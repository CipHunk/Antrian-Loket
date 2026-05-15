<?php

namespace App\Http\Controllers;

use App\Events\TicketCalled;
use App\Models\Call;
use App\Models\Counter;
use App\Models\Service;
use App\Models\Ticket;
use Illuminate\Http\Request;

class QueueController extends Controller
{
    public function status()
    {
        // Ambil last called per service + next 5 waiting (display preview) + total waiting count
        $services = Service::with(['tickets' => fn($q) => $q->latest('called_at')])->get();
        $payload = [];

        foreach ($services as $service) {
            $current = Ticket::where('service_id', $service->id)
                ->where('status', 'called')
                ->latest('called_at')
                ->first();

            $next = Ticket::where('service_id', $service->id)
                ->where('status', 'waiting')
                ->orderBy('number_int')
                ->take(5)
                ->get(['number_str']);

            // Total waiting count for accurate display
            $totalWaiting = Ticket::where('service_id', $service->id)
                ->where('status', 'waiting')
                ->count();

            $payload[] = [
                'service' => $service->name,
                'current' => $current?->number_str,
                'counter' => $current?->counter?->name,
                'next' => $next->pluck('number_str'),
                'total_waiting' => $totalWaiting, // Total count untuk display yang accurate
                'current_ticket' => $current?->number_str, // For sound system
                'current_counter' => $current?->counter?->name, // For sound system
                'called_at' => $current?->called_at?->timestamp, // For sound system timing
            ];
        }

        return response()->json([
            'services' => $payload,
            'timestamp' => now()->timestamp
        ]);
    }

    public function statusByService(Service $service)
    {
        $current = Ticket::where('service_id', $service->id)
            ->where('status', 'called')
            ->latest('called_at')
            ->first();

        $next = Ticket::where('service_id', $service->id)
            ->where('status', 'waiting')
            ->orderBy('number_int')
            ->take(5)
            ->get(['number_str']);

        return [
            'service' => $service->name,
            'current' => $current?->number_str,
            'counter' => $current?->counter?->name,
            'next' => $next->pluck('number_str'),
        ];
    }

    public function createTicket(Request $request)
    {
        $service = Service::findOrFail($request->service_id);
        
        // Find the maximum number_int for this service across ALL tickets (not just today)
        // This respects the unique constraint on (service_id, number_int)
        $last = Ticket::where('service_id', $service->id)
            ->max('number_int');

        $num = ($last ?? 0) + 1;

        // If number exceeds 999, we need to reset - delete old tickets first
        if ($num > 999) {
            // Delete old tickets that are done or cancelled (keep only today's waiting/called)
            $today = now()->startOfDay();
            Ticket::where('service_id', $service->id)
                ->where(function($q) use ($today) {
                    $q->whereIn('status', ['done', 'cancelled'])
                      ->orWhere('created_at', '<', $today);
                })
                ->delete();
            
            // Recalculate after cleanup
            $last = Ticket::where('service_id', $service->id)->max('number_int');
            $num = ($last ?? 0) + 1;
            
            if ($num > 999) {
                abort(422, 'Kuota antrian habis untuk layanan ini. Silakan hubungi admin.');
            }
        }

        $ticket = Ticket::create([
            'service_id' => $service->id,
            'number_int' => $num,
            'number_str' => $service->prefix . '-' . str_pad($num, 3, '0', STR_PAD_LEFT),
        ]);

        // Calculate estimated wait time
        $waitingAhead = Ticket::where('service_id', $service->id)
            ->where('status', 'waiting')
            ->where('number_int', '<', $num)
            ->count();

        // Get average service time for this service (in minutes)
        $today = now()->startOfDay();
        $avgServiceTime = Ticket::where('service_id', $service->id)
            ->where('status', 'done')
            ->whereDate('finished_at', $today)
            ->whereNotNull('called_at')
            ->whereNotNull('finished_at')
            ->get()
            ->avg(function ($ticket) {
                return $ticket->called_at->diffInMinutes($ticket->finished_at);
            });

        // Default to 5 minutes if no data
        $avgServiceTime = $avgServiceTime ?? 5;
        
        // Calculate estimated wait in minutes
        $estimatedWaitMinutes = round($waitingAhead * $avgServiceTime);
        
        // Calculate estimated service time
        $estimatedServiceTime = now()->addMinutes($estimatedWaitMinutes);

        return response()->json([
            'id' => $ticket->id,
            'service_id' => $ticket->service_id,
            'number_int' => $ticket->number_int,
            'number_str' => $ticket->number_str,
            'status' => $ticket->status,
            'created_at' => $ticket->created_at,
            'waiting_ahead' => $waitingAhead,
            'avg_service_time' => round($avgServiceTime, 1),
            'estimated_wait_minutes' => $estimatedWaitMinutes,
            'estimated_service_time' => $estimatedServiceTime->format('H:i'),
        ]);
    }

    public function callNext(Request $request)
    {
        $counter = Counter::findOrFail($request->counter_id);
        $ticket = Ticket::where('service_id', $counter->service_id)
            ->where('status', 'waiting')
            ->orderBy('number_int')
            ->first();

        if (!$ticket) {
            abort(404, 'Tidak ada antrian');
        }

        $ticket->update([
            'status' => 'called',
            'called_at' => now(),
            'counter_id' => $counter->id
        ]);

        event(new TicketCalled($ticket));

        Call::create([
            'ticket_id' => $ticket->id,
            'counter_id' => $counter->id,
            'user_id' => 1, // Default admin user
            'type' => 'call'
        ]);

        return $ticket;
    }

    public function recall(Ticket $ticket)
    {
        if ($ticket->status !== 'called') {
            abort(422, 'Ticket belum dipanggil');
        }

        event(new TicketCalled($ticket));

        Call::create([
            'ticket_id' => $ticket->id,
            'counter_id' => $ticket->counter_id,
            'user_id' => 1, // Default admin user
            'type' => 'recall'
        ]);

        return $ticket->refresh();
    }

    public function finish(Ticket $ticket)
    {
        if ($ticket->status !== 'called') {
            abort(422, 'Ticket belum dipanggil');
        }

        $ticket->update([
            'status' => 'done',
            'finished_at' => now()
        ]);

        // Don't create Call record for finish, just update ticket
        // Or use 'call' type if you want to track
        // Call::create([
        //     'ticket_id' => $ticket->id,
        //     'counter_id' => $ticket->counter_id,
        //     'user_id' => 1,
        //     'type' => 'call'
        // ]);

        return $ticket->refresh();
    }

    public function services()
    {
        return Service::where('is_active', true)->get();
    }

    public function counters()
    {
        return Counter::with('service')->where('is_active', true)->get();
    }

    public function currentTicket(Counter $counter)
    {
        $ticket = Ticket::where('counter_id', $counter->id)
            ->where('status', 'called')
            ->latest('called_at')
            ->first();

        if (!$ticket) {
            return response()->json(null, 404);
        }

        return $ticket;
    }

    public function counterStats(Counter $counter)
    {
        $today = now()->startOfDay();

        // Tickets done by this counter today
        $doneToday = Ticket::where('counter_id', $counter->id)
            ->where('status', 'done')
            ->whereDate('finished_at', $today)
            ->count();

        // Currently serving (called status)
        $currentlyServing = Ticket::where('counter_id', $counter->id)
            ->where('status', 'called')
            ->count();

        // Waiting for this service
        $waiting = Ticket::where('service_id', $counter->service_id)
            ->where('status', 'waiting')
            ->count();

        return response()->json([
            'done_today' => $doneToday,
            'currently_serving' => $currentlyServing,
            'waiting' => $waiting,
        ]);
    }

    public function dashboardStats()
    {
        $today = now()->startOfDay();

        // Total tickets today
        $totalToday = Ticket::whereDate('created_at', $today)->count();

        // Done tickets today (all services)
        $doneToday = Ticket::where('status', 'done')
            ->whereDate('finished_at', $today)
            ->count();

        // Currently being served (all counters)
        $currentlyServing = Ticket::where('status', 'called')->count();

        // Waiting tickets (all services)
        $waiting = Ticket::where('status', 'waiting')->count();

        // Stats per service
        $serviceStats = Service::withCount([
            'tickets as total_today' => fn($q) => $q->whereDate('created_at', $today),
            'tickets as done_today' => fn($q) => $q->where('status', 'done')->whereDate('finished_at', $today),
            'tickets as waiting' => fn($q) => $q->where('status', 'waiting'),
            'tickets as serving' => fn($q) => $q->where('status', 'called'),
        ])->where('is_active', true)->get();

        // Stats per counter
        $counterStats = Counter::with('service')->withCount([
            'tickets as done_today' => fn($q) => $q->where('status', 'done')->whereDate('finished_at', $today),
            'tickets as serving' => fn($q) => $q->where('status', 'called'),
        ])->where('is_active', true)->get();

        $avgServiceTime = Ticket::where('status', 'done')
            ->whereDate('finished_at', $today)
            ->whereNotNull('called_at')
            ->whereNotNull('finished_at')
            ->get()
            ->avg(function ($ticket) {
                return $ticket->called_at->diffInMinutes($ticket->finished_at);
            });

        return response()->json([
            'total_today' => $totalToday,
            'done_today' => $doneToday,
            'currently_serving' => $currentlyServing,
            'waiting' => $waiting,
            'avg_service_time' => round($avgServiceTime ?? 0, 1),
            'services' => $serviceStats,
            'counters' => $counterStats,
        ]);
    }

    public function globalStats()
    {
        $today = now()->startOfDay();

        // Total done tickets today from ALL services
        $doneToday = Ticket::where('status', 'done')
            ->whereDate('finished_at', $today)
            ->count();

        // Currently being served across all counters
        $currentlyServing = Ticket::where('status', 'called')->count();

        // Total waiting across all services
        $waiting = Ticket::where('status', 'waiting')->count();

        return response()->json([
            'done_today' => $doneToday,
            'currently_serving' => $currentlyServing,
            'waiting' => $waiting,
        ]);
    }
}

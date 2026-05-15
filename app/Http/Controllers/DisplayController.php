<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Ticket;
use Illuminate\Http\Request;

class DisplayController extends Controller
{
    public function index()
    {
        $services = Service::where('is_active', true)->get();
        $queueData = [];

        foreach ($services as $service) {
            $current = Ticket::where('service_id', $service->id)
                ->where('status', 'called')
                ->latest('called_at')
                ->first();

            $waiting = Ticket::where('service_id', $service->id)
                ->where('status', 'waiting')
                ->orderBy('number_int')
                ->take(5)
                ->get();

            $queueData[] = [
                'service' => $service,
                'current' => $current,
                'waiting' => $waiting,
                'waiting_count' => Ticket::where('service_id', $service->id)
                    ->where('status', 'waiting')
                    ->count(),
            ];
        }

        return view('display.index', compact('queueData'));
    }

    public function ticket()
    {
        $services = Service::where('is_active', true)->get();
        return view('display.ticket', compact('services'));
    }

    public function createTicket(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id'
        ]);

        $service = Service::findOrFail($request->service_id);
        $today = now()->startOfDay();
        $last = Ticket::where('service_id', $service->id)
            ->whereDate('created_at', $today)
            ->max('number_int');

        $num = ($last ?? 0) + 1;

        if ($num > 999) {
            return back()->with('error', 'Kuota tiket hari ini sudah habis.');
        }

        $ticket = Ticket::create([
            'service_id' => $service->id,
            'number_int' => $num,
            'number_str' => $service->prefix . '-' . str_pad($num, 3, '0', STR_PAD_LEFT),
        ]);

        return back()->with('success', 'Tiket berhasil dibuat: ' . $ticket->number_str);
    }
}

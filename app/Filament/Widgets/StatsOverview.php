<?php

namespace App\Filament\Widgets;

use App\Models\Counter;
use App\Models\Service;
use App\Models\Ticket;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $today = now()->startOfDay();

        // Total statistics
        $totalTicketsToday = Ticket::whereDate('created_at', $today)->count();
        $totalTicketsAll = Ticket::count();
        $doneToday = Ticket::where('status', 'done')->whereDate('finished_at', $today)->count();
        $currentlyServing = Ticket::where('status', 'called')->count();
        $waiting = Ticket::where('status', 'waiting')->count();

        // System statistics
        $totalServices = Service::where('is_active', true)->count();
        $totalCounters = Counter::where('is_active', true)->count();
        $activeCounters = Counter::where('is_active', true)
            ->whereHas('tickets', function ($q) {
                $q->where('status', 'called');
            })
            ->count();

        // Average service time
        $avgServiceTime = Ticket::where('status', 'done')
            ->whereDate('finished_at', $today)
            ->whereNotNull('called_at')
            ->whereNotNull('finished_at')
            ->get()
            ->avg(function ($ticket) {
                return $ticket->called_at->diffInMinutes($ticket->finished_at);
            });

        // Completion rate
        $completionRate = $totalTicketsToday > 0
            ? round(($doneToday / $totalTicketsToday) * 100, 1)
            : 0;

        return [
            Stat::make('Total Antrian Hari Ini', $totalTicketsToday)
                ->description('Tiket dibuat hari ini')
                ->descriptionIcon('heroicon-m-ticket')
                ->color('primary')
                ->chart([7, 12, 18, 25, 30, 28, $totalTicketsToday]),

            Stat::make('Selesai Dilayani', $doneToday)
                ->description("{$completionRate}% completion rate")
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success')
                ->chart([2, 5, 8, 12, 15, 18, $doneToday]),

            Stat::make('Sedang Dilayani', $currentlyServing)
                ->description("{$activeCounters}/{$totalCounters} counter aktif")
                ->descriptionIcon('heroicon-m-users')
                ->color('warning'),

            Stat::make('Menunggu', $waiting)
                ->description('Belum dipanggil')
                ->descriptionIcon('heroicon-m-clock')
                ->color('info'),
        ];
    }

    protected function getColumns(): int
    {
        return 4;
    }
}

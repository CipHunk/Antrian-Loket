<?php

namespace App\Filament\Widgets;

use App\Models\Counter;
use App\Models\Service;
use App\Models\Ticket;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class SystemInfoWidget extends StatsOverviewWidget
{
    protected static ?int $sort = 5;
    protected int | string | array $columnSpan = 'full';

    protected function getStats(): array
    {
        $today = now()->startOfDay();

        // Total statistics
        $totalTicketsAll = Ticket::count();
        $totalServices = Service::where('is_active', true)->count();
        $totalCounters = Counter::where('is_active', true)->count();

        // Average service time
        $avgServiceTime = Ticket::where('status', 'done')
            ->whereDate('finished_at', $today)
            ->whereNotNull('called_at')
            ->whereNotNull('finished_at')
            ->get()
            ->avg(function ($ticket) {
                return $ticket->called_at->diffInMinutes($ticket->finished_at);
            });

        // Peak hour (most busy hour today)
        $peakHour = Ticket::whereDate('created_at', $today)
            ->get()
            ->groupBy(function ($ticket) {
                return $ticket->created_at->format('H');
            })
            ->map(function ($group, $hour) {
                return (object) ['hour' => (int)$hour, 'count' => $group->count()];
            })
            ->sortByDesc('count')
            ->first();

        return [
            Stat::make('Waktu Pelayanan Rata-rata', round($avgServiceTime ?? 0, 1) . ' menit')
                ->description('Dari dipanggil hingga selesai')
                ->descriptionIcon('heroicon-m-clock')
                ->color('info')
                ->chart([5, 7, 9, 8, 10, 9, round($avgServiceTime ?? 0, 1)]),

            Stat::make('Total Layanan Aktif', $totalServices)
                ->description('Layanan tersedia di sistem')
                ->descriptionIcon('heroicon-m-squares-2x2')
                ->color('primary'),

            Stat::make('Total Counter Aktif', $totalCounters)
                ->description('Counter yang tersedia')
                ->descriptionIcon('heroicon-m-computer-desktop')
                ->color('primary'),

            Stat::make('Total Tiket (All Time)', number_format($totalTicketsAll))
                ->description('Sejak sistem berjalan')
                ->descriptionIcon('heroicon-m-chart-bar')
                ->color('gray'),

            Stat::make('Jam Tersibuk', $peakHour ? str_pad($peakHour->hour, 2, '0', STR_PAD_LEFT) . ':00' : '-')
                ->description($peakHour ? $peakHour->count . ' antrian' : 'Belum ada data')
                ->descriptionIcon('heroicon-m-fire')
                ->color('warning'),
        ];
    }

    protected function getColumns(): int
    {
        return 5;
    }
}

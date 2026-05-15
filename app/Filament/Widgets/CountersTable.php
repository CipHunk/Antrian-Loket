<?php

namespace App\Filament\Widgets;

use App\Models\Counter;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class CountersTable extends StatsOverviewWidget
{
    protected ?string $heading = 'Performa Loket Hari Ini';
    protected static ?int $sort = 3;
    protected int | string | array $columnSpan = 'full';

    protected function getStats(): array
    {
        $today = now()->startOfDay();

        $counters = Counter::with('service')
            ->where('is_active', true)
            ->withCount([
                'tickets as done_today' => fn($q) => $q->where('status', 'done')->whereDate('finished_at', $today),
                'tickets as serving' => fn($q) => $q->where('status', 'called'),
            ])
            ->get()
            ->sortByDesc('done_today');

        return $counters->map(function ($counter) {
            $isActive = $counter->serving > 0;

            return Stat::make($counter->name, $counter->done_today)
                ->description($counter->service->name)
                ->descriptionIcon('heroicon-m-building-storefront')
                ->color($isActive ? 'success' : 'gray')
                ->icon($isActive ? 'heroicon-m-signal' : 'heroicon-m-computer-desktop')
                ->chart($isActive ? [1, 2, 3, 4, 5, 6, $counter->done_today] : null)
                ->extraAttributes([
                    'class' => $isActive ? 'ring-2 ring-success-500' : '',
                ]);
        })->toArray();
    }

    protected function getColumns(): int
    {
        return 4;
    }
}

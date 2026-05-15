<?php

namespace App\Filament\Widgets;

use App\Models\Ticket;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;
use Illuminate\Database\Eloquent\Builder;

class LatestTicketsWidget extends TableWidget
{
    protected static ?int $sort = 4;
    protected int | string | array $columnSpan = 'full';
    protected static ?string $heading = 'Antrian Terbaru';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Ticket::query()
                    ->with(['service', 'counter'])
                    ->latest('created_at')
                    ->limit(15)
            )
            ->columns([
                TextColumn::make('number_str')
                    ->label('No. Antrian')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->size('lg')
                    ->badge()
                    ->color('primary'),

                TextColumn::make('service.name')
                    ->label('Layanan')
                    ->searchable()
                    ->sortable()
                    ->icon('heroicon-m-squares-2x2')
                    ->badge()
                    ->color('gray'),

                BadgeColumn::make('status')
                    ->label('Status')
                    ->formatStateUsing(fn(string $state): string => match ($state) {
                        'waiting' => 'Menunggu',
                        'called' => 'Dipanggil',
                        'done' => 'Selesai',
                        default => $state,
                    })
                    ->colors([
                        'info' => 'waiting',
                        'warning' => 'called',
                        'success' => 'done',
                    ])
                    ->icons([
                        'heroicon-m-clock' => 'waiting',
                        'heroicon-m-megaphone' => 'called',
                        'heroicon-m-check-circle' => 'done',
                    ]),

                TextColumn::make('counter.name')
                    ->label('Counter')
                    ->placeholder('-')
                    ->badge()
                    ->color('gray')
                    ->icon('heroicon-m-computer-desktop')
                    ->default('Belum dipanggil'),

                TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime('H:i')
                    ->sortable()
                    ->since()
                    ->description(fn(Ticket $record): string => $record->created_at->format('d M Y'))
                    ->icon('heroicon-m-calendar'),
            ])
            ->defaultSort('created_at', 'desc')
            ->paginated(false)
            ->striped();
    }
}

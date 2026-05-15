<?php

namespace App\Filament\Resources\Tickets\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class TicketsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('number_str')
                    ->label('Nomor Tiket')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('service.name')
                    ->label('Layanan')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'waiting' => 'warning',
                        'called' => 'success',
                        'done' => 'primary',
                        'cancelled' => 'danger',
                    })
                    ->formatStateUsing(fn(string $state): string => match ($state) {
                        'waiting' => 'Menunggu',
                        'called' => 'Dipanggil',
                        'done' => 'Selesai',
                        'cancelled' => 'Dibatalkan',
                    }),

                TextColumn::make('counter.name')
                    ->label('Loket')
                    ->placeholder('Belum dipanggil'),

                TextColumn::make('called_at')
                    ->label('Waktu Dipanggil')
                    ->dateTime()
                    ->sortable()
                    ->placeholder('Belum dipanggil'),

                TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime()
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'waiting' => 'Menunggu',
                        'called' => 'Dipanggil',
                        'done' => 'Selesai',
                        'cancelled' => 'Dibatalkan',
                    ]),

                SelectFilter::make('service')
                    ->label('Layanan')
                    ->relationship('service', 'name'),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}

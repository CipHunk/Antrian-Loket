<?php

namespace App\Filament\Resources\Tickets\Schemas;

use App\Models\Counter;
use App\Models\Service;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class TicketForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('service_id')
                    ->label('Layanan')
                    ->relationship('service', 'name')
                    ->required()
                    ->searchable()
                    ->preload(),

                TextInput::make('number_str')
                    ->label('Nomor Tiket')
                    ->disabled()
                    ->dehydrated(false),

                Select::make('status')
                    ->label('Status')
                    ->options([
                        'waiting' => 'Menunggu',
                        'called' => 'Dipanggil',
                        'done' => 'Selesai',
                        'cancelled' => 'Dibatalkan',
                    ])
                    ->default('waiting')
                    ->required(),

                Select::make('counter_id')
                    ->label('Loket')
                    ->relationship('counter', 'name')
                    ->searchable()
                    ->preload(),

                DateTimePicker::make('called_at')
                    ->label('Waktu Dipanggil')
                    ->nullable(),

                DateTimePicker::make('finished_at')
                    ->label('Waktu Selesai')
                    ->nullable(),
            ]);
    }
}

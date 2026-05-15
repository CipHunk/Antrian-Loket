<?php

namespace App\Filament\Resources\Counters\Schemas;

use App\Models\Service;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class CounterForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->label('Nama Loket')
                    ->required()
                    ->maxLength(255)
                    ->placeholder('Loket 1'),

                Select::make('service_id')
                    ->label('Layanan')
                    ->relationship('service', 'name')
                    ->required()
                    ->searchable()
                    ->preload(),

                Toggle::make('is_active')
                    ->label('Aktif')
                    ->default(true),
            ]);
    }
}

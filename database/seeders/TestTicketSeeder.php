<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\Counter;
use App\Models\Ticket;
use Illuminate\Database\Seeder;

class TestTicketSeeder extends Seeder
{
    public function run(): void
    {
        $service1 = Service::where('code', 'POLI-UMUM')->first();
        $service2 = Service::where('code', 'POLI-GIGI')->first();
        $service3 = Service::where('code', 'FARMASI')->first();

        if (!$service1 || !$service2 || !$service3) {
            echo "Services not found, please run DatabaseSeeder first\n";
            return;
        }

        // Clear existing tickets
        Ticket::truncate();

        // Create waiting tickets for Poli Umum
        Ticket::create([
            'service_id' => $service1->id,
            'number_int' => 1,
            'number_str' => 'A-001',
            'status' => 'waiting'
        ]);

        Ticket::create([
            'service_id' => $service1->id,
            'number_int' => 2,
            'number_str' => 'A-002',
            'status' => 'waiting'
        ]);

        Ticket::create([
            'service_id' => $service1->id,
            'number_int' => 3,
            'number_str' => 'A-003',
            'status' => 'waiting'
        ]);

        // Create called ticket for Poli Umum
        $counter1 = Counter::where('service_id', $service1->id)->first();
        if ($counter1) {
            Ticket::create([
                'service_id' => $service1->id,
                'number_int' => 4,
                'number_str' => 'A-004',
                'status' => 'called',
                'called_at' => now(),
                'counter_id' => $counter1->id
            ]);
        }

        // Create waiting tickets for Poli Gigi
        Ticket::create([
            'service_id' => $service2->id,
            'number_int' => 1,
            'number_str' => 'B-001',
            'status' => 'waiting'
        ]);

        Ticket::create([
            'service_id' => $service2->id,
            'number_int' => 2,
            'number_str' => 'B-002',
            'status' => 'waiting'
        ]);

        // Create called ticket for Poli Gigi
        $counter2 = Counter::where('service_id', $service2->id)->first();
        if ($counter2) {
            Ticket::create([
                'service_id' => $service2->id,
                'number_int' => 3,
                'number_str' => 'B-003',
                'status' => 'called',
                'called_at' => now(),
                'counter_id' => $counter2->id
            ]);
        }

        // Create waiting tickets for Farmasi
        Ticket::create([
            'service_id' => $service3->id,
            'number_int' => 1,
            'number_str' => 'C-001',
            'status' => 'waiting'
        ]);

        echo "Test tickets created successfully!\n";
    }
}

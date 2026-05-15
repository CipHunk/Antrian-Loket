<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Service;
use App\Models\Counter;
use App\Models\Ticket;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create users
        $admin = User::create([
            'name' => 'Admin Puskesmas',
            'email' => 'admin@puskesmas.com',
            'password' => Hash::make('password'),
        ]);

        $operator1 = User::create([
            'name' => 'Operator Poli Umum',
            'email' => 'operator1@puskesmas.com',
            'password' => Hash::make('password'),
        ]);

        $operator2 = User::create([
            'name' => 'Operator Poli Gigi',
            'email' => 'operator2@puskesmas.com',
            'password' => Hash::make('password'),
        ]);

        // Create services
        $poliUmum = Service::create([
            'code' => 'POLI-UMUM',
            'name' => 'Poli Umum',
            'prefix' => 'A',
            'is_active' => true,
        ]);

        $poliGigi = Service::create([
            'code' => 'POLI-GIGI',
            'name' => 'Poli Gigi',
            'prefix' => 'B',
            'is_active' => true,
        ]);

        $farmasi = Service::create([
            'code' => 'FARMASI',
            'name' => 'Farmasi',
            'prefix' => 'C',
            'is_active' => true,
        ]);

        $poliKIA = Service::create([
            'code' => 'POLI-KIA',
            'name' => 'Poli KIA (Kesehatan Ibu dan Anak)',
            'prefix' => 'D',
            'is_active' => true,
        ]);

        $laboratorium = Service::create([
            'code' => 'LABORATORIUM',
            'name' => 'Laboratorium',
            'prefix' => 'E',
            'is_active' => true,
        ]);

        // Create counters for Poli Umum
        $counter1 = Counter::create([
            'name' => 'Loket 1 - Poli Umum',
            'service_id' => $poliUmum->id,
            'is_active' => true,
        ]);

        $counter2 = Counter::create([
            'name' => 'Loket 2 - Poli Umum',
            'service_id' => $poliUmum->id,
            'is_active' => true,
        ]);

        // Create counters for other services
        Counter::create([
            'name' => 'Loket Poli Gigi',
            'service_id' => $poliGigi->id,
            'is_active' => true,
        ]);

        Counter::create([
            'name' => 'Loket Farmasi 1',
            'service_id' => $farmasi->id,
            'is_active' => true,
        ]);

        Counter::create([
            'name' => 'Loket Farmasi 2',
            'service_id' => $farmasi->id,
            'is_active' => true,
        ]);

        Counter::create([
            'name' => 'Loket KIA',
            'service_id' => $poliKIA->id,
            'is_active' => true,
        ]);

        Counter::create([
            'name' => 'Loket Laboratorium',
            'service_id' => $laboratorium->id,
            'is_active' => true,
        ]);

        // Create dummy tickets for Poli Umum (A series)
        // 1 sedang dilayani, 5 menunggu, 3 selesai

        // Ticket A-001 - Selesai
        Ticket::create([
            'service_id' => $poliUmum->id,
            'number_int' => 1,
            'number_str' => 'A-001',
            'status' => 'done',
            'counter_id' => $counter1->id,
            'called_at' => Carbon::now()->subHours(2),
            'finished_at' => Carbon::now()->subHours(1)->subMinutes(45),
        ]);

        // Ticket A-002 - Selesai
        Ticket::create([
            'service_id' => $poliUmum->id,
            'number_int' => 2,
            'number_str' => 'A-002',
            'status' => 'done',
            'counter_id' => $counter2->id,
            'called_at' => Carbon::now()->subHours(1)->subMinutes(50),
            'finished_at' => Carbon::now()->subHours(1)->subMinutes(30),
        ]);

        // Ticket A-003 - Selesai
        Ticket::create([
            'service_id' => $poliUmum->id,
            'number_int' => 3,
            'number_str' => 'A-003',
            'status' => 'done',
            'counter_id' => $counter1->id,
            'called_at' => Carbon::now()->subHours(1)->subMinutes(30),
            'finished_at' => Carbon::now()->subHours(1)->subMinutes(10),
        ]);

        // Ticket A-004 - Sedang dipanggil/dilayani
        Ticket::create([
            'service_id' => $poliUmum->id,
            'number_int' => 4,
            'number_str' => 'A-004',
            'status' => 'called',
            'counter_id' => $counter1->id,
            'called_at' => Carbon::now()->subMinutes(5),
        ]);

        // Ticket A-005 to A-009 - Menunggu
        for ($i = 5; $i <= 9; $i++) {
            Ticket::create([
                'service_id' => $poliUmum->id,
                'number_int' => $i,
                'number_str' => sprintf('A-%03d', $i),
                'status' => 'waiting',
            ]);
        }

        // Create dummy tickets for Poli Gigi (B series)
        // 1 sedang dilayani, 3 menunggu

        Ticket::create([
            'service_id' => $poliGigi->id,
            'number_int' => 1,
            'number_str' => 'B-001',
            'status' => 'called',
            'counter_id' => 3, // Loket Poli Gigi
            'called_at' => Carbon::now()->subMinutes(10),
        ]);

        for ($i = 2; $i <= 4; $i++) {
            Ticket::create([
                'service_id' => $poliGigi->id,
                'number_int' => $i,
                'number_str' => sprintf('B-%03d', $i),
                'status' => 'waiting',
            ]);
        }

        // Create dummy tickets for Farmasi (C series)
        // 2 sedang dilayani, 8 menunggu

        Ticket::create([
            'service_id' => $farmasi->id,
            'number_int' => 1,
            'number_str' => 'C-001',
            'status' => 'called',
            'counter_id' => 4, // Loket Farmasi 1
            'called_at' => Carbon::now()->subMinutes(3),
        ]);

        Ticket::create([
            'service_id' => $farmasi->id,
            'number_int' => 2,
            'number_str' => 'C-002',
            'status' => 'called',
            'counter_id' => 5, // Loket Farmasi 2
            'called_at' => Carbon::now()->subMinutes(2),
        ]);

        for ($i = 3; $i <= 10; $i++) {
            Ticket::create([
                'service_id' => $farmasi->id,
                'number_int' => $i,
                'number_str' => sprintf('C-%03d', $i),
                'status' => 'waiting',
            ]);
        }

        // Create dummy tickets for KIA (D series)
        // 2 menunggu

        for ($i = 1; $i <= 2; $i++) {
            Ticket::create([
                'service_id' => $poliKIA->id,
                'number_int' => $i,
                'number_str' => sprintf('D-%03d', $i),
                'status' => 'waiting',
            ]);
        }

        // Create dummy tickets for Laboratorium (E series)
        // 1 sedang dilayani, 4 menunggu

        Ticket::create([
            'service_id' => $laboratorium->id,
            'number_int' => 1,
            'number_str' => 'E-001',
            'status' => 'called',
            'counter_id' => 7, // Loket Laboratorium
            'called_at' => Carbon::now()->subMinutes(8),
        ]);

        for ($i = 2; $i <= 5; $i++) {
            Ticket::create([
                'service_id' => $laboratorium->id,
                'number_int' => $i,
                'number_str' => sprintf('E-%03d', $i),
                'status' => 'waiting',
            ]);
        }

        $this->command->info('✅ Database seeded successfully!');
        $this->command->info('');
        $this->command->info('📊 Summary:');
        $this->command->info('   Users: 3 (admin@puskesmas.com, operator1@puskesmas.com, operator2@puskesmas.com)');
        $this->command->info('   Password: password');
        $this->command->info('   Services: 5 (Poli Umum, Poli Gigi, Farmasi, KIA, Laboratorium)');
        $this->command->info('   Counters: 7');
        $this->command->info('   Tickets: 32 (4 called, 25 waiting, 3 done)');
    }
}

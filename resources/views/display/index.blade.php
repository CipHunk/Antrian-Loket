@extends('display.layout')

@section('title', 'Display Antrian Puskesmas')

@section('content')
<div class="container mx-auto px-6 py-8">
    <!-- Header -->
    <div class="text-center mb-12">
        <h1 class="text-5xl font-bold mb-4 text-white">
            🏥 PUSKESMAS ANTRIAN
        </h1>
        <p class="text-xl text-blue-200">
            Sistem Antrian Digital - {{ date('d F Y') }}
        </p>
        <div class="mt-4 text-lg text-blue-300">
            {{ date('H:i:s') }} WIB
        </div>
    </div>

    <!-- Main Display Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        @foreach($queueData as $data)
            <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <!-- Service Header -->
                <div class="text-center mb-6">
                    <h2 class="text-2xl font-bold text-white mb-2">
                        {{ $data['service']->name }}
                    </h2>
                    <div class="bg-blue-500/30 rounded-full px-4 py-2 inline-block">
                        <span class="text-sm font-medium">
                            {{ $data['waiting_count'] }} orang menunggu
                        </span>
                    </div>
                </div>

                <!-- Current Number -->
                <div class="text-center mb-8">
                    @if($data['current'])
                        <div class="current-number text-green-400 mb-2">
                            {{ $data['current']->number_str }}
                        </div>
                        <div class="text-xl text-green-300">
                            🔊 {{ $data['current']->counter->name }}
                        </div>
                        <div class="text-sm text-green-200 mt-2">
                            Dipanggil: {{ $data['current']->called_at->format('H:i:s') }}
                        </div>
                    @else
                        <div class="current-number text-gray-400 mb-2">
                            ---
                        </div>
                        <div class="text-xl text-gray-400">
                            Belum ada panggilan
                        </div>
                    @endif
                </div>

                <!-- Next Numbers -->
                @if($data['waiting']->count() > 0)
                    <div class="text-center">
                        <h3 class="text-lg font-semibold mb-4 text-blue-200">
                            Antrian Berikutnya:
                        </h3>
                        <div class="flex justify-center gap-3 flex-wrap">
                            @foreach($data['waiting'] as $ticket)
                                <span class="bg-blue-500/40 backdrop-blur-sm px-4 py-2 rounded-lg text-lg font-semibold border border-blue-400/30">
                                    {{ $ticket->number_str }}
                                </span>
                            @endforeach
                        </div>
                    </div>
                @endif
            </div>
        @endforeach
    </div>

    <!-- Ticker Information -->
    <div class="bg-yellow-500/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-400/30">
        <div class="ticker">
            <div class="ticker-content text-xl font-semibold text-yellow-200">
                🔔 INFORMASI: Pastikan Anda sudah mengambil nomor antrian di loket pendaftaran. 
                Dengarkan panggilan dengan seksama. Jika nomor Anda terlewat, silakan hubungi petugas. 
                Terima kasih atas kesabaran Anda. 🙏
            </div>
        </div>
    </div>

    <!-- Action Buttons -->
    <div class="fixed bottom-6 right-6 space-y-3">
        <a href="{{ route('display.ticket') }}" 
           class="block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
            📱 Ambil Nomor
        </a>
        <button onclick="window.location.reload()" 
                class="block w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
            🔄 Refresh
        </button>
    </div>
</div>
@endsection
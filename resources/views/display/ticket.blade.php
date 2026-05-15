@extends('display.layout')

@section('title', 'Ambil Nomor Antrian')

@section('content')
<div class="container mx-auto px-6 py-8 max-w-2xl">
    <!-- Header -->
    <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-4 text-white">
            🎫 AMBIL NOMOR ANTRIAN
        </h1>
        <p class="text-lg text-blue-200">
            Pilih layanan yang Anda butuhkan
        </p>
    </div>

    <!-- Alert Messages -->
    @if(session('success'))
        <div class="bg-green-500/20 border border-green-500/50 text-green-200 px-6 py-4 rounded-xl mb-6 text-center">
            <div class="text-2xl font-bold mb-2">✅ Berhasil!</div>
            <div class="text-lg">{{ session('success') }}</div>
            <div class="mt-4">
                <a href="{{ route('display.index') }}" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">
                    Lihat Display Antrian
                </a>
            </div>
        </div>
    @endif

    @if(session('error'))
        <div class="bg-red-500/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-xl mb-6 text-center">
            <div class="text-2xl font-bold mb-2">❌ Error!</div>
            <div class="text-lg">{{ session('error') }}</div>
        </div>
    @endif

    <!-- Service Selection Form -->
    <form method="POST" action="{{ route('display.create-ticket') }}" class="space-y-6">
        @csrf
        
        <div class="grid gap-4">
            @foreach($services as $service)
                @php
                    $todayCount = \App\Models\Ticket::where('service_id', $service->id)
                        ->whereDate('created_at', today())
                        ->count();
                    $waitingCount = \App\Models\Ticket::where('service_id', $service->id)
                        ->where('status', 'waiting')
                        ->count();
                @endphp
                
                <label class="block cursor-pointer">
                    <input type="radio" name="service_id" value="{{ $service->id }}" class="sr-only peer" required>
                    <div class="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl p-6 transition-all duration-300 peer-checked:border-green-400 peer-checked:bg-green-500/20 hover:bg-white/20">
                        <div class="flex justify-between items-center">
                            <div>
                                <h3 class="text-xl font-bold text-white mb-2">
                                    {{ $service->name }}
                                </h3>
                                <div class="text-sm text-blue-200 space-y-1">
                                    <div>Prefix: <span class="font-semibold">{{ $service->prefix }}</span></div>
                                    <div>Hari ini: <span class="font-semibold">{{ $todayCount }} tiket</span></div>
                                    <div>Menunggu: <span class="font-semibold text-yellow-300">{{ $waitingCount }} orang</span></div>
                                </div>
                            </div>
                            <div class="text-4xl opacity-70">
                                @switch($service->code)
                                    @case('POLI-UMUM')
                                        🏥
                                        @break
                                    @case('POLI-GIGI')
                                        🦷
                                        @break
                                    @case('FARMASI')
                                        💊
                                        @break
                                    @case('POLI-KIA')
                                        👶
                                        @break
                                    @default
                                        🏥
                                @endswitch
                            </div>
                        </div>
                        
                        <!-- Radio button indicator -->
                        <div class="mt-4 text-center">
                            <div class="w-6 h-6 border-2 border-white/40 rounded-full mx-auto peer-checked:bg-green-400 peer-checked:border-green-400 transition-all duration-300 flex items-center justify-center">
                                <div class="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </div>
                    </div>
                </label>
            @endforeach
        </div>

        <!-- Submit Button -->
        <div class="text-center pt-6">
            <button type="submit" 
                    class="bg-green-600 hover:bg-green-700 text-white text-xl font-bold px-12 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                🎫 AMBIL NOMOR ANTRIAN
            </button>
        </div>
    </form>

    <!-- Navigation -->
    <div class="text-center mt-8">
        <a href="{{ route('display.index') }}" 
           class="text-blue-300 hover:text-white transition-colors underline">
            ← Kembali ke Display Antrian
        </a>
    </div>
</div>
@endsection
<x-filament-panels::page>
    @pushOnce('styles')
        <link href="{{ asset('css/queue-management.css') }}" rel="stylesheet">
        <style>
            .call-action-btn {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                transition: all 0.3s ease;
                transform: scale(1);
            }
            .call-action-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 10px 20px rgba(16, 185, 129, 0.4);
            }
            .recall-btn {
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            }
            .recall-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 10px 20px rgba(245, 158, 11, 0.4);
            }
            .finish-btn {
                background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            }
            .finish-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 10px 20px rgba(99, 102, 241, 0.4);
            }
            .queue-card-active {
                border: 2px solid #10b981;
                box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
                animation: pulse-green 2s infinite;
            }
            @keyframes pulse-green {
                0% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
                50% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.5); }
                100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
            }
            .ticket-number-large {
                font-size: 3rem;
                font-weight: 900;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                font-family: 'Arial Black', sans-serif;
            }
            .next-in-line {
                background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                animation: glow-orange 1.5s ease-in-out infinite alternate;
            }
            @keyframes glow-orange {
                from { box-shadow: 0 4px 10px rgba(251, 191, 36, 0.3); }
                to { box-shadow: 0 8px 20px rgba(251, 191, 36, 0.6); }
            }
        </style>
    @endPushOnce
    
    @pushOnce('scripts')
        <script>
            // Queue Sound System
            class QueueSoundSystem {
                constructor() {
                    this.lastCalledTickets = new Map();
                    this.isEnabled = localStorage.getItem('queueSoundEnabled') !== 'false';
                    this.volume = parseFloat(localStorage.getItem('queueSoundVolume') || '0.7');
                    this.initSoundSystem();
                    this.setupPeriodicCheck();
                }

                initSoundSystem() {
                    if ('speechSynthesis' in window) {
                        this.speechSynth = window.speechSynthesis;
                        this.voice = null;
                        
                        this.speechSynth.onvoiceschanged = () => {
                            const voices = this.speechSynth.getVoices();
                            this.voice = voices.find(voice => voice.lang.includes('id')) || 
                                        voices.find(voice => voice.lang.includes('en')) || 
                                        voices[0];
                        };
                    }
                    this.createSoundEffects();
                }

                createSoundEffects() {
                    this.bellSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEbBjiR2O+OOggZZbPs44cAAA==');
                    this.bellSound.volume = this.volume;
                }

                playTicketCall(ticketNumber, serviceName, counterName) {
                    if (!this.isEnabled) return;
                    
                    this.bellSound.play().then(() => {
                        setTimeout(() => {
                            this.speakTicketCall(ticketNumber, serviceName, counterName);
                        }, 1000);
                    }).catch(() => {
                        setTimeout(() => {
                            this.speakTicketCall(ticketNumber, serviceName, counterName);
                        }, 500);
                    });
                }

                speakTicketCall(ticketNumber, serviceName, counterName) {
                    if (!this.speechSynth || !this.voice) return;

                    this.speechSynth.cancel();
                    
                    setTimeout(() => {
                        const text = `Nomor antrian ${ticketNumber}, layanan ${serviceName}, silakan menuju ${counterName}`;
                        const utterance = new SpeechSynthesisUtterance(text);
                        utterance.voice = this.voice;
                        utterance.volume = this.volume;
                        utterance.rate = 0.9;
                        utterance.pitch = 1.0;
                        utterance.lang = 'id-ID';
                        this.speechSynth.speak(utterance);
                    }, 500);
                }

                setupPeriodicCheck() {
                    setInterval(() => {
                        this.checkForNewCalls();
                    }, 15000);
                }

                async checkForNewCalls() {
                    try {
                        const response = await fetch('/api/status');
                        const data = await response.json();
                        
                        if (data.services) {
                            data.services.forEach(service => {
                                if (service.current_ticket && service.current_counter) {
                                    const ticketKey = `${service.service}-${service.current_ticket}`;
                                    const currentTime = Date.now();
                                    const callTime = service.called_at * 1000;
                                    
                                    const lastAnnounced = this.lastCalledTickets.get(ticketKey);
                                    const isRecentCall = (currentTime - callTime) < (3 * 60 * 1000);
                                    
                                    if (isRecentCall && (!lastAnnounced || (currentTime - lastAnnounced) > 45000)) {
                                        this.playTicketCall(
                                            service.current_ticket,
                                            service.service,
                                            service.current_counter
                                        );
                                        this.lastCalledTickets.set(ticketKey, currentTime);
                                    }
                                }
                            });
                        }
                    } catch (error) {
                        console.error('Error checking for new calls:', error);
                    }
                }

                toggleSound() {
                    this.isEnabled = !this.isEnabled;
                    localStorage.setItem('queueSoundEnabled', this.isEnabled);
                    return this.isEnabled;
                }

                setVolume(volume) {
                    this.volume = Math.max(0, Math.min(1, volume));
                    localStorage.setItem('queueSoundVolume', this.volume);
                    this.bellSound.volume = this.volume;
                }
            }

            document.addEventListener('DOMContentLoaded', function() {
                window.queueSound = new QueueSoundSystem();
            });
        </script>
    @endPushOnce

    <div class="space-y-6">
        <!-- Enhanced Sound & Quick Control Panel -->
        <div class="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl p-6 shadow-lg">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <img src="https://img.icons8.com/color/32/speaker.png" alt="Sound" class="w-7 h-7">
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-blue-900 dark:text-blue-100">Sistem Kontrol Antrian</h3>
                        <p class="text-sm text-blue-700 dark:text-blue-300">Panggilan otomatis & kontrol manual</p>
                    </div>
                </div>
                
                <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div class="flex items-center gap-3">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Volume:</span>
                        <input type="range" min="0" max="1" step="0.1" value="0.7" 
                               id="volumeControl" 
                               class="w-24 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                               onchange="window.queueSound?.setVolume(this.value)">
                        <span id="volumeValue" class="text-xs text-gray-600 dark:text-gray-400 min-w-[30px]">70%</span>
                    </div>
                    
                    <button onclick="toggleQueueSound(this)" 
                            id="soundToggle"
                            class="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                        <span class="flex items-center gap-2">
                            <span>🔊</span>
                            <span>AKTIF</span>
                        </span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Main Control Grid -->
        <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
            
            <!-- Counter Selection & Control Panel -->
            <div class="xl:col-span-1">
                <x-filament::section>
                    <x-slot name="heading">
                        <div class="flex items-center gap-3">
                            <img src="https://img.icons8.com/color/24/control-panel.png" alt="Control" class="w-6 h-6">
                            <span class="font-bold">Panel Kontrol</span>
                        </div>
                    </x-slot>
                    
                    <div class="space-y-6">
                        <!-- Counter Selection -->
                        <div>
                            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Pilih Loket Aktif:</label>
                            <x-filament::input.wrapper>
                                <x-filament::input.select wire:model.live="selectedCounterId" class="w-full">
                                    <option value="">-- Pilih Loket --</option>
                                    @foreach(\App\Models\Counter::with('service')->where('is_active', true)->get() as $counter)
                                        <option value="{{ $counter->id }}">
                                            🏢 {{ $counter->name }} - {{ $counter->service->name }}
                                        </option>
                                    @endforeach
                                </x-filament::input.select>
                            </x-filament::input.wrapper>
                        </div>
                        
                        @if($selectedCounterId)
                            @php
                                $selectedCounter = \App\Models\Counter::with('service')->find($selectedCounterId);
                                $currentTicket = \App\Models\Ticket::where('counter_id', $selectedCounterId)
                                    ->where('status', 'called')
                                    ->latest('called_at')
                                    ->first();
                                $nextTicket = \App\Models\Ticket::where('service_id', $selectedCounter->service_id)
                                    ->where('status', 'waiting')
                                    ->orderBy('number_int')
                                    ->first();
                                $waitingCount = \App\Models\Ticket::where('service_id', $selectedCounter->service_id)
                                    ->where('status', 'waiting')
                                    ->count();
                            @endphp
                            
                            <!-- Active Counter Info -->
                            <div class="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 p-5 rounded-xl border-2 border-blue-200 dark:border-blue-700 shadow-lg">
                                <div class="flex items-center gap-3 mb-4">
                                    <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                                        <img src="https://img.icons8.com/color/32/counter.png" alt="Counter" class="w-6 h-6">
                                    </div>
                                    <div>
                                        <h4 class="font-bold text-blue-900 dark:text-blue-100 text-lg">
                                            {{ $selectedCounter->name }}
                                        </h4>
                                        <p class="text-sm text-blue-700 dark:text-blue-300">
                                            📋 {{ $selectedCounter->service->name }}
                                        </p>
                                    </div>
                                </div>
                                
                                <!-- Current Serving -->
                                @if($currentTicket)
                                    <div class="bg-green-100 dark:bg-green-900/40 p-4 rounded-xl border border-green-300 dark:border-green-600 mb-4">
                                        <div class="text-center">
                                            <div class="text-xs text-green-700 dark:text-green-300 mb-2 font-semibold">🎯 SEDANG DILAYANI</div>
                                            <div class="ticket-number-large text-green-800 dark:text-green-200">
                                                {{ $currentTicket->number_str }}
                                            </div>
                                            <div class="text-xs text-green-600 dark:text-green-400 mt-2">
                                                ⏰ Sejak: {{ $currentTicket->called_at->format('H:i:s') }}
                                            </div>
                                            
                                            <!-- Action Buttons for Current Ticket -->
                                            <div class="flex gap-2 mt-4">
                                                <button onclick="recallTicket('{{ $currentTicket->id }}')"
                                                        class="recall-btn text-white px-4 py-2 rounded-lg text-xs font-bold flex-1 transition-all duration-300">
                                                    🔁 ULANGI
                                                </button>
                                                <button onclick="finishTicket('{{ $currentTicket->id }}')"
                                                        class="finish-btn text-white px-4 py-2 rounded-lg text-xs font-bold flex-1 transition-all duration-300">
                                                    ✅ SELESAI
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                @endif
                                
                                <!-- Next in Line -->
                                @if($nextTicket)
                                    <div class="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-xl border-2 border-yellow-300 dark:border-yellow-600 mb-4">
                                        <div class="text-center">
                                            <div class="text-xs text-yellow-800 dark:text-yellow-200 mb-2 font-semibold">🏃‍♂️ ANTRIAN BERIKUTNYA</div>
                                            <div class="text-3xl font-black text-yellow-800 dark:text-yellow-200 mb-3">
                                                {{ $nextTicket->number_str }}
                                            </div>
                                            
                                            <!-- Call Next Button -->
                                            <button onclick="callNextTicket({{ $selectedCounter->id }})"
                                                    class="call-action-btn text-white px-6 py-3 rounded-xl text-sm font-bold w-full transition-all duration-300 shadow-lg">
                                                📢 PANGGIL SEKARANG
                                            </button>
                                        </div>
                                    </div>
                                @else
                                    <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                                        <img src="https://img.icons8.com/color/48/checkmark.png" alt="Complete" class="w-8 h-8 mx-auto mb-2 opacity-70">
                                        <div class="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                            🎉 Semua antrian telah dilayani
                                        </div>
                                    </div>
                                @endif
                                
                                <!-- Queue Stats -->
                                <div class="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-lg border border-blue-200 dark:border-blue-600">
                                    <div class="flex items-center justify-between text-sm">
                                        <span class="text-blue-700 dark:text-blue-300 font-medium">📊 Total menunggu:</span>
                                        <span class="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                            {{ $waitingCount }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        @else
                            <!-- No Counter Selected -->
                            <div class="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                                <img src="https://img.icons8.com/color/64/control-panel.png" alt="Select" class="w-12 h-12 mx-auto mb-4 opacity-70">
                                <div class="text-gray-600 dark:text-gray-400">
                                    <div class="font-semibold mb-2">Pilih Loket untuk Memulai</div>
                                    <div class="text-sm">Silakan pilih loket dari dropdown di atas untuk mulai mengelola antrian</div>
                                </div>
                            </div>
                        @endif
                    </div>
                </x-filament::section>
            </div>
            
            <!-- Queue Status Display -->
            <div class="xl:col-span-3">
                <x-filament::section>
                    <x-slot name="heading">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <img src="https://img.icons8.com/color/24/dashboard.png" alt="Dashboard" class="w-6 h-6">
                                <span class="font-bold text-lg">Dashboard Antrian Real-time</span>
                            </div>
                            <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                <div class="flex items-center gap-1">
                                    <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span>Live</span>
                                </div>
                                <span>{{ now()->format('d M Y, H:i:s') }}</span>
                            </div>
                        </div>
                    </x-slot>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        @foreach($this->getCurrentTickets() as $serviceData)
                            <div class="queue-card border-2 border-gray-200 dark:border-gray-600 rounded-2xl p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 hover:shadow-xl transition-all duration-300 {{ $serviceData['current'] ? 'queue-card-active' : '' }}">
                                
                                <!-- Service Header -->
                                <div class="flex items-center gap-4 mb-6">
                                    <div class="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                                        @switch($serviceData['service'])
                                            @case('Poli Umum')
                                                <img src="https://img.icons8.com/color/32/hospital.png" alt="Poli Umum" class="w-8 h-8">
                                                @break
                                            @case('Poli Gigi')
                                                <img src="https://img.icons8.com/color/32/tooth.png" alt="Poli Gigi" class="w-8 h-8">
                                                @break
                                            @case('Farmasi')
                                                <img src="https://img.icons8.com/color/32/pills.png" alt="Farmasi" class="w-8 h-8">
                                                @break
                                            @case('Poli KIA')
                                                <img src="https://img.icons8.com/color/32/baby.png" alt="Poli KIA" class="w-8 h-8">
                                                @break
                                            @default
                                                <img src="https://img.icons8.com/color/32/hospital.png" alt="Default" class="w-8 h-8">
                                        @endswitch
                                    </div>
                                    <div class="flex-1">
                                        <h4 class="font-black text-gray-900 dark:text-gray-100 text-xl mb-1">
                                            {{ $serviceData['service'] }}
                                        </h4>
                                        <div class="flex items-center gap-2">
                                            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span class="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                                {{ $serviceData['waiting_count'] }} menunggu
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Current Status -->
                                @if($serviceData['current'])
                                    <div class="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 p-5 rounded-2xl border-2 border-green-300 dark:border-green-600 mb-4 shadow-lg">
                                        <div class="text-center">
                                            <div class="flex items-center justify-center gap-2 mb-3">
                                                <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                                <span class="text-xs text-green-700 dark:text-green-300 font-bold uppercase tracking-wider">Sedang Dipanggil</span>
                                            </div>
                                            <div class="ticket-number-large text-green-700 dark:text-green-300 mb-3">
                                                {{ $serviceData['current'] }}
                                            </div>
                                            <div class="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border border-green-200 dark:border-green-600">
                                                <img src="https://img.icons8.com/color/16/building.png" alt="Counter" class="w-4 h-4">
                                                <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ $serviceData['counter'] }}</span>
                                            </div>
                                            
                                            <!-- Test Sound Button -->
                                            <button onclick="testSoundCall('{{ $serviceData['current'] }}', '{{ $serviceData['service'] }}', '{{ $serviceData['counter'] }}')"
                                                    class="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 hover:scale-105">
                                                🔊 Test Suara
                                            </button>
                                        </div>
                                    </div>
                                @else
                                    <div class="bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
                                        <div class="text-center">
                                            <img src="https://img.icons8.com/color/48/timer.png" alt="Waiting" class="w-10 h-10 mx-auto mb-3 opacity-60">
                                            <span class="text-sm text-gray-500 dark:text-gray-400 font-medium">Menunggu Panggilan</span>
                                        </div>
                                    </div>
                                @endif
                                
                                <!-- Next in Queue -->
                                @if(count($serviceData['next']) > 0)
                                    <div class="border-t-2 border-gray-200 dark:border-gray-600 pt-4">
                                        <div class="flex items-center gap-2 mb-3">
                                            <img src="https://img.icons8.com/color/16/clock.png" alt="Clock" class="w-4 h-4">
                                            <span class="text-sm font-bold text-gray-700 dark:text-gray-300">
                                                Antrian Berikutnya:
                                            </span>
                                        </div>
                                        <div class="flex gap-2 flex-wrap">
                                            @foreach($serviceData['next'] as $index => $nextTicket)
                                                <span class="inline-flex items-center px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 {{ $index === 0 ? 'next-in-line text-white' : 'bg-blue-100 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-600 text-blue-800 dark:text-blue-200' }}">
                                                    {{ $nextTicket }}
                                                    @if($index === 0)
                                                        <span class="ml-2 text-xs opacity-90">▶</span>
                                                    @endif
                                                </span>
                                            @endforeach
                                        </div>
                                    </div>
                                @else
                                    <div class="border-t-2 border-gray-200 dark:border-gray-600 pt-4">
                                        <div class="text-center py-4">
                                            <img src="https://img.icons8.com/color/32/checkmark.png" alt="Complete" class="w-8 h-8 mx-auto mb-2 opacity-70">
                                            <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Queue Complete</div>
                                            <div class="text-xs text-gray-500 dark:text-gray-500">Semua pasien telah dilayani</div>
                                        </div>
                                    </div>
                                @endif
                            </div>
                        @endforeach
                    </div>
                </x-filament::section>
            </div>
        </div>
    </div>

    <script>
        // Enhanced JavaScript Functions
        function toggleQueueSound(button) {
            if (window.queueSound) {
                const isEnabled = window.queueSound.toggleSound();
                const iconSpan = button.querySelector('span:first-child');
                const textSpan = button.querySelector('span:last-child');
                
                if (isEnabled) {
                    button.className = 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105';
                    iconSpan.textContent = '🔊';
                    textSpan.textContent = 'AKTIF';
                } else {
                    button.className = 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105';
                    iconSpan.textContent = '🔇';
                    textSpan.textContent = 'MATI';
                }
                
                showNotification(isEnabled ? 'Sistem suara diaktifkan' : 'Sistem suara dimatikan', isEnabled ? 'success' : 'warning');
            }
        }

        function testSoundCall(ticketNumber, serviceName, counterName) {
            if (window.queueSound) {
                window.queueSound.playTicketCall(ticketNumber, serviceName, counterName);
                showNotification(`Testing: ${ticketNumber} - ${serviceName}`, 'info');
            }
        }

        async function callNextTicket(counterId) {
            try {
                showNotification('Memanggil antrian berikutnya...', 'info');
                
                const response = await fetch('/api/call/next', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
                    },
                    body: JSON.stringify({ counter_id: counterId })
                });

                if (response.ok) {
                    const ticket = await response.json();
                    showNotification(`Berhasil memanggil: ${ticket.number_str}`, 'success');
                    setTimeout(() => window.location.reload(), 1500);
                } else {
                    throw new Error('Gagal memanggil antrian');
                }
            } catch (error) {
                showNotification('Error: ' + error.message, 'error');
            }
        }

        async function recallTicket(ticketId) {
            try {
                const response = await fetch(`/api/call/${ticketId}/recall`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
                    }
                });

                if (response.ok) {
                    const ticket = await response.json();
                    showNotification(`Mengulang panggilan: ${ticket.number_str}`, 'success');
                    
                    // Trigger sound immediately
                    if (window.queueSound) {
                        setTimeout(() => {
                            // Get counter info and play sound
                            const counterName = document.querySelector('.call-action-btn')?.closest('.bg-gradient-to-br')?.querySelector('h4')?.textContent || 'Loket';
                            const serviceName = document.querySelector('.call-action-btn')?.closest('.bg-gradient-to-br')?.querySelector('p')?.textContent?.replace('📋 ', '') || 'Layanan';
                            window.queueSound.playTicketCall(ticket.number_str, serviceName, counterName);
                        }, 500);
                    }
                } else {
                    throw new Error('Gagal mengulang panggilan');
                }
            } catch (error) {
                showNotification('Error: ' + error.message, 'error');
            }
        }

        async function finishTicket(ticketId) {
            if (!confirm('Yakin ingin menyelesaikan tiket ini?')) return;
            
            try {
                const response = await fetch(`/api/call/${ticketId}/finish`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
                    }
                });

                if (response.ok) {
                    const ticket = await response.json();
                    showNotification(`Tiket ${ticket.number_str} telah diselesaikan`, 'success');
                    setTimeout(() => window.location.reload(), 1000);
                } else {
                    throw new Error('Gagal menyelesaikan tiket');
                }
            } catch (error) {
                showNotification('Error: ' + error.message, 'error');
            }
        }

        function showNotification(message, type = 'info') {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `fixed top-4 right-4 px-6 py-4 rounded-xl shadow-lg z-50 transition-all duration-300 transform translate-x-full`;
            
            // Set colors based on type
            const colors = {
                success: 'bg-green-500 text-white',
                error: 'bg-red-500 text-white',
                warning: 'bg-yellow-500 text-white',
                info: 'bg-blue-500 text-white'
            };
            
            notification.className += ` ${colors[type] || colors.info}`;
            notification.textContent = message;
            
            // Add to DOM
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.classList.remove('translate-x-full');
            }, 100);
            
            // Remove after 3 seconds
            setTimeout(() => {
                notification.classList.add('translate-x-full');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }

        // Volume control update
        document.addEventListener('DOMContentLoaded', function() {
            const volumeControl = document.getElementById('volumeControl');
            const volumeValue = document.getElementById('volumeValue');
            
            if (volumeControl && volumeValue) {
                volumeControl.addEventListener('input', function() {
                    const value = Math.round(this.value * 100);
                    volumeValue.textContent = value + '%';
                });
            }
            
            // Initialize sound system
            setTimeout(() => {
                if (window.queueSound) {
                    console.log('Queue management system ready!');
                }
            }, 1000);
        });

        // Auto-refresh every 30 seconds
        setInterval(() => {
            window.location.reload();
        }, 30000);
    </script>
</x-filament-panels::page>

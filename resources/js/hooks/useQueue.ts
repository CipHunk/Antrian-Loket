import { useState, useEffect, useCallback } from 'react';

// Types
export interface QueueData {
  service: string;
  current: string | null;
  counter: string | null;
  next: string[];
  total_waiting: number; // Add total waiting count
  current_ticket: string | null;
  current_counter: string | null;
  called_at: number | null;
}

export interface QueueStatus {
  services: QueueData[];
  timestamp: number;
}

export interface Ticket {
  id: number;
  number_str: string;
  service_id: number;
  status: string;
  called_at?: string;
  counter_id?: number;
  created_at: string;
}

export interface Counter {
  id: number;
  name: string;
  service: {
    id: number;
    name: string;
  };
}

export interface Service {
  id: number;
  name: string;
  code: string;
  prefix: string;
}

export interface DashboardStats {
  total_today: number;
  done_today: number;
  currently_serving: number;
  waiting: number;
  avg_service_time: number;
  services: Array<{
    id: number;
    name: string;
    total_today: number;
    done_today: number;
    waiting: number;
    serving: number;
  }>;
  counters: Array<{
    id: number;
    name: string;
    done_today: number;
    serving: number;
    service: {
      id: number;
      name: string;
    };
  }>;
}

export interface GlobalStats {
  done_today: number;
  currently_serving: number;
  waiting: number;
}

// Custom hook for queue status
export function useQueueStatus(pollingInterval: number = 10000) {
  const [data, setData] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQueueStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/status');
      if (!response.ok) {
        throw new Error('Failed to fetch queue status');
      }
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueueStatus();

    const interval = setInterval(fetchQueueStatus, pollingInterval);
    return () => clearInterval(interval);
  }, [fetchQueueStatus, pollingInterval]);

  return { data, loading, error, refetch: fetchQueueStatus };
}

// Custom hook for queue management actions
export function useQueueActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCSRFToken = () => {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
  };

  const callNext = useCallback(async (counterId: number): Promise<Ticket | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/call/next', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCSRFToken()
        },
        body: JSON.stringify({ counter_id: counterId })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to call next ticket');
      }

      const ticket = await response.json();
      return ticket;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const recall = useCallback(async (ticketId: number): Promise<Ticket | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/call/${ticketId}/recall`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCSRFToken()
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to recall ticket');
      }

      const ticket = await response.json();
      return ticket;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const finish = useCallback(async (ticketId: number): Promise<Ticket | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/call/${ticketId}/finish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCSRFToken()
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to finish ticket');
      }

      const ticket = await response.json();
      return ticket;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateTicket = useCallback(async (serviceId: number): Promise<Ticket | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCSRFToken(),
          'Accept': 'application/json'
        },
        body: JSON.stringify({ service_id: serviceId })
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Failed to generate ticket';

        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          const errorText = await response.text();
          errorMessage = errorText || `Error ${response.status}: ${response.statusText}`;
        }

        console.error('Generate ticket error:', errorMessage);
        throw new Error(errorMessage);
      }

      const ticket = await response.json();
      return ticket;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('Generate ticket exception:', err);
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    callNext,
    recall,
    finish,
    generateTicket,
    loading,
    error,
    clearError: () => setError(null)
  };
}

// Custom hook for services
export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        } else {
          // Fallback to mock data if API not available
          const mockServices: Service[] = [
            { id: 1, name: 'Poli Umum', code: 'POLI-UMUM', prefix: 'A' },
            { id: 2, name: 'Poli Gigi', code: 'POLI-GIGI', prefix: 'B' },
            { id: 3, name: 'Farmasi', code: 'FARMASI', prefix: 'C' },
            { id: 4, name: 'Poli KIA', code: 'POLI-KIA', prefix: 'D' },
          ];
          setServices(mockServices);
        }
        setError(null);
      } catch (err) {
        // Use mock data on error
        const mockServices: Service[] = [
          { id: 1, name: 'Poli Umum', code: 'POLI-UMUM', prefix: 'A' },
          { id: 2, name: 'Poli Gigi', code: 'POLI-GIGI', prefix: 'B' },
          { id: 3, name: 'Farmasi', code: 'FARMASI', prefix: 'C' },
          { id: 4, name: 'Poli KIA', code: 'POLI-KIA', prefix: 'D' },
        ];
        setServices(mockServices);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return { services, loading, error };
}

// Custom hook for counters
export function useCounters() {
  const [counters, setCounters] = useState<Counter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCounters = async () => {
      try {
        const response = await fetch('/api/counters');
        if (response.ok) {
          const data = await response.json();
          setCounters(data);
        } else {
          // Fallback to mock data if API not available
          const mockCounters: Counter[] = [
            { id: 1, name: 'Loket 1', service: { id: 1, name: 'Poli Umum' } },
            { id: 2, name: 'Loket Gigi', service: { id: 2, name: 'Poli Gigi' } },
            { id: 3, name: 'Loket Farmasi', service: { id: 3, name: 'Farmasi' } },
            { id: 4, name: 'Loket KIA', service: { id: 4, name: 'Poli KIA' } },
          ];
          setCounters(mockCounters);
        }
        setError(null);
      } catch (err) {
        // Use mock data on error
        const mockCounters: Counter[] = [
          { id: 1, name: 'Loket 1', service: { id: 1, name: 'Poli Umum' } },
          { id: 2, name: 'Loket Gigi', service: { id: 2, name: 'Poli Gigi' } },
          { id: 3, name: 'Loket Farmasi', service: { id: 3, name: 'Farmasi' } },
          { id: 4, name: 'Loket KIA', service: { id: 4, name: 'Poli KIA' } },
        ];
        setCounters(mockCounters);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCounters();
  }, []);

  return { counters, loading, error };
}

// Custom hook for current ticket at a counter
export function useCurrentTicket(counterId: number | null) {
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentTicket = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/counter/${id}/current`);

      if (response.ok) {
        const ticket = await response.json();
        setCurrentTicket(ticket);
      } else if (response.status === 404) {
        setCurrentTicket(null);
      } else {
        throw new Error('Failed to fetch current ticket');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setCurrentTicket(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (counterId) {
      fetchCurrentTicket(counterId);
    } else {
      setCurrentTicket(null);
    }
  }, [counterId, fetchCurrentTicket]);

  return {
    currentTicket,
    loading,
    error,
    refetch: counterId ? () => fetchCurrentTicket(counterId) : () => { }
  };
}

// Custom hook for notifications
export function useNotifications() {
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  } | null>(null);

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return { notification, showNotification, hideNotification };
}

// Custom hook for sound system
export function useSoundSystem() {
  const [isEnabled, setIsEnabled] = useState(() => {
    return localStorage.getItem('queueSoundEnabled') !== 'false';
  });

  const [volume, setVolume] = useState(() => {
    return parseFloat(localStorage.getItem('queueSoundVolume') || '0.7');
  });

  // Sound System Class
  const soundSystem = useMemo(() => {
    class QueueSoundSystem {
      private speechSynth: SpeechSynthesis | null = null;
      private voice: SpeechSynthesisVoice | null = null;
      private bellSound: HTMLAudioElement | null = null;

      constructor() {
        this.initSoundSystem();
      }

      initSoundSystem() {
        if ('speechSynthesis' in window) {
          this.speechSynth = window.speechSynthesis;

          const setVoice = () => {
            const voices = this.speechSynth!.getVoices();
            this.voice = voices.find(voice => voice.lang.includes('id')) ||
              voices.find(voice => voice.lang.includes('en')) ||
              voices[0];
          };

          if (this.speechSynth.getVoices().length > 0) {
            setVoice();
          } else {
            this.speechSynth.onvoiceschanged = setVoice;
          }
        }

        // Create bell sound
        this.bellSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEbBjiR2O+OOggZZbPs44cAAA==');
        this.updateVolume(volume);
      }

      updateVolume(newVolume: number) {
        if (this.bellSound) {
          this.bellSound.volume = newVolume;
        }
      }

      async playTicketCall(ticketNumber: string, serviceName: string, counterName: string) {
        if (!isEnabled) return;

        try {
          // Play bell sound first
          if (this.bellSound) {
            await this.bellSound.play();
            setTimeout(() => {
              this.speakTicketCall(ticketNumber, serviceName, counterName);
            }, 1000);
          } else {
            this.speakTicketCall(ticketNumber, serviceName, counterName);
          }
        } catch (error) {
          console.error('Error playing bell sound:', error);
          setTimeout(() => {
            this.speakTicketCall(ticketNumber, serviceName, counterName);
          }, 500);
        }
      }

      speakTicketCall(ticketNumber: string, serviceName: string, counterName: string) {
        if (!this.speechSynth || !this.voice) return;

        this.speechSynth.cancel();

        setTimeout(() => {
          const text = `Nomor antrian ${ticketNumber}, layanan ${serviceName}, silakan menuju ${counterName}`;
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.voice = this.voice;
          utterance.volume = volume;
          utterance.rate = 0.9;
          utterance.pitch = 1.0;
          utterance.lang = 'id-ID';

          this.speechSynth!.speak(utterance);
        }, 500);
      }
    }

    return new QueueSoundSystem();
  }, []);

  // Update localStorage when settings change
  useEffect(() => {
    localStorage.setItem('queueSoundEnabled', isEnabled.toString());
  }, [isEnabled]);

  useEffect(() => {
    localStorage.setItem('queueSoundVolume', volume.toString());
    soundSystem.updateVolume(volume);
  }, [volume, soundSystem]);

  const playTicketCall = useCallback((ticketNumber: string, serviceName: string, counterName: string) => {
    soundSystem.playTicketCall(ticketNumber, serviceName, counterName);
  }, [soundSystem]);

  const toggleSound = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  const updateVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
  }, []);

  return {
    isEnabled,
    volume,
    playTicketCall,
    toggleSound,
    updateVolume
  };
}

// Re-export useMemo for the sound system hook
import { useMemo } from 'react';

// Custom hook for counter statistics
export function useCounterStats(counterId: number | null) {
  const [stats, setStats] = useState<{
    done_today: number;
    currently_serving: number;
    waiting: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/counter/${id}/stats`);

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        throw new Error('Failed to fetch counter stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (counterId) {
      fetchStats(counterId);

      // Refresh every 30 seconds
      const interval = setInterval(() => {
        fetchStats(counterId);
      }, 30000);

      return () => clearInterval(interval);
    } else {
      setStats(null);
    }
  }, [counterId, fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: counterId ? () => fetchStats(counterId) : () => { }
  };
}
// Custom hook for dashboard statistics
export function useDashboardStats(pollingInterval: number = 30000) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/dashboard/stats');

      if (response.ok) {
        const data = await response.json();
        setStats(data);
        setError(null);
      } else {
        throw new Error('Failed to fetch dashboard stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    const interval = setInterval(fetchStats, pollingInterval);

    return () => clearInterval(interval);
  }, [fetchStats, pollingInterval]);

  return { stats, loading, error, refetch: fetchStats };
}

// Custom hook for global statistics (for display page)
export function useGlobalStats(pollingInterval: number = 30000) {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/global/stats');

      if (response.ok) {
        const data = await response.json();
        setStats(data);
        setError(null);
      } else {
        throw new Error('Failed to fetch global stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    const interval = setInterval(fetchStats, pollingInterval);

    return () => clearInterval(interval);
  }, [fetchStats, pollingInterval]);

  return { stats, loading, error, refetch: fetchStats };
}

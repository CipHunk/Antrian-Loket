import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQueueStatus, useSoundSystem, useGlobalStats } from '@/hooks/useQueue';
import { Volume2, VolumeX, Users, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function Display() {
  const { data, loading } = useQueueStatus();
  const { stats: globalStats } = useGlobalStats(30000); // Refresh every 30 seconds
  const { isEnabled, playTicketCall, toggleSound } = useSoundSystem();
  const prevDataRef = useRef<any>(null);

  const breadcrumbs = [
    { title: 'Antrian', href: '/queue/display' },
    { title: 'Display Antrian', href: '/queue/display' },
  ];

  // Auto-play sound when current ticket changes
  useEffect(() => {
    if (!data || !prevDataRef.current) {
      prevDataRef.current = data;
      return;
    }

    // Check if any service has a new current ticket
    data.services?.forEach((service, index) => {
      const prevService = prevDataRef.current?.services?.[index];
      if (service.current && service.current !== prevService?.current) {
        // New ticket is being called
        playTicketCall(service.current, service.service, service.counter || 'Counter');
      }
    });

    prevDataRef.current = data;
  }, [data, playTicketCall]);

  if (loading) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Display Antrian" />
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
            <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Display Antrian" />
      
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Display Antrian</h1>
            <p className="text-muted-foreground">Monitoring antrian real-time</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSound}
            title={isEnabled ? 'Matikan Suara' : 'Aktifkan Suara'}
          >
            {isEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </Button>
        </div>

    

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Menunggu</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {globalStats?.waiting ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">Antrian aktif</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sedang Dilayani</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {globalStats?.currently_serving ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">Counter aktif</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Selesai Hari Ini</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{globalStats?.done_today ?? 0}</div>
              <p className="text-xs text-muted-foreground">Total dilayani</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {data?.services?.map((service) => (
            <Card key={service.service}>
              <CardHeader>
                <CardTitle className="text-lg">{service.service}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Menunggu:</span>
                    <Badge variant="outline" className="text-base font-bold">
                      {service.total_waiting || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sedang Dilayani:</span>
                    <span className="text-lg font-semibold text-primary">
                      {service.current || '-'}
                    </span>
                  </div>
                  {service.current && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Counter:</span>
                      <Badge variant="default">{service.counter}</Badge>
                    </div>
                  )}
                  <div className="mt-2 pt-2 border-t">
                    <div className="text-xs text-muted-foreground mb-1">5 Antrian Berikutnya:</div>
                    <div className="flex flex-wrap gap-1">
                      {service.next && service.next.length > 0 ? (
                        service.next.map((ticket, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {ticket}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Tidak ada antrian</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

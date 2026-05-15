import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useServices, useQueueActions } from '@/hooks/useQueue';
import {
  Printer,
  Ticket,
  Users,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Calendar,
  Building2,
  Sparkles,
  Timer
} from 'lucide-react';
import { useState } from 'react';

export default function TicketPage() {
  const { services, loading } = useServices();
  const { generateTicket, loading: generating, error: queueError } = useQueueActions();
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [generatedTicket, setGeneratedTicket] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const breadcrumbs = [
    { title: 'Antrian', href: '/queue/display' },
    { title: 'Ambil Tiket', href: '/queue/ticket' },
  ];

  const handleGenerateTicket = async () => {
    if (!selectedService) return;

    setError(null);
    const ticket = await generateTicket(selectedService);
    if (ticket) {
      setGeneratedTicket(ticket);
    } else {
      setError(queueError || 'Gagal membuat tiket. Silakan coba lagi.');
    }
  };

  const handlePrint = () => {
    const ticket = generatedTicket;
    const serviceName = services.find(s => s.id === ticket.service_id)?.name || '';
    const createdAt = new Date(ticket.created_at).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Tiket Antrian - ${ticket.number_str}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 20mm;
          }
          * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
          }
          body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            display: flex;
            justify-content: center;
            padding: 20px;
          }
          .ticket {
            width: 100%;
            max-width: 400px;
            border: 3px solid #0d9488;
            border-radius: 16px;
            overflow: hidden;
            background: white;
          }
          .header {
            background: linear-gradient(135deg, #0d9488, #10b981);
            color: white;
            padding: 20px;
            text-align: center;
          }
          .header h1 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 4px;
          }
          .header p {
            font-size: 12px;
            opacity: 0.9;
          }
          .content {
            padding: 30px;
            text-align: center;
          }
          .service {
            font-size: 14px;
            padding: 6px 16px;
            border: 2px solid #0d9488;
            border-radius: 20px;
            display: inline-block;
            margin-bottom: 20px;
            color: #0d9488;
            font-weight: 600;
          }
          .number {
            font-size: 72px;
            font-weight: 900;
            letter-spacing: 4px;
            color: #0d9488;
            margin: 20px 0;
            line-height: 1;
          }
          .info {
            margin-top: 25px;
            padding-top: 20px;
            border-top: 2px dashed #e5e7eb;
            text-align: left;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            font-size: 14px;
            border-bottom: 1px solid #f3f4f6;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .info-label {
            color: #6b7280;
          }
          .info-value {
            font-weight: 600;
            color: #111827;
          }
          .estimate {
            margin-top: 20px;
            padding: 20px;
            background: linear-gradient(135deg, #f0fdfa, #ecfdf5);
            border: 2px solid #99f6e4;
            border-radius: 12px;
            text-align: center;
          }
          .estimate-label {
            font-size: 13px;
            color: #6b7280;
            margin-bottom: 8px;
          }
          .estimate-time {
            font-size: 42px;
            font-weight: 800;
            color: #0d9488;
          }
          .estimate-info {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-top: 15px;
            font-size: 13px;
          }
          .estimate-info span {
            color: #6b7280;
          }
          .estimate-info strong {
            color: #0d9488;
          }
          .footer {
            text-align: center;
            padding: 15px;
            background: #f9fafb;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            <h1>TIKET ANTRIAN</h1>
            <p>Sistem Antrian Poliklinik</p>
          </div>
          <div class="content">
            <div class="service">${serviceName}</div>
            <div class="number">${ticket.number_str}</div>
            
            <div class="info">
              <div class="info-row">
                <span class="info-label">Waktu Ambil</span>
                <span class="info-value">${createdAt}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Status</span>
                <span class="info-value" style="color: #3b82f6;">Menunggu</span>
              </div>
            </div>

            <div class="estimate">
              <div class="estimate-label">Perkiraan Dilayani</div>
              <div class="estimate-time">${ticket.estimated_service_time ?? '--:--'}</div>
              <div class="estimate-info">
                <span>Antrian di depan: <strong>${ticket.waiting_ahead ?? 0}</strong></span>
                <span>Tunggu: <strong>±${ticket.estimated_wait_minutes ?? 0} menit</strong></span>
              </div>
            </div>
          </div>
          <div class="footer">
            Harap tunggu panggilan nomor Anda di layar display
          </div>
        </div>
        <script>
          window.onload = function() { 
            setTimeout(function() {
              window.print(); 
            }, 200);
          }
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=600,height=800');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
    }
  };

  if (loading) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Ambil Tiket" />
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
      <Head title="Ambil Tiket" />

      <div className="min-h-screen p-6">
        <div className="container mx-auto max-w-6xl">
          {!generatedTicket ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center mb-8 space-y-2">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Ticket className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <h1 className="text-4xl font-bold tracking-tight">Ambil Tiket Antrian</h1>
                <p className="text-lg text-muted-foreground">
                  Pilih layanan yang Anda butuhkan dan dapatkan nomor antrian
                </p>
              </div>

              {/* Info Alert */}
              <Alert className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50">
                <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-900 dark:text-blue-100">
                  Sistem antrian digital memudahkan Anda untuk mendapatkan layanan tanpa menunggu lama.
                  Pilih layanan di bawah ini dan ambil nomor antrian Anda.
                </AlertDescription>
              </Alert>

              {/* Service Selection */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-xl font-semibold">Pilih Layanan</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {services?.map((service) => {
                    const isSelected = selectedService === service.id;
                    return (
                      <Card
                        key={service.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${isSelected
                          ? 'border-2 border-primary shadow-lg ring-2 ring-primary/20'
                          : 'border hover:border-primary/50'
                          }`}
                        onClick={() => setSelectedService(service.id)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="flex items-center gap-2 text-lg">
                                <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                  }`}>
                                  <Users className="h-4 w-4" />
                                </div>
                                {service.name}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                Kode: {service.code}
                              </CardDescription>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="h-5 w-5 text-primary animate-in fade-in zoom-in" />
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Badge
                            variant={isSelected ? "default" : "secondary"}
                            className="w-full justify-center text-sm font-semibold"
                          >
                            Antrian: {service.prefix}-XXX
                          </Badge>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <Card className="border-2">
                <CardContent className="pt-6">
                  <Button
                    onClick={handleGenerateTicket}
                    disabled={!selectedService || generating}
                    size="lg"
                    className="w-full h-14 text-lg font-semibold"
                  >
                    {generating ? (
                      <>
                        <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Membuat Tiket...
                      </>
                    ) : (
                      <>
                        <Ticket className="mr-2 h-6 w-6" />
                        Ambil Nomor Antrian Sekarang
                      </>
                    )}
                  </Button>
                  {!selectedService && (
                    <p className="text-center text-sm text-muted-foreground mt-3">
                      Silakan pilih layanan terlebih dahulu
                    </p>
                  )}
                  {error && (
                    <Alert className="mt-4 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
                      <AlertDescription className="text-red-900 dark:text-red-100">
                        <strong>Error:</strong> {error}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              {/* Print Styles */}
              <style
                dangerouslySetInnerHTML={{
                  __html: `
@media print {
  /* Hide everything except the ticket */
  body > *:not(#app),
  header, nav, aside, footer,
  .no-print,
  [data-sidebar],
  [data-slot="sidebar"],
  [data-slot="sidebar-wrapper"] {
    display: none !important;
  }

  /* Reset page */
  @page {
    size: A6 portrait;
    margin: 8mm;
  }

  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
  }

  /* Make sure ticket is visible and styled */
  #printable-ticket {
    display: block !important;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  #printable-ticket * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  /* Remove shadows and animations */
  #printable-ticket .shadow,
  #printable-ticket .shadow-xl {
    box-shadow: none !important;
  }

  /* Compact styling for print */
  #printable-ticket .ticket-number {
    font-size: 42px !important;
    color: #000 !important;
  }

  #printable-ticket .text-primary {
    color: #0d9488 !important;
  }
}
`}}
              />

              {/* Success State */}
              <div className="mx-auto max-w-2xl">
                {/* Success Animation Header - Hidden on print */}
                <div className="no-print text-center mb-8 animate-in fade-in zoom-in duration-500">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/50 rounded-full mb-4">
                    <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h1 className="text-3xl font-bold mb-2">Tiket Berhasil Dibuat!</h1>
                  <p className="text-muted-foreground">
                    Nomor antrian Anda telah berhasil dibuat
                  </p>
                </div>

                {/* Printable Ticket Card */}
                <div id="printable-ticket">
                  <Card className="border-2 shadow-xl animate-in slide-in-from-bottom-4 duration-500">
                    <CardHeader className="card-header text-center py-4 bg-primary/5 dark:bg-primary/10">
                      <CardTitle className="text-xl">Nomor Antrian</CardTitle>
                      <CardDescription className="text-xs">Simpan nomor ini</CardDescription>
                    </CardHeader>

                    <CardContent className="card-content space-y-4 py-4">
                      {/* Ticket Number Display */}
                      <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 dark:bg-primary/10 p-4 text-center">
                        <Badge variant="outline" className="text-xs font-semibold px-3 py-0.5 mb-2">
                          {services.find(s => s.id === generatedTicket.service_id)?.name}
                        </Badge>
                        <div className="ticket-number text-6xl font-black text-primary tracking-wider">
                          {generatedTicket.number_str}
                        </div>
                      </div>

                      {/* Info Rows - Compact */}
                      <div className="space-y-2 text-sm">
                        <div className="info-row flex items-center justify-between py-2 px-3 rounded bg-muted/50">
                          <span className="text-muted-foreground">Waktu</span>
                          <span className="font-medium">
                            {new Date(generatedTicket.created_at).toLocaleString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>

                        {/* Estimated Wait - Compact */}
                        <div className="estimate-section p-3 rounded bg-primary/5 border border-primary/20">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-muted-foreground">Antrian di depan</span>
                            <span className="font-bold text-primary">{generatedTicket.waiting_ahead ?? 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">Perkiraan dilayani</span>
                            <span className="estimate-time text-xl font-bold text-primary">
                              {generatedTicket.estimated_service_time ?? '--:--'}
                            </span>
                          </div>
                        </div>

                        <div className="info-row flex items-center justify-between py-2 px-3 rounded bg-muted/50">
                          <span className="text-muted-foreground">Status</span>
                          <Badge variant="outline" className="text-xs border-blue-500 text-blue-600">
                            Menunggu
                          </Badge>
                        </div>
                      </div>

                      {/* Footer note */}
                      <p className="text-center text-xs text-muted-foreground">
                        Tunggu pemanggilan di layar display
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Buttons - Hidden on print */}
                <div className="no-print mt-6 space-y-3">
                  <Button
                    onClick={handlePrint}
                    variant="default"
                    size="lg"
                    className="w-full h-12 text-base font-semibold"
                  >
                    <Printer className="mr-2 h-5 w-5" />
                    Cetak Tiket
                  </Button>

                  <Button
                    onClick={() => {
                      setGeneratedTicket(null);
                      setSelectedService(null);
                    }}
                    variant="outline"
                    size="lg"
                    className="w-full h-12 text-base font-semibold"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Ambil Tiket Baru
                  </Button>
                </div>

                {/* Info Box - Hidden on print */}
                <Alert className="no-print mt-6 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50">
                  <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <AlertDescription className="text-amber-900 dark:text-amber-100 text-sm">
                    <strong>Perhatian:</strong> Pastikan Anda berada di area tunggu dan
                    memperhatikan layar display untuk mendengar nomor antrian Anda dipanggil.
                  </AlertDescription>
                </Alert>

                {/* Additional Info - Hidden on print */}
                <div className="no-print mt-6 text-center text-sm text-muted-foreground">
                  <p>Terima kasih telah menggunakan sistem antrian digital kami</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

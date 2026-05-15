import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDashboardStats } from '@/hooks/useQueue';
import {
    Users,
    Clock,
    CheckCircle,
    TrendingUp,
    Activity,
    BarChart3,
    Timer,
    Sparkles
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { stats, loading } = useDashboardStats(30000); // Refresh every 30 seconds

    if (loading && !stats) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
                <div className="flex h-screen items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
                        <p className="mt-2 text-sm text-muted-foreground">Loading statistik...</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl shadow-lg shadow-teal-500/20">
                                <BarChart3 className="h-5 w-5 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        </div>
                        <p className="text-muted-foreground">
                            Ringkasan statistik sistem antrian hari ini
                        </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Real-time Update</span>
                    </div>
                </div>

                {/* Main Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-l-4 border-l-primary hover:shadow-lg transition-all">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Antrian Hari Ini</CardTitle>
                            <div className="p-2 rounded-lg bg-primary/10">
                                <BarChart3 className="h-4 w-4 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats?.total_today ?? 0}</div>
                            <p className="text-xs text-muted-foreground">
                                Tiket yang dibuat hari ini
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-emerald-500 hover:shadow-lg transition-all">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Selesai Dilayani</CardTitle>
                            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                <CheckCircle className="h-4 w-4 text-emerald-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-emerald-600">{stats?.done_today ?? 0}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats?.total_today ?
                                    `${Math.round((stats.done_today / stats.total_today) * 100)}% dari total`
                                    : 'Belum ada antrian'
                                }
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-all">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sedang Dilayani</CardTitle>
                            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                <Activity className="h-4 w-4 text-orange-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-orange-600">{stats?.currently_serving ?? 0}</div>
                            <p className="text-xs text-muted-foreground">
                                Loket aktif sekarang
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Menunggu</CardTitle>
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                <Clock className="h-4 w-4 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-600">{stats?.waiting ?? 0}</div>
                            <p className="text-xs text-muted-foreground">
                                Antrian belum dipanggil
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Average Service Time */}
                <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/20">
                                <Timer className="h-5 w-5 text-primary" />
                            </div>
                            Waktu Pelayanan Rata-rata
                        </CardTitle>
                        <CardDescription>
                            Durasi rata-rata dari pemanggilan hingga selesai
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-bold text-primary">
                            {stats?.avg_service_time ?? 0} <span className="text-xl text-muted-foreground font-normal">menit</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics by Service */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Users className="h-5 w-5 text-primary" />
                                </div>
                                Statistik per Layanan
                            </CardTitle>
                            <CardDescription>
                                Ringkasan antrian untuk setiap layanan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats?.services?.map((service) => (
                                    <div key={service.id} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors">
                                        <div className="space-y-1">
                                            <p className="font-medium">{service.name}</p>
                                            <div className="flex gap-2 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <CheckCircle className="h-3 w-3 text-emerald-600" />
                                                    {service.done_today} selesai
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Activity className="h-3 w-3 text-orange-600" />
                                                    {service.serving} dilayani
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3 text-blue-600" />
                                                    {service.waiting} menunggu
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-primary">{service.total_today}</div>
                                            <p className="text-xs text-muted-foreground">Total</p>
                                        </div>
                                    </div>
                                ))}

                                {!stats?.services?.length && (
                                    <p className="text-center text-sm text-muted-foreground py-4">
                                        Belum ada data layanan
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <TrendingUp className="h-5 w-5 text-primary" />
                                </div>
                                Performa Loket
                            </CardTitle>
                            <CardDescription>
                                Jumlah antrian yang diselesaikan per loket
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats?.counters?.map((counter) => (
                                    <div key={counter.id} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors">
                                        <div className="space-y-1">
                                            <p className="font-medium">{counter.name}</p>
                                            <div className="flex gap-2 items-center">
                                                <Badge variant="outline" className="text-xs">
                                                    {counter.service.name}
                                                </Badge>
                                                {counter.serving > 0 && (
                                                    <Badge variant="default" className="text-xs bg-orange-600">
                                                        Sedang Aktif
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-emerald-600">
                                                {counter.done_today}
                                            </div>
                                            <p className="text-xs text-muted-foreground">Selesai</p>
                                        </div>
                                    </div>
                                ))}

                                {!stats?.counters?.length && (
                                    <p className="text-center text-sm text-muted-foreground py-4">
                                        Belum ada data counter
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

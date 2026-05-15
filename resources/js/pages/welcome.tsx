import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Clock,
    Users,
    LayoutDashboard,
    BarChart3,
    CheckCircle,
    ArrowRight,
    Ticket,
    Monitor,
    Bell,
    Shield,
    Sparkles,
    Heart
} from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const features = [
        {
            icon: Ticket,
            title: 'Antrian Digital',
            description: 'Ambil nomor antrian secara digital tanpa perlu mengantri fisik',
            color: 'from-teal-500 to-emerald-500'
        },
        {
            icon: Monitor,
            title: 'Display Real-time',
            description: 'Pantau status antrian Anda melalui layar display yang ter-update otomatis',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Bell,
            title: 'Notifikasi Suara',
            description: 'Sistem panggilan otomatis dengan text-to-speech bahasa Indonesia',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: BarChart3,
            title: 'Statistik Lengkap',
            description: 'Dashboard admin dengan laporan dan statistik antrian harian',
            color: 'from-orange-500 to-amber-500'
        }
    ];

    const steps = [
        {
            number: '01',
            title: 'Ambil Tiket',
            description: 'Pilih layanan yang Anda butuhkan dan ambil nomor antrian digital'
        },
        {
            number: '02',
            title: 'Tunggu Panggilan',
            description: 'Pantau layar display atau tunggu pengumuman suara untuk giliran Anda'
        },
        {
            number: '03',
            title: 'Dapatkan Layanan',
            description: 'Datang ke loket yang ditunjukkan dan dapatkan pelayanan terbaik'
        }
    ];

    const stats = [
        { value: '99%', label: 'Kepuasan Pasien' },
        { value: '5+', label: 'Layanan Tersedia' },
        { value: '1000+', label: 'Antrian/Hari' },
        { value: '24/7', label: 'Sistem Online' }
    ];

    return (
        <>
            <Head title="Sistem Antrian Poliklinik">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700,800&display=swap" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                {/* Navigation */}
                <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-700/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/25">
                                    <Heart className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <span className="text-lg font-bold text-slate-900 dark:text-white">Sistem Antrian Poliklinik</span>
                                </div>
                            </div>

                            {/* Navigation Links */}
                            <div className="hidden md:flex items-center gap-8">
                                <a href="#features" className="text-sm font-medium text-slate-600 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400 transition-colors">Fitur</a>
                                <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400 transition-colors">Cara Kerja</a>
                                <a href="#stats" className="text-sm font-medium text-slate-600 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400 transition-colors">Statistik</a>
                            </div>

                            {/* Auth Buttons */}
                            <div className="flex items-center gap-3">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-sm font-semibold rounded-xl hover:from-teal-600 hover:to-emerald-700 transition-all shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 hover:-translate-y-0.5"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400 transition-colors"
                                        >
                                            Masuk
                                        </Link>
                                        <Link
                                            href={register()}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-sm font-semibold rounded-xl hover:from-teal-600 hover:to-emerald-700 transition-all shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 hover:-translate-y-0.5"
                                        >
                                            Daftar
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                    {/* Background Decorations */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-400/20 to-emerald-400/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-teal-100/30 to-transparent dark:from-teal-900/20 rounded-full blur-3xl" />
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <div className="text-center max-w-4xl mx-auto">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 dark:bg-teal-900/30 rounded-full border border-teal-200/50 dark:border-teal-700/50 mb-8">
                                <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                <span className="text-sm font-medium text-teal-700 dark:text-teal-300">Sistem Antrian Digital Modern</span>
                            </div>

                            {/* Headline */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
                                Kelola Antrian{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">
                                    Poliklinik
                                </span>
                                <br />
                                dengan Mudah & Efisien
                            </h1>

                            {/* Subheadline */}
                            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                                Tingkatkan pengalaman pasien dengan sistem antrian digital yang modern.
                                Real-time display, notifikasi suara, dan manajemen antrian yang efisien.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    href="/queue/ticket"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-base font-semibold rounded-2xl hover:from-teal-600 hover:to-emerald-700 transition-all shadow-xl shadow-teal-500/25 hover:shadow-2xl hover:shadow-teal-500/30 hover:-translate-y-1"
                                >
                                    <Ticket className="w-5 h-5" />
                                    Ambil Nomor Antrian
                                </Link>
                                <Link
                                    href="/queue/display"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base font-semibold rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                                >
                                    <Monitor className="w-5 h-5" />
                                    Lihat Display Antrian
                                </Link>
                            </div>
                        </div>

                        {/* Hero Stats */}
                        <div id="stats" className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                                    <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600 mb-1">{stat.value}</div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 lg:py-32 bg-white/50 dark:bg-slate-900/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                                Fitur Unggulan
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                Sistem antrian modern dengan berbagai fitur untuk memberikan pengalaman terbaik
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, index) => (
                                <div key={index} className="group p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:border-teal-300 dark:hover:border-teal-700 transition-all hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:-translate-y-1">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="py-20 lg:py-32">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                                Cara Kerja
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                Tiga langkah mudah untuk mendapatkan pelayanan tanpa antri lama
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {steps.map((step, index) => (
                                <div key={index} className="relative text-center">
                                    {/* Connector Line */}
                                    {index < steps.length - 1 && (
                                        <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-teal-300 to-emerald-300 dark:from-teal-700 dark:to-emerald-700" />
                                    )}

                                    {/* Step Circle */}
                                    <div className="relative z-10 w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-teal-500/25">
                                        <span className="text-3xl font-bold text-white">{step.number}</span>
                                    </div>

                                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{step.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 lg:py-32 bg-gradient-to-br from-teal-500 to-emerald-600 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                    </div>

                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                            Siap Memulai?
                        </h2>
                        <p className="text-xl text-teal-100 mb-10 max-w-2xl mx-auto">
                            Bergabunglah dengan sistem antrian digital kami dan tingkatkan efisiensi pelayanan poliklinik Anda
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/queue/ticket"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-teal-600 text-base font-semibold rounded-2xl hover:bg-teal-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                            >
                                <Ticket className="w-5 h-5" />
                                Ambil Tiket Sekarang
                            </Link>
                            {!auth.user && (
                                <Link
                                    href={register()}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white text-base font-semibold rounded-2xl border-2 border-white/30 hover:bg-white/10 transition-all"
                                >
                                    Daftar Akun
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            )}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 bg-slate-900 text-slate-400">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            {/* Logo */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                    <Heart className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <span className="text-lg font-bold text-white">Poliklinik</span>
                                    <span className="text-lg font-bold text-teal-400">Queue</span>
                                </div>
                            </div>

                            {/* Links */}
                            <div className="flex items-center gap-6 text-sm">
                                <Link href="/queue/display" className="hover:text-teal-400 transition-colors">Display</Link>
                                <Link href="/queue/ticket" className="hover:text-teal-400 transition-colors">Ambil Tiket</Link>
                                <a href="/admin" className="hover:text-teal-400 transition-colors">Admin Panel</a>
                            </div>

                            {/* Copyright */}
                            <div className="text-sm">
                                © {new Date().getFullYear()} Sistem Antrian Poliklinik. All rights reserved.
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

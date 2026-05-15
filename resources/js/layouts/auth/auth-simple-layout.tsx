import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
    variant?: 'user' | 'admin';
}

export default function AuthSimpleLayout({ children, title, description, variant = 'user' }: PropsWithChildren<AuthLayoutProps>) {
    const isAdmin = variant === 'admin';

    return (
        <div className="relative min-h-svh flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8 bg-white dark:bg-slate-950">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    {/* Logo */}
                    <Link href={home()} className="flex items-center justify-center gap-3 mb-8">
                        <div className={`w-12 h-12 ${isAdmin ? 'bg-gradient-to-br from-slate-700 to-slate-900' : 'bg-gradient-to-br from-teal-500 to-emerald-600'} rounded-xl flex items-center justify-center shadow-lg ${isAdmin ? 'shadow-slate-500/25' : 'shadow-teal-500/25'}`}>
                            <Heart className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <span className="text-xl font-bold text-slate-900 dark:text-white">Poliklinik</span>
                            <span className={`text-xl font-bold ${isAdmin ? 'text-slate-600 dark:text-slate-400' : 'text-teal-600 dark:text-teal-400'}`}>Queue</span>
                        </div>
                    </Link>

                    {/* Title & Description */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{title}</h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
                    </div>

                    {/* Form Content */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 p-8">
                        {children}
                    </div>

                    {/* Footer */}
                    <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-500">
                        © {new Date().getFullYear()} Sistem Antrian Poliklinik
                    </p>
                </div>
            </div>

            {/* Right Side - Decorative */}
            <div className={`hidden lg:flex flex-1 items-center justify-center p-12 ${isAdmin ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-teal-500 via-emerald-500 to-teal-600'} relative overflow-hidden`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                </div>

                {/* Decorative Circles */}
                <div className={`absolute -top-40 -right-40 w-80 h-80 ${isAdmin ? 'bg-slate-700/30' : 'bg-white/10'} rounded-full blur-3xl`} />
                <div className={`absolute -bottom-40 -left-40 w-80 h-80 ${isAdmin ? 'bg-slate-600/30' : 'bg-white/10'} rounded-full blur-3xl`} />

                {/* Content */}
                <div className="relative z-10 text-center text-white max-w-md">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 ${isAdmin ? 'bg-slate-700/50' : 'bg-white/20'} rounded-full backdrop-blur-sm mb-8`}>
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-medium">{isAdmin ? 'Panel Administrator' : 'Sistem Antrian Modern'}</span>
                    </div>

                    <h2 className="text-4xl font-bold mb-4">
                        {isAdmin ? 'Kelola Antrian dengan Mudah' : 'Selamat Datang'}
                    </h2>
                    <p className={`text-lg ${isAdmin ? 'text-slate-300' : 'text-teal-100'} leading-relaxed`}>
                        {isAdmin
                            ? 'Akses dashboard admin untuk mengelola layanan, loket, dan sistem antrian poliklinik Anda.'
                            : 'Sistem antrian digital modern untuk pengalaman pelayanan kesehatan yang lebih baik dan efisien.'
                        }
                    </p>

                    {/* Feature Icons */}
                    <div className="mt-12 grid grid-cols-3 gap-6 text-white">
                        {[
                            { icon: '🎫', label: 'Tiket Digital' },
                            { icon: '📺', label: 'Real-time' },
                            { icon: '📊', label: 'Statistik' },
                        ].map((item, idx) => (
                            <div key={idx} className={`p-4 ${isAdmin ? 'bg-slate-800/50' : 'bg-white/10'} rounded-xl backdrop-blur-sm`}>
                                <div className="text-2xl mb-2">{item.icon}</div>
                                <div className="text-xs font-medium">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

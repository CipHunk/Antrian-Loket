import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { home } from '@/routes';
import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, LogIn, Heart, Shield, Sparkles, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function AdminLogin({ status, canResetPassword }: AdminLoginProps) {
    return (
        <>
            <Head title="Login Admin" />

            <div className="relative min-h-svh flex">
                {/* Left Side - Form */}
                <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8 bg-slate-50 dark:bg-slate-950">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        {/* Back to Home Link */}
                        <Link
                            href={home()}
                            className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Beranda
                        </Link>

                        {/* Logo */}
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-500/25">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <span className="text-xl font-bold text-slate-900 dark:text-white">Poliklinik</span>
                                <span className="text-xl font-bold text-slate-600 dark:text-slate-400">Queue</span>
                            </div>
                        </div>

                        {/* Admin Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mb-4">
                            <Shield className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Panel Administrator</span>
                        </div>

                        {/* Title & Description */}
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Login Administrator</h1>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Masuk untuk mengakses dashboard admin</p>
                        </div>

                        {/* Status Message */}
                        {status && (
                            <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                                <p className="text-sm font-medium text-green-700 dark:text-green-300">{status}</p>
                            </div>
                        )}

                        {/* Form */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 p-8">
                            <Form
                                method="post"
                                action="/admin/login"
                                resetOnSuccess={['password']}
                                className="flex flex-col gap-5"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        {/* Email Field */}
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Email Admin
                                            </Label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Mail className="h-5 w-5 text-slate-400" />
                                                </div>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="email"
                                                    placeholder="admin@poliklinik.com"
                                                    className="pl-10 h-12 rounded-xl border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                                                />
                                            </div>
                                            <InputError message={errors.email} />
                                        </div>

                                        {/* Password Field */}
                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Password
                                            </Label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock className="h-5 w-5 text-slate-400" />
                                                </div>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    name="password"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    placeholder="Masukkan password"
                                                    className="pl-10 h-12 rounded-xl border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                                                />
                                            </div>
                                            <InputError message={errors.password} />
                                        </div>

                                        {/* Remember Me */}
                                        <div className="flex items-center gap-3">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                tabIndex={3}
                                                className="rounded border-slate-300 dark:border-slate-600 text-slate-600 focus:ring-slate-500"
                                            />
                                            <Label htmlFor="remember" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                                                Ingat saya
                                            </Label>
                                        </div>

                                        {/* Submit Button */}
                                        <Button
                                            type="submit"
                                            tabIndex={4}
                                            disabled={processing}
                                            className="w-full h-12 mt-2 bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950 text-white font-semibold rounded-xl shadow-lg shadow-slate-500/25 hover:shadow-xl hover:shadow-slate-500/30 transition-all"
                                        >
                                            {processing ? (
                                                <LoaderCircle className="h-5 w-5 animate-spin mr-2" />
                                            ) : (
                                                <LogIn className="h-5 w-5 mr-2" />
                                            )}
                                            Masuk ke Dashboard
                                        </Button>
                                    </>
                                )}
                            </Form>
                        </div>

                        {/* Security Notice */}
                        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl">
                            <div className="flex items-start gap-3">
                                <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Akses Terbatas</p>
                                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                                        Halaman ini hanya untuk administrator sistem. Akses tidak sah akan dicatat.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-500">
                            © {new Date().getFullYear()} Sistem Antrian Poliklinik
                        </p>
                    </div>
                </div>

                {/* Right Side - Decorative */}
                <div className="hidden lg:flex flex-1 items-center justify-center p-12 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                    </div>

                    {/* Decorative Circles */}
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-slate-700/30 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-600/30 rounded-full blur-3xl" />

                    {/* Content */}
                    <div className="relative z-10 text-center text-white max-w-md">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-full backdrop-blur-sm mb-8">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-medium">Panel Administrator</span>
                        </div>

                        <h2 className="text-4xl font-bold mb-4">
                            Kelola Antrian dengan Mudah
                        </h2>
                        <p className="text-lg text-slate-300 leading-relaxed">
                            Akses dashboard admin untuk mengelola layanan, loket, dan sistem antrian poliklinik Anda.
                        </p>

                        {/* Feature Icons */}
                        <div className="mt-12 grid grid-cols-3 gap-6">
                            {[
                                { icon: '👥', label: 'Kelola User' },
                                { icon: '🏥', label: 'Layanan' },
                                { icon: '📊', label: 'Statistik' },
                            ].map((item, idx) => (
                                <div key={idx} className="p-4 bg-slate-800/50 rounded-xl backdrop-blur-sm">
                                    <div className="text-2xl mb-2">{item.icon}</div>
                                    <div className="text-xs font-medium">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

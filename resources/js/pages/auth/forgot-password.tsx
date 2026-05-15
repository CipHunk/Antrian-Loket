// Components
import PasswordResetLinkController from '@/actions/App/Http/Controllers/Auth/PasswordResetLinkController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, Mail, Send, ArrowLeft } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <AuthLayout title="Lupa Password" description="Masukkan email Anda untuk menerima link reset password">
            <Head title="Lupa Password" />

            {status && (
                <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">{status}</p>
                </div>
            )}

            <Form {...PasswordResetLinkController.store.form()} className="flex flex-col gap-5">
                {({ processing, errors }) => (
                    <>
                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Alamat Email
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                    placeholder="nama@contoh.com"
                                    className="pl-10 h-12 rounded-xl border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full h-12 mt-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-all"
                        >
                            {processing ? (
                                <LoaderCircle className="h-5 w-5 animate-spin mr-2" />
                            ) : (
                                <Send className="h-5 w-5 mr-2" />
                            )}
                            Kirim Link Reset Password
                        </Button>

                        {/* Back to Login */}
                        <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
                            <TextLink
                                href={login()}
                                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Kembali ke halaman login
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}

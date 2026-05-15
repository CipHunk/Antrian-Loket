import { Heart } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg shadow-teal-500/20">
                <Heart className="size-4 text-white" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-bold">
                    <span className="text-sidebar-foreground">Sistem Antrian Poliklinik</span>
                </span>
                <span className="text-xs text-sidebar-foreground/60">Cepat, Efisien, dan Modern</span>
            </div>
        </>
    );
}

"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Bike,
    Activity,
    PlusSquare,
    MoreHorizontal
} from 'lucide-react';

export function MobileNav() {
    const pathname = usePathname();

    const items = [
        { name: 'Home', icon: LayoutDashboard, href: '/' },
        { name: 'Frota', icon: Bike, href: '/frota' },
        { name: 'Novo', icon: PlusSquare, href: '/hodometro' }, // Atalho rápido para lançamento
        { name: 'Serviços', icon: Activity, href: '/servicos' },
        { name: 'Mais', icon: MoreHorizontal, href: '/relatorios' },
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-lg border-t border-white/10 flex items-center justify-around px-2 z-[100] safe-area-bottom">
            {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-all ${isActive ? 'text-brand-cyan' : 'text-foreground/40'
                            }`}
                    >
                        <item.icon size={20} className={isActive ? 'neon-text-cyan' : ''} />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">
                            {item.name}
                        </span>
                        {isActive && (
                            <div className="absolute bottom-1 w-1 h-1 rounded-full bg-brand-cyan shadow-[0_0_8px_#06d0f9]" />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}

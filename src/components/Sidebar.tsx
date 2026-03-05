"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Bike,
    Users,
    Wrench,
    Fuel,
    Receipt,
    Activity,
    BarChart3,
    Settings,
    LogOut,
    Link as LinkIcon,
    Hash,
    Droplets
} from 'lucide-react';

const menuSections = [
    {
        title: 'Principal',
        items: [
            { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
        ]
    },
    {
        title: 'Cadastros',
        items: [
            { name: 'Técnicos', icon: Users, href: '/equipe' },
            { name: 'Motos', icon: Bike, href: '/frota' },
            { name: 'Vínculos', icon: LinkIcon, href: '/vinculos' },
        ]
    },
    {
        title: 'Operações',
        items: [
            { name: 'Hodômetro', icon: Hash, href: '/hodometro' },
            { name: 'Abastecimentos', icon: Fuel, href: '/abastecimentos' },
            { name: 'Troca de Óleo', icon: Droplets, href: '/troca-oleo' },
            { name: 'Manutenção', icon: Wrench, href: '/manutencoes' },
            { name: 'Despesas', icon: Receipt, href: '/despesas' },
            { name: 'Serviços', icon: Activity, href: '/servicos' },
        ]
    },
    {
        title: 'Análise',
        items: [
            { name: 'Relatórios', icon: BarChart3, href: '/relatorios' },
        ]
    }
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 glass flex flex-col z-50 overflow-y-auto">
            <div className="p-8 pb-4">
                <h1 className="text-2xl font-bold neon-text-cyan tracking-wider">
                    SGT <span className="text-xs font-light text-foreground/30">PRO</span>
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-6 overflow-y-auto py-4">
                {menuSections.map((section) => (
                    <div key={section.title} className="space-y-1">
                        <h3 className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/20 mb-3">
                            {section.title}
                        </h3>
                        <div className="space-y-1">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group ${isActive
                                            ? 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/10 neon-glow-cyan'
                                            : 'text-foreground/50 hover:bg-white/5 hover:text-foreground'
                                            }`}
                                    >
                                        <item.icon size={18} className={isActive ? 'text-brand-cyan' : 'group-hover:text-brand-cyan'} />
                                        <span className="font-medium text-sm">{item.name}</span>
                                        {isActive && (
                                            <div className="ml-auto w-1 h-1 rounded-full bg-brand-cyan shadow-[0_0_8px_#06d0f9]" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-white/5 bg-background/50 backdrop-blur-md">
                <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400/50 hover:bg-red-500/10 hover:text-red-400 transition-all text-left">
                    <LogOut size={18} />
                    <span className="text-sm font-medium">Sair do Sistema</span>
                </button>
            </div>
        </aside>
    );
}


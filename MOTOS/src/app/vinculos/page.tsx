"use client";

import React from 'react';
import {
    Link as LinkIcon,
    Search,
    Filter,
    History,
    ArrowRight,
    Plus,
    Clock
} from 'lucide-react';

const currentAssignments = [
    { id: 1, tech: 'João Silva', moto: 'Yamaha MT-07', plate: 'ABC-1234', start: '01/01/2024', type: 'Definitiva' },
    { id: 2, tech: 'Ricardo Souza', moto: 'Honda CB 500', plate: 'XYZ-5678', start: '15/01/2024', type: 'Definitiva' },
    { id: 3, tech: 'Manoel Gomes', moto: 'Honda NC 750X', plate: 'GHI-3456', start: '20/02/2024', type: 'Temporária' },
];

const history = [
    { id: 101, tech: 'Manoel Gomes', moto: 'XRE 300', plate: 'DEF-9012', start: '01/01/2024', end: '19/02/2024', reason: 'Manutenção' },
    { id: 102, tech: 'Carlos Alberto', moto: 'Tiger 900', plate: 'JKL-7890', start: '05/01/2024', end: '10/02/2024', reason: 'Férias' },
];

export default function VinculosPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Vínculos Gerenciais</h2>
                    <p className="text-foreground/50">Associação entre colaboradores e ativos da frota.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-brand-cyan text-black font-bold rounded-xl hover:opacity-90 transition-all shadow-[0_0_15px_#06d0f933]">
                    <Plus size={20} />
                    Novo Vínculo
                </button>
            </header>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center gap-3 text-brand-cyan mb-2">
                        <LinkIcon size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Vínculos Ativos</span>
                    </div>
                    <p className="text-3xl font-bold">42</p>
                </div>
                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center gap-3 text-brand-orange mb-2">
                        <Clock size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Trocas Temporárias</span>
                    </div>
                    <p className="text-3xl font-bold">03</p>
                </div>
                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center gap-3 text-foreground/30 mb-2">
                        <History size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Histórico Total</span>
                    </div>
                    <p className="text-3xl font-bold">158</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Ativos */}
                <div className="glass rounded-2xl overflow-hidden border border-brand-cyan/10">
                    <div className="p-6 border-b border-white/5 bg-brand-cyan/5 flex justify-between items-center">
                        <h3 className="font-bold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
                            Vínculos Ativos Atuais
                        </h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" size={14} />
                            <input type="text" placeholder="Buscar..." className="pl-9 pr-4 py-1.5 bg-black/20 rounded-lg text-xs outline-none" />
                        </div>
                    </div>
                    <div className="divide-y divide-white/5">
                        {currentAssignments.map((v) => (
                            <div key={v.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold">{v.tech}</span>
                                        <span className="text-[10px] text-foreground/40 font-mono">TÉCNICO</span>
                                    </div>
                                    <ArrowRight size={14} className="text-brand-cyan/50" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold">{v.plate}</span>
                                        <span className="text-[10px] text-foreground/40 font-mono">{v.moto}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] block text-foreground/40 mb-1">Início: {v.start}</span>
                                    <span className="px-2 py-0.5 rounded-full bg-brand-cyan/10 text-brand-cyan text-[10px] font-bold uppercase">
                                        {v.type}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Histórico */}
                <div className="glass rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <h3 className="font-bold">Histórico de Movimentações</h3>
                        <button className="text-xs text-foreground/40 hover:text-foreground underline">Ver PDF</button>
                    </div>
                    <div className="divide-y divide-white/5">
                        {history.map((h) => (
                            <div key={h.id} className="p-4 flex items-center justify-between opacity-60 hover:opacity-100 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                        <History size={14} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{h.tech} ↔ {h.plate}</p>
                                        <p className="text-[10px] text-foreground/40">{h.start} até {h.end}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-foreground/30 italic">
                                    Motivo: {h.reason}
                                </span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full py-4 text-xs font-bold text-foreground/20 hover:text-foreground/40 transition-all border-t border-white/5">
                        CARREGAR MAIS REGISTROS
                    </button>
                </div>
            </div>
        </div>
    );
}

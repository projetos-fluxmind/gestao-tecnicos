"use client";

import React from 'react';
import {
    BarChart3,
    Download,
    FileText,
    Calendar,
    Filter,
    Users,
    Bike,
    Search,
    ArrowRight
} from 'lucide-react';

const reportTypes = [
    { id: 'km', title: 'Relatório de Quilometragem', icon: BarChart3, color: 'brand-cyan', desc: 'Resumo de KM rodada por técnico e moto.' },
    { id: 'fuel', title: 'Relatório de Abastecimentos', icon: Download, color: 'brand-emerald', desc: 'Análise de consumo e gastos com combustível.' },
    { id: 'oil', title: 'Trocas de Óleo', icon: FileText, color: 'brand-orange', desc: 'Monitoramento de intervalos e alertas de atraso.' },
    { id: 'expense', title: 'Despesas e Reembolsos', icon: Download, color: 'brand-cyan', desc: 'Consolidado financeiro de despesas operacionais.' },
    { id: 'maintenance', title: 'Manutenzões Realizadas', icon: FileText, color: 'brand-orange', desc: 'Histórico de preventivas e corretivas.' },
    { id: 'consolidated', title: 'Consolidado Mensal', icon: BarChart3, color: 'brand-emerald', desc: 'Visão executiva total do sistema.' },
];

export default function RelatoriosPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Centro de Análise</h2>
                    <p className="text-foreground/50">Geração de relatórios e inteligência de dados.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-3 glass rounded-xl flex items-center gap-2 hover:bg-white/10 transition-all">
                        <Calendar size={18} />
                        <span className="text-sm">Últimos 30 dias</span>
                    </button>
                </div>
            </header>

            {/* Main Grid for Report Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {reportTypes.map((type) => (
                    <div key={type.id} className="glass p-8 rounded-3xl group hover:border-brand-cyan/30 transition-all relative overflow-hidden cursor-pointer">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl bg-${type.color}/10 text-${type.color} group-hover:scale-110 transition-transform`}>
                                <type.icon size={28} />
                            </div>
                            <ArrowRight className="text-foreground/20 group-hover:text-brand-cyan group-hover:translate-x-1 transition-all" size={20} />
                        </div>

                        <h3 className="text-xl font-bold mb-2">{type.title}</h3>
                        <p className="text-sm text-foreground/40 leading-relaxed">
                            {type.desc}
                        </p>

                        {/* Hover highlight */}
                        <div className={`absolute bottom-0 left-0 w-full h-1 bg-${type.color} opacity-20 transform translate-y-full group-hover:translate-y-0 transition-transform`} />
                    </div>
                ))}
            </div>

            {/* Advanced Filters Section */}
            <div className="glass p-8 rounded-3xl space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="text-xl font-bold">Filtros Avançados</h3>
                        <p className="text-sm text-foreground/40">Refine os dados para exportação.</p>
                    </div>
                    <button className="px-6 py-3 bg-brand-cyan text-black font-bold rounded-xl flex items-center gap-2 hover:opacity-90 transition-all shadow-[0_0_20px_#06d0f944]">
                        <FileText size={18} />
                        GERAR ARQUIVO (PDF/CSV)
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest px-2">Data Início</label>
                        <input type="date" className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-brand-cyan/40" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest px-2">Data Fim</label>
                        <input type="date" className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-brand-cyan/40" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest px-2">Técnico Específico</label>
                        <div className="relative">
                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={16} />
                            <select className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-brand-cyan/40 appearance-none">
                                <option>Todos os Técnicos</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest px-2">Placa da Moto</label>
                        <div className="relative">
                            <Bike className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={16} />
                            <select className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-brand-cyan/40 appearance-none">
                                <option>Todas as Motos</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Information Alert */}
            <div className="p-6 rounded-2xl bg-brand-cyan/5 border border-brand-cyan/10 flex gap-4 items-start">
                <div className="p-2 bg-brand-cyan/20 rounded-lg text-brand-cyan">
                    <BarChart3 size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-brand-cyan mb-1">Dica de Exportação</h4>
                    <p className="text-sm text-foreground/60">
                        Para auditorias mensais, recomendamos o <strong>Relatório Consolidado</strong> em formato CSV, que contém todas as transações, hodômetros e manutenções em uma única planilha para pivotagem.
                    </p>
                </div>
            </div>
        </div>
    );
}

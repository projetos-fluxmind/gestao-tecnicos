"use client";

import React, { useState } from 'react';
import { BarChart2, LayoutDashboard, Search, FilterX } from 'lucide-react';
import { EditOperacaoModal } from '@/components/EditOperacaoModal';
import { DeleteOperacaoBtn } from '@/components/DeleteOperacaoBtn';

export function ServicosTableClient({ logs, techs }: { logs: any[], techs: any[] }) {
    const [dateFilter, setDateFilter] = useState('');
    const [techFilter, setTechFilter] = useState('');
    const [serviceFilter, setServiceFilter] = useState('');

    const filteredLogs = logs.filter(log => {
        let matchDate = true;
        if (dateFilter) {
            matchDate = new Date(log.data).toISOString().split('T')[0] === dateFilter;
        }

        let matchTech = true;
        if (techFilter) {
            matchTech = log.tecnicoId.toString() === techFilter;
        }

        let matchService = true;
        if (serviceFilter) {
            if (serviceFilter === 'instalacoes') matchService = log.instalacoes > 0;
            if (serviceFilter === 'manut_com_troca') matchService = log.manutencoes_com_troca > 0;
            if (serviceFilter === 'manut_sem_troca') matchService = log.manutencoes_sem_troca > 0;
            if (serviceFilter === 'retiradas') matchService = log.retiradas > 0;
        }

        return matchDate && matchTech && matchService;
    });

    return (
        <section className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground/30">
                    <BarChart2 size={14} /> Histórico de Apontamentos
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-grow md:max-w-[150px]">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={e => setDateFilter(e.target.value)}
                            className="bg-black/40 border border-white/5 rounded-xl pl-9 pr-3 py-2 text-xs w-full focus:border-brand-cyan/40 appearance-none text-foreground/70 outline-none"
                            title="Filtrar por Data"
                        />
                    </div>

                    <select
                        value={techFilter}
                        onChange={e => setTechFilter(e.target.value)}
                        className="bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs focus:border-brand-cyan/40 outline-none flex-grow md:max-w-[160px] text-foreground/70"
                    >
                        <option value="">Todos os Técnicos</option>
                        {techs.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                    </select>

                    <select
                        value={serviceFilter}
                        onChange={e => setServiceFilter(e.target.value)}
                        className="bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs focus:border-brand-cyan/40 outline-none flex-grow md:max-w-[160px] text-foreground/70"
                    >
                        <option value="">Tipo de Serviço</option>
                        <option value="instalacoes">Instalações</option>
                        <option value="manut_com_troca">Manut. com Troca</option>
                        <option value="manut_sem_troca">Manut. sem Troca</option>
                        <option value="retiradas">Retiradas</option>
                    </select>

                    {(dateFilter || techFilter || serviceFilter) && (
                        <button
                            onClick={() => { setDateFilter(''); setTechFilter(''); setServiceFilter(''); }}
                            className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors"
                            title="Limpar Filtros"
                        >
                            <FilterX size={14} />
                        </button>
                    )}
                </div>
            </div>

            <div className="glass rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 border-b border-white/5 bg-white/2">
                                <th className="px-8 py-5">Técnico / Data</th>
                                <th className="px-8 py-5 text-center text-brand-cyan">Instalações</th>
                                <th className="px-8 py-5 text-center text-brand-orange">Manut. C/ Troca</th>
                                <th className="px-8 py-5 text-center text-white/50">Manut. S/ Troca</th>
                                <th className="px-8 py-5 text-center text-brand-emerald">Retiradas</th>
                                <th className="px-8 py-5 text-right">Volume Dia</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredLogs.map((L: any) => {
                                const totalDoDia = L.instalacoes + L.manutencoes_com_troca + L.manutencoes_sem_troca + L.retiradas;
                                return (
                                    <tr key={L.id} className="hover:bg-white/5 transition-all group cursor-default">
                                        <td className="px-8 py-6">
                                            <div className="font-bold text-sm text-foreground/80 max-w-[200px] truncate group-hover:text-brand-cyan transition-colors">
                                                {L.technician?.nome}
                                            </div>
                                            <div className="text-[10px] text-foreground/30 font-mono mt-1">
                                                {new Date(L.data).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' })}
                                            </div>
                                            {L.observacoes && (
                                                <div className="text-[10px] text-brand-orange/60 font-mono italic mt-1 max-w-[200px] truncate">
                                                    "{L.observacoes}"
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-8 py-6 text-center font-mono font-bold text-brand-cyan text-lg">
                                            {L.instalacoes > 0 ? L.instalacoes : '-'}
                                        </td>

                                        <td className="px-8 py-6 text-center font-mono font-bold text-brand-orange text-lg">
                                            {L.manutencoes_com_troca > 0 ? L.manutencoes_com_troca : '-'}
                                        </td>
                                        <td className="px-8 py-6 text-center font-mono text-white/50 text-lg">
                                            {L.manutencoes_sem_troca > 0 ? L.manutencoes_sem_troca : '-'}
                                        </td>
                                        <td className="px-8 py-6 text-center font-mono font-bold text-brand-emerald text-lg">
                                            {L.retiradas > 0 ? L.retiradas : '-'}
                                        </td>

                                        <td className="px-8 py-6 text-right relative">
                                            <div className="inline-flex items-center gap-2 justify-end">
                                                <div className="opacity-0 group-hover:opacity-100 flex items-center justify-end gap-2 transition-all mr-2">
                                                    <EditOperacaoModal log={L} techs={techs} />
                                                    <DeleteOperacaoBtn id={L.id} />
                                                    <div className="w-px h-6 bg-white/10 mx-1"></div>
                                                </div>
                                                <div className="bg-white/10 px-3 py-1 rounded-xl font-mono text-xs font-bold shadow-inner whitespace-nowrap">
                                                    {totalDoDia} OS
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-white/5">
                    {filteredLogs.map((L: any) => {
                        const totalDoDia = L.instalacoes + L.manutencoes_com_troca + L.manutencoes_sem_troca + L.retiradas;
                        return (
                            <div key={L.id} className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-bold text-brand-cyan">{L.technician?.nome}</div>
                                        <div className="text-[10px] text-foreground/40 font-mono mt-0.5 uppercase tracking-wider">
                                            {new Date(L.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })}
                                        </div>
                                    </div>
                                    <div className="bg-white/5 px-3 py-1 rounded-lg font-mono text-[10px] font-bold">
                                        {totalDoDia} TOTAL
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white/2 p-3 rounded-2xl border border-white/5">
                                        <p className="text-[8px] font-bold text-brand-cyan uppercase tracking-widest mb-1">Instalações</p>
                                        <p className="text-xl font-black font-mono">{L.instalacoes}</p>
                                    </div>
                                    <div className="bg-white/2 p-3 rounded-2xl border border-white/5">
                                        <p className="text-[8px] font-bold text-brand-emerald uppercase tracking-widest mb-1">Retiradas</p>
                                        <p className="text-xl font-black font-mono">{L.retiradas}</p>
                                    </div>
                                    <div className="bg-white/2 p-3 rounded-2xl border border-white/5">
                                        <p className="text-[8px] font-bold text-brand-orange uppercase tracking-widest mb-1">Manut C/ Troca</p>
                                        <p className="text-xl font-black font-mono">{L.manutencoes_com_troca}</p>
                                    </div>
                                    <div className="bg-white/2 p-3 rounded-2xl border border-white/5">
                                        <p className="text-[8px] font-bold text-foreground/30 uppercase tracking-widest mb-1">Manut S/ Troca</p>
                                        <p className="text-xl font-black font-mono">{L.manutencoes_sem_troca}</p>
                                    </div>
                                </div>

                                {L.observacoes && (
                                    <p className="text-[10px] text-brand-orange/60 italic font-mono bg-brand-orange/5 p-2 rounded-lg border border-brand-orange/10">
                                        "{L.observacoes}"
                                    </p>
                                )}

                                <div className="flex justify-end gap-3 pt-2">
                                    <EditOperacaoModal log={L} techs={techs} />
                                    <DeleteOperacaoBtn id={L.id} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredLogs.length === 0 && (
                    <div className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center justify-center opacity-30">
                            <LayoutDashboard size={48} className="mb-4" />
                            {logs.length === 0 ? (
                                <>
                                    <p className="font-bold">Nenhum apontamento diário feito ainda.</p>
                                    <p className="text-xs max-w-sm mt-2">Clique em "Lançar Diária de Serviço" para começar a medir a produtividade do time de campo.</p>
                                </>
                            ) : (
                                <>
                                    <p className="font-bold">Nenhum registro encontrado para estes filtros.</p>
                                    <p className="text-xs max-w-sm mt-2">Tente limpar os campos de busca para ver todo o histórico.</p>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

import React from 'react';
import {
    Link as LinkIcon,
    Search,
    History,
    ArrowRight,
    Plus,
    Clock,
    Bike,
    Users
} from 'lucide-react';
import { getAssignments, getActiveAssignments } from '../actions/assignments';
import { getAllTechnicians } from '../actions/technicians';
import { getMotorcycles } from '../actions/motorcycles';
import { NovoVinculoForm } from '@/components/NovoVinculoForm';

export default async function VinculosPage() {
    const [activeAssignments, allAssignments, techs, motos] = await Promise.all([
        getActiveAssignments(),
        getAssignments(),
        getAllTechnicians(),
        getMotorcycles()
    ]);

    const historicAssignments = allAssignments.filter((a: any) => a.data_fim !== null);
    const tempAssignments = activeAssignments.filter((a: any) => a.tipo === 'temporaria');

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Vínculos Gerenciais</h2>
                    <p className="text-foreground/50">Associação entre colaboradores e ativos da frota.</p>
                </div>
                <NovoVinculoForm techs={techs} motos={motos} />
            </header>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center gap-3 text-brand-cyan mb-2">
                        <LinkIcon size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Vínculos Ativos</span>
                    </div>
                    <p className="text-3xl font-bold">{activeAssignments.length}</p>
                </div>
                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center gap-3 text-brand-orange mb-2">
                        <Clock size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Trocas Temporárias</span>
                    </div>
                    <p className="text-3xl font-bold">{String(tempAssignments.length).padStart(2, '0')}</p>
                </div>
                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center gap-3 text-foreground/30 mb-2">
                        <History size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Histórico Total</span>
                    </div>
                    <p className="text-3xl font-bold">{allAssignments.length}</p>
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
                        {activeAssignments.map((v: any) => (
                            <div key={v.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Users size={14} className="text-brand-cyan/50" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold">{v.technician?.nome}</span>
                                            <span className="text-[10px] text-foreground/40 font-mono">TÉCNICO</span>
                                        </div>
                                    </div>
                                    <ArrowRight size={14} className="text-brand-cyan/50" />
                                    <div className="flex items-center gap-2">
                                        <Bike size={14} className="text-brand-cyan/50" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold">{v.motorcycle?.placa}</span>
                                            <span className="text-[10px] text-foreground/40 font-mono">{v.motorcycle?.modelo}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] block text-foreground/40 mb-1">
                                        Início: {v.data_inicio ? new Date(v.data_inicio).toLocaleDateString('pt-BR') : '-'}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full bg-brand-cyan/10 text-brand-cyan text-[10px] font-bold uppercase">
                                        {v.tipo || 'Definitiva'}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {activeAssignments.length === 0 && (
                            <div className="p-10 text-center text-foreground/20 italic">
                                Nenhum vínculo ativo no momento.
                            </div>
                        )}
                    </div>
                </div>

                {/* Histórico */}
                <div className="glass rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <h3 className="font-bold">Histórico de Movimentações</h3>
                    </div>
                    <div className="divide-y divide-white/5">
                        {historicAssignments.slice(0, 10).map((h: any) => (
                            <div key={h.id} className="p-4 flex items-center justify-between opacity-60 hover:opacity-100 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                        <History size={14} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{h.technician?.nome} ↔ {h.motorcycle?.placa}</p>
                                        <p className="text-[10px] text-foreground/40">
                                            {h.data_inicio ? new Date(h.data_inicio).toLocaleDateString('pt-BR') : '-'} até {h.data_fim ? new Date(h.data_fim).toLocaleDateString('pt-BR') : '-'}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-foreground/30 italic">
                                    {h.motivo_troca || h.tipo || '-'}
                                </span>
                            </div>
                        ))}
                        {historicAssignments.length === 0 && (
                            <div className="p-10 text-center text-foreground/20 italic">
                                Nenhum histórico de movimentação.
                            </div>
                        )}
                    </div>
                    {historicAssignments.length > 10 && (
                        <button className="w-full py-4 text-xs font-bold text-foreground/20 hover:text-foreground/40 transition-all border-t border-white/5">
                            CARREGAR MAIS REGISTROS
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

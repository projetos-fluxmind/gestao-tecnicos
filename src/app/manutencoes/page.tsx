import React from 'react';
import {
    Search,
    Wrench,
    AlertTriangle,
    CheckCircle2,
    Clock,
    ArrowRight
} from 'lucide-react';
import { getMaintenances } from '../actions/maintenance';
import { getMotorcycles } from '../actions/motorcycles';
import { getAllTechnicians } from '../actions/technicians';
import { ManutencaoForm } from '@/components/ManutencaoForm';

export default async function ManutencoesPage() {
    const [maintenances, motos, techs] = await Promise.all([
        getMaintenances(),
        getMotorcycles(),
        getAllTechnicians()
    ]);

    // Calcular stats
    const emRevisaoCount = maintenances.filter((m: any) => m.status === 'em_andamento').length;
    const aguardandoPecaCount = maintenances.filter((m: any) => m.status === 'aguardando_peca').length;
    const concluidaCount = maintenances.filter((m: any) => m.status === 'concluida').length;

    const kanbanColumns = [
        { title: 'em_andamento', label: 'Em Revisão', count: emRevisaoCount, color: 'brand-cyan', icon: Clock },
        { title: 'aguardando_peca', label: 'Aguardando Peças', count: aguardandoPecaCount, color: 'brand-orange', icon: AlertTriangle },
        { title: 'concluida', label: 'Pronto para Retirada', count: concluidaCount, color: 'brand-emerald', icon: CheckCircle2 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Manutenções</h2>
                    <p className="text-foreground/50">Acompanhamento de revisões e reparos da frota.</p>
                </div>
                {/* The ManutencaoForm starts as a button and expands */}
                <ManutencaoForm motos={motos} techs={techs} />
            </header>

            {/* Kanban-like Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {kanbanColumns.map((column) => (
                    <div key={column.title} className="glass p-6 rounded-2xl border-t-2" style={{ borderTopColor: `var(--color-${column.color})` }}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-foreground/80 flex items-center gap-2">
                                <column.icon size={16} className={`text-${column.color}`} />
                                {column.label}
                            </h3>
                            <span className="px-2 py-0.5 rounded-md bg-white/5 text-xs font-mono">{column.count}</span>
                        </div>
                        <div className="space-y-3">
                            {maintenances.filter((m: any) => m.status === column.title).map((m: any) => (
                                <div key={m.id} className="p-3 bg-white/5 rounded-xl text-sm border border-white/5 hover:border-white/10 transition-all cursor-pointer">
                                    <p className="font-semibold">{m.motorcycle?.placa} ({m.motorcycle?.modelo})</p>
                                    <p className="text-xs text-foreground/40 mt-1">{m.technician?.nome}</p>
                                </div>
                            ))}
                            {column.count === 0 && <p className="text-xs text-foreground/20 italic">Nenhum veículo nesta etapa.</p>}
                        </div>
                    </div>
                ))}
            </div>

            {/* History Table */}
            <div className="glass rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h3 className="text-xl font-bold">Histórico Recente</h3>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" size={16} />
                        <input type="text" placeholder="Filtrar histórico..." className="w-full pl-10 pr-4 py-2 bg-white/5 rounded-lg text-sm focus:outline-none" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-xs uppercase tracking-wider text-foreground/40">
                                <th className="px-6 py-4 font-semibold">Veículo</th>
                                <th className="px-6 py-4 font-semibold">Tipo / Serviço</th>
                                <th className="px-6 py-4 font-semibold">Data Entrada</th>
                                <th className="px-6 py-4 font-semibold">Custo</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {maintenances.map((m: any) => (
                                <tr key={m.id} className="hover:bg-white/5 transition-all group">
                                    <td className="px-6 py-4 font-medium">
                                        <p>{m.motorcycle?.placa}</p>
                                        <p className="text-[10px] text-foreground/50">{m.technician?.nome}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 items-start">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${m.tipo_manutencao === 'preventiva' ? 'bg-brand-cyan/10 text-brand-cyan' : m.tipo_manutencao === 'corretiva' ? 'bg-brand-orange/10 text-brand-orange' : 'bg-red-500/10 text-red-500'}`}>
                                                {m.tipo_manutencao}
                                            </span>
                                            {m.descricao_problema && <span className="text-[10px] text-foreground/60">{String(m.descricao_problema).slice(0, 30)}...</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-foreground/60">{new Date(m.data_entrada).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm font-mono">
                                        {m.valor_total ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(m.valor_total)) : '---'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs uppercase font-bold text-foreground/60">
                                                {m.status.replace('_', ' ')}
                                            </span>
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-brand-cyan transition-all opacity-0 group-hover:opacity-100">
                                                <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {maintenances.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-foreground/50">
                                        Nenhuma manutenção registrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

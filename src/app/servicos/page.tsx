import React from 'react';
import { Activity, LayoutDashboard, Settings2, BarChart2 } from 'lucide-react';
import { getServiceLogs, getDailyServiceStats } from '@/app/actions/services';
import { getAllTechnicians } from '@/app/actions/technicians';
import { NovaOperacaoForm } from '@/components/NovaOperacaoForm';
import { ServicosTableClient } from '@/components/ServicosTableClient';

export default async function ServicosPage() {
    const [logs, stats, techs] = await Promise.all([
        getServiceLogs(),
        getDailyServiceStats(),
        getAllTechnicians()
    ]);

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-700 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-brand-cyan/20 rounded-2xl text-brand-cyan hidden sm:block">
                        <Activity size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Produtividade e Servicos</h2>
                        <p className="text-foreground/50">Lancamento diario de instalacoes, manutencoes e retiradas.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <NovaOperacaoForm techs={techs} />
                </div>
            </header>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                    { label: 'Instalacoes', val: stats.totalInstalacoes, bg: 'bg-brand-cyan/10 border-brand-cyan/20', color: 'text-brand-cyan' },
                    { label: 'Manut. com Troca', val: stats.totalManutComTroca, bg: 'bg-brand-orange/10 border-brand-orange/20', color: 'text-brand-orange' },
                    { label: 'Manut. sem Troca', val: stats.totalManutSemTroca, bg: 'bg-white/5 border-white/10', color: 'text-white' },
                    { label: 'Retiradas', val: stats.totalRetiradas, bg: 'bg-brand-emerald/10 border-brand-emerald/20', color: 'text-brand-emerald' },
                    { label: 'Volume Total', val: stats.totalGeral, bg: 'bg-gradient-to-br from-brand-cyan/20 to-brand-emerald/20 border-brand-cyan/30', color: 'text-white' },
                ].map(c => (
                    <div key={c.label} className={`glass p-6 rounded-3xl border transition-all ${c.bg}`}>
                        <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">{c.label} (30 dias)</p>
                        <p className={`text-4xl font-black font-mono mt-4 ${c.color}`}>{c.val}</p>
                    </div>
                ))}
            </div>

            <ServicosTableClient logs={logs} techs={techs} />
        </div>
    );
}

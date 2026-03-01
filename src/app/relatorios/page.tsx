import React from 'react';
import {
    BarChart3,
    Calendar,
} from 'lucide-react';
import { getAllTechnicians } from '../actions/technicians';
import { getMotorcycles } from '../actions/motorcycles';
import { ReportGenerator } from '@/components/ReportGenerator';

export default async function RelatoriosPage() {
    const [techs, motos] = await Promise.all([
        getAllTechnicians(),
        getMotorcycles()
    ]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Centro de Análise</h2>
                    <p className="text-foreground/50">Geração de relatórios e inteligência de dados históricos.</p>
                </div>
                <div className="flex gap-2">
                    <div className="px-4 py-3 glass rounded-xl flex items-center gap-2 hover:bg-white/10 transition-all cursor-default">
                        <Calendar size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest text-foreground/60">{new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
                    </div>
                </div>
            </header>

            {/* Main Interactive Report Engine */}
            <ReportGenerator techs={techs} motos={motos} />

            {/* Information Alert - Highlighting the value of analysis */}
            <div className="p-8 rounded-[2rem] bg-brand-cyan/5 border border-brand-cyan/10 flex flex-col md:flex-row gap-6 items-center md:items-start group hover:bg-brand-cyan/[0.08] transition-all">
                <div className="p-4 bg-brand-cyan/20 rounded-2xl text-brand-cyan group-hover:scale-110 transition-transform">
                    <BarChart3 size={32} />
                </div>
                <div>
                    <h4 className="font-bold text-lg text-brand-cyan mb-2">Poder de Decisão Baseado em Dados</h4>
                    <p className="text-sm text-foreground/60 leading-relaxed max-w-4xl text-balance">
                        As informações consolidadas acima permitem identificar <strong>gargalos operacionais</strong>, prever manutenções antes que ocorram falhas críticas e otimizar o consumo de combustível da frota. Para auditorias semestrais, utilize o <strong className="text-foreground">Relatório de Consolidado Mensal</strong>.
                    </p>
                </div>
            </div>
        </div>
    );
}

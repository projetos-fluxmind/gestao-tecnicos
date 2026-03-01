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
    ArrowRight,
    TrendingUp
} from 'lucide-react';
import { getAllTechnicians } from '../actions/technicians';
import { getMotorcycles } from '../actions/motorcycles';
import { ReportGenerator } from '@/components/ReportGenerator';

const reportTypes = [
    { id: 'km', idLabel: 'QUILOMETRAGEM', title: 'Relatório de Quilometragem', icon: BarChart3, color: 'brand-cyan', desc: 'Resumo de KM rodada por técnico e moto.' },
    { id: 'fuel', idLabel: 'ABASTECIMENTOS', title: 'Relatório de Abastecimentos', icon: Download, color: 'brand-emerald', desc: 'Análise de consumo e gastos com combustível.' },
    { id: 'oil', idLabel: 'ÓLEO', title: 'Trocas de Óleo', icon: FileText, color: 'brand-orange', desc: 'Monitoramento de intervalos e alertas de atraso.' },
    { id: 'expense', idLabel: 'DESPESAS', title: 'Despesas e Reembolsos', icon: Download, color: 'brand-cyan', desc: 'Consolidado financeiro de despesas operacionais.' },
    { id: 'maintenance', idLabel: 'MANUTENÇÃO', title: 'Manutenções Realizadas', icon: FileText, color: 'brand-orange', desc: 'Histórico de preventivas e corretivas.' },
    { id: 'consolidated', idLabel: 'EXTRATO', title: 'Consolidado Mensal', icon: BarChart3, color: 'brand-emerald', desc: 'Visão executiva total do sistema.' },
];

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
            <ReportGenerator techs={techs} motos={motos} reportTypes={reportTypes} />

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

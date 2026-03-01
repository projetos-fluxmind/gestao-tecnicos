import React from 'react';
import {
    Receipt,
    Search,
    Calendar,
    CheckCircle2,
    Clock,
    Plus,
    ArrowRight,
    TrendingDown
} from 'lucide-react';
import { getExpenses, approveExpense } from '../actions/expenses';
import { getAllTechnicians } from '../actions/technicians';
import { NovaDespesaForm } from '@/components/NovaDespesaForm';

export default async function DespesasPage() {
    const [expenses, techs] = await Promise.all([
        getExpenses(),
        getAllTechnicians()
    ]);

    const totalPendente = expenses
        .filter((e: any) => !e.aprovado_supervisor)
        .reduce((sum: number, e: any) => sum + Number(e.valor), 0);

    const totalAprovado = expenses
        .filter((e: any) => e.aprovado_supervisor)
        .reduce((sum: number, e: any) => sum + Number(e.valor), 0);

    // Calcular média por técnico
    const techCount = new Set(expenses.map((e: any) => e.tecnicoId)).size;
    const media = techCount > 0 ? (totalAprovado + totalPendente) / techCount : 0;

    const categoriaLabel: Record<string, string> = {
        alimentacao: 'Alimentação',
        combustivel: 'Combustível',
        pedagio: 'Pedágio',
        hospedagem: 'Hospedagem',
        pecas: 'Peças',
        outros: 'Outros',
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Gestão de Despesas</h2>
                    <p className="text-foreground/50">Fluxo de aprovação de gastos operacionais.</p>
                </div>
                <NovaDespesaForm techs={techs} />
            </header>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass p-6 rounded-2xl">
                    <p className="text-[10px] font-bold text-foreground/30 uppercase mb-2">Total Pendente</p>
                    <div className="flex justify-between items-end">
                        <p className="text-2xl font-bold font-mono">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPendente)}
                        </p>
                        <Clock className="text-brand-orange" size={20} />
                    </div>
                </div>
                <div className="glass p-6 rounded-2xl">
                    <p className="text-[10px] font-bold text-foreground/30 uppercase mb-2">Total Aprovado</p>
                    <div className="flex justify-between items-end">
                        <p className="text-2xl font-bold font-mono text-brand-emerald">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalAprovado)}
                        </p>
                        <CheckCircle2 className="text-brand-emerald" size={20} />
                    </div>
                </div>
                <div className="glass p-6 rounded-2xl">
                    <p className="text-[10px] font-bold text-foreground/30 uppercase mb-2">Média por Técnico</p>
                    <div className="flex justify-between items-end">
                        <p className="text-2xl font-bold font-mono">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(media)}
                        </p>
                        <ArrowRight className="text-brand-cyan" size={20} />
                    </div>
                </div>
                <div className="glass p-6 rounded-2xl">
                    <p className="text-[10px] font-bold text-foreground/30 uppercase mb-2">Total de Registros</p>
                    <div className="flex justify-between items-end">
                        <p className="text-2xl font-bold font-mono">{expenses.length}</p>
                        <TrendingDown className="text-brand-emerald" size={20} />
                    </div>
                </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/2">
                    <div className="flex items-center gap-4">
                        <h3 className="font-bold text-lg">Solicitações de Reembolso</h3>
                        <div className="flex gap-1 p-1 bg-black/30 rounded-lg">
                            <button className="px-3 py-1 bg-white/5 rounded-md text-[10px] font-bold uppercase">Todas</button>
                            <button className="px-3 py-1 text-foreground/30 rounded-md text-[10px] font-bold uppercase hover:text-foreground">Pendentes</button>
                            <button className="px-3 py-1 text-foreground/30 rounded-md text-[10px] font-bold uppercase hover:text-foreground">Aprovadas</button>
                        </div>
                    </div>
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={16} />
                        <input type="text" placeholder="Filtrar por técnico ou categoria..." className="w-full pl-12 pr-4 py-2.5 bg-black/20 rounded-xl text-sm border border-transparent focus:border-brand-cyan/30 outline-none transition-all" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[11px] font-bold uppercase tracking-wider text-foreground/40 border-b border-white/5 bg-white/1">
                                <th className="px-8 py-5">Colaborador</th>
                                <th className="px-8 py-5">Categoria / Descrição</th>
                                <th className="px-8 py-5">Data</th>
                                <th className="px-8 py-5">Valor</th>
                                <th className="px-8 py-5 text-center">Status</th>
                                <th className="px-8 py-5 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {expenses.map((exp: any) => (
                                <tr key={exp.id} className="group hover:bg-white/2 transition-all cursor-pointer">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-cyan/20 to-brand-emerald/20 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                                <span className="text-xs font-bold text-brand-cyan">{exp.technician?.nome?.charAt(0)}</span>
                                            </div>
                                            <span className="font-bold text-foreground/80">{exp.technician?.nome}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 w-fit mb-1 font-bold text-brand-cyan/70">
                                                {categoriaLabel[exp.categoria] || exp.categoria}
                                            </span>
                                            <span className="text-sm text-foreground/60">{exp.descricao || '—'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-foreground/40">
                                        {exp.data ? new Date(exp.data).toLocaleDateString('pt-BR') : '—'}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="font-mono font-bold text-lg">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(exp.valor))}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${exp.aprovado_supervisor
                                            ? 'bg-brand-emerald/10 text-brand-emerald'
                                            : 'bg-brand-orange/10 text-brand-orange animate-pulse'
                                            }`}>
                                            {exp.aprovado_supervisor ? 'Aprovado' : 'Pendente'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {!exp.aprovado_supervisor && (
                                                <form action={async () => {
                                                    "use server";
                                                    await approveExpense(exp.id);
                                                }}>
                                                    <button type="submit" className="p-2 aspect-square glass rounded-lg text-brand-emerald hover:bg-brand-emerald hover:text-black transition-all">
                                                        <CheckCircle2 size={16} />
                                                    </button>
                                                </form>
                                            )}
                                            <button className="p-2 aspect-square glass rounded-lg text-foreground/40 hover:text-brand-cyan transition-all">
                                                <Receipt size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {expenses.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-foreground/30 italic">
                                        Nenhuma despesa registrada ainda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {expenses.length > 0 && (
                    <div className="p-8 flex justify-center border-t border-white/5">
                        <button className="text-xs font-bold text-foreground/20 hover:text-brand-cyan transition-all tracking-widest uppercase">
                            Carregar mais resultados
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

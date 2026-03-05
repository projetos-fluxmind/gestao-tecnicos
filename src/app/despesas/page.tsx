import React from 'react';
import {
    History,
    TrendingUp,
    PieChart,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';

import {
    getCardTransactions,
    getCompanyWallet,
    getMonthlyFinancialStats
} from '../actions/expenses';
import { getAllTechnicians } from '../actions/technicians';

import { NovaDespesaForm } from '@/components/NovaDespesaForm';
import { CardManagement } from '@/components/CardManagement';
import { CardTransactionHistory } from '@/components/CardTransactionHistory';
import { MonthlyPerformanceTable } from '@/components/MonthlyPerformanceTable';

export default async function DespesasPage() {
    const [techs, transactions, companyWallet, monthlyStats] = await Promise.all([
        getAllTechnicians(),
        getCardTransactions(),
        getCompanyWallet(),
        getMonthlyFinancialStats()
    ]);

    // Calcular estatísticas rápidas do mês atual
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyTransactions = transactions.filter((t: any) => {
        const d = new Date(t.data);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const totalSpentMonth = monthlyTransactions
        .filter((t: any) => t.tipo === 'gasto')
        .reduce((sum: number, t: any) => sum + Number(t.valor), 0);

    const totalReloadMonth = monthlyTransactions
        .filter((t: any) => t.tipo === 'recarga')
        .reduce((sum: number, t: any) => sum + Number(t.valor), 0);

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-700 pb-20">
            {/* Header com Ações Rápidas */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-brand-cyan/20 rounded-2xl text-brand-cyan hidden sm:block">
                        <Wallet size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Painel Financeiro</h2>
                        <p className="text-foreground/50">Fluxo de Caixa, Despesas, KM Rodados e Auditoria.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <NovaDespesaForm techs={techs} />
                </div>
            </header>

            {/* Layout Principal: Gestão de Saldos e Caixa Mestre */}
            <section className="space-y-6">
                <div className="flex items-center gap-2 px-2 text-[10px] font-bold uppercase tracking-widest text-foreground/30">
                    <PieChart size={14} /> Controle de Repasses & Caixa
                </div>
                <CardManagement techs={techs} companyWallet={companyWallet} />
            </section>

            {/* Cards de Resumo Financeiro do Mês */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-3xl group hover:border-brand-cyan/30 transition-all border border-white/5">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Gastos Gerais (Mês)</p>
                        <div className="p-2 bg-brand-orange/10 rounded-lg text-brand-orange group-hover:scale-110 transition-transform">
                            <ArrowDownRight size={18} />
                        </div>
                    </div>
                    <p className="text-3xl font-black font-mono">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSpentMonth)}
                    </p>
                    <p className="text-[10px] text-foreground/20 mt-2 italic">* Manutenção, Abastecimento, Alimentação, etc.</p>
                </div>

                <div className="glass p-6 rounded-3xl group hover:border-brand-emerald/30 transition-all border border-white/5">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Repasses (Mês)</p>
                        <div className="p-2 bg-brand-emerald/10 rounded-lg text-brand-emerald group-hover:scale-110 transition-transform">
                            <ArrowUpRight size={18} />
                        </div>
                    </div>
                    <p className="text-3xl font-black font-mono text-brand-emerald">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalReloadMonth)}
                    </p>
                    <p className="text-[10px] text-foreground/20 mt-2 italic">* Dinheiro injetado no saldo dos técnicos</p>
                </div>

                <div className="glass p-6 rounded-3xl group border-brand-cyan/10 transition-all border">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-bold text-brand-cyan uppercase tracking-widest">Média do Km da Frota</p>
                        <div className="p-2 bg-brand-cyan/10 rounded-lg text-brand-cyan group-hover:rotate-12 transition-transform">
                            <TrendingUp size={18} />
                        </div>
                    </div>
                    <p className="text-3xl font-black font-mono">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                            monthlyStats.length > 0 ? (monthlyStats.reduce((sum: number, s: any) => sum + s.custoKM, 0) / monthlyStats.length) : 0
                        )}
                        <span className="text-xs text-foreground/30 ml-2 font-normal">/ KM</span>
                    </p>
                    <p className="text-[10px] text-foreground/20 mt-2 italic">* Média global de gasto p/ rodar 1 KM</p>
                </div>
            </div>

            {/* Auditoria de Performance por KM (NOVO) */}
            <MonthlyPerformanceTable stats={monthlyStats} />

            {/* Histórico Consolidado de Transações (Reporting / Download CSV) */}
            <section className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground/30">
                        <History size={14} /> Relatório de Abatimentos e Repasses (Extrato)
                    </div>
                </div>
                <CardTransactionHistory transactions={transactions} />
            </section>
        </div>
    );
}

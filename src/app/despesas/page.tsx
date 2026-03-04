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
import { getExpenses, approveExpense, getCardTransactions, getCompanyWallet } from '../actions/expenses';
import { getAllTechnicians } from '../actions/technicians';
import { NovaDespesaForm } from '@/components/NovaDespesaForm';
import { CardManagement } from '@/components/CardManagement';
import { CardTransactionHistory } from '@/components/CardTransactionHistory';
import { ExpenseRequestsTable } from '@/components/ExpenseRequestsTable';

export default async function DespesasPage() {
    const [expenses, techs, transactions, companyWallet] = await Promise.all([
        getExpenses(),
        getAllTechnicians(),
        getCardTransactions(),
        getCompanyWallet()
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
        <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-700 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Fluxo Financeiro</h2>
                    <p className="text-foreground/50">Controle de caixa, recargas e despesas corporativas.</p>
                </div>
                <NovaDespesaForm techs={techs} />
            </header>

            {/* Layout Principal: Gestao de Cartoes */}
            <CardManagement techs={techs} companyWallet={companyWallet} />

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
                <div className="glass p-6 rounded-2xl border-brand-emerald/10">
                    <p className="text-[10px] font-bold text-brand-emerald uppercase mb-2">Total de Movimentações</p>
                    <div className="flex justify-between items-end">
                        <p className="text-2xl font-bold font-mono text-brand-emerald">{transactions.length}</p>
                        <TrendingDown className="text-brand-emerald" size={20} />
                    </div>
                </div>
            </div>

            {/* Dashboard Sections */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Refund Table Extracted */}
                <ExpenseRequestsTable expenses={expenses} categoriaLabel={categoriaLabel} />

                <CardTransactionHistory transactions={transactions} />
            </div>
        </div>
    );
}

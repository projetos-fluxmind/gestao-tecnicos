"use client";

import React, { useState } from 'react';
import {
    History, ArrowUpCircle, ArrowDownCircle, Calendar, Utensils, Fuel, Wrench, Layers, Download, Search, Settings
} from 'lucide-react';
import { deleteCardTransaction } from '@/app/actions/expenses';
import { useRouter } from 'next/navigation';

export function CardTransactionHistory({ transactions }: { transactions: any[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("todos");
    const [filterCategory, setFilterCategory] = useState("todas");
    const router = useRouter();

    const getIcon = (tipo: string, categoria: string) => {
        if (tipo === 'recarga') return <ArrowUpCircle className="text-brand-emerald" size={18} />;
        switch (categoria?.toLowerCase()) {
            case 'combustivel': return <Fuel className="text-brand-cyan" size={18} />;
            case 'manutencao': return <Wrench className="text-brand-orange" size={18} />;
            case 'alimentacao': return <Utensils className="text-brand-cyan" size={18} />;
            case 'pecas': return <Layers className="text-white/40" size={18} />;
            default: return <ArrowDownCircle className="text-brand-orange/60" size={18} />;
        }
    };

    const getCategoryLabel = (cat: string) => {
        const labels: Record<string, string> = {
            'recarga': 'Transferência / Recarga',
            'combustivel': 'Abastecimento',
            'alimentacao': 'Alimentação',
            'manutencao': 'Manutenção Corretiva',
            'pecas': 'Peças e Insumos',
            'pedagio': 'Pedágio',
            'hospedagem': 'Hospedagem'
        };
        return labels[cat?.toLowerCase()] || cat;
    };

    const filteredTransactions = transactions.filter(t => {
        const matchesSearch =
            t.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.technician?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.referencia?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = filterType === "todos" || t.tipo === filterType;
        const matchesCategory = filterCategory === "todas" || t.categoria?.toLowerCase() === filterCategory.toLowerCase();

        return matchesSearch && matchesType && matchesCategory;
    });

    const downloadCSV = () => {
        const rows = [
            ["Data", "Tecnico", "Tipo", "Categoria", "Descricao", "Referencia", "Valor"],
            ...filteredTransactions.map(t => [
                new Date(t.data).toLocaleString('pt-BR'),
                t.technician?.nome || '—',
                t.tipo,
                getCategoryLabel(t.categoria),
                t.descricao || '',
                t.referencia || '',
                t.valor
            ])
        ];

        const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `extrato_gastos_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="glass rounded-[2rem] overflow-hidden">
            <div className="p-8 border-b border-white/5 bg-white/2 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <History className="text-brand-cyan" size={24} />
                        Histórico de Extrato
                    </h3>
                    <p className="text-sm text-foreground/40">Entradas via repasse e saídas de campo.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" size={16} />
                        <input
                            type="text" placeholder="Buscar transação..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="w-full sm:w-48 pl-10 pr-4 py-2 bg-black/40 border border-white/5 rounded-xl text-xs outline-none focus:border-brand-cyan/40"
                        />
                    </div>
                    <select value={filterType} onChange={e => setFilterType(e.target.value)} className="px-4 py-2 bg-black/40 border border-white/5 rounded-xl text-xs outline-none">
                        <option value="todos">Entradas e Saídas</option>
                        <option value="recarga">Apenas Entradas</option>
                        <option value="gasto">Apenas Saídas</option>
                    </select>
                    <button onClick={downloadCSV} className="px-4 py-2 bg-brand-cyan/10 text-brand-cyan font-bold rounded-xl hover:bg-brand-cyan hover:text-black transition-all text-xs flex items-center justify-center gap-2">
                        <Download size={16} /> Baixar
                    </button>
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 border-b border-white/5 bg-white/1">
                            <th className="px-8 py-4">Evento / Data</th>
                            <th className="px-8 py-4">Técnico</th>
                            <th className="px-8 py-4">Descrição / Ref</th>
                            <th className="px-8 py-4 text-right">Valor Operado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredTransactions.map((t) => (
                            <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl ${t.tipo === 'recarga' ? 'bg-brand-emerald/10' : 'bg-white/5'}`}>
                                            {getIcon(t.tipo, t.categoria)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground/80">{getCategoryLabel(t.categoria)}</p>
                                            <p className="text-[10px] text-foreground/30 flex items-center gap-1">
                                                <Calendar size={10} />
                                                {new Date(t.data).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 uppercase text-[10px] font-bold text-foreground/60 tracking-widest">
                                    {t.technician?.nome}
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm text-foreground/60 max-w-xs">{t.descricao || '—'}</p>
                                    <p className="text-[9px] font-mono text-foreground/20 italic">{t.referencia}</p>
                                </td>
                                <td className={`px-8 py-6 text-right font-bold font-mono text-lg ${t.tipo === 'recarga' ? 'text-brand-emerald' : 'text-brand-orange'}`}>
                                    {t.tipo === 'recarga' ? '+' : '-'} R$ {Number(t.valor).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden divide-y divide-white/5">
                {filteredTransactions.map((t) => (
                    <div key={t.id} className="p-6 space-y-3">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl h-fit ${t.tipo === 'recarga' ? 'bg-brand-emerald/10' : 'bg-white/5'}`}>
                                    {getIcon(t.tipo, t.categoria)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground/80">{getCategoryLabel(t.categoria)}</p>
                                    <p className="text-[10px] text-foreground/30 uppercase font-bold tracking-wider">{t.technician?.nome}</p>
                                </div>
                            </div>
                            <p className={`font-mono font-bold text-base ${t.tipo === 'recarga' ? 'text-brand-emerald' : 'text-brand-orange'}`}>
                                {t.tipo === 'recarga' ? '+' : '-'} R$ {Number(t.valor).toFixed(2)}
                            </p>
                        </div>

                        {(t.descricao || t.referencia) && (
                            <div className="bg-white/2 p-3 rounded-xl border border-white/5">
                                {t.descricao && <p className="text-xs text-foreground/60 mb-1">{t.descricao}</p>}
                                {t.referencia && <p className="text-[9px] font-mono text-foreground/20 italic uppercase truncate">{t.referencia}</p>}
                            </div>
                        )}

                        <div className="flex justify-between items-center text-[10px] text-foreground/40 font-mono italic">
                            <span>REGISTRO:</span>
                            <span>{new Date(t.data).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                ))}
            </div>

            {filteredTransactions.length === 0 && (
                <div className="px-8 py-16 text-center text-foreground/20 italic">Sem registros no momento.</div>
            )}
        </div>
    );
}

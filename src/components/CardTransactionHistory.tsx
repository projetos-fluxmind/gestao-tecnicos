"use client";

import React, { useState } from 'react';
import {
    History,
    ArrowUpCircle,
    ArrowDownCircle,
    Calendar,
    ShoppingBag,
    Fuel,
    Wrench,
    Utensils,
    Layers,
    Download,
    Search,
    Filter,
    X,
    Receipt,
    Pencil,
    Trash2,
    Save
} from 'lucide-react';
import { updateCardTransaction, deleteCardTransaction } from '@/app/actions/expenses';
import { useRouter } from 'next/navigation';

type CardTransactionHistoryProps = {
    transactions: any[];
};

export function CardTransactionHistory({ transactions }: CardTransactionHistoryProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("todos");
    const [selectedTx, setSelectedTx] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleEditClick = () => {
        setIsEditing(true);
        setEditData({
            valor: selectedTx.valor,
            descricao: selectedTx.descricao || "",
            referencia: selectedTx.referencia || ""
        });
    };

    const handleSaveEdit = async () => {
        setLoading(true);
        await updateCardTransaction(selectedTx.id, {
            valor: Number(editData.valor),
            descricao: editData.descricao,
            referencia: editData.referencia
        });
        setSelectedTx({ ...selectedTx, ...editData, valor: Number(editData.valor) });
        setIsEditing(false);
        setLoading(false);
        router.refresh();
    };

    const handleDelete = async () => {
        if (confirm("ATENÇÃO: Deseja apagar este registro? O saldo do técnico será revertido automaticamente.")) {
            setLoading(true);
            await deleteCardTransaction(selectedTx.id);
            setSelectedTx(null);
            setLoading(false);
            router.refresh();
        }
    };

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

        return matchesSearch && matchesType;
    });

    const downloadCSV = () => {
        const headers = ["Data", "Técnico", "Tipo", "Categoria", "Descrição", "Referência", "Valor (R$)"];
        const rows = filteredTransactions.map(t => [
            new Date(t.data).toLocaleString('pt-BR'),
            t.technician?.nome || 'Desconhecido',
            t.tipo === 'recarga' ? 'Entrada' : 'Saída',
            getCategoryLabel(t.categoria),
            t.descricao || '',
            t.referencia || '',
            t.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        ]);

        let tableStr = `<html xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head><meta charset="utf-8"></head>
        <body><table border="1">
            <thead><tr>${headers.map(h => `<th style="background-color:#06d0f9; color:black;">${h}</th>`).join('')}</tr></thead>
            <tbody>
                ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
            </tbody>
        </table></body></html>`;

        const blob = new Blob([tableStr], { type: 'application/vnd.ms-excel' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `relatorio_cartoes_${new Date().toISOString().split('T')[0]}.xls`;
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
                        Histórico de Movimentações
                    </h3>
                    <p className="text-sm text-foreground/40">Visão completa de entradas e saídas do cartão.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar transação..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full sm:w-48 pl-10 pr-4 py-2 bg-black/40 border border-white/5 rounded-xl text-xs outline-none focus:border-brand-cyan/40"
                        />
                    </div>
                    <select
                        value={filterType}
                        onChange={e => setFilterType(e.target.value)}
                        className="px-4 py-2 bg-black/40 border border-white/5 rounded-xl text-xs outline-none focus:border-brand-cyan/40 appearance-none text-foreground/80"
                    >
                        <option value="todos">Todas as Operações</option>
                        <option value="recarga">Entradas (Recargas)</option>
                        <option value="gasto">Saídas (Despesas)</option>
                    </select>
                    <button
                        onClick={downloadCSV}
                        className="px-4 py-2 bg-brand-cyan/10 text-brand-cyan font-bold rounded-xl hover:bg-brand-cyan hover:text-black transition-all text-xs flex items-center justify-center gap-2 border border-brand-cyan/20"
                    >
                        <Download size={16} />
                        Baixar Excel
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 border-b border-white/5 bg-white/1">
                            <th className="px-8 py-4">Evento / Data</th>
                            <th className="px-8 py-4">Técnico</th>
                            <th className="px-8 py-4">Descrição / Referência</th>
                            <th className="px-8 py-4 text-right">Valor Movimentado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredTransactions.map((t, idx) => (
                            <tr
                                key={t.id || idx}
                                onClick={() => setSelectedTx(t)}
                                className="hover:bg-white/5 transition-colors cursor-pointer group"
                            >
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl ${t.tipo === 'recarga' ? 'bg-brand-emerald/10' : 'bg-white/5'}`}>
                                            {getIcon(t.tipo, t.categoria)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground/80">{getCategoryLabel(t.categoria)}</p>
                                            <p className="text-[10px] text-foreground/30 flex items-center gap-1">
                                                <Calendar size={10} />
                                                {new Date(t.data).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 uppercase italic text-[10px] font-bold text-foreground/60 tracking-widest">
                                    {t.technician?.nome}
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm text-foreground/60 max-w-xs truncate">{t.descricao || '—'}</p>
                                    <p className="text-[9px] font-mono text-foreground/20 italic">{t.referencia || 'TRANS-PIX-INT'}</p>
                                </td>
                                <td className={`px-8 py-6 text-right font-bold font-mono text-lg ${t.tipo === 'recarga' ? 'text-brand-emerald' : 'text-brand-orange'}`}>
                                    {t.tipo === 'recarga' ? '+' : '-'} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.valor)}
                                </td>
                            </tr>
                        ))}
                        {filteredTransactions.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-8 py-20 text-center text-foreground/20 italic">
                                    Nenhuma movimentação encontrada com os filtros atuais.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Transaction Detail Modal */}
            {selectedTx && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in" onClick={() => { setSelectedTx(null); setIsEditing(false); }}>
                    <div className="glass w-full max-w-md rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => { setSelectedTx(null); setIsEditing(false); }} className="absolute top-6 right-6 p-2 text-foreground/40 hover:text-white bg-black/30 rounded-full z-10 transition-all">
                            <X size={18} />
                        </button>

                        <div className={`p-8 border-b border-white/5 relative ${selectedTx.tipo === 'recarga' ? 'bg-brand-emerald/10' : 'bg-brand-orange/10'}`}>
                            <div className="w-16 h-16 rounded-full bg-black/40 flex items-center justify-center mb-4 border border-white/10 shadow-inner">
                                {getIcon(selectedTx.tipo, selectedTx.categoria)}
                            </div>
                            <h3 className="text-2xl font-bold">{getCategoryLabel(selectedTx.categoria)}</h3>
                            <p className="text-sm font-mono opacity-60">ID Lançamento: {selectedTx.id}</p>

                            {!isEditing && (
                                <div className="absolute top-6 right-20 flex gap-2">
                                    <button onClick={handleEditClick} className="p-2 bg-brand-cyan/20 text-brand-cyan rounded-full hover:bg-brand-cyan hover:text-black transition-all">
                                        <Pencil size={18} />
                                    </button>
                                    <button onClick={handleDelete} className="p-2 bg-brand-orange/20 text-brand-orange rounded-full hover:bg-brand-orange hover:text-black transition-all" disabled={loading}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Valor</p>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={editData.valor}
                                        onChange={e => setEditData({ ...editData, valor: e.target.value })}
                                        className="w-32 bg-black/40 border border-white/10 rounded-lg p-2 text-right font-mono font-bold text-lg outline-none focus:border-brand-cyan/40"
                                    />
                                ) : (
                                    <p className={`text-2xl font-black font-mono ${selectedTx.tipo === 'recarga' ? 'text-brand-emerald' : 'text-brand-orange'}`}>
                                        {selectedTx.tipo === 'recarga' ? '+' : '-'} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedTx.valor)}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Colaborador Vinculado</p>
                                    <p className="font-bold">{selectedTx.technician?.nome || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Data e Hora</p>
                                    <p className="font-mono text-sm opacity-80">{new Date(selectedTx.data).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'medium' })}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Descrição</p>
                                    {isEditing ? (
                                        <textarea
                                            value={editData.descricao}
                                            onChange={e => setEditData({ ...editData, descricao: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 mt-1 text-sm outline-none focus:border-brand-cyan/40 min-h-[60px]"
                                        />
                                    ) : (
                                        <p className="text-sm opacity-80 p-3 bg-black/40 rounded-xl mt-1 border border-white/5">{selectedTx.descricao || 'Sem descrição.'}</p>
                                    )}
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Chave de Referência Interna</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.referencia}
                                            onChange={e => setEditData({ ...editData, referencia: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 mt-1 text-xs font-mono outline-none focus:border-brand-cyan/40"
                                        />
                                    ) : selectedTx.referencia ? (
                                        <p className="text-xs font-mono text-brand-cyan p-2 bg-brand-cyan/10 rounded-lg inline-block mt-1">{selectedTx.referencia}</p>
                                    ) : <p className="text-xs text-foreground/40 mt-1">Nenhuma referência</p>}
                                </div>

                                {isEditing && (
                                    <div className="pt-4 flex gap-4">
                                        <button onClick={() => setIsEditing(false)} className="w-1/2 py-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all font-bold text-sm">
                                            CANCELAR
                                        </button>
                                        <button onClick={handleSaveEdit} disabled={loading} className="w-1/2 py-3 bg-brand-cyan text-black rounded-xl hover:opacity-90 transition-all font-bold text-sm shadow-[0_0_15px_#06d0f940] flex justify-center items-center gap-2">
                                            <Save size={16} /> {loading ? 'SALVANDO...' : 'SALVAR'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

"use client";

import React, { useState } from 'react';
import { Search, CheckCircle2, Pencil, Trash2, X, Save } from 'lucide-react';
import { approveExpense, deleteExpense, updateExpense } from '@/app/actions/expenses';
import { CategoriaDespesa } from '@prisma/client';
import { useRouter } from 'next/navigation';

type ExpenseRequestsTableProps = {
    expenses: any[];
    categoriaLabel: Record<string, string>;
};

export function ExpenseRequestsTable({ expenses, categoriaLabel }: ExpenseRequestsTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [editingExp, setEditingExp] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const router = useRouter();

    const filteredExpenses = expenses.filter(exp =>
        exp.technician?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        setErrorMsg("");
        if (confirm("Tem certeza que deseja apagar esta solicitação? Esta ação é permanente.")) {
            setLoading(true);
            try {
                const res = await deleteExpense(id);
                if (res && res.success) {
                    router.refresh();
                } else {
                    const msg = (res as any)?.error || "Erro desconhecido ao excluir.";
                    setErrorMsg(msg);
                    alert("Erro ao excluir: " + msg);
                }
            } catch (err: any) {
                const msg = err.message || "Erro de conexão.";
                setErrorMsg(msg);
                alert("Erro: " + msg);
            }
            setLoading(false);
        }
    };

    const handleSaveEdit = async () => {
        setLoading(true);
        setErrorMsg("");
        try {
            const res = await updateExpense(editingExp.id, {
                categoria: editingExp.categoria,
                descricao: editingExp.descricao,
                valor: Number(editingExp.valor),
            });
            if (res && res.success) {
                setEditingExp(null);
                router.refresh();
            } else {
                const msg = (res as any)?.error || "Erro desconhecido ao salvar.";
                setErrorMsg(msg);
                alert("Erro ao salvar: " + msg);
            }
        } catch (err: any) {
            const msg = err.message || "Erro de conexão.";
            setErrorMsg(msg);
            alert("Erro: " + msg);
        }
        setLoading(false);
    };

    return (
        <div className="glass rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/2">
                <h3 className="font-bold text-lg">Solicitações de Reembolso</h3>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={16} />
                    <input
                        type="text"
                        placeholder="Filtrar..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-black/20 rounded-xl text-xs border border-transparent focus:border-brand-cyan/30 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full text-left">
                    <tbody className="divide-y divide-white/5">
                        {filteredExpenses.map((exp: any) => (
                            <tr key={exp.id} className="group hover:bg-white/2 transition-all">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-brand-cyan/10 flex items-center justify-center border border-brand-cyan/20">
                                            <span className="text-[10px] font-bold text-brand-cyan">{exp.technician?.nome?.charAt(0)}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-foreground/80">{exp.technician?.nome}</span>
                                            <span className="text-[10px] text-foreground/40">{exp.data ? new Date(exp.data).toLocaleDateString('pt-BR') : '—'}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 w-fit mb-1 font-bold text-brand-cyan/70 uppercase">
                                            {categoriaLabel[exp.categoria] || exp.categoria}
                                        </span>
                                        <span className="text-xs text-foreground/60">{exp.descricao || '—'}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="font-mono font-bold text-brand-orange">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(exp.valor))}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right w-48">
                                    <div className="flex justify-end gap-2 pr-2 items-center">
                                        <button
                                            onClick={() => setEditingExp(exp)}
                                            className="p-2 aspect-square glass rounded-lg text-brand-cyan hover:bg-brand-cyan hover:text-black transition-all"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(e, exp.id)}
                                            className="p-2 aspect-square glass rounded-lg text-brand-orange hover:bg-brand-orange hover:text-black transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        {!exp.aprovado_supervisor ? (
                                            <button
                                                onClick={async () => { await approveExpense(exp.id); router.refresh(); }}
                                                className="p-2 aspect-square glass rounded-lg text-brand-emerald hover:bg-brand-emerald hover:text-black transition-all"
                                                title="Aprovar reembolso"
                                            >
                                                <CheckCircle2 size={16} />
                                            </button>
                                        ) : (
                                            <CheckCircle2 className="text-brand-emerald" size={16} />
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredExpenses.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-foreground/30 italic">
                                    Nenhuma despesa pendente.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de Edição */}
            {editingExp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in" onClick={() => setEditingExp(null)}>
                    <div className="glass w-full max-w-md rounded-[2rem] overflow-hidden border border-brand-cyan/20 bg-black/90 p-8 relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setEditingExp(null)} className="absolute top-6 right-6 p-2 text-foreground/40 hover:text-white bg-white/5 rounded-full transition-all">
                            <X size={18} />
                        </button>

                        <h3 className="text-xl font-bold mb-6 text-brand-cyan flex items-center gap-2">
                            <Pencil size={20} /> Editar Solicitação
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-foreground/40">Categoria</label>
                                <select
                                    value={editingExp.categoria}
                                    onChange={e => setEditingExp({ ...editingExp, categoria: e.target.value as CategoriaDespesa })}
                                    className="w-full bg-black/40 border border-white/5 rounded-xl p-3 outline-none focus:border-brand-cyan/40 text-sm appearance-none"
                                >
                                    {Object.entries(categoriaLabel).map(([val, label]) => (
                                        <option key={val} value={val}>{label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-foreground/40">Valor (R$)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editingExp.valor}
                                    onChange={e => setEditingExp({ ...editingExp, valor: e.target.value })}
                                    className="w-full bg-black/40 border border-white/5 rounded-xl p-3 outline-none focus:border-brand-cyan/40 text-sm font-mono text-brand-orange"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-foreground/40">Descrição</label>
                                <textarea
                                    value={editingExp.descricao}
                                    onChange={e => setEditingExp({ ...editingExp, descricao: e.target.value })}
                                    className="w-full bg-black/40 border border-white/5 rounded-xl p-3 outline-none focus:border-brand-cyan/40 text-sm min-h-[80px]"
                                />
                            </div>
                            <button
                                disabled={loading}
                                onClick={handleSaveEdit}
                                className="w-full py-4 mt-4 bg-brand-cyan text-black font-black rounded-xl hover:opacity-90 transition-all shadow-[0_0_20px_#06d0f933] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Save size={18} /> {loading ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

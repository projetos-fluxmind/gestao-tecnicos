"use client";

import React, { useState } from 'react';
import { Plus, X, Receipt, AlertCircle, Loader2 } from 'lucide-react';
import { createExpense } from '@/app/actions/expenses';
import { useRouter } from 'next/navigation';

export function NovaDespesaForm({ techs }: { techs: any[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [tecnicoId, setTecnicoId] = useState("");
    const [categoria, setCategoria] = useState("alimentacao");
    const [valor, setValor] = useState("");
    const [pagamento, setPagamento] = useState("cartao");
    const [descricao, setDescricao] = useState("");
    const [data, setData] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const success = await createExpense({
            tecnicoId, categoria, valor, pagamento, descricao, data
        });

        if (success) {
            setIsOpen(false);
            setTecnicoId(""); setValor(""); setDescricao("");
            router.refresh();
        } else {
            alert("Erro ao registrar despesa.");
        }
        setLoading(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="px-6 py-3 bg-brand-cyan text-black font-black rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-[0_0_20px_#06d0f940]"
            >
                <Plus size={20} /> Nova Despesa
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in" onClick={() => setIsOpen(false)}>
                    <div className="glass w-full max-w-lg rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 p-2 text-foreground/40 hover:text-white bg-black/30 rounded-full z-10">
                            <X size={18} />
                        </button>

                        <div className="p-8 border-b border-white/5 bg-gradient-to-r from-brand-cyan/10 to-transparent">
                            <div className="w-12 h-12 rounded-2xl bg-brand-cyan/20 flex items-center justify-center text-brand-cyan mb-4">
                                <Receipt size={24} />
                            </div>
                            <h3 className="text-2xl font-bold">Lançar Despesa</h3>
                            <p className="text-sm opacity-60 mt-1">Alimentação, pedágios, hospedagem ou reembolsos.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest pl-1">Colaborador</label>
                                    <select required value={tecnicoId} onChange={e => setTecnicoId(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-brand-cyan/40 outline-none">
                                        <option value="">Selecione o técnico</option>
                                        {techs.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest pl-1">Categoria</label>
                                        <select value={categoria} onChange={e => setCategoria(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-brand-cyan/40 outline-none">
                                            <option value="alimentacao">Alimentação</option>
                                            <option value="pedagio">Pedágio</option>
                                            <option value="hospedagem">Hospedagem</option>
                                            <option value="pecas">Peças Avulsas</option>
                                            <option value="outros">Outros</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest pl-1">Data</label>
                                        <input type="date" required value={data} onChange={e => setData(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-brand-cyan/40 outline-none" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest pl-1">Valor (R$)</label>
                                        <input type="number" step="0.01" required placeholder="0.00" value={valor} onChange={e => setValor(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-brand-cyan/40 outline-none font-mono" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest pl-1">Forma de Pagto.</label>
                                        <select value={pagamento} onChange={e => setPagamento(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-brand-cyan/40 outline-none">
                                            <option value="cartao">Cartão Coporativo</option>
                                            <option value="reembolso">Pedir Reembolso</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest pl-1">Descrição</label>
                                    <input type="text" placeholder="Ex: Almoço em rota" required value={descricao} onChange={e => setDescricao(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-brand-cyan/40 outline-none" />
                                </div>
                            </div>

                            {pagamento === 'cartao' && (
                                <div className="flex items-center gap-3 p-4 bg-brand-cyan/10 rounded-xl border border-brand-cyan/20 text-brand-cyan text-xs">
                                    <AlertCircle size={16} />
                                    <p>O valor será <strong className="font-bold">debitado instantaneamente</strong> do saldo do cartão deste técnico.</p>
                                </div>
                            )}

                            <div className="pt-2">
                                <button disabled={loading} type="submit" className="w-full py-4 bg-brand-cyan text-black font-black tracking-widest text-xs rounded-xl shadow-[0_0_15px_#06d0f940] hover:scale-[1.02] transition-all flex justify-center items-center gap-2">
                                    {loading ? <Loader2 className="animate-spin" size={16} /> : <Receipt size={16} />}
                                    {loading ? 'PROCESSANDO...' : 'REGISTRAR DESPESA'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

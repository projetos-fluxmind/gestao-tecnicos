"use client";

import React, { useState } from 'react';
import { Plus, X, Receipt, DollarSign, Calendar, Users, Info, Save } from 'lucide-react';
import { createExpense } from '@/app/actions/expenses';
import { CategoriaDespesa } from '@prisma/client';

export function NovaDespesaForm({ techs }: { techs: any[] }) {
    const [open, setOpen] = useState(false);
    const [tecnicoId, setTecnicoId] = useState("");
    const [categoria, setCategoria] = useState<CategoriaDespesa>("outros");
    const [valor, setValor] = useState("");
    const [descricao, setDescricao] = useState("");
    const [data, setData] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    async function handleSubmit() {
        if (!tecnicoId || !valor || !data || !categoria) {
            setMsg({ type: 'error', text: 'Preencha técnico, categoria, valor e data.' });
            return;
        }

        setLoading(true);
        setMsg({ type: '', text: '' });

        // Sanitização: trocar vírgula por ponto para suportar locale PT-BR
        const cleanValor = parseFloat(valor.toString().replace(',', '.'));

        if (isNaN(cleanValor)) {
            setMsg({ type: 'error', text: 'Valor financeiro inválido.' });
            setLoading(false);
            return;
        }

        const res = await createExpense({
            tecnicoId: Number(tecnicoId),
            categoria,
            valor: cleanValor,
            descricao,
            data
        });

        if (res?.success) {
            setMsg({ type: 'success', text: 'Solicitação de Reembolso Enviada!' });
            setTimeout(() => {
                setOpen(false);
                setMsg({ type: '', text: '' });
                setTecnicoId("");
                setValor("");
                setDescricao("");
            }, 1500);
        } else {
            setMsg({ type: 'error', text: 'Erro ao registrar despesa.' });
        }
        setLoading(false);
    }

    if (!open) {
        return (
            <button onClick={() => setOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-brand-cyan text-black font-bold rounded-xl hover:opacity-90 transition-all shadow-[0_0_15px_#06d0f933]">
                <Plus size={20} />
                Nova Despesa
            </button>
        );
    }

    return (
        <div className="glass p-8 rounded-[2rem] border border-brand-cyan/20 animate-in fade-in slide-in-from-top-4 w-full relative mb-12 shadow-2xl">
            <button onClick={() => setOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-all">
                <X size={20} className="text-foreground/30 hover:text-white" />
            </button>
            <div className="flex items-center gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-brand-cyan/10 text-brand-cyan">
                    <Receipt size={28} />
                </div>
                <div>
                    <h3 className="text-2xl font-bold">Solicitar Reembolso</h3>
                    <p className="text-sm text-foreground/40 text-balance">Registre os detalhes da despesa operacional para aprovação.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-foreground/40 uppercase tracking-widest px-1 flex items-center gap-2">
                            <Users size={14} className="text-brand-cyan" /> Colaborador
                        </label>
                        <select value={tecnicoId} onChange={e => setTecnicoId(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 outline-none focus:border-brand-cyan/30 transition-all text-sm appearance-none">
                            <option value="">Selecione o Técnico...</option>
                            {techs.map(t => (
                                <option key={t.id} value={t.id}>{t.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-foreground/40 uppercase tracking-widest px-1">Categoria</label>
                            <select value={categoria} onChange={e => setCategoria(e.target.value as CategoriaDespesa)} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 outline-none focus:border-brand-cyan/30 transition-all text-sm appearance-none">
                                <option value="alimentacao">Alimentação</option>
                                <option value="combustivel">Combustível</option>
                                <option value="pedagio">Pedágio</option>
                                <option value="hospedagem">Hospedagem</option>
                                <option value="pecas">Peças/Serviços</option>
                                <option value="outros">Outros</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-foreground/40 uppercase tracking-widest px-1">Data do Gasto</label>
                            <div className="relative">
                                <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" />
                                <input type="date" value={data} onChange={e => setData(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-2xl pl-10 pr-4 py-4 outline-none focus:border-brand-cyan/30 transition-all text-sm" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-foreground/40 uppercase tracking-widest px-1 flex items-center gap-2">
                            <DollarSign size={14} className="text-brand-emerald" /> Valor Total (R$)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={valor}
                            onChange={e => setValor(e.target.value)}
                            placeholder="0,00"
                            className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 outline-none focus:border-emerald-500/30 transition-all text-lg font-mono font-bold text-brand-emerald"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-foreground/40 uppercase tracking-widest px-1 text-balance">Descrição Justificativa</label>
                        <textarea value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Ex: Almoço em rota de manutenção, Pedágio Rodovia dos Bandeirantes..." className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 outline-none focus:border-brand-cyan/30 transition-all text-sm min-h-[100px]" />
                    </div>
                </div>
            </div>

            {msg.text && (
                <div className={`mt-8 p-4 rounded-2xl text-center font-bold text-sm ${msg.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-brand-emerald/10 text-brand-emerald'}`}>
                    {msg.text}
                </div>
            )}

            <div className="mt-8 flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 p-4 bg-white/2 rounded-2xl border border-white/5 flex gap-3 text-xs text-foreground/40 leading-relaxed italic">
                    <Info size={16} className="text-brand-cyan flex-shrink-0" />
                    Após o envio, a despesa ficará com status "Pendente" até que um supervisor realize a revisão e aprovação para o repasse financeiro.
                </div>
                <button disabled={loading} onClick={handleSubmit} className="w-full md:w-72 py-5 bg-brand-cyan text-black font-black tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_10px_30px_-10px_rgba(6,208,249,0.3)] flex items-center justify-center gap-2">
                    <Save size={20} />
                    {loading ? 'ENVIANDO...' : 'SOLICITAR REEMBOLSO'}
                </button>
            </div>
        </div>
    );
}

"use client";

import React, { useState } from 'react';
import { Wrench, Plus, X } from 'lucide-react';
import { createMaintenance } from '@/app/actions/maintenance';

export function ManutencaoForm({ motos, techs }: { motos: any[], techs: any[] }) {
    const [open, setOpen] = useState(false);

    const [motoId, setMotoId] = useState("");
    const [tecnicoId, setTecnicoId] = useState("");
    const [tipo, setTipo] = useState<"preventiva" | "corretiva" | "emergencial">("preventiva");
    const [data_entrada, setDataEntrada] = useState(new Date().toISOString().split('T')[0]);
    const [descricao, setDescricao] = useState("");

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    async function handleSubmit() {
        if (!motoId || !tecnicoId || !tipo || !data_entrada || !descricao) {
            setMsg({ type: 'error', text: 'Preencha todos os campos.' });
            return;
        }

        setLoading(true);
        setMsg({ type: '', text: '' });

        const res = await createMaintenance({
            motoId: Number(motoId),
            tecnicoId: Number(tecnicoId),
            data_entrada,
            tipo,
            descricao
        });

        if (res?.success) {
            setMsg({ type: 'success', text: 'Manutenção Registrada!' });
            setTimeout(() => {
                setOpen(false);
                setMsg({ type: '', text: '' });
                setDescricao("");
            }, 1500);
        } else {
            setMsg({ type: 'error', text: 'Erro ao registrar manutenção.' });
        }
        setLoading(false);
    }

    if (!open) {
        return (
            <button onClick={() => setOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-brand-orange text-black font-bold rounded-xl hover:opacity-90 transition-all shadow-[0_0_15px_#f2a90033]">
                <Wrench size={20} />
                Registrar Manutenção
            </button>
        );
    }

    return (
        <div className="glass p-6 rounded-2xl border-l-4 border-brand-orange animate-in fade-in slide-in-from-top-4 w-full relative mb-8">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-all">
                <X size={20} className="text-foreground/50 hover:text-white" />
            </button>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Wrench size={20} className="text-brand-orange" />
                Nova Manutenção
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-foreground/50 uppercase">Data da Entrada</label>
                    <input type="date" value={data_entrada} onChange={e => setDataEntrada(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-orange/40 transition-all" />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-foreground/50 uppercase">Tipo</label>
                    <select value={tipo} onChange={e => setTipo(e.target.value as any)} className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-orange/40 transition-all appearance-none">
                        <option value="preventiva">Preventiva</option>
                        <option value="corretiva">Corretiva</option>
                        <option value="emergencial">Emergencial</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-foreground/50 uppercase">Moto</label>
                    <select value={motoId} onChange={e => setMotoId(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-orange/40 transition-all appearance-none">
                        <option value="">Selecione...</option>
                        {motos.map(m => <option key={m.id} value={m.id}>{m.placa} - {m.modelo}</option>)}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-foreground/50 uppercase">Técnico Responsável</label>
                    <select value={tecnicoId} onChange={e => setTecnicoId(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-orange/40 transition-all appearance-none">
                        <option value="">Selecione...</option>
                        {techs.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                    </select>
                </div>

                <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-foreground/50 uppercase">Descrição do Problema / Serviço</label>
                    <textarea value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Descreva os itens a serem revisados..." className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-orange/40 transition-all min-h-[100px]" />
                </div>
            </div>

            {msg.text && (
                <div className={`mt-4 p-3 rounded-xl text-center font-bold text-sm ${msg.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-brand-emerald/10 text-brand-emerald'}`}>
                    {msg.text}
                </div>
            )}

            <button disabled={loading} onClick={handleSubmit} className="w-full mt-6 py-4 bg-brand-orange text-black font-bold rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50">
                {loading ? 'SALVANDO...' : 'CONFIRMAR MANUTENÇÃO'}
            </button>
        </div>
    );
}

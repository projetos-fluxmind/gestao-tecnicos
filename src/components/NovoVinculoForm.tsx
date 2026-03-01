"use client";

import React, { useState } from 'react';
import { LinkIcon, Bike, Users, Save, X, Info } from 'lucide-react';
import { createAssignment } from '@/app/actions/assignments';

export function NovoVinculoForm({ motos, techs }: { motos: any[], techs: any[] }) {
    const [open, setOpen] = useState(false);
    const [motoId, setMotoId] = useState("");
    const [tecnicoId, setTecnicoId] = useState("");
    const [tipo, setTipo] = useState("definitiva");
    const [data_inicio, setDataInicio] = useState(new Date().toISOString().split('T')[0]);
    const [observacoes, setObservacoes] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    async function handleSubmit() {
        if (!motoId || !tecnicoId || !data_inicio) {
            setMsg({ type: 'error', text: 'Preencha moto, técnico e data.' });
            return;
        }

        setLoading(true);
        setMsg({ type: '', text: '' });

        const res = await createAssignment({
            motoId: Number(motoId),
            tecnicoId: Number(tecnicoId),
            data_inicio,
            tipo,
            observacoes
        });

        if (res?.success) {
            setMsg({ type: 'success', text: 'Vínculo Criado com Sucesso!' });
            setTimeout(() => {
                setOpen(false);
                setMsg({ type: '', text: '' });
                setMotoId("");
                setTecnicoId("");
                setObservacoes("");
            }, 1500);
        } else {
            setMsg({ type: 'error', text: 'Erro ao criar vínculo.' });
        }
        setLoading(false);
    }

    if (!open) {
        return (
            <button onClick={() => setOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-brand-cyan text-black font-bold rounded-xl hover:opacity-90 transition-all shadow-[0_0_15px_#06d0f933]">
                <LinkIcon size={20} />
                Novo Vínculo
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
                    <LinkIcon size={28} />
                </div>
                <div>
                    <h3 className="text-2xl font-bold">Configurar Novo Vínculo</h3>
                    <p className="text-sm text-foreground/40 text-balance">Associe um ativo da frota a um técnico operacional.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-foreground/40 uppercase tracking-widest px-1 flex items-center gap-2">
                            <Bike size={14} className="text-brand-cyan" /> Selecionar Veículo
                        </label>
                        <select value={motoId} onChange={e => setMotoId(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 outline-none focus:border-brand-cyan/30 transition-all text-sm appearance-none">
                            <option value="">Selecione a Moto...</option>
                            {motos.map(m => (
                                <option key={m.id} value={m.id}>{m.placa} - {m.modelo}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-foreground/40 uppercase tracking-widest px-1 flex items-center gap-2">
                            <Users size={14} className="text-brand-cyan" /> Selecionar Técnico
                        </label>
                        <select value={tecnicoId} onChange={e => setTecnicoId(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 outline-none focus:border-brand-cyan/30 transition-all text-sm appearance-none">
                            <option value="">Selecione o Técnico...</option>
                            {techs.map(t => (
                                <option key={t.id} value={t.id}>{t.nome}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-foreground/40 uppercase tracking-widest px-1">Tipo de Vínculo</label>
                            <select value={tipo} onChange={e => setTipo(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 outline-none focus:border-brand-cyan/30 transition-all text-sm appearance-none">
                                <option value="definitiva">Definitiva</option>
                                <option value="temporaria">Temporária</option>
                                <option value="reserva">Moto Reserva</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-foreground/40 uppercase tracking-widest px-1">Data de Início</label>
                            <input type="date" value={data_inicio} onChange={e => setDataInicio(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 outline-none focus:border-brand-cyan/30 transition-all text-sm" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-foreground/40 uppercase tracking-widest px-1">Observações Internas</label>
                        <textarea value={observacoes} onChange={e => setObservacoes(e.target.value)} placeholder="Motivo do vínculo, condições do veículo, etc..." className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 outline-none focus:border-brand-cyan/30 transition-all text-sm min-h-[100px]" />
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
                    Ao criar um novo vínculo para um veículo que já possui um técnico associado, o vínculo anterior será encerrado automaticamente com a data de início deste novo registro.
                </div>
                <button disabled={loading} onClick={handleSubmit} className="w-full md:w-64 py-5 bg-brand-cyan text-black font-black tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_10px_30px_-10px_rgba(6,208,249,0.3)] flex items-center justify-center gap-2">
                    <Save size={20} />
                    {loading ? 'PROCESSANDO...' : 'CONFIRMAR VÍNCULO'}
                </button>
            </div>
        </div>
    );
}

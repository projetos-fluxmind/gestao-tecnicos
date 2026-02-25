"use client";

import React, { useState } from 'react';
import { Fuel, Camera } from 'lucide-react';
import { createFuelLog } from '@/app/actions/fuel';

export function AbastecimentoForm({ motos, techs }: { motos: any[], techs: any[] }) {
    const [motoId, setMotoId] = useState("");
    const [tecnicoId, setTecnicoId] = useState("");
    const [km, setKm] = useState("");
    const [litros, setLitros] = useState("");
    const [valor, setValor] = useState("");
    const [data, setData] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    const selectedMoto = motos.find((m: any) => m.id.toString() === motoId);

    async function handleSubmit() {
        if (!motoId || !tecnicoId || !km || !litros || !valor || !data) {
            setMsg({ type: 'error', text: 'Preencha todos os campos.' });
            return;
        }

        setLoading(true);
        setMsg({ type: '', text: '' });

        const res = await createFuelLog({
            motoId: Number(motoId),
            tecnicoId: Number(tecnicoId),
            data,
            km: Number(km),
            litros: Number(litros),
            valor: Number(valor)
        });

        if (res?.success) {
            setMsg({ type: 'success', text: 'Abastecimento registrado!' });
            setMotoId("");
            setKm("");
            setLitros("");
            setValor("");
        } else {
            setMsg({ type: 'error', text: 'Erro ao salvar abastecimento.' });
        }
        setLoading(false);
    }

    return (
        <div className="xl:col-span-1 space-y-6">
            <div className="glass p-8 rounded-2xl bg-gradient-to-br from-brand-cyan/5 to-transparent border border-brand-cyan/10">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Fuel size={20} className="text-brand-cyan" />
                    Lançamento Manual
                </h3>

                <div className="space-y-4 mb-6">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-foreground/50 uppercase">Data</label>
                        <input type="date" value={data} onChange={e => setData(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-cyan/40" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-foreground/50 uppercase">Moto</label>
                        <select value={motoId} onChange={e => setMotoId(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-cyan/40">
                            <option value="">Selecione...</option>
                            {motos.map(m => <option key={m.id} value={m.id}>{m.placa} - {m.modelo}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-foreground/50 uppercase">Técnico</label>
                        <select value={tecnicoId} onChange={e => setTecnicoId(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-cyan/40">
                            <option value="">Selecione...</option>
                            {techs.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-foreground/50 uppercase">KM Atual {selectedMoto && `(Últ: ${selectedMoto.hodometro_atual})`}</label>
                            <input type="number" step="0.1" value={km} onChange={e => setKm(e.target.value)} placeholder="Ex: 15400.5" className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-cyan/40 font-mono" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-foreground/50 uppercase">Litros</label>
                            <input type="number" step="0.1" value={litros} onChange={e => setLitros(e.target.value)} placeholder="Ex: 10.5" className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-cyan/40 font-mono" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-foreground/50 uppercase">Valor Total (R$)</label>
                        <input type="number" step="0.01" value={valor} onChange={e => setValor(e.target.value)} placeholder="Ex: 50.00" className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500/40 font-mono text-emerald-500" />
                    </div>
                </div>

                {msg.text && (
                    <div className={`p-3 rounded-xl text-center font-bold text-xs mb-4 ${msg.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-brand-emerald/10 text-brand-emerald'}`}>
                        {msg.text}
                    </div>
                )}

                <button disabled={loading} onClick={handleSubmit} className="w-full py-4 bg-brand-cyan text-black font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
                    {loading ? 'Processando...' : 'REGISTRAR ABASTECIMENTO'}
                </button>
            </div>
        </div>
    );
}

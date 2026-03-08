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
    const [valorLitro, setValorLitro] = useState("");
    const [data, setData] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    const selectedMoto = motos.find((m: any) => m.id.toString() === motoId);

    // Dynamic calculations for preview
    const kmLast = selectedMoto ? Number(selectedMoto.hodometro_atual) : 0;
    const numKm = parseFloat(km.toString().replace(',', '.'));
    const numLitros = parseFloat(litros.toString().replace(',', '.'));

    let media = 0;
    if (!isNaN(numKm) && !isNaN(numLitros) && numLitros > 0 && numKm > kmLast) {
        media = (numKm - kmLast) / numLitros;
    }

    const handleValorLitroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const vl = e.target.value;
        setValorLitro(vl);
        const l = parseFloat(litros.toString().replace(',', '.'));
        const v = parseFloat(vl.replace(',', '.'));
        if (!isNaN(l) && !isNaN(v)) {
            setValor((l * v).toFixed(2));
        }
    }

    const handleValorTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const vt = e.target.value;
        setValor(vt);
        const l = parseFloat(litros.toString().replace(',', '.'));
        const v = parseFloat(vt.replace(',', '.'));
        if (!isNaN(l) && !isNaN(v) && l > 0) {
            setValorLitro((v / l).toFixed(3));
        }
    }

    const handleLitrosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const lStr = e.target.value;
        setLitros(lStr);
        const l = parseFloat(lStr.replace(',', '.'));
        const vl = parseFloat(valorLitro.toString().replace(',', '.'));
        if (!isNaN(l) && !isNaN(vl) && vl > 0) {
            setValor((l * vl).toFixed(2));
        }
    }

    async function handleSubmit() {
        if (!motoId || !tecnicoId || !km || !litros || !valor || !data) {
            setMsg({ type: 'error', text: 'Preencha todos os campos obrigatórios.' });
            return;
        }

        setLoading(true);
        setMsg({ type: '', text: '' });

        const cleanKm = parseFloat(km.toString().replace(',', '.'));
        const cleanLitros = parseFloat(litros.toString().replace(',', '.'));
        const cleanValor = parseFloat(valor.toString().replace(',', '.'));

        if (isNaN(cleanKm) || isNaN(cleanLitros) || isNaN(cleanValor)) {
            setMsg({ type: 'error', text: 'Valores numéricos inválidos.' });
            setLoading(false);
            return;
        }

        const res = await createFuelLog({
            motoId: Number(motoId),
            tecnicoId: Number(tecnicoId),
            data,
            km: cleanKm,
            litros: cleanLitros,
            valor: cleanValor
        });

        if (res?.success) {
            setMsg({ type: 'success', text: 'Abastecimento registrado com sucesso!' });
            setMotoId("");
            setKm("");
            setLitros("");
            setValor("");
            setValorLitro("");
        } else {
            setMsg({ type: 'error', text: 'Erro ao salvar. Verifique se os dados estão corretos.' });
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
                    <div className="grid grid-cols-2 gap-4">
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-foreground/50 uppercase flex justify-between">
                                <span>KM Atual</span>
                                {selectedMoto && <span className="text-brand-cyan">Últ: {selectedMoto.hodometro_atual}</span>}
                            </label>
                            <input type="number" step="0.1" inputMode="decimal" value={km} onChange={e => setKm(e.target.value)} placeholder="0.0" className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-cyan/40 font-mono" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-foreground/50 uppercase">Data</label>
                            <input type="date" value={data} onChange={e => setData(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-cyan/40" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-foreground/50 uppercase">Litros</label>
                            <input type="number" step="0.1" inputMode="decimal" value={litros} onChange={handleLitrosChange} placeholder="Ex: 10.5" className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-cyan/40 font-mono" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-foreground/50 uppercase">R$/Litro</label>
                            <input type="number" step="0.01" inputMode="decimal" value={valorLitro} onChange={handleValorLitroChange} placeholder="Ex: 5.80" className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500/40 font-mono" />
                        </div>
                        <div className="space-y-1 md:col-span-1 col-span-2">
                            <label className="text-[10px] font-bold text-foreground/50 uppercase">Total (R$)</label>
                            <input type="number" step="0.01" inputMode="decimal" value={valor} onChange={handleValorTotalChange} placeholder="0.00" className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500/40 font-mono text-emerald-500 font-bold" />
                        </div>
                    </div>

                    {/* Preview de Média de Consumo */}
                    <div className="p-4 rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground/60 uppercase">Média de Consumo Prevista</span>
                        <span className={`text-lg font-mono font-bold ${media > 0 ? 'text-brand-cyan' : 'text-foreground/30'}`}>
                            {media > 0 ? `${media.toFixed(1)} km/l` : '-- km/l'}
                        </span>
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

"use client";

import React, { useState } from 'react';
import { Droplets } from 'lucide-react';
import { createOilChange } from '@/app/actions/oil';

export function TrocaOleoForm({ motos, techs }: { motos: any[], techs: any[] }) {
    const [motoId, setMotoId] = useState("");
    const [tecnicoId, setTecnicoId] = useState("");
    const [km, setKm] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    const selectedMoto = motos.find((m: any) => m.id.toString() === motoId);

    // Calcula diferença projetada
    const kmAtual = Number(selectedMoto?.hodometro_atual || 0);
    const projecao = km ? Number(km) - kmAtual : 0;

    async function handleSubmit() {
        if (!motoId || !tecnicoId || !km) {
            setMsg({ type: 'error', text: 'Preencha moto, técnico e KM atual.' });
            return;
        }

        setLoading(true);
        setMsg({ type: '', text: '' });

        // Sanitização: trocar vírgula por ponto para suportar locale PT-BR
        const cleanKm = parseFloat(km.toString().replace(',', '.'));

        if (isNaN(cleanKm)) {
            setMsg({ type: 'error', text: 'Quilometragem inválida.' });
            setLoading(false);
            return;
        }

        const res = await createOilChange({
            motoId: Number(motoId),
            tecnicoId: Number(tecnicoId),
            data: new Date().toISOString(),
            km: cleanKm
        });

        if (res?.success) {
            setMsg({ type: 'success', text: 'Troca de Óleo registrada com sucesso!' });
            setMotoId("");
            setKm("");
        } else {
            setMsg({ type: 'error', text: 'Erro ao salvar. Verifique se o valor é válido.' });
        }
        setLoading(false);
    }

    return (
        <div className="lg:col-span-1 glass p-6 rounded-2xl h-fit space-y-6 border-t-2 border-brand-emerald/30">
            <h3 className="text-lg font-bold flex items-center gap-2">
                <Droplets className="text-brand-emerald" size={18} />
                Registrar Troca
            </h3>
            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-foreground/40 uppercase mb-1 block">Motocicleta</label>
                    <select value={motoId} onChange={e => setMotoId(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-emerald/50 transition-all text-sm appearance-none">
                        <option value="">Selecione a Moto</option>
                        {motos.map(m => <option key={m.id} value={m.id}>{m.placa} ({m.modelo})</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-foreground/40 uppercase mb-1 block">Técnico Responsável</label>
                    <select value={tecnicoId} onChange={e => setTecnicoId(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-emerald/50 transition-all text-sm appearance-none">
                        <option value="">Selecione o Técnico</option>
                        {techs.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-foreground/40 uppercase mb-1 block">KM da Troca</label>
                    <input type="number" step="0.1" inputMode="decimal" value={km} onChange={e => setKm(e.target.value)} placeholder={`Ex: ${kmAtual + 900}`} className="w-full bg-black/20 font-mono font-bold text-brand-emerald border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-emerald/50 transition-all text-xl mt-1" />
                </div>
                <div className="pt-2">
                    <div className="p-4 bg-brand-emerald/5 border border-brand-emerald/10 rounded-xl flex flex-col items-center">
                        <p className="text-[10px] text-brand-emerald font-bold uppercase mb-1">Intervalo desde a última troca</p>
                        <p className={`text-xl font-mono font-bold ${projecao > 1000 ? 'text-red-500' : 'text-brand-emerald'}`}>
                            {projecao.toFixed(1)} km
                        </p>
                        {projecao > 1000 && <p className="text-[10px] text-red-500 font-bold mt-1">⚠️ LIMite ULTRAPASSADO</p>}
                    </div>
                </div>

                {msg.text && (
                    <div className={`p-3 rounded-xl text-center font-bold text-xs ${msg.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-brand-emerald/10 text-brand-emerald'}`}>
                        {msg.text}
                    </div>
                )}

                <button disabled={loading} onClick={handleSubmit} className="w-full py-4 bg-brand-emerald text-black hover:scale-[1.02] active:scale-[0.98] font-bold rounded-xl transition-all shadow-[0_0_15px_#0df28033] disabled:opacity-50 mt-4">
                    {loading ? 'Processando...' : '💾 REGISTRAR TROCA'}
                </button>
            </div>
        </div>
    );
}

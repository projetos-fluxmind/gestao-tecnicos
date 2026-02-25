"use client";

import React, { useState } from 'react';
import { Hash, Camera } from 'lucide-react';
import { createOdometerReading } from '@/app/actions/odometer';

export function HodometroForm({ motos, techs }: { motos: any[], techs: any[] }) {
    const [motoId, setMotoId] = useState("");
    const [tecnicoId, setTecnicoId] = useState("");
    const [km, setKm] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    const selectedMoto = motos.find((m: any) => m.id.toString() === motoId);

    async function handleSubmit() {
        if (!motoId || !tecnicoId || !km) {
            setMsg({ type: 'error', text: 'Preencha placa, técnico e KM.' });
            return;
        }

        setLoading(true);
        setMsg({ type: '', text: '' });

        const formData = new FormData();
        formData.append("motoId", motoId);
        formData.append("tecnicoId", tecnicoId);
        formData.append("km", km);
        formData.append("tipo", "outro"); // padrão por enquanto

        const res = await createOdometerReading(formData);

        if (res?.success) {
            setMsg({ type: 'success', text: 'KM registrado!' });
            setMotoId("");
            setKm("");
        } else {
            setMsg({ type: 'error', text: res?.error || 'Erro ao salvar.' });
        }
        setLoading(false);
    }

    return (
        <div className="lg:col-span-1 glass p-8 rounded-2xl h-fit border-t-2 border-brand-cyan/30">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-brand-cyan/10 rounded-2xl text-brand-cyan">
                    <Hash size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold">Novo Lançamento</h3>
                    <p className="text-xs text-foreground/40">Insira a leitura atual do painel.</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest pl-1">Identificar Moto</label>
                    <select
                        value={motoId}
                        onChange={(e) => setMotoId(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-4 outline-none focus:border-brand-cyan/40 transition-all appearance-none"
                    >
                        <option value="">Selecione uma moto...</option>
                        {motos.map(m => (
                            <option key={m.id} value={m.id}>{m.placa} - {m.modelo}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest pl-1">Identificar Técnico</label>
                    <select
                        value={tecnicoId}
                        onChange={(e) => setTecnicoId(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-4 outline-none focus:border-brand-cyan/40 transition-all appearance-none"
                    >
                        <option value="">Selecione o responsável...</option>
                        {techs.map(t => (
                            <option key={t.id} value={t.id}>{t.nome}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest pl-1">
                            Leitura do Hodômetro (km)
                            {selectedMoto && <span className="ml-2 text-brand-cyan border border-brand-cyan/30 px-2 py-0.5 rounded-md">Último: {selectedMoto.hodometro_atual}km</span>}
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            placeholder="0.0"
                            value={km}
                            onChange={(e) => setKm(e.target.value)}
                            className="w-full bg-black/20 border border-white/5 rounded-2xl px-6 py-5 text-3xl font-mono font-bold text-brand-cyan focus:border-brand-cyan/40 transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest pl-1">Comprovante Visual</label>
                    <button className="w-full flex items-center justify-center gap-3 py-6 border-2 border-dashed border-white/10 rounded-2xl hover:border-brand-cyan/30 hover:bg-white/5 transition-all group">
                        <Camera size={24} className="text-foreground/20 group-hover:text-brand-cyan" />
                        <span className="text-sm font-medium text-foreground/40 group-hover:text-foreground">Tirar foto do painel</span>
                    </button>
                </div>

                {msg.text && (
                    <div className={`p-4 rounded-xl text-center font-bold text-sm ${msg.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-brand-emerald/10 text-brand-emerald'}`}>
                        {msg.text}
                    </div>
                )}

                <button
                    disabled={loading}
                    onClick={handleSubmit}
                    className="w-full py-5 bg-brand-cyan text-black font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_-10px_rgba(6,208,249,0.3)] disabled:opacity-50"
                >
                    {loading ? 'Salvando...' : 'CONFIRMAR LEITURA'}
                </button>
            </div>
        </div>
    );
}

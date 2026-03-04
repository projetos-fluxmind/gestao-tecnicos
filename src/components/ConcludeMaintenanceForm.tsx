"use client";

import React, { useState } from 'react';
import { CheckCircle2, X, DollarSign, PenTool, Layers, Loader2 } from 'lucide-react';
import { concludeMaintenance } from '@/app/actions/maintenance';

type Props = {
    maintenanceId: number;
    placa: string;
};

export function ConcludeMaintenanceForm({ maintenanceId, placa }: Props) {
    const [open, setOpen] = useState(false);
    const [valor, setValor] = useState("");
    const [servicos, setServicos] = useState("");
    const [pecas, setPecas] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    async function handleConclude() {
        if (!valor || !servicos) {
            setMsg("Preencha o valor e os serviços realizados.");
            return;
        }

        setLoading(true);
        const res = await concludeMaintenance(maintenanceId, {
            valor_total: Number(valor),
            servicos,
            pecas
        });

        if (res.success) {
            setMsg("Manutenção finalizada!");
            setTimeout(() => setOpen(false), 1500);
        } else {
            setMsg("Erro ao finalizar.");
        }
        setLoading(false);
    }

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20 rounded-lg hover:bg-brand-emerald hover:text-black transition-all text-xs font-bold uppercase"
            >
                <CheckCircle2 size={14} />
                Finalizar
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass p-8 rounded-[2rem] w-full max-w-lg relative border-brand-emerald/20 animate-in zoom-in-95">
                <button onClick={() => setOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full">
                    <X size={20} className="text-foreground/40" />
                </button>

                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="text-brand-emerald" size={24} />
                    Finalizar Manutenção
                </h3>
                <p className="text-sm text-foreground/40 mb-6 uppercase tracking-widest font-bold">Veículo: {placa}</p>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest px-2">Valor Total (R$)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-emerald/40" size={16} />
                            <input
                                type="number"
                                value={valor}
                                onChange={e => setValor(e.target.value)}
                                placeholder="0,00"
                                className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl outline-none focus:border-brand-emerald/40 text-sm font-mono"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest px-2">Serviços Realizados</label>
                        <textarea
                            value={servicos}
                            onChange={e => setServicos(e.target.value)}
                            placeholder="Descreva o que foi feito..."
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl outline-none focus:border-brand-emerald/40 text-sm min-h-[80px]"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest px-2">Peças Trocadas (Opcional)</label>
                        <input
                            type="text"
                            value={pecas}
                            onChange={e => setPecas(e.target.value)}
                            placeholder="Ex: Filtro de óleo, Pastilhas..."
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl outline-none focus:border-brand-emerald/40 text-sm"
                        />
                    </div>

                    <button
                        onClick={handleConclude}
                        disabled={loading}
                        className="w-full py-4 bg-brand-emerald text-black font-black rounded-xl hover:opacity-90 transition-all shadow-[0_0_20px_#00ffa333] disabled:opacity-30 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : "CONCLUIR E ABATER SALDO"}
                    </button>

                    {msg && <p className={`text-center text-xs font-bold ${msg.includes('sucesso') || msg.includes('finalizada') ? 'text-brand-emerald' : 'text-brand-orange'} animate-pulse`}>{msg}</p>}
                </div>
            </div>
        </div>
    );
}

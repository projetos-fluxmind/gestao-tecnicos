"use client";

import React, { useState } from 'react';
import { CreditCard, ArrowRight, ArrowDownRight, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { reloadCard, fundCompanyWallet } from '@/app/actions/expenses';

export function CardManagement({ techs, companyWallet }: { techs: any[], companyWallet: any }) {
    const [selectedTech, setSelectedTech] = useState<any>(null);
    const [reloadAmount, setReloadAmount] = useState("");
    const [fundingAmount, setFundingAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTech || !reloadAmount) return;
        setLoading(true);
        const ok = await reloadCard(selectedTech.id, Number(reloadAmount));
        if (ok) {
            setReloadAmount("");
            setSelectedTech(null);
            alert("Transferência realizada com sucesso!");
        } else {
            alert("Erro na recarga.");
        }
        setLoading(false);
    };

    const handleFundWallet = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await fundCompanyWallet(Number(fundingAmount));
        setFundingAmount("");
        setLoading(false);
    };

    const totalDistributed = techs.reduce((acc, t) => acc + Number(t.saldo_atual), 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Master Company Wallet */}
            <div className="glass p-8 rounded-3xl border border-brand-cyan/20 shadow-[0_0_30px_#06d0f910] flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-brand-cyan/20 text-brand-cyan rounded-xl">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className="font-bold flex flex-col">
                                <span className="text-white text-lg">Caixa Mestre</span>
                                <span className="text-[10px] text-brand-cyan uppercase tracking-widest">Conta Corporativa</span>
                            </h3>
                        </div>
                    </div>

                    <div className="space-y-1 mb-8">
                        <p className="text-[10px] text-foreground/40 font-bold tracking-widest uppercase">Saldo Disponível para Repasse</p>
                        <p className="text-4xl font-black font-mono text-white">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(companyWallet?.saldo_geral || 0))}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleFundWallet} className="flex gap-2">
                    <input
                        type="number" step="0.01" inputMode="decimal" required value={fundingAmount} onChange={e => setFundingAmount(e.target.value)}
                        placeholder="Injetar fundos (R$)"
                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 text-xs font-mono outline-none focus:border-brand-cyan/40"
                    />
                    <button disabled={loading} className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all">
                        <ArrowDownRight size={18} />
                    </button>
                </form>
            </div>

            {/* Repasse para Técnicos */}
            <div className="lg:col-span-2 glass p-8 rounded-3xl border border-white/5">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-brand-emerald/10 text-brand-emerald rounded-xl">
                        <RefreshCw size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Repasse para Técnicos</h3>
                        <p className="text-[10px] text-foreground/40 uppercase tracking-widest">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalDistributed)} distribuídos atualmente</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                        {techs.map(t => (
                            <div
                                key={t.id}
                                onClick={() => setSelectedTech(t)}
                                className={`p-4 rounded-xl cursor-pointer transition-all border flex justify-between items-center ${selectedTech?.id === t.id ? 'border-brand-cyan bg-brand-cyan/5' : 'border-white/5 hover:border-white/20 bg-black/20'}`}
                            >
                                <div>
                                    <p className="font-bold text-sm tracking-wide">{t.nome}</p>
                                    <p className="text-[10px] text-foreground/40 uppercase tracking-widest mt-1">Saldo Atual</p>
                                </div>
                                <p className={`font-mono font-bold ${Number(t.saldo_atual) < 50 ? 'text-brand-orange' : 'text-brand-emerald'}`}>
                                    R$ {Number(t.saldo_atual).toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-black/30 p-6 rounded-2xl border border-white/5 flex flex-col justify-center">
                        {selectedTech ? (
                            <form onSubmit={handleReload} className="space-y-4">
                                <div>
                                    <p className="text-[10px] text-brand-cyan font-bold tracking-widest uppercase mb-1">Tecnico Selecionado</p>
                                    <p className="font-bold text-lg">{selectedTech.nome}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1 block">Valor da Transferência (R$)</label>
                                    <input
                                        type="number" step="0.01" inputMode="decimal" required value={reloadAmount} onChange={e => setReloadAmount(e.target.value)}
                                        className="w-full bg-black/60 border border-brand-cyan/20 rounded-xl p-3 font-mono text-lg focus:border-brand-cyan outline-none transition-all shadow-inner"
                                        placeholder="0.00"
                                    />
                                </div>
                                <button disabled={loading} className="w-full py-3 bg-brand-cyan text-black font-black tracking-widest text-[10px] rounded-xl flex justify-center items-center gap-2 hover:scale-[1.02] transition-all shadow-[0_0_15px_#06d0f940]">
                                    {loading ? 'PROCESSANDO...' : 'CONFIRMAR TRANSFERÊNCIA'} <ArrowRight size={14} />
                                </button>
                            </form>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center text-foreground/30 space-y-3 h-full">
                                <CreditCard size={32} className="opacity-20" />
                                <p className="text-sm font-medium">Selecione um técnico ao lado para realizar recargas sistêmicas.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}

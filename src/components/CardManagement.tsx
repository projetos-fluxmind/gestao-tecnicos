"use client";

import React, { useState } from 'react';
import { CreditCard, Plus, ArrowUpRight, ArrowDownRight, Loader2, DollarSign, Users } from 'lucide-react';
import { reloadCard, reloadMonthlyBalance, reloadAllMonthlyBalances, fundCompanyWallet } from '@/app/actions/expenses';

type CardManagementProps = {
    techs: any[];
    companyWallet: { saldo_geral: number };
};

export function CardManagement({ techs, companyWallet }: CardManagementProps) {
    const [selectedTechId, setSelectedTechId] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [loadingMonthly, setLoadingMonthly] = useState(false);
    const [funding, setFunding] = useState(false);

    const selectedTech = techs.find(t => t.id === Number(selectedTechId));

    async function handleReload() {
        if (!selectedTechId || !amount || Number(amount) <= 0) {
            setMsg("Preencha todos os campos corretamente.");
            return;
        }

        setLoading(true);
        setMsg("");

        try {
            const result = await reloadCard({
                tecnicoId: selectedTechId === 'todos' ? 'todos' : Number(selectedTechId),
                valor: Number(amount),
                descricao: description || "Carga de saldo no cartão"
            });

            if (result.success) {
                setMsg(selectedTechId === 'todos' ? "Saldo adicionado para todos os técnicos com sucesso!" : "Saldo adicionado com sucesso!");
                setAmount("");
                setDescription("");
            } else {
                setMsg("Erro ao adicionar saldo.");
            }
        } catch (error) {
            setMsg("Erro de conexão.");
        } finally {
            setLoading(false);
        }
    }

    async function handleFundCompanyWallet() {
        if (!amount || Number(amount) <= 0) {
            setMsg("Insira um valor válido para injetar no caixa geral.");
            return;
        }

        setFunding(true);
        setMsg("");

        try {
            const result = await fundCompanyWallet(Number(amount));
            if (result.success) {
                setMsg("Caixa mestre atualizado com sucesso!");
                setAmount("");
                setDescription("");
            } else {
                setMsg(result.error || "Erro ao depositar.");
            }
        } catch (error) {
            setMsg("Erro de conexão.");
        } finally {
            setFunding(false);
        }
    }

    async function handleMonthlyReload() {
        if (!selectedTechId) return;

        setLoadingMonthly(true);
        setMsg("");

        try {
            if (selectedTechId === 'todos') {
                const result = await reloadAllMonthlyBalances();
                if (result.success) {
                    setMsg(`Atenção: Limite mensal renovado para ${result.count} técnicos!`);
                } else {
                    setMsg(result.error || "Erro ao renovar limite em massa.");
                }
            } else {
                const result = await reloadMonthlyBalance(Number(selectedTechId));
                if (result.success) {
                    setMsg("Atenção: Limite do cartão renovado para o teto total!");
                } else {
                    setMsg(result.error || "Erro ao renovar limite mensal.");
                }
            }
            setAmount("");
            setDescription("");
        } catch (error) {
            setMsg("Erro de conexão.");
        } finally {
            setLoadingMonthly(false);
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Balance View */}
            <div className="lg:col-span-2 glass p-8 rounded-[2rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <CreditCard size={120} />
                </div>

                <div className="relative z-10 space-y-6">
                    <div>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <CreditCard className="text-brand-cyan" size={24} />
                            Gestão de Saldos Online
                        </h3>
                        <p className="text-sm text-foreground/40">Controle de recarga e saldo disponível por técnico.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <select
                            value={selectedTechId}
                            onChange={(e) => {
                                setSelectedTechId(e.target.value);
                                setMsg("");
                            }}
                            className="bg-black/30 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-brand-cyan/40 text-sm"
                        >
                            <option value="">Selecione um Técnico...</option>
                            <option value="caixa_master" className="font-bold text-brand-emerald">💰 Caixa Geral / Adicionar Fundo Mestre</option>
                            <option value="todos" className="font-bold text-brand-cyan">Todos os Técnicos (Em Massa)</option>
                            {techs.map(t => (
                                <option key={t.id} value={t.id}>{t.nome}</option>
                            ))}
                        </select>

                        <div className="p-4 bg-brand-cyan/10 rounded-xl border border-brand-cyan/20 flex flex-col justify-center">
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] font-bold text-brand-cyan uppercase tracking-widest">
                                    {selectedTechId === 'todos' ? 'Saldo Global Técnicos' : selectedTechId === 'caixa_master' ? 'Fundo Caixa Empresa' : 'Saldo Atual'}
                                </p>
                                <p className="text-[10px] opacity-50 bg-brand-emerald/10 text-brand-emerald px-2 py-0.5 rounded-full border border-brand-emerald/20 font-bold">
                                    CAIXA: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(companyWallet?.saldo_geral || 0)}
                                </p>
                            </div>
                            <p className="text-2xl font-black font-mono">
                                {selectedTechId === 'caixa_master'
                                    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(companyWallet?.saldo_geral || 0)
                                    : selectedTechId === 'todos'
                                        ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(techs.reduce((sum, t) => sum + Number(t.saldo_atual || 0), 0))
                                        : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(selectedTech?.saldo_atual || 0))
                                }
                            </p>
                            {!selectedTechId && (
                                <p className="text-[10px] text-foreground/30 mt-1">Selecione um técnico para ver o saldo individual</p>
                            )}
                        </div>
                    </div>

                    {(selectedTech || selectedTechId === 'todos') && (
                        <div className="animate-in fade-in slide-in-from-left-4 space-y-4">
                            {selectedTech && (
                                <div className="flex items-center gap-4 p-4 glass rounded-2xl bg-white/2">
                                    <div className="p-3 bg-brand-emerald/20 text-brand-emerald rounded-lg">
                                        <ArrowUpRight size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-foreground/60">Cartão Corporativo</p>
                                        <p className="text-sm font-mono text-foreground/40">{selectedTech.cartao_corporativo_numero || 'Nenhum cartão vinculado'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest">Limite Total</p>
                                        <p className="text-sm font-bold text-foreground/60">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(selectedTech.cartao_corporativo_limite || 0))}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {selectedTechId === 'todos' && (
                                <div className="flex items-center gap-4 p-4 glass rounded-2xl bg-brand-cyan/5 border border-brand-cyan/10">
                                    <div className="p-3 bg-brand-cyan/20 text-brand-cyan rounded-lg">
                                        <Users size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-brand-cyan">Ação em Massa</p>
                                        <p className="text-sm text-foreground/60">A próxima ação será aplicada a todos os técnicos com cartão.</p>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleMonthlyReload}
                                disabled={loadingMonthly || (selectedTech && !selectedTech.cartao_corporativo_limite)}
                                className="w-full py-3 bg-brand-orange/10 hover:bg-brand-orange/20 text-brand-orange font-bold text-xs tracking-widest rounded-xl transition-all disabled:opacity-30 border border-brand-orange/20 flex items-center justify-center gap-2"
                            >
                                {loadingMonthly ? <Loader2 size={16} className="animate-spin" /> : "RENOVAR LIMITE MENSAL AUTOMATICAMENTE"}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Reload Form */}
            <div className="glass p-8 rounded-[2rem] border-brand-cyan/20 bg-brand-cyan/5">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Plus className="text-brand-cyan" size={20} />
                    Adicionar Saldo
                </h3>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest px-2">Valor da Recarga</label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-cyan/40" size={16} />
                            <input
                                type="number"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                placeholder="0,00"
                                className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl outline-none focus:border-brand-cyan/40 text-sm font-mono"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest px-2">Descrição (Opcional)</label>
                        <input
                            type="text"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Ex: Adiantamento viagem..."
                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl outline-none focus:border-brand-cyan/40 text-sm"
                        />
                    </div>

                    <button
                        onClick={selectedTechId === 'caixa_master' ? handleFundCompanyWallet : handleReload}
                        disabled={(loading || funding) || !selectedTechId}
                        className={`w-full py-4 font-black rounded-xl hover:opacity-90 transition-all disabled:opacity-30 flex items-center justify-center gap-2 ${selectedTechId === 'caixa_master' ? 'bg-brand-emerald text-black shadow-[0_0_20px_#10b98133]' : 'bg-brand-cyan text-black shadow-[0_0_20px_#06d0f933]'}`}
                    >
                        {loading || funding ? <Loader2 size={20} className="animate-spin" /> : selectedTechId === 'caixa_master' ? 'INJETAR FUNDO NO CAIXA MESTRE' : 'CARREGAR CARTÃO'}
                    </button>

                    {msg && <p className={`text-center text-xs font-bold p-2 bg-black/40 border rounded-lg ${msg.includes('sucesso') || msg.includes('atualizado') ? 'text-brand-emerald border-brand-emerald/20' : 'text-brand-orange border-brand-orange/20'}`}>{msg}</p>}
                </div>
            </div>
        </div>
    );
}

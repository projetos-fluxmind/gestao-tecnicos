"use client";

import React, { useState } from 'react';
import { Edit, X, Activity, Loader2, Save } from 'lucide-react';
import { createServiceLog } from '@/app/actions/services';
import { useRouter } from 'next/navigation';

export function EditOperacaoModal({ log, techs }: { log: any, techs: any[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [tecnicoId, setTecnicoId] = useState(log.tecnicoId.toString());
    const [data, setData] = useState(new Date(log.data).toISOString().split('T')[0]);
    const [instalacoes, setInstalacoes] = useState(log.instalacoes.toString());
    const [manutencoesComTroca, setManutencoesComTroca] = useState(log.manutencoes_com_troca.toString());
    const [manutencoesSemTroca, setManutencoesSemTroca] = useState(log.manutencoes_sem_troca.toString());
    const [retiradas, setRetiradas] = useState(log.retiradas.toString());
    const [observacoes, setObservacoes] = useState(log.observacoes || "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const ok = await createServiceLog({
            tecnicoId: Number(tecnicoId),
            data,
            instalacoes: Number(instalacoes) || 0,
            manutencoes_com_troca: Number(manutencoesComTroca) || 0,
            manutencoes_sem_troca: Number(manutencoesSemTroca) || 0,
            retiradas: Number(retiradas) || 0,
            observacoes
        });

        if (ok.success) {
            setIsOpen(false);
            router.refresh();
        } else {
            alert("Erro ao editar os serviços.");
        }
        setLoading(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 bg-brand-cyan/10 text-brand-cyan hover:bg-brand-cyan hover:text-black rounded-lg transition-colors"
                title="Editar Apontamento"
            >
                <Edit size={16} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in" onClick={() => setIsOpen(false)}>
                    <div className="glass w-full max-w-xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 p-2 text-foreground/40 hover:text-white bg-black/30 rounded-full z-10 transition-colors">
                            <X size={18} />
                        </button>

                        <div className="p-8 border-b border-white/5 bg-gradient-to-r from-brand-cyan/10 to-transparent">
                            <div className="w-12 h-12 rounded-2xl bg-brand-cyan/20 flex items-center justify-center text-brand-cyan mb-4">
                                <Activity size={24} />
                            </div>
                            <h3 className="text-2xl font-bold">Editar Apontamento</h3>
                            <p className="text-sm opacity-60 mt-1">Alterar os registros estruturais lançados.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest pl-1 mb-1 block">Técnico Responsável</label>
                                    <select disabled required value={tecnicoId} onChange={e => setTecnicoId(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-brand-cyan/40 outline-none opacity-50 cursor-not-allowed">
                                        <option value="">Selecione...</option>
                                        {techs.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                                    </select>
                                    <p className="text-[10px] text-brand-cyan/50 mt-1 ml-1 px-1">O técnico não pode ser alterado. (Delete o registro se houver erro)</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest pl-1 mb-1 block">Data de Execução</label>
                                    <input disabled type="date" required value={data} onChange={e => setData(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-brand-cyan/40 outline-none opacity-50 cursor-not-allowed" />
                                    <p className="text-[10px] text-brand-cyan/50 mt-1 ml-1 px-1">A data não pode ser alterada. (Delete o registro se houver erro)</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 bg-black/20 p-6 rounded-2xl border border-white/5">
                                <div>
                                    <label className="text-[10px] font-bold text-brand-cyan uppercase tracking-widest pl-1 mb-1 block">Instalações</label>
                                    <input type="number" min="0" required value={instalacoes} onChange={e => setInstalacoes(e.target.value)} className="w-full bg-black/40 border border-brand-cyan/20 rounded-xl p-3 text-center text-lg font-mono focus:border-brand-cyan outline-none" onFocus={e => e.target.select()} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-brand-emerald uppercase tracking-widest pl-1 mb-1 block">Retiradas</label>
                                    <input type="number" min="0" required value={retiradas} onChange={e => setRetiradas(e.target.value)} className="w-full bg-black/40 border border-brand-emerald/20 rounded-xl p-3 text-center text-lg font-mono focus:border-brand-emerald outline-none" onFocus={e => e.target.select()} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-brand-orange uppercase tracking-widest pl-1 mb-1 block">Manut. com Troca</label>
                                    <input type="number" min="0" required value={manutencoesComTroca} onChange={e => setManutencoesComTroca(e.target.value)} className="w-full bg-black/40 border border-brand-orange/20 rounded-xl p-3 text-center text-lg font-mono focus:border-brand-orange outline-none" onFocus={e => e.target.select()} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-white uppercase tracking-widest pl-1 mb-1 block">Manut. sem Troca</label>
                                    <input type="number" min="0" required value={manutencoesSemTroca} onChange={e => setManutencoesSemTroca(e.target.value)} className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-center text-lg font-mono focus:border-white outline-none" onFocus={e => e.target.select()} />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest pl-1 mb-1 block">Observações do Fecho (Opç)</label>
                                <textarea placeholder="Anotações gerais do supervisor para esse dia..." value={observacoes} onChange={e => setObservacoes(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-brand-cyan/40 outline-none resize-none" rows={2}></textarea>
                            </div>

                            <button disabled={loading} type="submit" className="w-full py-4 bg-brand-cyan text-black font-black tracking-widest text-xs rounded-xl shadow-[0_0_15px_#06d0f940] hover:scale-[1.02] transition-all flex justify-center items-center gap-2">
                                {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                {loading ? 'SALVANDO...' : 'ATUALIZAR DADOS'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

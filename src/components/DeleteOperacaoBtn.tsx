"use client";

import React, { useState } from 'react';
import { Trash2, Loader2, AlertTriangle, X } from 'lucide-react';
import { deleteServiceLog } from '@/app/actions/services';
import { useRouter } from 'next/navigation';

export function DeleteOperacaoBtn({ id }: { id: number }) {
    const [loading, setLoading] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setLoading(true);
        const ok = await deleteServiceLog(id);
        if (ok.success) {
            router.refresh();
        } else {
            alert("Erro ao remover registro.");
        }
        setConfirm(false);
        setLoading(false);
    };

    if (confirm) {
        return (
            <div className="fixed inset-0 z-[99] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-[#111] border border-red-500/20 max-w-sm w-full rounded-2xl p-6 shadow-2xl relative">
                    <button onClick={() => setConfirm(false)} className="absolute top-4 right-4 text-foreground/40 hover:text-white"><X size={16} /></button>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
                            <AlertTriangle size={24} />
                        </div>
                        <h4 className="text-xl font-bold mb-2">Excluir Apontamento?</h4>
                        <p className="text-sm text-foreground/60 mb-6">Tem certeza? Isso apagará este registro e o volume do técnico no dia. A ação é irreversível.</p>
                        <div className="grid grid-cols-2 gap-3 w-full">
                            <button onClick={() => setConfirm(false)} className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-bold transition-colors">Cancelar</button>
                            <button disabled={loading} onClick={handleDelete} className="px-4 py-3 rounded-xl bg-red-500 text-white text-sm font-bold shadow-[0_0_15px_#ef444440] hover:bg-red-600 transition-colors flex justify-center items-center">
                                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Excluir'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <button
            onClick={() => setConfirm(true)}
            className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
            title="Excluir Registro"
        >
            <Trash2 size={16} />
        </button>
    );
}

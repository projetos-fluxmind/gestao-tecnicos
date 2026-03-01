import React from 'react';
import { UserPlus, ChevronLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { createTechnician } from '../../actions/technicians';
import { redirect } from 'next/navigation';

export default function NovoTecnico() {
    async function action(formData: FormData) {
        "use server";
        const res = await createTechnician(formData);
        if (res.success) {
            redirect('/equipe');
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex items-center gap-4">
                <Link href="/equipe" className="p-2 hover:bg-white/5 rounded-xl transition-all text-foreground/50 hover:text-brand-cyan">
                    <ChevronLeft size={24} />
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Novo Colaborador</h2>
                    <p className="text-foreground/50">Adicione um novo técnico à base de dados.</p>
                </div>
            </header>

            <form action={action} className="glass p-8 rounded-[2rem] border border-white/5 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">Nome Completo</label>
                        <input
                            name="nome"
                            required
                            placeholder="Ex: João da Silva"
                            className="w-full bg-black/40 border border-white/5 focus:border-brand-cyan/30 rounded-2xl p-4 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">Matrícula</label>
                        <input
                            name="matricula"
                            required
                            placeholder="MAT-0000"
                            className="w-full bg-black/40 border border-white/5 focus:border-brand-cyan/30 rounded-2xl p-4 outline-none transition-all font-mono"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">Telefone</label>
                        <input
                            name="telefone"
                            required
                            placeholder="(00) 00000-0000"
                            className="w-full bg-black/40 border border-white/5 focus:border-brand-cyan/30 rounded-2xl p-4 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">Região de Atuação</label>
                        <input
                            name="regiao"
                            required
                            placeholder="Ex: São Paulo - Zona Sul"
                            className="w-full bg-black/40 border border-white/5 focus:border-brand-cyan/30 rounded-2xl p-4 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button type="submit" className="w-full py-4 bg-brand-cyan text-black font-bold rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_#06d0f933]">
                        <Save size={20} />
                        CADASTRAR TÉCNICO
                    </button>
                </div>
            </form>
        </div>
    );
}

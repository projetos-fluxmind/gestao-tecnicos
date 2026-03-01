import React from 'react';
import { ChevronLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTechnicianById, updateTechnician } from '../../../actions/technicians';
import { notFound } from 'next/navigation';
import { ProfilePhotoUploader } from '@/components/ProfilePhotoUploader';

export default async function EditarTecnicoPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const technicianId = parseInt(id, 10);

    if (isNaN(technicianId)) {
        notFound();
    }

    const tech: any = await getTechnicianById(technicianId);

    if (!tech) {
        notFound();
    }

    const birthDateValue =
        tech.data_nascimento instanceof Date
            ? tech.data_nascimento.toISOString().substring(0, 10)
            : tech.data_nascimento
                ? new Date(tech.data_nascimento).toISOString().substring(0, 10)
                : '';

    async function action(formData: FormData) {
        "use server";
        const res = await updateTechnician(technicianId, formData);
        if (res.success) {
            redirect(`/equipe/${technicianId}`);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex items-center gap-4">
                <Link href={`/equipe/${technicianId}`} className="p-2 hover:bg-white/5 rounded-xl transition-all text-foreground/50 hover:text-brand-cyan">
                    <ChevronLeft size={24} />
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Editar Colaborador</h2>
                    <p className="text-foreground/50">Atualize os dados do técnico.</p>
                </div>
            </header>

            <form action={action} className="glass p-8 rounded-[2rem] border border-white/5 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-1">Nome Completo</label>
                        <input
                            name="nome"
                            required
                            defaultValue={tech.nome ?? ''}
                            className="w-full bg-black/40 border border-white/5 focus:border-brand-cyan/30 rounded-2xl p-4 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-1">Matrícula</label>
                        <input
                            name="matricula"
                            required
                            defaultValue={tech.matricula ?? ''}
                            className="w-full bg-black/40 border border-white/5 focus:border-brand-cyan/30 rounded-2xl p-4 outline-none transition-all font-mono"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-1">Telefone</label>
                        <input
                            name="telefone"
                            required
                            defaultValue={tech.telefone ?? ''}
                            className="w-full bg-black/40 border border-white/5 focus:border-brand-cyan/30 rounded-2xl p-4 outline-none transition-all"
                        />
                    </div>

                    <ProfilePhotoUploader name="foto_perfil" initialUrl={tech.foto_perfil ?? ''} />

                    {/* Documentos */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-1">CPF ou RG</label>
                        <input
                            name="cpf_rg"
                            required
                            defaultValue={tech.cpf_rg ?? ''}
                            className="w-full bg-black/40 border border-white/5 focus:border-brand-cyan/30 rounded-2xl p-4 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-1">CNH (Categoria A)</label>
                        <input
                            name="cnh"
                            required
                            defaultValue={tech.cnh ?? ''}
                            className="w-full bg-black/40 border border-white/5 focus:border-brand-cyan/30 rounded-2xl p-4 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-1">Data de Nascimento (Dia/Mês/Ano)</label>
                        <input
                            name="data_nascimento"
                            type="date"
                            required
                            defaultValue={birthDateValue}
                            className="w-full bg-black/40 border border-white/5 focus:border-brand-cyan/30 rounded-2xl p-4 outline-none transition-all text-foreground/80 focus:text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-1">Cidade de Atuação</label>
                        <input
                            name="cidade_atuacao"
                            required
                            defaultValue={tech.cidade_atuacao ?? ''}
                            className="w-full bg-black/40 border border-white/5 focus:border-brand-cyan/30 rounded-2xl p-4 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-1">Residência (Endereço Completo)</label>
                        <input
                            name="residencia"
                            required
                            defaultValue={tech.residencia ?? ''}
                            className="w-full bg-black/40 border border-white/5 focus:border-brand-cyan/30 rounded-2xl p-4 outline-none transition-all"
                        />
                    </div>

                    {/* Fardamentos */}
                    <div className="md:col-span-2 mt-4 mb-2">
                        <h4 className="text-sm font-bold text-foreground/80 border-b border-white/5 pb-2">Informações de Fardamento / EPI</h4>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-1">Camisa (P a XG)</label>
                        <select
                            name="tamanho_camisa"
                            required
                            defaultValue={tech.tamanho_camisa ?? ''}
                            className="w-full bg-black/40 border border-white/5 focus:border-brand-cyan/30 rounded-2xl p-4 outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option value="">Selecione o Tamanho...</option>
                            <option value="P">P</option>
                            <option value="M">M</option>
                            <option value="G">G</option>
                            <option value="GG">GG</option>
                            <option value="XG">XG</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-1">Calça (Numeração)</label>
                        <select
                            name="tamanho_calca"
                            required
                            defaultValue={tech.tamanho_calca ?? ''}
                            className="w-full bg-black/40 border border-white/5 focus:border-brand-cyan/30 rounded-2xl p-4 outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option value="">Selecione a Numeração...</option>
                            <option value="36">36</option>
                            <option value="38">38</option>
                            <option value="40">40</option>
                            <option value="42">42</option>
                            <option value="44">44</option>
                            <option value="46">46</option>
                            <option value="48">48</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-1">Bota (Numeração)</label>
                        <select
                            name="tamanho_bota"
                            required
                            defaultValue={tech.tamanho_bota ?? ''}
                            className="w-full bg-black/40 border border-white/5 focus:border-brand-cyan/30 rounded-2xl p-4 outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option value="">Selecione a Numeração...</option>
                            <option value="38">38</option>
                            <option value="39">39</option>
                            <option value="40">40</option>
                            <option value="41">41</option>
                            <option value="42">42</option>
                            <option value="43">43</option>
                            <option value="44">44</option>
                            <option value="45">45</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-1">Capacete (Numeração)</label>
                        <select
                            name="tamanho_capacete"
                            required
                            defaultValue={tech.tamanho_capacete ?? ''}
                            className="w-full bg-black/40 border border-white/5 focus:border-brand-cyan/30 rounded-2xl p-4 outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option value="">Selecione a Numeração...</option>
                            <option value="56">56</option>
                            <option value="58">58</option>
                            <option value="60">60</option>
                            <option value="62">62</option>
                            <option value="64">64</option>
                        </select>
                    </div>

                    <input type="hidden" name="regiao" value={tech.regiao_atuacao ?? "—"} />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full py-4 bg-brand-cyan text-black font-bold rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_#06d0f933]"
                    >
                        <Save size={20} />
                        SALVAR ALTERAÇÕES
                    </button>
                </div>
            </form>
        </div>
    );
}


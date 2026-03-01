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
                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-1">Nome Completo</label>
                        <input
                            name="nome"
                            required
                            placeholder="Ex: João da Silva"
                            className="w-full bg-black/40 border border-white/5 focus:border-brand-cyan/30 rounded-2xl p-4 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-1">Matrícula</label>
                        <input
                            name="matricula"
                            required
                            placeholder="MAT-0000"
                            className="w-full bg-black/40 border border-white/5 focus:border-brand-cyan/30 rounded-2xl p-4 outline-none transition-all font-mono"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-1">Telefone</label>
                        <input
                            name="telefone"
                            required
                            placeholder="(00) 00000-0000"
                            className="w-full bg-black/40 border border-white/5 focus:border-brand-cyan/30 rounded-2xl p-4 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-1">Foto de Perfil (URL Opcional)</label>
                        <input
                            name="foto_perfil"
                            type="url"
                            placeholder="https://exemplo.com/foto.jpg"
                            className="w-full bg-black/40 border border-white/5 focus:border-brand-cyan/30 rounded-2xl p-4 outline-none transition-all"
                        />
                    </div>

                    {/* Documentos */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-1">CPF ou RG</label>
                        <input
                            name="cpf_rg"
                            required
                            placeholder="Ex: 123.456.789-00"
                            className="w-full bg-black/40 border border-white/5 focus:border-brand-cyan/30 rounded-2xl p-4 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-1">CNH (Categoria A)</label>
                        <input
                            name="cnh"
                            required
                            placeholder="Número da CNH"
                            className="w-full bg-black/40 border border-white/5 focus:border-brand-cyan/30 rounded-2xl p-4 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-1">Data de Nascimento (Dia/Mês/Ano)</label>
                        <input
                            name="data_nascimento"
                            type="date"
                            required
                            className="w-full bg-black/40 border border-white/5 focus:border-brand-cyan/30 rounded-2xl p-4 outline-none transition-all text-foreground/80 focus:text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-1">Cidade de Atuação</label>
                        <input
                            name="cidade_atuacao"
                            required
                            placeholder="Ex: São Paulo"
                            className="w-full bg-black/40 border border-white/5 focus:border-brand-cyan/30 rounded-2xl p-4 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-1">Residência (Endereço Completo)</label>
                        <input
                            name="residencia"
                            placeholder="Rua, Número, Bairro, CEP"
                            required
                            className="w-full bg-black/40 border border-white/5 focus:border-brand-cyan/30 rounded-2xl p-4 outline-none transition-all"
                        />
                    </div>

                    {/* Fardamentos */}
                    <div className="md:col-span-2 mt-4 mb-2">
                        <h4 className="text-sm font-bold text-foreground/80 border-b border-white/5 pb-2">Informações de Fardamento / EPI</h4>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-1">Camisa (P a XG)</label>
                        <select name="tamanho_camisa" required className="w-full bg-black/40 border border-white/5 focus:border-brand-cyan/30 rounded-2xl p-4 outline-none transition-all appearance-none cursor-pointer">
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
                        <select name="tamanho_calca" required className="w-full bg-black/40 border border-white/5 focus:border-brand-cyan/30 rounded-2xl p-4 outline-none transition-all appearance-none cursor-pointer">
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
                        <select name="tamanho_bota" required className="w-full bg-black/40 border border-white/5 focus:border-brand-cyan/30 rounded-2xl p-4 outline-none transition-all appearance-none cursor-pointer">
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
                        <select name="tamanho_capacete" required className="w-full bg-black/40 border border-white/5 focus:border-brand-cyan/30 rounded-2xl p-4 outline-none transition-all appearance-none cursor-pointer">
                            <option value="">Selecione a Numeração...</option>
                            <option value="56">56</option>
                            <option value="58">58</option>
                            <option value="60">60</option>
                            <option value="62">62</option>
                            <option value="64">64</option>
                        </select>
                    </div>

                    {/* Fallback hidden fields so the server doesn't complain about missing fields that we temporarily omitted but were in the old file (regiao is technically replaced by cidade, but we'll map it to the old one if needed, though we still keep it or map explicitly) */}
                    <input type="hidden" name="regiao" value="—" />

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

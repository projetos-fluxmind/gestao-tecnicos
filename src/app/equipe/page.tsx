import React from 'react';
import {
    UserPlus,
    Search,
    Bike,
    Phone,
    Mail,
    Star,
    TrendingUp,
    ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import { getTechnicians } from '../actions/technicians';

export default async function EquipePage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const params = await searchParams;
    const currentPage = Number(params.page) || 1;
    const { data: technicians, metadata } = await getTechnicians(currentPage, 6);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Gestão de Talentos</h2>
                    <p className="text-foreground/50">Administração de técnicos e performance de campo.</p>
                </div>
                <Link href="/equipe/novo" className="flex items-center gap-2 px-6 py-3 bg-brand-cyan text-black font-bold rounded-xl hover:opacity-90 transition-all shadow-[0_0_15px_#06d0f933]">
                    <UserPlus size={20} />
                    NOVO COLABORADOR
                </Link>
            </header>

            {/* Control Hub */}
            <div className="glass p-6 rounded-3xl flex flex-col md:flex-row gap-6 border border-white/5 bg-white/2">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-brand-cyan transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nome, matrícula ou unidade..."
                        className="w-full pl-12 pr-4 py-3.5 bg-black/30 border border-transparent focus:border-brand-cyan/30 rounded-2xl outline-none transition-all placeholder:text-foreground/20 text-sm"
                    />
                </div>
                <div className="flex gap-3">
                    <select className="px-6 py-3.5 bg-white/5 border border-white/5 rounded-2xl text-xs font-bold uppercase tracking-widest text-foreground/50 focus:border-brand-cyan/30 outline-none appearance-none cursor-pointer">
                        <option>Todas as Regiões</option>
                    </select>
                    <div className="flex p-1 bg-black/40 rounded-2xl">
                        <button className="px-5 py-2.5 bg-white/10 text-brand-cyan rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-sm">Grid</button>
                        <button className="px-5 py-2.5 text-foreground/20 hover:text-foreground rounded-xl text-[10px] font-bold uppercase tracking-widest">Lista</button>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {technicians.map((tech: any) => {
                    const currentMoto = tech.assignments?.find((a: any) => !a.data_fim)?.motorcycle;

                    return (
                        <div key={tech.id} className="glass rounded-[2rem] p-8 flex flex-col sm:flex-row gap-8 relative group border border-white/5 hover:border-brand-emerald/20 transition-all duration-500 overflow-hidden shadow-2xl bg-gradient-to-br from-white/2 to-transparent">

                            {/* Rating Badge */}
                            <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 bg-black/40 rounded-full border border-white/5 backdrop-blur-md">
                                <Star size={12} className="text-brand-orange fill-brand-orange" />
                                <span className="text-xs font-bold">5.0</span>
                            </div>

                            <div className="flex-shrink-0">
                                <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-brand-cyan/20 via-transparent to-brand-emerald/20 flex items-center justify-center border border-white/10 relative group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                                    <span className="text-3xl font-black text-white/80 tracking-tighter shadow-sm">{tech.nome.split(' ').map((n: string) => n[0]).join('')}</span>
                                    <div className="absolute inset-0 bg-brand-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    {/* Status Indicator */}
                                    <div className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-4 border-[#121212] ${tech.status === 'ativo' ? 'bg-brand-emerald' : 'bg-brand-orange'
                                        } shadow-[0_0_10px_rgba(13,242,128,0.5)]`} />
                                </div>
                            </div>

                            <div className="flex-1 space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold tracking-tight text-foreground/90">{tech.nome}</h3>
                                    <p className="text-[10px] font-bold text-brand-cyan/60 uppercase tracking-[0.2em] mt-1">{tech.matricula} • {tech.regiao_atuacao}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-black/20 rounded-2xl border border-white/5">
                                        <p className="text-[9px] font-bold text-foreground/20 uppercase tracking-widest mb-1 flex items-center gap-1">
                                            <Bike size={10} /> Ativo Vinculado
                                        </p>
                                        <p className="text-sm font-bold font-mono text-foreground/60">{currentMoto ? currentMoto.placa : 'Nenhum'}</p>
                                    </div>
                                    <div className="p-3 bg-black/20 rounded-2xl border border-white/5">
                                        <p className="text-[9px] font-bold text-foreground/20 uppercase tracking-widest mb-1 flex items-center gap-1">
                                            <TrendingUp size={10} /> Eficiência
                                        </p>
                                        <p className="text-sm font-bold text-brand-emerald">100%</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex gap-2">
                                        <button className="p-3 bg-white/5 rounded-xl text-foreground/40 hover:text-brand-cyan hover:bg-brand-cyan/10 transition-all border border-transparent hover:border-brand-cyan/20">
                                            <Phone size={18} />
                                        </button>
                                        <button className="p-3 bg-white/5 rounded-xl text-foreground/40 hover:text-brand-cyan hover:bg-brand-cyan/10 transition-all border border-transparent hover:border-brand-cyan/20">
                                            <Mail size={18} />
                                        </button>
                                    </div>
                                    <button className="flex items-center gap-2 px-5 py-2.5 bg-black/30 hover:bg-black/50 border border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all group/btn">
                                        Perfil Completo
                                        <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Empty slot for recruitment */}
                <Link href="/equipe/novo" className="border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center p-12 hover:bg-brand-cyan/5 hover:border-brand-cyan/20 transition-all cursor-pointer group gap-4 min-h-[300px]">
                    <UserPlus size={40} className="text-foreground/10 group-hover:text-brand-cyan group-hover:scale-110 transition-all" />
                    <div className="text-center">
                        <p className="font-bold text-foreground/30 group-hover:text-foreground">Recrutar Novo Técnico</p>
                        <p className="text-xs text-foreground/10">Adicionar à base de colaboradores</p>
                    </div>
                </Link>
            </div>

            {/* Pagination Controls */}
            {metadata.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <Link
                        href={`/equipe?page=${currentPage - 1}`}
                        className={`px-6 py-3 glass rounded-xl text-xs font-bold tracking-widest transition-all ${currentPage <= 1 ? 'opacity-10 pointer-events-none' : 'hover:bg-white/10 hover:border-brand-cyan/30'}`}
                    >
                        ANTERIOR
                    </Link>

                    <div className="flex items-center gap-3">
                        {Array.from({ length: metadata.totalPages }).map((_, i) => {
                            const pageNum = i + 1;
                            const isActive = currentPage === pageNum;
                            return (
                                <Link
                                    key={pageNum}
                                    href={`/equipe?page=${pageNum}`}
                                    className={`w-11 h-11 flex items-center justify-center rounded-xl text-xs font-bold transition-all border ${isActive
                                        ? 'bg-brand-cyan text-black border-brand-cyan shadow-[0_0_20px_#06d0f933]'
                                        : 'glass border-white/5 text-foreground/30 hover:text-foreground hover:border-white/20'}`}
                                >
                                    {pageNum}
                                </Link>
                            );
                        })}
                    </div>

                    <Link
                        href={`/equipe?page=${currentPage + 1}`}
                        className={`px-6 py-3 glass rounded-xl text-xs font-bold tracking-widest transition-all ${currentPage >= metadata.totalPages ? 'opacity-10 pointer-events-none' : 'hover:bg-white/10 hover:border-brand-cyan/30'}`}
                    >
                        PRÓXIMO
                    </Link>
                </div>
            )}
        </div>
    );
}

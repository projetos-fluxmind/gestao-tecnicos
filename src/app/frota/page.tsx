import React from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Bike,
    Gauge,
    Calendar,
    ArrowUpRight,
    Droplets
} from 'lucide-react';
import Link from 'next/link';
import { getMotorcycles } from '../actions/motorcycles';
import { getOilChanges } from '../actions/oil';

export default async function FrotaPage() {
    const [motos, oilChanges] = await Promise.all([
        getMotorcycles(),
        getOilChanges()
    ]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Gestão de Frota</h2>
                    <p className="text-foreground/50">Gerencie todas as motocicletas do ecossistema SGT.</p>
                </div>
                <Link href="/frota/novo" className="flex items-center gap-2 px-6 py-3 bg-brand-cyan text-black font-bold rounded-xl hover:opacity-90 transition-all shadow-[0_0_15px_#06d0f933]">
                    <Plus size={20} />
                    ADICIONAR VEÍCULO
                </Link>
            </header>

            {/* Filter Hub */}
            <div className="glass p-4 rounded-2xl flex flex-wrap gap-4 items-center border border-white/5 bg-white/2">
                <div className="flex-1 min-w-[300px] relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-brand-cyan transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por placa, modelo ou marca..."
                        className="w-full pl-12 pr-4 py-3 bg-black/20 border border-transparent focus:border-brand-cyan/30 rounded-xl outline-none transition-all placeholder:text-foreground/20 text-sm"
                    />
                </div>
                <div className="flex gap-2 p-1 bg-black/40 rounded-xl">
                    {['Todas', 'Ativas', 'Ocupadas', 'Manutenção'].map((f) => (
                        <button key={f} className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${f === 'Todas' ? 'bg-white/10 text-brand-cyan shadow-sm' : 'text-foreground/30 hover:text-foreground'}`}>
                            {f}
                        </button>
                    ))}
                </div>
                <button className="p-3 glass rounded-xl hover:bg-white/10 transition-all text-foreground/30 hover:text-brand-cyan">
                    <Filter size={20} />
                </button>
            </div>

            {/* Fleet Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {motos.map((moto: any) => {
                    const lastOil = oilChanges.find((oc: any) => oc.motoId === moto.id);
                    const kmSinceOil = lastOil ? Number(moto.hodometro_atual) - Number(lastOil.quilometragem) : Number(moto.hodometro_atual);
                    const oilProgress = Math.min((kmSinceOil / 900) * 100, 100);

                    return (
                        <div key={moto.id} className="glass rounded-3xl group relative overflow-hidden border border-white/5 hover:border-brand-cyan/20 transition-all duration-500 shadow-xl">
                            {/* Status bar */}
                            <div className={`absolute top-0 left-0 w-full h-1 ${moto.status === 'ativa' ? 'bg-brand-emerald' :
                                    moto.status === 'em_manutencao' ? 'bg-brand-orange animate-pulse' :
                                        moto.status === 'inativa' ? 'bg-red-500' : 'bg-brand-cyan'
                                } opacity-40`} />

                            <div className="p-8">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-black/30 flex items-center justify-center border border-white/5 group-hover:border-brand-cyan/40 transition-all relative overflow-hidden">
                                            <Bike size={28} className="text-brand-cyan/70 group-hover:text-brand-cyan group-hover:scale-110 transition-all" />
                                            <div className="absolute inset-0 bg-brand-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold tracking-tight">{moto.modelo}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="font-mono text-sm text-foreground/40 bg-white/5 px-2 py-0.5 rounded uppercase">{moto.placa}</span>
                                                <span className="text-[10px] font-bold text-foreground/20 uppercase">{moto.marca}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="p-2 text-foreground/20 hover:text-foreground transition-all">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest flex items-center gap-1">
                                            <Gauge size={10} /> Quilometragem
                                        </p>
                                        <p className="text-lg font-mono font-bold">{Number(moto.hodometro_atual).toLocaleString()} <span className="text-xs text-foreground/30">km</span></p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest flex items-center gap-1">
                                            <Calendar size={10} /> Ano/Modelo
                                        </p>
                                        <p className="text-lg font-bold">{moto.ano}</p>
                                    </div>
                                    <div className="col-span-2 p-4 bg-white/2 rounded-2xl border border-white/5 group-hover:border-brand-cyan/10 transition-all">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest flex items-center gap-1">
                                                <Droplets size={12} className="text-brand-orange" /> Troca de Óleo
                                            </p>
                                            <span className={`text-[10px] font-bold ${kmSinceOil > 800 ? 'text-brand-orange animate-pulse' : 'text-foreground/20'}`}>
                                                {kmSinceOil.toFixed(0)}/900 km
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-1000 ${kmSinceOil > 800 ? 'bg-brand-orange shadow-[0_0_8px_#f2a900]' : 'bg-brand-cyan'}`}
                                                style={{ width: `${oilProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] border ${moto.status === 'ativa' ? 'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/20' :
                                            moto.status === 'em_manutencao' ? 'bg-brand-orange/10 text-brand-orange border-brand-orange/20' :
                                                moto.status === 'inativa' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                    'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20'
                                        }`}>
                                        {moto.status}
                                    </span>
                                    <Link href={`/frota/${moto.id}`} className="text-[10px] font-bold text-brand-cyan/40 hover:text-brand-cyan transition-all flex items-center gap-1 group/btn">
                                        DETALHES TÉCNICOS <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {motos.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                        <p className="text-foreground/20 italic">Sua frota está vazia. Comece adicionando o primeiro veículo!</p>
                        <Link href="/frota/novo" className="text-brand-cyan text-sm font-bold mt-4 inline-block hover:underline">Cadastrar Agora</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

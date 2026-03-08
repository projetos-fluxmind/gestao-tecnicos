import React from 'react';
import {
  Users,
  Bike,
  Wrench,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Droplets,
  Fuel,
  Hash
} from 'lucide-react';
import Link from 'next/link';
import { getTechniciansCount } from './actions/technicians';
import { getMotorcyclesCount, getRecentMotorcycles } from './actions/motorcycles';
import { getOilChanges } from './actions/oil';

export default async function Dashboard() {
  const [activeTechs, motoStats, recentMotos, oilChanges] = await Promise.all([
    getTechniciansCount(),
    getMotorcyclesCount(),
    getRecentMotorcycles(5),
    getOilChanges()
  ]);

  // Calculate critical oil alerts based on 800km limit
  const oilAlerts = recentMotos.map((m: any) => {
    const lastChange = oilChanges.find((oc: any) => oc.motoId === m.id);
    const lastKm = lastChange ? Number(lastChange.quilometragem) : 0;
    const currentKm = Number(m.hodometro_atual);
    const diff = currentKm - lastKm;

    if (diff > 800) {
      return {
        title: 'Troca Atrasada',
        desc: `${m.placa}: ${diff.toFixed(0)}km rodados (Excedeu 800km).`,
        type: 'error',
        icon: AlertTriangle
      };
    } else if (diff >= 750) {
      return {
        title: 'Troca Próxima',
        desc: `${m.placa}: ${diff.toFixed(0)}km. Agende a manutenção.`,
        type: 'warning',
        icon: Droplets
      };
    }
    return null;
  }).filter(Boolean);

  const stats = [
    { label: 'Técnicos Ativos', value: activeTechs.toString(), icon: Users, trend: 'Tempo Real', color: 'brand-cyan' },
    { label: 'Disponibilidade', value: `${motoStats.available}/${motoStats.total}`, icon: Bike, trend: 'Frota Ativa', color: 'brand-emerald' },
    { label: 'Em Manutenção', value: motoStats.inMaintenance.toString(), icon: Wrench, trend: 'Oficina', color: 'brand-orange' },
    { label: 'Total Ativos', value: motoStats.total.toString(), icon: TrendingUp, trend: 'Frota Total', color: 'brand-cyan' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Painel de Controle</h2>
          <p className="text-foreground/50">Visão geral do ecossistema SGT.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-xs font-bold text-foreground/40 border border-white/5">
            <div className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
            SISTEMA ONLINE
          </div>
          <Link href="/relatorios" className="px-4 py-2 bg-brand-cyan text-black font-bold rounded-xl hover:opacity-90 transition-all text-sm shadow-[0_0_15px_#06d0f933]">
            Relatório Rápido
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="glass p-6 rounded-2xl relative overflow-hidden group hover:translate-y--1 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}/10 text-${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-lg bg-white/5 uppercase tracking-wider ${stat.color === 'brand-emerald' ? 'text-brand-emerald' : stat.color === 'brand-orange' ? 'text-brand-orange' : 'text-brand-cyan'}`}>
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-foreground/30 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-bold mt-1 font-mono">{stat.value}</h3>
            </div>
            <div className={`absolute bottom-0 left-0 w-full h-1 bg-${stat.color} opacity-20 shadow-[0_0_10px_${stat.color}]`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 sm:p-8 border-b border-white/5 flex justify-between items-center bg-white/1">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Bike className="text-brand-cyan" size={20} />
                  Performance da Frota
                </h3>
                <p className="text-xs text-foreground/30 font-medium">Situação em tempo real dos ativos.</p>
              </div>
              <Link href="/frota" className="text-brand-cyan text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-1">
                Ver Tudo <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-white/5">
              {recentMotos.map((moto: any) => {
                const currentAssignment = moto.assignments?.[0];
                const technicianName = currentAssignment?.technician?.nome || 'Disponível';

                return (
                  <div key={moto.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-white/2 transition-all group">
                    <div className="flex items-center gap-3 sm:gap-5">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-black/20 flex items-center justify-center border border-white/5 group-hover:border-brand-cyan/30 transition-all">
                        <Bike size={18} className="text-foreground/30 group-hover:text-brand-cyan" />
                      </div>
                      <div className="max-w-[120px] sm:max-w-none">
                        <h4 className="font-bold text-foreground/80 text-sm sm:text-base">{moto.placa}</h4>
                        <p className="text-[10px] sm:text-xs text-foreground/30 truncate">{moto.modelo} • <span className="text-brand-cyan/60 font-medium">{technicianName}</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="hidden sm:block text-right">
                        <p className="text-[10px] font-bold text-foreground/20 uppercase">Hodômetro</p>
                        <p className="text-sm font-mono font-bold">{Number(moto.hodometro_atual).toLocaleString()} km</p>
                      </div>
                      <span className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${moto.status === 'ativa'
                        ? 'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/20'
                        : moto.status === 'em_manutencao'
                          ? 'bg-brand-orange/10 text-brand-orange border-brand-orange/20 animate-pulse'
                          : 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20'
                        }`}>
                        {moto.status === 'ativa' ? 'Ativa' : moto.status === 'em_manutencao' ? 'Oficina' : 'Reserva'}
                      </span>
                    </div>
                  </div>
                );
              })}
              {recentMotos.length === 0 && (
                <div className="p-10 text-center text-foreground/20 italic">
                  Nenhum veículo cadastrado no sistema.
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link href="/hodometro" className="glass p-6 sm:p-8 rounded-3xl flex items-center justify-between group hover:border-brand-cyan/50 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-cyan/10 rounded-2xl text-brand-cyan group-hover:scale-110 transition-transform">
                  <Hash size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base">Lançar Quilometragem</h4>
                  <p className="text-[10px] sm:text-xs text-foreground/40">Sincronização diária</p>
                </div>
              </div>
              <ArrowUpRight className="text-foreground/20 group-hover:text-brand-cyan" size={20} />
            </Link>
            <Link href="/abastecimentos" className="glass p-6 sm:p-8 rounded-3xl flex items-center justify-between group hover:border-brand-emerald/50 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-emerald/10 rounded-2xl text-brand-emerald group-hover:scale-110 transition-transform">
                  <Fuel size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base">Registrar Abastecimento</h4>
                  <p className="text-[10px] sm:text-xs text-foreground/40">Controle de consumo</p>
                </div>
              </div>
              <ArrowUpRight className="text-foreground/20 group-hover:text-brand-emerald" size={20} />
            </Link>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass p-6 sm:p-8 rounded-3xl border-t-2 border-brand-orange/30">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <AlertTriangle size={20} className="text-brand-orange" />
              Alertas Críticos
            </h3>
            <div className="space-y-4">
              {oilAlerts.length > 0 ? oilAlerts.map((alert: any, i: number) => (
                <div key={i} className={`p-4 rounded-2xl border flex gap-4 ${alert.type === 'error' ? 'bg-red-500/5 border-red-500/10' : 'bg-brand-orange/5 border-brand-orange/10'
                  }`}>
                  <div className={`p-2 rounded-xl h-fit ${alert.type === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-brand-orange/10 text-brand-orange'
                    }`}>
                    <alert.icon size={18} />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${alert.type === 'error' ? 'text-red-400' : 'text-brand-orange'}`}>
                      {alert.title}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-foreground/50 mt-1">{alert.desc}</p>
                  </div>
                </div>
              )) : (
                <div className="py-4 text-center">
                  <p className="text-xs text-foreground/20 italic">Nenhum alerta crítico no momento.</p>
                </div>
              )}
            </div>
            <button className="w-full mt-6 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all">
              Tratar Alertas
            </button>
          </div>

          <div className="glass p-6 sm:p-8 rounded-3xl bg-brand-cyan/10 border-none relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-lg sm:text-xl font-bold mb-2">Suporte Técnico</h4>
              <p className="text-xs sm:text-sm text-foreground/60 mb-6 italic">"Gestão eficiente gera resultados permanentes."</p>
              <button className="px-6 py-2 bg-black text-white rounded-xl text-[10px] sm:text-xs font-bold hover:bg-black/80 transition-all border border-white/10">
                Chamado Frotas
              </button>
            </div>
            <TrendingUp className="absolute right-[-20px] bottom-[-20px] text-white/5" size={120} />
          </div>
        </div>
      </div>
    </div>
  );
}



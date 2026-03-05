"use client";

import React from 'react';
import { Target, TrendingUp, TrendingDown, Info } from 'lucide-react';

export function MonthlyPerformanceTable({ stats }: { stats: any[] }) {

    // Sort array by highest cost per KM to highlight problems
    const sortedStats = [...stats].sort((a, b) => b.custoKM - a.custoKM);

    return (
        <div className="glass rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl relative">
            <div className="absolute top-0 right-0 p-8 opacity-5 mix-blend-screen pointer-events-none">
                <Target size={120} />
            </div>

            <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-brand-cyan/5 to-transparent">
                <div>
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                        <TrendingUp className="text-brand-cyan" size={24} />
                        Desempenho por KM (Mês Atual)
                    </h3>
                    <p className="text-sm text-foreground/40 mt-1 max-w-xl">
                        Média de gastos (Combustível + Manutenção) por KM rodado no mês, separados por dupla Técnico e Moto.
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                    <Info size={14} className="text-brand-cyan" />
                    <span className="text-[10px] text-foreground/40 font-mono">
                        Cálculo: (Gasto O.S. + Gasto Rota) / KM Total
                    </span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] font-bold uppercase tracking-widest text-foreground/20 bg-white/2 border-b border-white/5">
                            <th className="px-8 py-5">Técnico / Moto</th>
                            <th className="px-8 py-5 text-right">Total Gasto</th>
                            <th className="px-8 py-5 text-right">KM Rodados</th>
                            <th className="px-8 py-5 text-right">Custo por KM</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {sortedStats.map((stat, idx) => {
                            const isHighCost = stat.custoKM > 0.40; // Exemplo de threshold arbitrário

                            return (
                                <tr key={`${stat.tecnicoId}-${stat.motoId}`} className="hover:bg-white/5 transition-all group">
                                    <td className="px-8 py-6">
                                        <p className="font-bold text-sm tracking-wide group-hover:text-brand-cyan transition-colors">
                                            {stat.techName}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-mono text-foreground/30 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-md">
                                                {stat.motoPlaca}
                                            </span>
                                            <span className="text-[10px] text-foreground/40 truncate max-w-[150px]">
                                                {stat.motoModelo}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-8 py-6 text-right font-mono text-sm tracking-wider">
                                        R$ {Number(stat.totalGasto).toFixed(2)}
                                    </td>

                                    <td className="px-8 py-6 text-right font-mono text-sm tracking-wider text-foreground/60">
                                        {Number(stat.totalKm).toLocaleString('pt-BR')} KM
                                    </td>

                                    <td className="px-8 py-6 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className={`font-black font-mono text-xl ${isHighCost ? 'text-brand-orange' : 'text-brand-emerald shadow-[0_0_15px_#10b98120]'}`}>
                                                R$ {stat.custoKM.toFixed(2)}
                                            </span>

                                            <span className={`text-[9px] uppercase tracking-widest font-bold mt-1 px-2 py-0.5 rounded-sm ${isHighCost ? 'bg-brand-orange/10 text-brand-orange' : 'bg-brand-emerald/10 text-brand-emerald'}`}>
                                                {isHighCost ? 'Atenção Necessária' : 'Eficiente'}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                        {sortedStats.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-8 py-20 text-center text-foreground/20 italic">
                                    Nenhuma movimentação ou gasto detectado neste mês para calcular médias.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

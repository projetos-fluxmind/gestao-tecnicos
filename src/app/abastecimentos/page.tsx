import React from 'react';
import {
    Fuel,
    Search,
    Filter,
    History,
    TrendingUp
} from 'lucide-react';
import { getFuelLogs } from '../actions/fuel';
import { getMotorcycles } from '../actions/motorcycles';
import { getAllTechnicians } from '../actions/technicians';
import { AbastecimentoForm } from '@/components/AbastecimentoForm';

export default async function AbastecimentosPage() {
    const [fuelLogs, motos, techs] = await Promise.all([
        getFuelLogs(),
        getMotorcycles(),
        getAllTechnicians()
    ]);

    const totalSpent = fuelLogs.reduce((sum: number, log: any) => sum + Number(log.valor_total || 0), 0);
    const totalLiters = fuelLogs.reduce((sum: number, log: any) => sum + Number(log.litros || 0), 0);

    // Process fuel details for the table (average consumption & cost per liter)
    const processedLogs = fuelLogs.map((log: any, index: number) => {
        // Encontra o abastecimento ANTERIOR da mesma moto (que aparece DEPOIS no array ordenado de forma descrescente)
        const prevLog = fuelLogs.slice(index + 1).find((l: any) => l.motoId === log.motoId);

        const valorLitro = Number(log.valor_litro) > 0
            ? Number(log.valor_litro)
            : (Number(log.litros) > 0 ? Number(log.valor_total) / Number(log.litros) : 0);

        let media = null;
        if (prevLog) {
            const kmDiff = Number(log.quilometragem) - Number(prevLog.quilometragem);
            if (kmDiff > 0 && Number(log.litros) > 0) {
                media = kmDiff / Number(log.litros);
            }
        }

        return {
            ...log,
            valorLitroFormated: valorLitro,
            mediaKmL: media
        };
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Abastecimento & Consumo</h2>
                    <p className="text-foreground/50">Controle de eficiência e gastos com combustível.</p>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl border-l-4 border-brand-cyan relative overflow-hidden">
                    <div className="z-10 relative">
                        <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-1">Total de Abastecimentos</p>
                        <p className="text-4xl font-bold font-mono text-brand-cyan">{fuelLogs.length}</p>
                    </div>
                    <TrendingUp className="absolute right-[-10px] bottom-[-10px] text-brand-cyan/10" size={100} />
                </div>
                <div className="glass p-6 rounded-2xl border-l-4 border-brand-emerald relative overflow-hidden">
                    <div className="z-10 relative">
                        <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-1">Gasto Total</p>
                        <p className="text-4xl font-bold font-mono text-brand-emerald">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSpent)}
                        </p>
                    </div>
                    <Fuel className="absolute right-[-10px] bottom-[-10px] text-brand-emerald/10" size={100} />
                </div>
                <div className="glass p-6 rounded-2xl border-l-4 border-foreground/10 flex flex-col justify-center">
                    <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-1">Litros Consumidos</p>
                    <p className="text-2xl font-bold">{totalLiters.toFixed(1)} L</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Entry Panel Toggle/Form Preview */}
                <AbastecimentoForm motos={motos} techs={techs} />

                {/* History Table */}
                <div className="xl:col-span-2 glass rounded-2xl overflow-hidden shadow-2xl h-fit">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <h3 className="font-bold flex items-center gap-2">
                            <History size={18} className="text-brand-cyan" />
                            Registros de Abastecimento
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] text-foreground/30 uppercase tracking-widest border-b border-white/5 bg-white/2">
                                    <th className="px-6 py-5">Técnico/Veículo</th>
                                    <th className="px-6 py-5">Data</th>
                                    <th className="px-6 py-5">Quantidade & Consumo</th>
                                    <th className="px-6 py-5">Valores & R$/L</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {processedLogs.map((log: any) => (
                                    <tr key={log.id} className="group hover:bg-white/5 transition-all">
                                        <td className="px-6 py-5">
                                            <p className="font-bold whitespace-nowrap">{log.technician?.nome}</p>
                                            <p className="text-[10px] font-mono text-brand-cyan/60">{log.motorcycle?.placa}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-medium">{new Date(log.data).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1.5">
                                                <p className="text-sm font-medium">{Number(log.litros).toFixed(1)} Litros</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] bg-white/5 py-1 px-2 rounded-md font-mono text-foreground/60 border border-white/5">
                                                        KM: {Number(log.quilometragem).toLocaleString('pt-BR')}
                                                    </span>
                                                    {log.mediaKmL ? (
                                                        <span className="text-[9px] bg-brand-cyan/20 text-brand-cyan py-1 px-2 rounded-md font-bold border border-brand-cyan/20 whitespace-nowrap">
                                                            Média: {log.mediaKmL.toFixed(1)} km/l
                                                        </span>
                                                    ) : (
                                                        <span className="text-[9px] bg-white/5 text-foreground/30 py-1 px-2 rounded-md font-bold border border-white/5 whitespace-nowrap" title="Necessário dois registros da mesma moto para calcular a média.">
                                                            Média: -- km/l
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-bold font-mono text-emerald-400">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(log.valor_total))}
                                            </p>
                                            <p className="text-[10px] text-foreground/40 font-bold mt-1 tracking-wider uppercase">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(log.valorLitroFormated)} / L
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                                {processedLogs.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-foreground/50">
                                            Nenhum abastecimento registrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

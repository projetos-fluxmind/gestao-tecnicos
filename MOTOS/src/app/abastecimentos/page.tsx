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
import { getTechnicians } from '../actions/technicians';
import { AbastecimentoForm } from '@/components/AbastecimentoForm';

export default async function AbastecimentosPage() {
    const [fuelLogs, motos, techs] = await Promise.all([
        getFuelLogs(),
        getMotorcycles(),
        getTechnicians()
    ]);

    const totalSpent = fuelLogs.reduce((sum: number, log: any) => sum + Number(log.valor_total || 0), 0);
    const totalLiters = fuelLogs.reduce((sum: number, log: any) => sum + Number(log.litros || 0), 0);
    const avgFleetStr = totalLiters > 0 ? (fuelLogs.reduce((sum: number, log: any) => sum + Number(log.quilometragem || 0), 0) / totalLiters).toFixed(1) : "0.0"; // Note: this is a simple avg representation, real avg km/l requires tracking prev km.

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
                <div className="glass p-6 rounded-2xl border-l-4 border-foreground/10">
                    <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-1">Litros Consumidos</p>
                    <p className="text-2xl font-bold">{totalLiters.toFixed(1)} L</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Entry Panel Toggle/Form Preview */}
                <AbastecimentoForm motos={motos} techs={techs} />

                {/* History Table */}
                <div className="xl:col-span-2 glass rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <h3 className="font-bold flex items-center gap-2">
                            <History size={18} className="text-brand-cyan" />
                            Registros de Abastecimento
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] text-foreground/30 uppercase tracking-widest border-b border-white/5 bg-white/1">
                                    <th className="px-6 py-5">Técnico/Veículo</th>
                                    <th className="px-6 py-5">Data</th>
                                    <th className="px-6 py-5">Quantitativo</th>
                                    <th className="px-6 py-5">Valores</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {fuelLogs.map((log: any) => (
                                    <tr key={log.id} className="group hover:bg-white/2 transition-all">
                                        <td className="px-6 py-5">
                                            <p className="font-bold whitespace-nowrap">{log.technician?.nome}</p>
                                            <p className="text-[10px] font-mono text-brand-cyan/60">{log.motorcycle?.placa}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-medium">{new Date(log.data).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-[10px] text-foreground/40 uppercase font-bold mb-1">Litros / KM</p>
                                            <p className="text-sm font-medium">{Number(log.litros).toFixed(1)}L <span className="text-[10px] text-foreground/30">@</span> {Number(log.quilometragem).toLocaleString()}km</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-[10px] text-foreground/40 uppercase font-bold mb-1">Total Pago</p>
                                            <p className="text-sm font-bold font-mono">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(log.valor_total))}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                                {fuelLogs.length === 0 && (
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

import React from 'react';
import {
    History,
    Plus,
    TrendingUp,
    MapPin
} from 'lucide-react';
import { getOdometerReadings } from '../actions/odometer';
import { getMotorcycles } from '../actions/motorcycles';
import { getAllTechnicians } from '../actions/technicians';
import { HodometroForm } from '@/components/HodometroForm';

export default async function HodometroPage() {
    const [readings, motos, techs] = await Promise.all([
        getOdometerReadings(),
        getMotorcycles(),
        getAllTechnicians()
    ]);

    const totalKm = motos.reduce((sum: number, m: any) => sum + Number(m.hodometro_atual), 0);
    const activeMotos = motos.filter((m: any) => m.status === 'ativa').length;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Registro de Hodômetro</h2>
                    <p className="text-foreground/50">Sincronização de quilometragem da frota.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Card via Client Component */}
                <HodometroForm motos={motos} techs={techs} />

                {/* History Table */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/2">
                            <h3 className="font-bold flex items-center gap-2">
                                <History size={18} className="text-brand-cyan" />
                                Logs de Quilometragem
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] text-foreground/30 uppercase border-b border-white/5">
                                        <th className="px-6 py-4">Data/Hora</th>
                                        <th className="px-6 py-4">Responsável</th>
                                        <th className="px-6 py-4">Veículo</th>
                                        <th className="px-6 py-4 text-right">KM Registrada</th>
                                        <th className="px-6 py-4 text-right">Variação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {readings.map((r: any) => (
                                        <tr key={r.id} className="text-sm hover:bg-white/5 transition-all group">
                                            <td className="px-6 py-4">
                                                <span className="block font-medium">{new Date(r.data_registro).toLocaleDateString()}</span>
                                                <span className="text-[10px] text-foreground/30">{new Date(r.createdAt).toLocaleTimeString()}</span>
                                            </td>
                                            <td className="px-6 py-4 text-foreground/70">{r.technician?.nome}</td>
                                            <td className="px-6 py-4 font-mono font-bold text-brand-cyan/80">{r.motorcycle?.placa}</td>
                                            <td className="px-6 py-4 text-right font-mono font-bold">{Number(r.quilometragem).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                {r.observacoes && (
                                                    <div className="inline-flex items-center gap-2 p-1 glass rounded-lg text-brand-emerald">
                                                        <TrendingUp size={14} />
                                                        <span className="text-[10px] font-bold">{r.observacoes}</span>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {readings.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-foreground/50">
                                                Nenhum registro de hodômetro encontrado.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="glass p-6 rounded-2xl flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-1">Km Total Frota</p>
                                <p className="text-2xl font-bold font-mono">{totalKm.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 flex items-center justify-center text-brand-cyan">
                                <TrendingUp size={24} />
                            </div>
                        </div>
                        <div className="glass p-6 rounded-2xl flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-1">Motos Ativas</p>
                                <p className="text-2xl font-bold font-mono">{activeMotos}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-brand-emerald/10 flex items-center justify-center text-brand-emerald">
                                <MapPin size={24} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

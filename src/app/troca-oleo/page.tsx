import React from 'react';
import {
    Droplets,
    Search,
    AlertTriangle,
    History,
    Plus
} from 'lucide-react';
import { getOilChanges } from '../actions/oil';
import { getMotorcycles } from '../actions/motorcycles';
import { getAllTechnicians } from '../actions/technicians';
import { TrocaOleoForm } from '@/components/TrocaOleoForm';

export default async function TrocaOleoPage() {
    const [oilChanges, motos, techs] = await Promise.all([
        getOilChanges(),
        getMotorcycles(),
        getAllTechnicians()
    ]);

    // Calcular motos com troca de óleo atrasada 
    // Considerando o cenário simples de hodometro_atual > (última troca na timeline? pra simplificar, a moto precisa ter um campo, ou usar a última db row)
    // Para simplificar a POC, vamos assumir que as oilChanges têm "alerta_ultrapassou" ou calcular agora baseado na mais recente de cada moto
    const delayedMotos = motos.filter((moto: any) => {
        const lastChange = oilChanges.find((oc: any) => oc.motoId === moto.id);
        const lastKm = lastChange ? Number(lastChange.quilometragem) : 0;
        const currentKm = Number(moto.hodometro_atual);
        const limit = 900; // 900 km 
        return currentKm - lastKm > limit;
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Troca de Óleo</h2>
                    <p className="text-foreground/50">Controle rigoroso do intervalo de 900km.</p>
                </div>
            </header>

            {/* Alert Banner for pending changes */}
            {delayedMotos.length > 0 && (
                <div className="space-y-3">
                    {delayedMotos.map((moto: any, idx: number) => {
                        const lastChange = oilChanges.find((oc: any) => oc.motoId === moto.id);
                        const lastKm = lastChange ? Number(lastChange.quilometragem) : 0;
                        const excesso = Number(moto.hodometro_atual) - lastKm - 900;

                        return (
                            <div key={idx} className="glass border-l-4 border-red-500 p-4 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                                        <AlertTriangle size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-red-400">{moto.placa} ({moto.modelo}) — Troca ATRASADA!</h4>
                                        <p className="text-xs text-foreground/50">Excedido em {excesso.toFixed(1)} km além do limite de 900km.</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Registration Form */}
                <TrocaOleoForm motos={motos} techs={techs} />

                {/* List of recent changes */}
                <div className="lg:col-span-2 glass rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <History className="text-brand-emerald" size={18} />
                            Histórico de Trocas
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs text-foreground/30 uppercase border-b border-white/5">
                                    <th className="px-6 py-4 font-bold">Data/Técnico</th>
                                    <th className="px-6 py-4 font-bold">Moto</th>
                                    <th className="px-6 py-4 font-bold">KM</th>
                                    <th className="px-6 py-4 font-bold">Intervalo</th>
                                    <th className="px-6 py-4 font-bold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {oilChanges.map((log: any) => {
                                    const diff = Number(log.diferenca_km || 0);
                                    const isOk = diff <= 1000;

                                    return (
                                        <tr key={log.id} className="text-sm hover:bg-white/5 transition-all">
                                            <td className="px-6 py-4">
                                                <p className="font-medium">{new Date(log.data).toLocaleDateString()}</p>
                                                <p className="text-[10px] text-foreground/50">{log.technician?.nome}</p>
                                            </td>
                                            <td className="px-6 py-4 font-bold">{log.motorcycle?.placa}</td>
                                            <td className="px-6 py-4 font-mono">{Number(log.quilometragem).toLocaleString()} km</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold">{diff.toFixed(1)} km</span>
                                                    <span className="text-[10px] text-foreground/30">diferença</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${isOk ? 'bg-brand-emerald/10 text-brand-emerald' : 'bg-red-500/10 text-red-500'}`}>
                                                    {isOk ? 'OK' : 'ATRASADA'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {oilChanges.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-foreground/50">
                                            Nenhuma troca de óleo registrada.
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

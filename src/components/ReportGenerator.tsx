"use client";

import React, { useState } from 'react';
import {
    BarChart3,
    Download,
    FileText,
    Calendar,
    Users,
    Bike,
    Search,
    ArrowRight,
    TrendingUp,
    FileSearch,
    X,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { getReportData, ReportFilter } from '@/app/actions/reports';

type ReportGeneratorProps = {
    techs: any[];
    motos: any[];
    reportTypes: any[];
};

export function ReportGenerator({ techs, motos, reportTypes }: ReportGeneratorProps) {
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [techId, setTechId] = useState("");
    const [motoId, setMotoId] = useState("");

    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any[] | null>(null);
    const [msg, setMsg] = useState("");

    async function handleGenerate() {
        if (!selectedType) {
            setMsg("Selecione um tipo de relatório primeiro.");
            return;
        }

        setLoading(true);
        setResults(null);
        setMsg("");

        const filter: ReportFilter = {
            type: selectedType,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            techId: techId ? Number(techId) : undefined,
            motoId: motoId ? Number(motoId) : undefined,
        };

        const data = await getReportData(filter);
        setResults(data);
        setLoading(false);

        if (data.length === 0) {
            setMsg("Nenhum dado encontrado para os filtros selecionados.");
        }
    }

    const currentReport = reportTypes.find(r => r.id === selectedType);

    return (
        <div className="space-y-8">
            {/* Grid of Report Types */}
            {!results && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {reportTypes.map((type) => (
                        <div
                            key={type.id}
                            onClick={() => setSelectedType(type.id)}
                            className={`glass p-8 rounded-3xl group transition-all relative overflow-hidden cursor-pointer border-2 ${selectedType === type.id ? 'border-brand-cyan bg-brand-cyan/5 shadow-[0_0_30px_rgba(6,208,249,0.1)]' : 'border-transparent hover:border-brand-cyan/30'}`}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-4 rounded-2xl ${selectedType === type.id ? 'bg-brand-cyan text-black' : `bg-${type.color}/10 text-${type.color}`} group-hover:scale-110 transition-transform`}>
                                    <type.icon size={28} />
                                </div>
                                {selectedType === type.id && <CheckCircle2 className="text-brand-cyan" size={20} />}
                            </div>

                            <h3 className="text-xl font-bold mb-2">{type.title}</h3>
                            <p className="text-sm text-foreground/40 leading-relaxed">
                                {type.desc}
                            </p>

                            <div className={`absolute bottom-0 left-0 w-full h-1 bg-${type.color} transform ${selectedType === type.id ? 'translate-y-0' : 'translate-y-full'} group-hover:translate-y-0 transition-transform`} />
                        </div>
                    ))}
                </div>
            )}

            {/* Config & Results Section */}
            <div className="glass p-8 rounded-[2rem] space-y-8 relative overflow-hidden">
                {loading && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="text-brand-cyan animate-spin" size={48} />
                        <p className="text-brand-cyan font-bold tracking-widest animate-pulse">PROCESSANDO INTELIGÊNCIA...</p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="text-xl font-bold">Parâmetros de Refinamento</h3>
                        <p className="text-sm text-foreground/40">{selectedType ? `Configurando: ${currentReport?.title}` : 'Selecione um módulo acima para filtrar.'}</p>
                    </div>
                    <div className="flex gap-3">
                        {results && (
                            <button
                                onClick={() => setResults(null)}
                                className="px-6 py-3 glass rounded-xl flex items-center gap-2 hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-wider"
                            >
                                <X size={18} /> Limpar
                            </button>
                        )}
                        <button
                            disabled={!selectedType || loading}
                            onClick={handleGenerate}
                            className="px-8 py-3 bg-brand-cyan text-black font-black rounded-xl flex items-center gap-2 hover:opacity-90 transition-all shadow-[0_0_20px_#06d0f944] disabled:opacity-30 tracking-widest text-xs"
                        >
                            <FileSearch size={18} />
                            {results ? 'REPROCESSAR' : 'GERAR ANÁLISE'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest px-2">Data Início</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-brand-cyan/40 text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest px-2">Data Fim</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-brand-cyan/40 text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest px-2 flex items-center gap-2">
                            <Users size={12} className="text-brand-cyan" /> Técnico
                        </label>
                        <select
                            value={techId}
                            onChange={e => setTechId(e.target.value)}
                            className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-brand-cyan/40 appearance-none text-sm"
                        >
                            <option value="">Todos os Técnicos</option>
                            {techs.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest px-2 flex items-center gap-2">
                            <Bike size={12} className="text-brand-cyan" /> Placa
                        </label>
                        <select
                            value={motoId}
                            onChange={e => setMotoId(e.target.value)}
                            className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-3 outline-none focus:border-brand-cyan/40 appearance-none text-sm"
                        >
                            <option value="">Todas as Motos</option>
                            {motos.map(m => <option key={m.id} value={m.id}>{m.placa} - {m.modelo}</option>)}
                        </select>
                    </div>
                </div>

                {msg && <p className="text-center text-brand-orange font-bold text-sm animate-pulse">{msg}</p>}

                {/* Results Table Preview */}
                {results && results.length > 0 && (
                    <div className="mt-8 animate-in zoom-in-95 duration-500">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h4 className="font-bold text-brand-cyan flex items-center gap-2">
                                <TrendingUp size={16} />
                                Resultados Encontrados ({results.length})
                            </h4>
                            <button
                                className="text-[10px] font-black tracking-widest text-brand-emerald border border-brand-emerald/20 px-3 py-1 rounded-lg hover:bg-brand-emerald/10"
                                onClick={() => alert('Simulando exportação CSV...')}
                            >
                                EXPORTAR CSV
                            </button>
                        </div>
                        <div className="overflow-x-auto rounded-2xl border border-white/5 bg-black/20">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                                    <tr>
                                        <th className="px-6 py-4">Data</th>
                                        <th className="px-6 py-4">Responsável</th>
                                        {selectedType !== 'expense' && <th className="px-6 py-4">Veículo</th>}
                                        <th className="px-6 py-4">Info Principal</th>
                                        <th className="px-6 py-4 text-right">Valor/Métrica</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {results.slice(0, 10).map((item, idx) => (
                                        <tr key={idx} className="hover:bg-white/2 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs">
                                                {new Date(item.data || item.data_registro || item.data_entrada).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 font-bold">{item.technician?.nome}</td>
                                            {selectedType !== 'expense' && <td className="px-6 py-4">{item.motorcycle?.placa}</td>}
                                            <td className="px-6 py-4 text-xs text-foreground/60 max-w-[200px] truncate">
                                                {item.descricao || item.categoria || item.tipo_manutencao || item.tipo_registro || '—'}
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-brand-cyan">
                                                {item.valor || item.valor_total || item.quilometragem || item.litros || '—'}
                                                <span className="ml-1 text-[10px] text-foreground/20 font-normal">
                                                    {item.valor ? 'BRL' : item.quilometragem ? 'KM' : item.litros ? 'L' : ''}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {results.length > 10 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center text-foreground/20 italic text-xs">
                                                Exibindo 10 de {results.length} resultados. Use a exportação para ver todos.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

import React from 'react';
import { ChevronLeft, MapPin, Phone, Mail, FileText, Calendar, Shirt, HardHat, Car, PersonStanding, Bike, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { getTechnicianById } from '../../actions/technicians';
import { notFound } from 'next/navigation';

export default async function TecnicoPerfilPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const technicianId = parseInt(id, 10);

    if (isNaN(technicianId)) {
        notFound();
    }

    const tech: any = await getTechnicianById(technicianId);

    if (!tech) {
        notFound();
    }

    const nameParts = tech.nome.split(' ');
    const shortName = nameParts.length > 1 ? `${nameParts[0]} ${nameParts[nameParts.length - 1]}` : nameParts[0];

    const currentMoto = tech.assignments?.find((a: any) => !a.data_fim)?.motorcycle;

    let ageText = "Idade n/d";
    let formattedBirthDate = "N/D";
    if (tech.data_nascimento) {
        const birthDate = new Date(tech.data_nascimento);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        ageText = `${age} anos`;
        formattedBirthDate = birthDate.toLocaleDateString('pt-BR');
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <header className="flex items-center gap-4">
                <Link href="/equipe" className="p-2 hover:bg-white/5 rounded-xl transition-all text-foreground/50 hover:text-brand-cyan">
                    <ChevronLeft size={24} />
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Perfil do Técnico</h2>
                    <p className="text-foreground/50">Detalhes completos do colaborador.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Cartão Principal Resumo */}
                <div className="md:col-span-1 glass p-8 rounded-[2rem] border border-white/5 flex flex-col items-center text-center space-y-6">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-brand-cyan/20 via-transparent to-brand-emerald/20 flex items-center justify-center border-2 border-white/10 relative overflow-hidden shadow-[0_0_30px_rgba(6,208,249,0.15)]">
                        {tech.foto_perfil ? (
                            <img src={tech.foto_perfil} alt={tech.nome} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-5xl font-black text-white/80 tracking-tighter shadow-sm">{nameParts.map((n: string) => n[0]).join('').substring(0, 2)}</span>
                        )}
                        <div className={`absolute bottom-3 right-3 w-6 h-6 rounded-full border-4 border-[#121212] ${tech.status === 'ativo' ? 'bg-brand-emerald' : 'bg-brand-orange'
                            } shadow-[0_0_15px_rgba(13,242,128,0.5)]`} />
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold tracking-tight text-foreground/90">{shortName}</h3>
                        <p className="text-xs font-bold text-brand-cyan/80 uppercase tracking-[0.2em] mt-2">{tech.matricula}</p>
                    </div>

                    <div className="flex gap-2 justify-center w-full pt-4 border-t border-white/5">
                        <a href={`https://wa.me/55${tech.telefone?.replace(/\D/g, '')}?text=Olá%20${shortName}!`} target="_blank" rel="noopener noreferrer" className="flex-1 p-3 bg-brand-cyan/10 rounded-xl text-brand-cyan hover:bg-brand-cyan hover:text-black font-bold transition-all flex items-center justify-center gap-2">
                            <Phone size={18} /> WhatsApp
                        </a>
                    </div>
                </div>

                {/* Informações Detalhadas */}
                <div className="md:col-span-2 space-y-6">

                    {/* Dados Básicos */}
                    <div className="glass p-8 rounded-[2rem] border border-white/5 space-y-6">
                        <h4 className="text-sm font-bold text-foreground/80 uppercase tracking-widest flex items-center gap-2">
                            <FileText size={16} className="text-brand-cyan" /> Informações Pessoais
                        </h4>

                        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                            <div>
                                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Nome Completo</p>
                                <p className="text-sm font-medium mt-1">{tech.nome}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Nascimento / Idade</p>
                                <p className="text-sm font-medium mt-1">{formattedBirthDate} ({ageText})</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">CPF / RG</p>
                                <p className="text-sm font-mono mt-1 text-foreground/80">{tech.cpf_rg || "Não Cadastrado"}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">CNH</p>
                                <p className="text-sm font-mono mt-1 text-foreground/80">{tech.cnh || "Não Cadastrada"}</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest flex items-center gap-1 mb-1"><MapPin size={10} /> Cidade Base</p>
                                <p className="text-sm font-medium">{tech.cidade_atuacao || tech.regiao_atuacao || "Não definida"}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest flex items-center gap-1 mb-1"><MapPin size={10} /> Residência</p>
                                <p className="text-sm font-medium text-foreground/70">{tech.residencia || "Não cadastrada"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Fardamento */}
                    <div className="glass p-8 rounded-[2rem] border border-white/5 space-y-6">
                        <h4 className="text-sm font-bold text-foreground/80 uppercase tracking-widest flex items-center gap-2">
                            <Shirt size={16} className="text-brand-emerald" /> Fardamento e EPI
                        </h4>

                        <div className="grid grid-cols-4 gap-4">
                            <div className="p-4 bg-black/30 rounded-2xl border border-white/5 text-center transition-all hover:bg-white/5">
                                <Shirt size={20} className="mx-auto mb-2 text-foreground/40" />
                                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Camisa</p>
                                <p className="text-lg font-black text-brand-cyan">{tech.tamanho_camisa || "--"}</p>
                            </div>
                            <div className="p-4 bg-black/30 rounded-2xl border border-white/5 text-center transition-all hover:bg-white/5">
                                <PersonStanding size={20} className="mx-auto mb-2 text-foreground/40" />
                                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Calça</p>
                                <p className="text-lg font-black text-brand-emerald">{tech.tamanho_calca || "--"}</p>
                            </div>
                            <div className="p-4 bg-black/30 rounded-2xl border border-white/5 text-center transition-all hover:bg-white/5">
                                <Bike size={20} className="mx-auto mb-2 text-foreground/40" />
                                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Bota</p>
                                <p className="text-lg font-black text-brand-orange">{tech.tamanho_bota || "--"}</p>
                            </div>
                            <div className="p-4 bg-black/30 rounded-2xl border border-white/5 text-center transition-all hover:bg-white/5">
                                <HardHat size={20} className="mx-auto mb-2 text-foreground/40" />
                                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Capacete</p>
                                <p className="text-lg font-black text-white">{tech.tamanho_capacete || "--"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Ativos e Status Operacional */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="glass p-6 rounded-3xl border border-brand-cyan/20 bg-brand-cyan/5 flex flex-col justify-center relative overflow-hidden group">
                            <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform">
                                <Bike size={120} />
                            </div>
                            <p className="text-[10px] font-bold text-brand-cyan/60 uppercase tracking-widest mb-1">Moto Vinculada</p>
                            {currentMoto ? (
                                <>
                                    <h4 className="text-2xl font-black text-white tracking-tight">{currentMoto.modelo}</h4>
                                    <p className="text-sm font-mono text-brand-cyan mt-1">{currentMoto.placa}</p>
                                </>
                            ) : (
                                <h4 className="text-xl font-bold text-foreground/40 mt-1">Sem moto alocada</h4>
                            )}
                        </div>

                        <div className="glass p-6 rounded-3xl border border-brand-emerald/20 bg-brand-emerald/5 flex flex-col justify-center relative justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-brand-emerald/60 uppercase tracking-widest mb-1">Avaliação do Sistema</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Star size={16} className="text-brand-orange fill-brand-orange" />
                                    <Star size={16} className="text-brand-orange fill-brand-orange" />
                                    <Star size={16} className="text-brand-orange fill-brand-orange" />
                                    <Star size={16} className="text-brand-orange fill-brand-orange" />
                                    <Star size={16} className="text-brand-orange fill-brand-orange" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-brand-emerald">
                                <TrendingUp size={16} />
                                <span className="text-sm font-bold">100% de Eficiência</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

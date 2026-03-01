"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTechnicians(page: number = 1, pageSize: number = 8) {
    try {
        const skip = (page - 1) * pageSize;

        const [technicians, total] = await Promise.all([
            prisma.technician.findMany({
                orderBy: { nome: 'asc' },
                skip,
                take: pageSize,
                include: {
                    assignments: {
                        where: { data_fim: null },
                        include: {
                            motorcycle: true
                        }
                    }
                }
            }),
            prisma.technician.count()
        ]);

        const serializedTechs = technicians.map(tech => ({
            ...tech,
            assignments: tech.assignments.map(a => ({
                ...a,
                motorcycle: a.motorcycle ? {
                    ...a.motorcycle,
                    hodometro_atual: Number(a.motorcycle.hodometro_atual)
                } : null
            }))
        }));

        return {
            data: serializedTechs,
            metadata: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize)
            }
        };
    } catch (error) {
        console.error("Erro ao buscar técnicos:", error);
        return {
            data: [],
            metadata: {
                total: 0,
                page: 1,
                pageSize,
                totalPages: 0
            }
        };
    }
}

export async function createTechnician(formData: FormData) {
    const nome = formData.get("nome") as string;
    const matricula = formData.get("matricula") as string;
    const telefone = formData.get("telefone") as string;
    const regiao = formData.get("regiao") as string;

    const cpf_rg = formData.get("cpf_rg") as string;
    const cnh = formData.get("cnh") as string;
    const data_nascimento = formData.get("data_nascimento") as string;
    const cidade_atuacao = formData.get("cidade_atuacao") as string;
    const residencia = formData.get("residencia") as string;
    const tamanho_camisa = formData.get("tamanho_camisa") as string;
    const tamanho_calca = formData.get("tamanho_calca") as string;
    const tamanho_bota = formData.get("tamanho_bota") as string;
    const tamanho_capacete = formData.get("tamanho_capacete") as string;
    const foto_perfil = formData.get("foto_perfil") as string;

    try {
        await prisma.technician.create({
            data: {
                nome,
                matricula,
                telefone,
                foto_perfil,
                regiao_atuacao: regiao,
                cpf_rg,
                cnh,
                data_nascimento: data_nascimento ? new Date(data_nascimento) : null,
                cidade_atuacao,
                residencia,
                tamanho_camisa,
                tamanho_calca,
                tamanho_bota,
                tamanho_capacete,
                status: "ativo"
            }
        });
        revalidatePath("/equipe");
        return { success: true };
    } catch (error) {
        console.error("Erro ao criar técnico:", error);
        return { success: false, error: "Falha ao criar técnico." };
    }
}

export async function getAllTechnicians() {
    try {
        const techs = await prisma.technician.findMany({
            orderBy: { nome: 'asc' },
            include: {
                assignments: {
                    where: { data_fim: null },
                    include: {
                        motorcycle: true
                    }
                }
            }
        });

        return techs.map(tech => ({
            ...tech,
            assignments: tech.assignments.map(a => ({
                ...a,
                motorcycle: a.motorcycle ? {
                    ...a.motorcycle,
                    hodometro_atual: Number(a.motorcycle.hodometro_atual)
                } : null
            }))
        }));
    } catch (error) {
        console.error("Erro ao buscar todos os técnicos:", error);
        return [];
    }
}

export async function getTechniciansCount() {
    try {
        return await prisma.technician.count({
            where: { status: 'ativo' }
        });
    } catch (error) {
        return 0;
    }
}

export async function getTechnicianById(id: number) {
    try {
        const tech = await prisma.technician.findUnique({
            where: { id },
            include: {
                assignments: {
                    where: { data_fim: null },
                    include: {
                        motorcycle: true
                    }
                }
            }
        });

        if (!tech) return null;

        return {
            ...tech,
            assignments: tech.assignments.map(a => ({
                ...a,
                motorcycle: a.motorcycle ? {
                    ...a.motorcycle,
                    hodometro_atual: Number(a.motorcycle.hodometro_atual)
                } : null
            }))
        };
    } catch (error) {
        console.error("Erro ao buscar técnico:", error);
        return null;
    }
}

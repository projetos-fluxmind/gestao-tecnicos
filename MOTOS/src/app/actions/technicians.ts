"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTechnicians() {
    try {
        return await prisma.technician.findMany({
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
    } catch (error) {
        console.error("Erro ao buscar técnicos:", error);
        return [];
    }
}

export async function createTechnician(formData: FormData) {
    const nome = formData.get("nome") as string;
    const matricula = formData.get("matricula") as string;
    const telefone = formData.get("telefone") as string;
    const regiao = formData.get("regiao") as string;

    try {
        await prisma.technician.create({
            data: {
                nome,
                matricula,
                telefone,
                regiao_atuacao: regiao,
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

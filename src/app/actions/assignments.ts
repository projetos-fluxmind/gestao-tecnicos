"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAssignments() {
    try {
        const assignments = await prisma.technicalAssignment.findMany({
            orderBy: { data_inicio: 'desc' },
            include: {
                technician: true,
                motorcycle: true,
            }
        });

        return assignments.map(a => ({
            ...a,
            motorcycle: a.motorcycle ? {
                ...a.motorcycle,
                hodometro_atual: Number(a.motorcycle.hodometro_atual)
            } : null
        }));
    } catch (error) {
        console.error("Erro ao buscar vínculos:", error);
        return [];
    }
}

export async function getActiveAssignments() {
    try {
        const assignments = await prisma.technicalAssignment.findMany({
            where: { data_fim: null },
            orderBy: { data_inicio: 'desc' },
            include: {
                technician: true,
                motorcycle: true,
            }
        });

        return assignments.map(a => ({
            ...a,
            motorcycle: a.motorcycle ? {
                ...a.motorcycle,
                hodometro_atual: Number(a.motorcycle.hodometro_atual)
            } : null
        }));
    } catch (error) {
        console.error("Erro ao buscar vínculos ativos:", error);
        return [];
    }
}

export async function createAssignment(data: {
    tecnicoId: number;
    motoId: number;
    data_inicio: string;
    tipo: string;
    observacoes?: string;
}) {
    try {
        // Encerrar vínculo anterior da moto (se houver)
        await prisma.technicalAssignment.updateMany({
            where: { motoId: data.motoId, data_fim: null },
            data: { data_fim: new Date(data.data_inicio) }
        });

        await prisma.technicalAssignment.create({
            data: {
                tecnicoId: data.tecnicoId,
                motoId: data.motoId,
                data_inicio: new Date(data.data_inicio),
                tipo: data.tipo,
                observacoes: data.observacoes,
            }
        });

        revalidatePath("/vinculos");
        revalidatePath("/equipe");
        revalidatePath("/frota");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Erro ao criar vínculo:", error);
        return { success: false, error: "Falha ao criar vínculo." };
    }
}

export async function endAssignment(id: number) {
    try {
        await prisma.technicalAssignment.update({
            where: { id },
            data: { data_fim: new Date() }
        });
        revalidatePath("/vinculos");
        revalidatePath("/equipe");
        revalidatePath("/frota");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Erro ao encerrar vínculo:", error);
        return { success: false };
    }
}

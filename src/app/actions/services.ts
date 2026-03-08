"use server";

import prisma from "@/lib/prisma";
import { serializePrisma } from "@/lib/serializePrisma";
import { revalidatePath } from "next/cache";

export async function createServiceLog(data: {
    tecnicoId: number;
    data: string;
    instalacoes: number;
    manutencoes_com_troca: number;
    manutencoes_sem_troca: number;
    retiradas: number;
    observacoes?: string;
}) {
    try {
        await prisma.serviceLog.upsert({
            where: {
                tecnicoId_data: {
                    tecnicoId: data.tecnicoId,
                    data: new Date(data.data),
                },
            },
            update: {
                instalacoes: data.instalacoes,
                manutencoes_com_troca: data.manutencoes_com_troca,
                manutencoes_sem_troca: data.manutencoes_sem_troca,
                retiradas: data.retiradas,
                observacoes: data.observacoes,
            },
            create: {
                tecnicoId: data.tecnicoId,
                data: new Date(data.data),
                instalacoes: data.instalacoes,
                manutencoes_com_troca: data.manutencoes_com_troca,
                manutencoes_sem_troca: data.manutencoes_sem_troca,
                retiradas: data.retiradas,
                observacoes: data.observacoes,
            },
        });

        revalidatePath("/servicos");
        revalidatePath("/");
        return { success: true };
    } catch (e: any) {
        console.error("Erro ao salvar acompanhamento de servico:", e);
        return { success: false, error: e.message };
    }
}

export async function getServiceLogs(limit = 100) {
    try {
        const logs = await prisma.serviceLog.findMany({
            include: { technician: true },
            orderBy: { data: "desc" },
            take: limit,
        });
        return serializePrisma(logs);
    } catch (e) {
        console.error("Erro ao buscar servicos:", e);
        return [];
    }
}

export async function getDailyServiceStats() {
    try {
        const d = new Date();
        d.setDate(d.getDate() - 30);

        const logs = await prisma.serviceLog.findMany({
            where: { data: { gte: d } },
        });

        const totalInstalacoes = logs.reduce((sum: number, l: any) => sum + l.instalacoes, 0);
        const totalManutComTroca = logs.reduce((sum: number, l: any) => sum + l.manutencoes_com_troca, 0);
        const totalManutSemTroca = logs.reduce((sum: number, l: any) => sum + l.manutencoes_sem_troca, 0);
        const totalRetiradas = logs.reduce((sum: number, l: any) => sum + l.retiradas, 0);

        return {
            totalInstalacoes,
            totalManutComTroca,
            totalManutSemTroca,
            totalRetiradas,
            totalGeral: totalInstalacoes + totalManutComTroca + totalManutSemTroca + totalRetiradas,
        };
    } catch (e) {
        console.error(e);
        return {
            totalInstalacoes: 0,
            totalManutComTroca: 0,
            totalManutSemTroca: 0,
            totalRetiradas: 0,
            totalGeral: 0,
        };
    }
}

export async function deleteServiceLog(id: number) {
    try {
        await prisma.serviceLog.delete({
            where: { id },
        });

        revalidatePath("/servicos");
        revalidatePath("/");
        return { success: true };
    } catch (e: any) {
        console.error("Erro ao deletar apontamento diario:", e);
        return { success: false, error: e.message };
    }
}

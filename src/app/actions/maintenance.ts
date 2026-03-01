"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getMaintenances() {
    try {
        const maintenances = await prisma.maintenance.findMany({
            orderBy: { data_entrada: 'desc' },
            include: {
                motorcycle: true,
                technician: true
            }
        });

        return maintenances.map(m => ({
            ...m,
            valor_total: m.valor_total ? Number(m.valor_total) : null,
            motorcycle: m.motorcycle ? {
                ...m.motorcycle,
                hodometro_atual: Number(m.motorcycle.hodometro_atual)
            } : null
        }));
    } catch (error) {
        console.error("Erro ao buscar manutenções:", error);
        return [];
    }
}

export async function createMaintenance(data: {
    motoId: number;
    tecnicoId: number;
    data_entrada: string;
    tipo: "preventiva" | "corretiva" | "emergencial";
    descricao: string;
}) {
    try {
        await prisma.maintenance.create({
            data: {
                motoId: data.motoId,
                tecnicoId: data.tecnicoId,
                data_entrada: new Date(data.data_entrada),
                tipo_manutencao: data.tipo,
                descricao_problema: data.descricao,
                status: "em_andamento"
            }
        });

        // Atualizar status da moto para manutenção
        await prisma.motorcycle.update({
            where: { id: data.motoId },
            data: { status: "em_manutencao" }
        });

        revalidatePath("/manutencoes");
        revalidatePath("/frota");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Erro ao criar manutenção:", error);
        return { success: false };
    }
}

"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getOilChanges() {
    try {
        const changes = await prisma.oilChange.findMany({
            orderBy: { data: 'desc' },
            include: {
                motorcycle: true,
                technician: true
            }
        });

        return changes.map(change => ({
            ...change,
            quilometragem: Number(change.quilometragem),
            quilometragem_ultima_troca: change.quilometragem_ultima_troca ? Number(change.quilometragem_ultima_troca) : null,
            diferenca_km: change.diferenca_km ? Number(change.diferenca_km) : null,
            valor: change.valor ? Number(change.valor) : null,
            motorcycle: change.motorcycle ? {
                ...change.motorcycle,
                hodometro_atual: Number(change.motorcycle.hodometro_atual)
            } : null
        }));
    } catch (error) {
        console.error("Erro ao buscar trocas de óleo:", error);
        return [];
    }
}

export async function createOilChange(data: {
    motoId: number;
    tecnicoId: number;
    data: string;
    km: number;
}) {
    try {
        // Buscar a quilometragem da última troca
        const lastChange = await prisma.oilChange.findFirst({
            where: { motoId: data.motoId },
            orderBy: { data: 'desc' }
        });

        const kmLast = lastChange ? Number(lastChange.quilometragem) : 0;
        const diff = data.km - kmLast;
        const alert = diff > 900;

        await prisma.oilChange.create({
            data: {
                motoId: data.motoId,
                tecnicoId: data.tecnicoId,
                data: new Date(data.data),
                quilometragem: data.km,
                quilometragem_ultima_troca: kmLast,
                diferenca_km: diff,
                alerta_ultrapassou: alert
            }
        });

        // Atualizar km na moto tb
        await prisma.motorcycle.update({
            where: { id: data.motoId },
            data: { hodometro_atual: data.km }
        });

        revalidatePath("/troca-oleo");
        revalidatePath("/frota");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Erro ao registrar troca de óleo:", error);
        return { success: false };
    }
}

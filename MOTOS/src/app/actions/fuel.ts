"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getFuelLogs() {
    try {
        return await prisma.fuelLog.findMany({
            orderBy: { data: 'desc' },
            include: {
                motorcycle: true,
                technician: true
            }
        });
    } catch (error) {
        console.error("Erro ao buscar abastecimentos:", error);
        return [];
    }
}

export async function createFuelLog(data: {
    motoId: number;
    tecnicoId: number;
    data: string;
    km: number;
    litros: number;
    valor: number;
}) {
    try {
        await prisma.fuelLog.create({
            data: {
                motoId: data.motoId,
                tecnicoId: data.tecnicoId,
                data: new Date(data.data),
                quilometragem: data.km,
                litros: data.litros,
                valor_total: data.valor,
                valor_litro: data.valor / data.litros
            }
        });

        // Atualizar hodômetro da moto
        await prisma.motorcycle.update({
            where: { id: data.motoId },
            data: { hodometro_atual: data.km }
        });

        revalidatePath("/abastecimentos");
        revalidatePath("/hodometro");
        revalidatePath("/frota");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Erro ao registrar abastecimento:", error);
        return { success: false };
    }
}

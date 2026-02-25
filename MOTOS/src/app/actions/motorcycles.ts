"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getMotorcycles() {
    try {
        return await prisma.motorcycle.findMany({
            orderBy: { placa: 'asc' },
        });
    } catch (error) {
        console.error("Erro ao buscar motos:", error);
        return [];
    }
}

export async function createMotorcycle(formData: FormData) {
    const placa = formData.get("placa") as string;
    const modelo = formData.get("modelo") as string;
    const marca = formData.get("marca") as string;
    const ano = parseInt(formData.get("ano") as string);
    const km = parseFloat(formData.get("km") as string);

    try {
        await prisma.motorcycle.create({
            data: {
                placa,
                modelo,
                marca,
                ano,
                hodometro_atual: km,
                status: "ativa"
            }
        });
        revalidatePath("/frota");
        return { success: true };
    } catch (error) {
        console.error("Erro ao criar moto:", error);
        return { success: false, error: "Falha ao criar moto." };
    }
}

export async function updateMotorcycleKm(id: number, km: number) {
    try {
        await prisma.motorcycle.update({
            where: { id },
            data: { hodometro_atual: km }
        });
        revalidatePath("/");
        revalidatePath("/frota");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

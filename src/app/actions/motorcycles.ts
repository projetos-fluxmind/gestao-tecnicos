"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getMotorcycles() {
    try {
        const motos = await prisma.motorcycle.findMany({
            orderBy: { placa: 'asc' },
        });

        // Convert Decimal to Number for Client Components serialization
        return motos.map(moto => ({
            ...moto,
            hodometro_atual: Number(moto.hodometro_atual)
        }));
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

export async function getMotorcyclesCount() {
    try {
        const total = await prisma.motorcycle.count();
        const available = await prisma.motorcycle.count({ where: { status: 'ativa' } });
        const inMaintenance = await prisma.motorcycle.count({ where: { status: 'em_manutencao' } });

        return { total, available, inMaintenance };
    } catch (error) {
        return { total: 0, available: 0, inMaintenance: 0 };
    }
}

export async function getRecentMotorcycles(limit: number = 5) {
    try {
        const motos = await prisma.motorcycle.findMany({
            orderBy: { placa: 'asc' },
            take: limit,
            include: {
                assignments: {
                    where: { data_fim: null },
                    include: {
                        technician: true
                    }
                }
            }
        });

        return motos.map(moto => ({
            ...moto,
            hodometro_atual: Number(moto.hodometro_atual)
        }));
    } catch (error) {
        return [];
    }
}

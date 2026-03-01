"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getFuelLogs() {
    try {
        const logs = await prisma.fuelLog.findMany({
            orderBy: { data: 'desc' },
            include: {
                motorcycle: true,
                technician: true
            }
        });

        return logs.map(log => ({
            ...log,
            quilometragem: Number(log.quilometragem),
            litros: Number(log.litros),
            valor_total: Number(log.valor_total),
            valor_litro: Number(log.valor_litro),
            motorcycle: log.motorcycle ? {
                ...log.motorcycle,
                hodometro_atual: Number(log.motorcycle.hodometro_atual)
            } : null
        }));
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
        // Validar entradas básicas
        if (!data.motoId || !data.tecnicoId || isNaN(data.km) || isNaN(data.litros) || isNaN(data.valor)) {
            console.error("Dados inválidos para abastecimento:", data);
            return { success: false, error: "Dados inválidos." };
        }

        const vLitro = data.litros > 0 ? (data.valor / data.litros) : 0;

        await prisma.fuelLog.create({
            data: {
                motoId: data.motoId,
                tecnicoId: data.tecnicoId,
                data: new Date(data.data),
                quilometragem: data.km,
                litros: data.litros,
                valor_total: data.valor,
                valor_litro: vLitro,
                posto: "Posto em Rota",
                observacoes: `Abastecimento aos ${data.km}km`
            }
        });

        // Atualizar hodômetro da moto
        await prisma.motorcycle.update({
            where: { id: data.motoId },
            data: { hodometro_atual: data.km }
        });

        // Registrar também um log de hodômetro para manter o histórico
        await prisma.odometerReading.create({
            data: {
                motoId: data.motoId,
                tecnicoId: data.tecnicoId,
                quilometragem: data.km,
                tipo_registro: "abastecimento",
                data_registro: new Date(data.data),
                observacoes: "Registrado via Abastecimento"
            }
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

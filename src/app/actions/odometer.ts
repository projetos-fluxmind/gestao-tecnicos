"use server";

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getOdometerReadings() {
    try {
        const readings = await prisma.odometerReading.findMany({
            orderBy: { data_registro: 'desc' },
            include: {
                motorcycle: true,
                technician: true
            },
            take: 50 // limit to recent 50
        });

        return readings.map(r => ({
            ...r,
            quilometragem: Number(r.quilometragem),
            motorcycle: r.motorcycle ? {
                ...r.motorcycle,
                hodometro_atual: Number(r.motorcycle.hodometro_atual)
            } : null
        }));
    } catch (error) {
        console.error("Erro ao buscar registros de hodômetro:", error);
        return [];
    }
}

export async function createOdometerReading(formData: FormData) {
    const motoId = Number(formData.get("motoId"));
    const tecnicoId = Number(formData.get("tecnicoId"));
    const km = Number(formData.get("km"));
    const tipo = formData.get("tipo") as string || "outro";

    if (!motoId || !tecnicoId || !km) {
        return { success: false, error: "Dados incompletos." };
    }

    try {
        // Pegar o km antigo da moto
        const motoAnterior = await prisma.motorcycle.findUnique({ where: { id: motoId } });
        const kmAntigo = motoAnterior ? Number(motoAnterior.hodometro_atual) : 0;
        const diferenca = km - kmAntigo;

        await prisma.odometerReading.create({
            data: {
                motoId,
                tecnicoId,
                quilometragem: km,
                tipo_registro: tipo as any, // "inicio_mes", "abastecimento", "troca_oleo", "manutencao", "outro"
                data_registro: new Date(),
                observacoes: diferenca > 0 ? `+${diferenca.toFixed(1)} km` : `${diferenca.toFixed(1)} km`
            }
        });

        // Atualizar o hodômetro atual da moto
        await prisma.motorcycle.update({
            where: { id: motoId },
            data: { hodometro_atual: km }
        });

        revalidatePath("/hodometro");
        revalidatePath("/frota");
        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Erro ao registrar hodômetro:", error);
        return { success: false, error: "Falha ao registrar hodômetro." };
    }
}

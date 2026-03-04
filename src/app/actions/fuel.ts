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
            km_percorrido: log.km_percorrido ? Number(log.km_percorrido) : null,
            custo_por_km: log.custo_por_km ? Number(log.custo_por_km) : null,
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

        // Buscar o último abastecimento para calcular a eficiência
        const lastLog = await prisma.fuelLog.findFirst({
            where: { motoId: data.motoId },
            orderBy: { quilometragem: 'desc' }
        });

        let kmPercorrido = null;
        let custoPorKm = null;

        if (lastLog) {
            const diffKm = Number(data.km) - Number(lastLog.quilometragem);
            if (diffKm > 0) {
                kmPercorrido = diffKm;
                custoPorKm = data.valor / diffKm;
            }
        }

        await prisma.$transaction(async (tx) => {
            const fuelLog = await tx.fuelLog.create({
                data: {
                    motoId: data.motoId,
                    tecnicoId: data.tecnicoId,
                    data: new Date(data.data),
                    quilometragem: data.km,
                    litros: data.litros,
                    valor_total: data.valor,
                    valor_litro: vLitro,
                    km_percorrido: kmPercorrido,
                    custo_por_km: custoPorKm,
                    posto: "Posto em Rota",
                    observacoes: lastLog ? `Abastecimento aos ${data.km}km` : "Registro Inicial"
                }
            });

            // 1. Abater do saldo do técnico
            await tx.technician.update({
                where: { id: data.tecnicoId },
                data: {
                    saldo_atual: {
                        decrement: data.valor
                    }
                }
            });

            // 2. Registrar a transação do cartão
            await tx.cardTransaction.create({
                data: {
                    tecnicoId: data.tecnicoId,
                    tipo: "gasto",
                    valor: data.valor,
                    categoria: "combustivel",
                    referencia: `abastecimento:${fuelLog.id}`,
                    descricao: `Abastecimento: ${data.km}km`
                }
            });

            // Atualizar hodômetro da moto
            await tx.motorcycle.update({
                where: { id: data.motoId },
                data: { hodometro_atual: data.km }
            });

            // Registrar também um log de hodômetro para manter o histórico
            await tx.odometerReading.create({
                data: {
                    motoId: data.motoId,
                    tecnicoId: data.tecnicoId,
                    quilometragem: data.km,
                    tipo_registro: "abastecimento",
                    data_registro: new Date(data.data),
                    observacoes: "Registrado via Abastecimento"
                }
            });
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

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
export async function concludeMaintenance(id: number, data: {
    valor_total: number;
    servicos: string;
    pecas?: string;
}) {
    try {
        await prisma.$transaction(async (tx) => {
            // 1. Atualizar a manutenção
            const maintenance = await tx.maintenance.update({
                where: { id },
                data: {
                    valor_total: data.valor_total,
                    servicos_realizados: data.servicos,
                    pecas_trocadas: data.pecas,
                    status: "concluida",
                    data_saida: new Date()
                }
            });

            // 2. Voltar a moto para status ativa
            await tx.motorcycle.update({
                where: { id: maintenance.motoId },
                data: { status: "ativa" }
            });

            // 3. Abater do saldo do técnico
            await tx.technician.update({
                where: { id: maintenance.tecnicoId },
                data: {
                    saldo_atual: {
                        decrement: data.valor_total
                    }
                }
            });

            // 4. Registrar a transação do cartão
            await tx.cardTransaction.create({
                data: {
                    tecnicoId: maintenance.tecnicoId,
                    tipo: "gasto",
                    valor: data.valor_total,
                    categoria: "manutencao",
                    referencia: `manutencao:${id}`,
                    descricao: `Manutenção: ${maintenance.tipo_manutencao} - ${data.servicos}`
                }
            });
        });

        revalidatePath("/manutencoes");
        revalidatePath("/frota");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Erro ao concluir manutenção:", error);
        return { success: false };
    }
}

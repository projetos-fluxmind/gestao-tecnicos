"use server";

import prisma from "@/lib/prisma";
import { serializePrisma } from "@/lib/serializePrisma";
import { revalidatePath } from "next/cache";

export async function getCompanyWallet() {
    try {
        let wallet = await prisma.companyWallet.findFirst();
        if (!wallet) {
            wallet = await prisma.companyWallet.create({
                data: { saldo_geral: 0 },
            });
        }
        return serializePrisma(wallet);
    } catch (error) {
        console.error("Error fetching company wallet:", error);
        return { saldo_geral: 0 };
    }
}

export async function fundCompanyWallet(amount: number) {
    try {
        const wallet = await prisma.companyWallet.findFirst();
        if (wallet) {
            await prisma.companyWallet.update({
                where: { id: wallet.id },
                data: { saldo_geral: { increment: amount } },
            });
        } else {
            await prisma.companyWallet.create({
                data: { saldo_geral: amount },
            });
        }
        revalidatePath("/despesas");
        return true;
    } catch (error) {
        console.error("Error funding wallet:", error);
        return false;
    }
}

export async function reloadCard(tecnicoId: number, amount: number) {
    try {
        await prisma.$transaction(async (tx: any) => {
            const wallet = await tx.companyWallet.findFirst();
            if (!wallet) throw new Error("Carteira nao encontrada");

            await tx.companyWallet.update({
                where: { id: wallet.id },
                data: { saldo_geral: { decrement: amount } },
            });

            await tx.technician.update({
                where: { id: tecnicoId },
                data: { saldo_atual: { increment: amount } },
            });

            await tx.cardTransaction.create({
                data: {
                    tecnicoId,
                    tipo: "recarga",
                    valor: amount,
                    categoria: "recarga",
                    descricao: "Recarga / Transferencia de Saldo",
                    referencia: `RECARGA-${Date.now()}`,
                },
            });
        });
        revalidatePath("/despesas");
        return true;
    } catch (error) {
        console.error("Error reloading card:", error);
        return false;
    }
}

export async function createExpense(data: any) {
    try {
        const value = Number(data.valor);
        await prisma.$transaction(async (tx: any) => {
            const expense = await tx.expense.create({
                data: {
                    tecnicoId: Number(data.tecnicoId),
                    categoria: data.categoria,
                    valor: value,
                    descricao: data.descricao,
                    data: new Date(data.data),
                    aprovado_supervisor: data.pagamento === "cartao" ? true : false,
                },
            });

            if (data.pagamento === "cartao") {
                await tx.technician.update({
                    where: { id: Number(data.tecnicoId) },
                    data: { saldo_atual: { decrement: value } },
                });

                await tx.cardTransaction.create({
                    data: {
                        tecnicoId: Number(data.tecnicoId),
                        tipo: "gasto",
                        valor: value,
                        categoria: data.categoria,
                        descricao: data.descricao || "Despesa no Cartao",
                        referencia: `DESPESA-${expense.id}`,
                    },
                });
            }
        });
        revalidatePath("/despesas");
        return true;
    } catch (error) {
        console.error("Error creating expense:", error);
        return false;
    }
}

export async function getMonthlyFinancialStats() {
    try {
        const fuelLogs = await prisma.fuelLog.findMany({
            include: { technician: true, motorcycle: true },
        });

        const maintenances = await prisma.maintenance.findMany({
            include: { technician: true, motorcycle: true },
        });

        const groups: Record<string, any> = {};

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        fuelLogs.forEach((log: any) => {
            const key = `${log.tecnicoId}-${log.motoId}`;
            if (!groups[key]) {
                groups[key] = {
                    tecnicoId: log.tecnicoId,
                    motoId: log.motoId,
                    techName: log.technician.nome,
                    motoPlaca: log.motorcycle.placa,
                    motoModelo: log.motorcycle.modelo,
                    totalGasto: 0,
                    totalKm: 0,
                    custoKM: 0,
                };
            }
            const logDate = new Date(log.data);
            if (logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear) {
                groups[key].totalGasto += Number(log.valor_total || 0);
                groups[key].totalKm += Number(log.km_percorrido || 0);
            }
        });

        maintenances.forEach((m: any) => {
            const key = `${m.tecnicoId}-${m.motoId}`;
            if (!groups[key]) {
                groups[key] = {
                    tecnicoId: m.tecnicoId,
                    motoId: m.motoId,
                    techName: m.technician?.nome || "Desconhecido",
                    motoPlaca: m.motorcycle?.placa || "Sem Moto",
                    motoModelo: m.motorcycle?.modelo || "",
                    totalGasto: 0,
                    totalKm: 0,
                    custoKM: 0,
                };
            }
            const logDate = new Date(m.data_entrada);
            if (logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear) {
                groups[key].totalGasto += Number(m.valor_total || 0);
            }
        });

        const stats = Object.values(groups).map((g: any) => {
            g.custoKM = g.totalKm > 0 ? g.totalGasto / g.totalKm : 0;
            return g;
        });

        return serializePrisma(stats.filter((s: any) => s.totalGasto > 0));
    } catch (e) {
        console.error("Failed to fetch monthly stats", e);
        return [];
    }
}

export async function getCardTransactions() {
    try {
        const transactions = await prisma.cardTransaction.findMany({
            include: { technician: true },
            orderBy: { data: "desc" },
        });
        return serializePrisma(transactions);
    } catch (e) {
        return [];
    }
}

export async function deleteCardTransaction(id: number) {
    try {
        await prisma.$transaction(async (tx: any) => {
            const dt = await tx.cardTransaction.findUnique({ where: { id } });
            if (!dt) return;

            if (dt.tipo === "recarga") {
                await tx.technician.update({
                    where: { id: dt.tecnicoId },
                    data: { saldo_atual: { decrement: dt.valor } },
                });
            } else if (dt.tipo === "gasto") {
                await tx.technician.update({
                    where: { id: dt.tecnicoId },
                    data: { saldo_atual: { increment: dt.valor } },
                });
            }

            await tx.cardTransaction.delete({ where: { id } });
        });
        revalidatePath("/despesas");
        return true;
    } catch (e) {
        return false;
    }
}

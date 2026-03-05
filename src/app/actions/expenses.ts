"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCompanyWallet() {
    try {
        let wallet = await prisma.companyWallet.findFirst();
        if (!wallet) {
            wallet = await prisma.companyWallet.create({
                data: { saldo_geral: 0 }
            });
        }
        return JSON.parse(JSON.stringify(wallet));
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
                data: { saldo_geral: { increment: amount } }
            });
        } else {
            await prisma.companyWallet.create({
                data: { saldo_geral: amount }
            });
        }
        revalidatePath('/despesas');
        return true;
    } catch (error) {
        console.error("Error funding wallet:", error);
        return false;
    }
}

export async function reloadCard(tecnicoId: number, amount: number) {
    try {
        await prisma.$transaction(async (tx) => {
            // Deduct from company wallet
            const wallet = await tx.companyWallet.findFirst();
            if (!wallet) throw new Error("Carteira não encontrada");

            await tx.companyWallet.update({
                where: { id: wallet.id },
                data: { saldo_geral: { decrement: amount } }
            });

            // Add to technician
            await tx.technician.update({
                where: { id: tecnicoId },
                data: { saldo_atual: { increment: amount } }
            });

            // Create transaction history
            await tx.cardTransaction.create({
                data: {
                    tecnicoId,
                    tipo: 'recarga',
                    valor: amount,
                    categoria: 'recarga',
                    descricao: 'Recarga / Transferência de Saldo',
                    referencia: `RECARGA-${Date.now()}`
                }
            });
        });
        revalidatePath('/despesas');
        return true;
    } catch (error) {
        console.error("Error reloading card:", error);
        return false;
    }
}

export async function createExpense(data: any) {
    try {
        const value = Number(data.valor);
        await prisma.$transaction(async (tx) => {
            const expense = await tx.expense.create({
                data: {
                    tecnicoId: Number(data.tecnicoId),
                    categoria: data.categoria,
                    valor: value,
                    descricao: data.descricao,
                    data: new Date(data.data),
                    aprovado_supervisor: data.pagamento === 'cartao' ? true : false,
                }
            });

            if (data.pagamento === 'cartao') {
                // Abater do saldo atual
                await tx.technician.update({
                    where: { id: Number(data.tecnicoId) },
                    data: { saldo_atual: { decrement: value } }
                });

                // Registrar a transação
                await tx.cardTransaction.create({
                    data: {
                        tecnicoId: Number(data.tecnicoId),
                        tipo: 'gasto',
                        valor: value,
                        categoria: data.categoria,
                        descricao: data.descricao || 'Despesa no Cartão',
                        referencia: `DESPESA-${expense.id}`
                    }
                });
            }
        });
        revalidatePath('/despesas');
        return true;
    } catch (error) {
        console.error("Error creating expense:", error);
        return false;
    }
}

export async function getMonthlyFinancialStats() {
    try {
        // Obter registros de gasolina
        const fuelLogs = await prisma.fuelLog.findMany({
            include: { technician: true, motorcycle: true }
        });

        // Obter manutenções confirmadas com substituição ou abatimento
        const maintenances = await prisma.maintenance.findMany({
            include: { technician: true, motorcycle: true }
        });

        const groups: Record<string, any> = {};

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        fuelLogs.forEach(log => {
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
                    custoKM: 0
                };
            }
            const logDate = new Date(log.data);
            if (logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear) {
                groups[key].totalGasto += Number(log.valor_total || 0);
                groups[key].totalKm += Number(log.km_percorrido || 0);
            }
        });

        maintenances.forEach(m => {
            const key = `${m.tecnicoId}-${m.motoId}`;
            if (!groups[key]) {
                groups[key] = {
                    tecnicoId: m.tecnicoId,
                    motoId: m.motoId,
                    techName: m.technician?.nome || 'Desconhecido',
                    motoPlaca: m.motorcycle?.placa || 'Sem Moto',
                    motoModelo: m.motorcycle?.modelo || '',
                    totalGasto: 0,
                    totalKm: 0,
                    custoKM: 0
                };
            }
            const logDate = new Date(m.data_entrada);
            if (logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear) {
                groups[key].totalGasto += Number(m.valor_total || 0);
                // Manutenção não adiciona KM, apenas custo. O KM já é trackeado nos fuelLogs
            }
        });

        const stats = Object.values(groups).map(g => {
            g.custoKM = g.totalKm > 0 ? g.totalGasto / g.totalKm : 0;
            return g;
        });

        return stats.filter(s => s.totalGasto > 0);
    } catch (e) {
        console.error("Failed to fetch monthly stats", e);
        return [];
    }
}

export async function getCardTransactions() {
    try {
        const transactions = await prisma.cardTransaction.findMany({
            include: { technician: true },
            orderBy: { data: 'desc' }
        });
        return JSON.parse(JSON.stringify(transactions));
    } catch (e) {
        return [];
    }
}

export async function deleteCardTransaction(id: number) {
    try {
        await prisma.$transaction(async (tx) => {
            const dt = await tx.cardTransaction.findUnique({ where: { id } });
            if (!dt) return;

            // Revert balance
            if (dt.tipo === 'recarga') {
                await tx.technician.update({
                    where: { id: dt.tecnicoId },
                    data: { saldo_atual: { decrement: dt.valor } }
                });
            } else if (dt.tipo === 'gasto') {
                await tx.technician.update({
                    where: { id: dt.tecnicoId },
                    data: { saldo_atual: { increment: dt.valor } }
                });
            }

            await tx.cardTransaction.delete({ where: { id } });
        });
        revalidatePath('/despesas');
        return true;
    } catch (e) {
        return false;
    }
}

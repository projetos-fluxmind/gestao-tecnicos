"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CategoriaDespesa } from "@prisma/client";

export async function getExpenses() {
    try {
        const expenses = await prisma.expense.findMany({
            orderBy: { data: 'desc' },
            include: {
                technician: true,
            }
        });

        return expenses.map(expense => ({
            ...expense,
            valor: Number(expense.valor),
            technician: expense.technician ? {
                ...expense.technician,
                cartao_corporativo_limite: expense.technician.cartao_corporativo_limite ? Number(expense.technician.cartao_corporativo_limite) : null,
                saldo_atual: Number(expense.technician.saldo_atual)
            } : null
        }));
    } catch (error) {
        console.error("Erro ao buscar despesas:", error);
        return [];
    }
}

export async function approveExpense(id: number) {
    try {
        await prisma.expense.update({
            where: { id },
            data: {
                aprovado_supervisor: true,
                data_aprovacao: new Date()
            }
        });
        revalidatePath("/despesas");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Erro ao aprovar despesa:", error);
        return { success: false };
    }
}


export async function createExpense(data: {
    tecnicoId: number;
    categoria: CategoriaDespesa;
    valor: number;
    descricao?: string;
    data: string;
    tipoPagamento: 'cartao' | 'reembolso';
}) {
    try {
        if (data.tipoPagamento === 'cartao') {
            await prisma.$transaction(async (tx) => {
                // 1. Abater do saldo do técnico (Sempre abate de despesas registradas)
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
                        categoria: data.categoria,
                        referencia: `cartao_direto:${Date.now()}`,
                        descricao: data.descricao || `Gasto em ${data.categoria} no cartão`
                    }
                });
            });
        } else {
            // Reembolso: não mexe no saldo do cartão corporativo
            await prisma.expense.create({
                data: {
                    tecnicoId: data.tecnicoId,
                    categoria: data.categoria,
                    valor: data.valor,
                    descricao: data.descricao,
                    data: new Date(data.data),
                    aprovado_supervisor: false
                }
            });
        }

        revalidatePath("/despesas");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Erro ao criar despesa:", error);
        return { success: false };
    }
}

export async function getCompanyWallet() {
    try {
        let wallet = await prisma.companyWallet.findUnique({ where: { id: 1 } });
        if (!wallet) {
            wallet = await prisma.companyWallet.create({ data: { id: 1, saldo_geral: 0 } });
        }
        return { ...wallet, saldo_geral: Number(wallet.saldo_geral) };
    } catch (error) {
        return { saldo_geral: 0 };
    }
}

export async function fundCompanyWallet(amount: number) {
    try {
        await prisma.companyWallet.upsert({
            where: { id: 1 },
            update: { saldo_geral: { increment: amount } },
            create: { id: 1, saldo_geral: amount }
        });
        revalidatePath("/despesas");
        return { success: true };
    } catch (error: any) {
        console.error("Erro fundo mestre:", error);
        return { success: false, error: error.message || "Erro ao adicionar fundos ao saldo geral." };
    }
}

export async function reloadCard(data: {
    tecnicoId: number | 'todos';
    valor: number;
    descricao?: string;
}) {
    try {
        await prisma.$transaction(async (tx) => {
            const activeTechs = await tx.technician.findMany({ where: { status: 'ativo' } });
            const totalRequired = data.tecnicoId === 'todos' ? data.valor * activeTechs.length : data.valor;

            let wallet = await tx.companyWallet.findUnique({ where: { id: 1 } });
            if (!wallet) wallet = await tx.companyWallet.create({ data: { id: 1, saldo_geral: 0 } });

            if (Number(wallet.saldo_geral) < totalRequired) {
                throw new Error(`Saldo geral insuficiente. Necessário: R$ ${totalRequired.toFixed(2)}`);
            }

            // Deduct from general balance
            await tx.companyWallet.update({
                where: { id: 1 },
                data: { saldo_geral: { decrement: totalRequired } }
            });

            if (data.tecnicoId === 'todos') {
                for (const tech of activeTechs) {
                    await tx.technician.update({
                        where: { id: tech.id },
                        data: { saldo_atual: { increment: data.valor } }
                    });
                    await tx.cardTransaction.create({
                        data: {
                            tecnicoId: tech.id,
                            tipo: "recarga",
                            valor: data.valor,
                            categoria: "recarga",
                            descricao: data.descricao || "Recarga de saldo em massa"
                        }
                    });
                }
            } else {
                await tx.technician.update({
                    where: { id: data.tecnicoId },
                    data: {
                        saldo_atual: {
                            increment: data.valor
                        }
                    }
                });

                await tx.cardTransaction.create({
                    data: {
                        tecnicoId: data.tecnicoId,
                        tipo: "recarga",
                        valor: data.valor,
                        categoria: "recarga",
                        descricao: data.descricao || "Recarga de saldo no cartão"
                    }
                });
            }
        });

        revalidatePath("/despesas");
        revalidatePath("/equipe");
        revalidatePath("/");
        return { success: true };
    } catch (error: any) {
        console.error("Erro ao recarregar cartão:", error);
        return { success: false, error: error.message || "Erro desconhecido" };
    }
}

export async function getCardTransactions(tecnicoId?: number) {
    try {
        const transactions = await prisma.cardTransaction.findMany({
            where: tecnicoId ? { tecnicoId } : undefined,
            orderBy: { data: 'desc' },
            include: {
                technician: true
            }
        });

        return transactions.map(t => ({
            ...t,
            valor: Number(t.valor),
            technician: t.technician ? {
                ...t.technician,
                cartao_corporativo_limite: t.technician.cartao_corporativo_limite ? Number(t.technician.cartao_corporativo_limite) : null,
                saldo_atual: Number(t.technician.saldo_atual)
            } : null
        }));
    } catch (error) {
        console.error("Erro ao buscar transações:", error);
        return [];
    }
}

export async function reloadMonthlyBalance(tecnicoId: number) {
    try {
        const technician = await prisma.technician.findUnique({
            where: { id: tecnicoId },
            select: { cartao_corporativo_limite: true, saldo_atual: true }
        });

        if (!technician || !technician.cartao_corporativo_limite) {
            return { success: false, error: "Limite do cartão não configurado." };
        }

        const limit = Number(technician.cartao_corporativo_limite);
        const currentBalance = Number(technician.saldo_atual);

        if (currentBalance >= limit) {
            return { success: false, error: "O saldo já está no teto do limite." };
        }

        const reloadAmount = limit - currentBalance;

        await prisma.$transaction(async (tx) => {
            let wallet = await tx.companyWallet.findUnique({ where: { id: 1 } });
            if (!wallet) wallet = await tx.companyWallet.create({ data: { id: 1, saldo_geral: 0 } });

            if (Number(wallet.saldo_geral) < reloadAmount) {
                throw new Error(`Saldo geral insuficiente para a renovação. Faltam fundos na conta mestre.`);
            }

            // Deduct
            await tx.companyWallet.update({
                where: { id: 1 },
                data: { saldo_geral: { decrement: reloadAmount } }
            });

            await tx.technician.update({
                where: { id: tecnicoId },
                data: {
                    saldo_atual: limit
                }
            });

            await tx.cardTransaction.create({
                data: {
                    tecnicoId,
                    tipo: "recarga",
                    valor: reloadAmount,
                    categoria: "recarga",
                    descricao: "Recarga Mensal de Limite"
                }
            });
        });

        revalidatePath("/despesas");
        revalidatePath("/equipe");
        revalidatePath("/");
        return { success: true };
    } catch (error: any) {
        console.error("Erro ao renovar limite mensal:", error);
        return { success: false, error: error.message || "Erro interno do servidor." };
    }
}

export async function reloadAllMonthlyBalances() {
    try {
        const technicians = await prisma.technician.findMany({
            where: { status: 'ativo', cartao_corporativo_limite: { not: null } }
        });

        let updatedCount = 0;

        await prisma.$transaction(async (tx) => {
            // Calculate total needed
            let totalNeeded = 0;
            for (const tech of technicians) {
                const limit = Number(tech.cartao_corporativo_limite);
                const currentBalance = Number(tech.saldo_atual);
                if (currentBalance < limit && limit > 0) {
                    totalNeeded += (limit - currentBalance);
                }
            }

            if (totalNeeded === 0) return; // No one needs reload

            let wallet = await tx.companyWallet.findUnique({ where: { id: 1 } });
            if (!wallet) wallet = await tx.companyWallet.create({ data: { id: 1, saldo_geral: 0 } });

            if (Number(wallet.saldo_geral) < totalNeeded) {
                throw new Error(`Saldo geral insuficiente! Necessários: R$ ${totalNeeded.toFixed(2)}.`);
            }

            await tx.companyWallet.update({
                where: { id: 1 },
                data: { saldo_geral: { decrement: totalNeeded } }
            });

            for (const tech of technicians) {
                const limit = Number(tech.cartao_corporativo_limite);
                const currentBalance = Number(tech.saldo_atual);

                if (currentBalance < limit && limit > 0) {
                    const reloadAmount = limit - currentBalance;

                    await tx.technician.update({
                        where: { id: tech.id },
                        data: { saldo_atual: limit }
                    });

                    await tx.cardTransaction.create({
                        data: {
                            tecnicoId: tech.id,
                            tipo: "recarga",
                            valor: reloadAmount,
                            categoria: "recarga",
                            descricao: "Recarga Mensal Automática (Teto)"
                        }
                    });
                    updatedCount++;
                }
            }
        });

        revalidatePath("/despesas");
        revalidatePath("/equipe");
        revalidatePath("/");
        return { success: true, count: updatedCount };
    } catch (error: any) {
        console.error("Erro na recarga mensal em massa:", error);
        return { success: false, error: error.message || "Erro ao processar a recarga em massa." };
    }
}

// === EDIÇÃO E EXCLUSÃO DE DESPESAS ===

export async function deleteExpense(id: number) {
    try {
        await prisma.expense.delete({ where: { id } });
        revalidatePath("/despesas");
        return { success: true as const };
    } catch (error: any) {
        console.error("Erro ao excluir despesa:", error);
        return { success: false as const, error: error?.message || "Erro ao excluir." };
    }
}

export async function updateExpense(id: number, data: { categoria?: CategoriaDespesa; valor?: number; descricao?: string; data?: string }) {
    try {
        await prisma.expense.update({
            where: { id },
            data: {
                ...(data.categoria && { categoria: data.categoria }),
                ...(data.valor && { valor: data.valor }),
                ...(data.descricao && { descricao: data.descricao }),
                ...(data.data && { data: new Date(data.data) })
            }
        });
        revalidatePath("/despesas");
        return { success: true };
    } catch (error) {
        console.error("Erro ao atualizar despesa:", error);
        return { success: false, error: "Erro ao atualizar." };
    }
}

// === EDIÇÃO E EXCLUSÃO DE MOVIMENTAÇÕES DO CARTÃO ===

export async function deleteCardTransaction(id: number) {
    try {
        // Busca a transação antes de deletar para reverter o saldo
        const transaction = await prisma.cardTransaction.findUnique({
            where: { id },
            include: { technician: true }
        });

        if (!transaction) {
            return { success: false, error: "Transação não encontrada." };
        }

        // Reverte o efeito no saldo do técnico:
        // Se era uma recarga (entrada) -> diminui o saldo
        // Se era um gasto (saída) -> devolve o valor ao saldo
        const ajusteSaldo = transaction.tipo === 'recarga'
            ? -Number(transaction.valor)   // era recarga: remove do saldo
            : Number(transaction.valor);    // era gasto: devolve ao saldo

        await prisma.$transaction([
            prisma.technician.update({
                where: { id: transaction.tecnicoId },
                data: { saldo_atual: { increment: ajusteSaldo } }
            }),
            prisma.cardTransaction.delete({ where: { id } })
        ]);

        revalidatePath("/despesas");
        return { success: true };
    } catch (error: any) {
        console.error("Erro ao excluir transação:", error);
        return { success: false, error: error.message || "Erro ao excluir." };
    }
}

export async function updateCardTransaction(id: number, data: { valor?: number; descricao?: string; referencia?: string }) {
    try {
        await prisma.cardTransaction.update({
            where: { id },
            data: {
                ...(data.valor && { valor: data.valor }),
                ...(data.descricao !== undefined && { descricao: data.descricao }),
                ...(data.referencia !== undefined && { referencia: data.referencia })
            }
        });
        revalidatePath("/despesas");
        return { success: true };
    } catch (error) {
        console.error("Erro ao atualizar transação:", error);
        return { success: false, error: "Erro ao atualizar." };
    }
}

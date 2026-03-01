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
            valor: Number(expense.valor)
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
}) {
    try {
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
        revalidatePath("/despesas");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Erro ao criar despesa:", error);
        return { success: false };
    }
}

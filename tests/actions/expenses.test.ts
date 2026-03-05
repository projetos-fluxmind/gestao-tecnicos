import { describe, it, expect, vi, beforeEach } from 'vitest'
import prisma from '@/lib/prisma'
import { createExpense, reloadCard, getCardTransactions } from '@/app/actions/expenses'
import { revalidatePath } from 'next/cache'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    default: {
        expense: {
            create: vi.fn(),
            findMany: vi.fn(),
            update: vi.fn(),
        },
        technician: {
            update: vi.fn(),
            findUnique: vi.fn(),
        },
        cardTransaction: {
            create: vi.fn(),
            findMany: vi.fn(),
        },
        $transaction: vi.fn((callback) => callback({
            expense: {
                create: vi.fn().mockResolvedValue({ id: 1 }),
            },
            technician: {
                update: vi.fn(),
            },
            cardTransaction: {
                create: vi.fn(),
            }
        }))
    }
}))

// Mock Next.js cache revalidation
vi.mock('next/cache', () => ({
    revalidatePath: vi.fn()
}))

describe('Expenses Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('reloadCard', () => {
        it('should correctly increment technician balance and create transaction', async () => {
            const txMock = {
                companyWallet: {
                    findFirst: vi.fn().mockResolvedValue({ id: 1, saldo_geral: 1000 }),
                    update: vi.fn().mockResolvedValue({ id: 1 })
                },
                technician: { update: vi.fn().mockResolvedValue({ id: 1 }) },
                cardTransaction: { create: vi.fn().mockResolvedValue({ id: 10 }) }
            };

            vi.mocked(prisma.$transaction).mockImplementationOnce(async (callback: any) => {
                return callback(txMock);
            });

            const result = await reloadCard(1, 500);

            expect(result).toBe(true);
            expect(txMock.technician.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    saldo_atual: { increment: 500 }
                }
            });
            expect(txMock.cardTransaction.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    tecnicoId: 1,
                    tipo: 'recarga',
                    valor: 500,
                    categoria: 'recarga'
                })
            });
            expect(revalidatePath).toHaveBeenCalled();
        })
    })

    describe('createExpense', () => {
        it('should create expense, deduct balance and create card transaction', async () => {
            const txMock = {
                expense: { create: vi.fn().mockResolvedValue({ id: 100 }) },
                technician: { update: vi.fn().mockResolvedValue({ id: 1 }) },
                cardTransaction: { create: vi.fn().mockResolvedValue({ id: 200 }) }
            };

            vi.mocked(prisma.$transaction).mockImplementationOnce(async (callback: any) => {
                return callback(txMock);
            });

            const result = await createExpense({
                tecnicoId: 1,
                valor: 50,
                categoria: 'alimentacao',
                descricao: 'Almoço',
                data: new Date().toISOString(),
                pagamento: 'cartao'
            });

            expect(result).toBe(true);
            expect(txMock.expense.create).toHaveBeenCalled();
            expect(txMock.technician.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    saldo_atual: { decrement: 50 }
                }
            });
            expect(txMock.cardTransaction.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    tipo: 'gasto',
                    valor: 50,
                    categoria: 'alimentacao'
                })
            });
        })
    })
})

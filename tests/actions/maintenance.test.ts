import { describe, it, expect, vi, beforeEach } from 'vitest'
import prisma from '@/lib/prisma'
import { concludeMaintenance } from '@/app/actions/maintenance'
import { revalidatePath } from 'next/cache'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    default: {
        maintenance: {
            update: vi.fn(),
        },
        motorcycle: {
            update: vi.fn(),
        },
        technician: {
            update: vi.fn(),
        },
        cardTransaction: {
            create: vi.fn(),
        },
        $transaction: vi.fn((callback) => callback({
            maintenance: { update: vi.fn() },
            motorcycle: { update: vi.fn() },
            technician: { update: vi.fn() },
            cardTransaction: { create: vi.fn() }
        }))
    }
}))

// Mock Next.js cache revalidation
vi.mock('next/cache', () => ({
    revalidatePath: vi.fn()
}))

describe('Maintenance Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('concludeMaintenance', () => {
        it('should successfully conclude maintenance, update moto status, and deduct from tech balance', async () => {
            const txMock = {
                maintenance: {
                    update: vi.fn().mockResolvedValue({ id: 1, motoId: 10, tecnicoId: 2, tipo_manutencao: 'corretiva' })
                },
                motorcycle: { update: vi.fn().mockResolvedValue({ id: 10 }) },
                technician: { update: vi.fn().mockResolvedValue({ id: 2 }) },
                cardTransaction: { create: vi.fn().mockResolvedValue({ id: 500 }) }
            };

            vi.mocked(prisma.$transaction).mockImplementationOnce(async (callback: any) => {
                return callback(txMock);
            });

            const payload = {
                valor_total: 1500,
                servicos: 'Troca de motor',
                pecas: 'Motor 150cc'
            };

            const result = await concludeMaintenance(1, payload);

            expect(result.success).toBe(true);

            // Verify maintenance update
            expect(txMock.maintenance.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: expect.objectContaining({
                    valor_total: 1500,
                    status: 'concluida'
                })
            });

            // Verify moto status return to active
            expect(txMock.motorcycle.update).toHaveBeenCalledWith({
                where: { id: 10 },
                data: { status: 'ativa' }
            });

            // Verify tech balance deduction
            expect(txMock.technician.update).toHaveBeenCalledWith({
                where: { id: 2 },
                data: {
                    saldo_atual: { decrement: 1500 }
                }
            });

            // Verify card transaction creation
            expect(txMock.cardTransaction.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    tecnicoId: 2,
                    tipo: 'gasto',
                    valor: 1500,
                    categoria: 'manutencao'
                })
            });

            expect(revalidatePath).toHaveBeenCalled();
        })
    })
})

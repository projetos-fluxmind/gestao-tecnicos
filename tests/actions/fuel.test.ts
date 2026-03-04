import { describe, it, expect, vi, beforeEach } from 'vitest'
import prisma from '@/lib/prisma'
import { getFuelLogs, createFuelLog } from '@/app/actions/fuel'
import { revalidatePath } from 'next/cache'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    default: {
        fuelLog: {
            findMany: vi.fn(),
            create: vi.fn(),
            findFirst: vi.fn(),
        },
        motorcycle: {
            update: vi.fn(),
        },
        cardTransaction: {
            create: vi.fn(),
        },
        technician: {
            update: vi.fn(),
        },
        odometerReading: {
            create: vi.fn(),
        },
        $transaction: vi.fn((callback) => callback({
            fuelLog: { create: vi.fn(), findFirst: vi.fn() },
            motorcycle: { update: vi.fn() },
            odometerReading: { create: vi.fn() },
            technician: { update: vi.fn() },
            cardTransaction: { create: vi.fn() }
        }))
    }
}))

// Mock Next.js cache revalidation
vi.mock('next/cache', () => ({
    revalidatePath: vi.fn()
}))

describe('Fuel Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('getFuelLogs', () => {
        it('should return empty array on failure', async () => {
            vi.mocked(prisma.fuelLog.findMany).mockRejectedValueOnce(new Error('DB Error'))

            const logs = await getFuelLogs()
            expect(logs).toEqual([])
        })

        it('should format decimals to numbers', async () => {
            const mockLogs = [
                {
                    id: 1,
                    quilometragem: { constructor: { name: 'Decimal' }, toString: () => '1000.5' },
                    litros: { constructor: { name: 'Decimal' }, toString: () => '10.5' },
                    valor_total: { constructor: { name: 'Decimal' }, toString: () => '50.00' },
                    valor_litro: { constructor: { name: 'Decimal' }, toString: () => '4.76' },
                    km_percorrido: null,
                    custo_por_km: null,
                    motorcycle: {
                        hodometro_atual: { constructor: { name: 'Decimal' }, toString: () => '1000.5' }
                    }
                }
            ] as any

            vi.mocked(prisma.fuelLog.findMany).mockResolvedValue(mockLogs)

            const logs = await getFuelLogs()
            expect(logs[0].quilometragem).toBe(1000.5)
            expect(logs[0].litros).toBe(10.5)
            expect(logs[0].valor_litro).toBe(4.76)
            expect(logs).toHaveLength(1)
            expect(prisma.fuelLog.findMany).toHaveBeenCalledTimes(1)
        })
    })

    describe('createFuelLog', () => {
        it('should return error if inputs are incomplete', async () => {
            const result = await createFuelLog({
                motoId: 0,
                tecnicoId: 1,
                data: '2026-02-28',
                km: NaN,
                litros: 10,
                valor: 50
            })

            expect(result.success).toBe(false)
            expect(prisma.$transaction).not.toHaveBeenCalled()
        })

        it('should create log, update moto, deduct tech balance and create transaction', async () => {
            const payload = {
                motoId: 1,
                tecnicoId: 2,
                data: '2026-02-28',
                km: 15400,
                litros: 10,
                valor: 58.00
            }

            const txMock = {
                fuelLog: { create: vi.fn().mockResolvedValue({ id: 100 }) },
                motorcycle: { update: vi.fn().mockResolvedValue({ id: 1 }) },
                odometerReading: { create: vi.fn().mockResolvedValue({ id: 200 }) },
                technician: { update: vi.fn().mockResolvedValue({ id: 2 }) },
                cardTransaction: { create: vi.fn().mockResolvedValue({ id: 300 }) }
            };

            vi.mocked(prisma.$transaction).mockImplementationOnce(async (callback: any) => {
                return callback(txMock);
            });

            // Mock findFirst for last log (empty)
            vi.mocked(prisma.fuelLog.findFirst).mockResolvedValueOnce(null);

            const result = await createFuelLog(payload)

            expect(result.success).toBe(true)
            expect(txMock.fuelLog.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    motoId: 1,
                    tecnicoId: 2,
                    quilometragem: 15400,
                    litros: 10,
                    valor_total: 58.00
                })
            })

            expect(txMock.technician.update).toHaveBeenCalledWith({
                where: { id: 2 },
                data: {
                    saldo_atual: { decrement: 58.00 }
                }
            })

            expect(txMock.cardTransaction.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    tipo: 'gasto',
                    valor: 58.00,
                    categoria: 'combustivel'
                })
            })

            expect(revalidatePath).toHaveBeenCalled()
        })
    })
})

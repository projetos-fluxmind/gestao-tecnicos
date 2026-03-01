"use server";

import prisma from "@/lib/prisma";

export type ReportFilter = {
    type: string;
    startDate?: string;
    endDate?: string;
    techId?: number;
    motoId?: number;
};

function serializeDecimal(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
        return obj.map(serializeDecimal);
    }

    // Check if it's a Prisma Decimal object
    if (obj.constructor && obj.constructor.name === 'Decimal') {
        return Number(obj);
    }

    const serialized: any = {};
    for (const key in obj) {
        serialized[key] = serializeDecimal(obj[key]);
    }
    return serialized;
}

export async function getReportData(filter: ReportFilter) {
    const { type, startDate, endDate, techId, motoId } = filter;

    const dateFilter: any = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    try {
        let results: any[] = [];
        switch (type) {
            case 'km':
                results = await prisma.odometerReading.findMany({
                    where: {
                        ...(startDate || endDate ? { data_registro: dateFilter } : {}),
                        ...(techId ? { tecnicoId: techId } : {}),
                        ...(motoId ? { motoId: motoId } : {}),
                    },
                    include: { technician: true, motorcycle: true },
                    orderBy: { data_registro: 'desc' }
                });
                break;

            case 'fuel':
                results = await prisma.fuelLog.findMany({
                    where: {
                        ...(startDate || endDate ? { data: dateFilter } : {}),
                        ...(techId ? { tecnicoId: techId } : {}),
                        ...(motoId ? { motoId: motoId } : {}),
                    },
                    include: { technician: true, motorcycle: true },
                    orderBy: { data: 'desc' }
                });
                break;

            case 'oil':
                results = await prisma.oilChange.findMany({
                    where: {
                        ...(startDate || endDate ? { data: dateFilter } : {}),
                        ...(techId ? { tecnicoId: techId } : {}),
                        ...(motoId ? { motoId: motoId } : {}),
                    },
                    include: { technician: true, motorcycle: true },
                    orderBy: { data: 'desc' }
                });
                break;

            case 'expense':
                results = await prisma.expense.findMany({
                    where: {
                        ...(startDate || endDate ? { data: dateFilter } : {}),
                        ...(techId ? { tecnicoId: techId } : {}),
                    },
                    include: { technician: true },
                    orderBy: { data: 'desc' }
                });
                break;

            case 'maintenance':
                results = await prisma.maintenance.findMany({
                    where: {
                        ...(startDate || endDate ? { data_entrada: dateFilter } : {}),
                        ...(techId ? { tecnicoId: techId } : {}),
                        ...(motoId ? { motoId: motoId } : {}),
                    },
                    include: { technician: true, motorcycle: true },
                    orderBy: { data_entrada: 'desc' }
                });
                break;

            case 'consolidated':
                // For consolidated, we return a merged list of diverse events
                const [m, f, e] = await Promise.all([
                    prisma.maintenance.findMany({ take: 10, include: { technician: true, motorcycle: true }, orderBy: { data_entrada: 'desc' } }),
                    prisma.fuelLog.findMany({ take: 10, include: { technician: true, motorcycle: true }, orderBy: { data: 'desc' } }),
                    prisma.expense.findMany({ take: 10, include: { technician: true }, orderBy: { data: 'desc' } })
                ]);
                results = [...m, ...f, ...e].sort((a: any, b: any) =>
                    new Date(b.data || b.data_entrada || b.data_registro).getTime() -
                    new Date(a.data || a.data_entrada || a.data_registro).getTime()
                );
                break;

            default:
                results = [];
        }

        return serializeDecimal(results);
    } catch (error) {
        console.error("Erro ao gerar dados do relatório:", error);
        return [];
    }
}

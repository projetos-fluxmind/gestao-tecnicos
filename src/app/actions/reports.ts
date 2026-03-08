"use server";

import prisma from "@/lib/prisma";
import { serializePrisma } from "@/lib/serializePrisma";

export type ReportFilter = {
    type: string;
    startDate?: string;
    endDate?: string;
    techId?: number;
    motoId?: number;
};

export async function getReportData(filter: ReportFilter) {
    const { type, startDate, endDate, techId, motoId } = filter;

    const dateFilter: any = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    try {
        let results: any[] = [];
        switch (type) {
            case "km":
                results = await prisma.odometerReading.findMany({
                    where: {
                        ...(startDate || endDate ? { data_registro: dateFilter } : {}),
                        ...(techId ? { tecnicoId: techId } : {}),
                        ...(motoId ? { motoId } : {}),
                    },
                    include: { technician: true, motorcycle: true },
                    orderBy: { data_registro: "desc" },
                });
                break;

            case "fuel":
                results = await prisma.fuelLog.findMany({
                    where: {
                        ...(startDate || endDate ? { data: dateFilter } : {}),
                        ...(techId ? { tecnicoId: techId } : {}),
                        ...(motoId ? { motoId } : {}),
                    },
                    include: { technician: true, motorcycle: true },
                    orderBy: { data: "desc" },
                });
                break;

            case "oil":
                results = await prisma.oilChange.findMany({
                    where: {
                        ...(startDate || endDate ? { data: dateFilter } : {}),
                        ...(techId ? { tecnicoId: techId } : {}),
                        ...(motoId ? { motoId } : {}),
                    },
                    include: { technician: true, motorcycle: true },
                    orderBy: { data: "desc" },
                });
                break;

            case "maintenance":
                results = await prisma.maintenance.findMany({
                    where: {
                        ...(startDate || endDate ? { data_entrada: dateFilter } : {}),
                        ...(techId ? { tecnicoId: techId } : {}),
                        ...(motoId ? { motoId } : {}),
                    },
                    include: { technician: true, motorcycle: true },
                    orderBy: { data_entrada: "desc" },
                });
                break;

            case "efficiency": {
                const logs = await prisma.fuelLog.findMany({
                    where: {
                        ...(startDate || endDate ? { data: dateFilter } : {}),
                        ...(techId ? { tecnicoId: techId } : {}),
                        ...(motoId ? { motoId } : {}),
                    },
                    include: { technician: true, motorcycle: true },
                });

                const groups: Record<string, any> = {};

                logs.forEach((log: any) => {
                    const key = techId ? `moto-${log.motoId}` : `tech-${log.tecnicoId}`;
                    if (!groups[key]) {
                        groups[key] = {
                            id: key,
                            data: log.data,
                            technician: log.technician,
                            motorcycle: log.motorcycle,
                            desc: techId ? log.motorcycle.placa : log.technician.nome,
                            km_total: 0,
                            valor_total: 0,
                            qtd_abastecimentos: 0,
                            valor: 0,
                            unidade: "R$/KM",
                        };
                    }
                    groups[key].km_total += Number(log.km_percorrido || 0);
                    groups[key].valor_total += Number(log.valor_total || 0);
                    groups[key].qtd_abastecimentos += 1;
                });

                results = Object.values(groups).map((g: any) => ({
                    ...g,
                    valor: g.km_total > 0 ? g.valor_total / g.km_total : 0,
                    info_extra: `${g.km_total.toFixed(0)} KM rodados`,
                    descricao: `Eficiencia: ${g.qtd_abastecimentos} abastecimentos`,
                }));

                results.sort((a, b) => b.valor - a.valor);
                break;
            }

            case "consolidated": {
                const [m, f] = await Promise.all([
                    prisma.maintenance.findMany({
                        take: 10,
                        include: { technician: true, motorcycle: true },
                        orderBy: { data_entrada: "desc" },
                    }),
                    prisma.fuelLog.findMany({
                        take: 10,
                        include: { technician: true, motorcycle: true },
                        orderBy: { data: "desc" },
                    }),
                ]);
                results = [...m, ...f].sort(
                    (a: any, b: any) =>
                        new Date(b.data || b.data_entrada || b.data_registro).getTime() -
                        new Date(a.data || a.data_entrada || a.data_registro).getTime(),
                );
                break;
            }

            default:
                results = [];
        }

        return serializePrisma(results);
    } catch (error) {
        console.error("Erro ao gerar dados do relatorio:", error);
        return [];
    }
}

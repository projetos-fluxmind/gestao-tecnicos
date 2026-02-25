import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Iniciando seed do banco de dados...')

    // 1. Criar Motos
    console.log('🏍️ Criando motos...')
    const moto1 = await prisma.motorcycle.upsert({
        where: { placa: 'ABC-1234' },
        update: {},
        create: {
            placa: 'ABC-1234',
            modelo: 'Honda CB 500X',
            marca: 'Honda',
            ano: 2023,
            hodometro_atual: 12450,
            status: 'ativa'
        }
    })

    const moto2 = await prisma.motorcycle.upsert({
        where: { placa: 'XYZ-5678' },
        update: {},
        create: {
            placa: 'XYZ-5678',
            modelo: 'Yamaha MT-07',
            marca: 'Yamaha',
            ano: 2022,
            hodometro_atual: 18900,
            status: 'em_manutencao'
        }
    })

    const moto3 = await prisma.motorcycle.upsert({
        where: { placa: 'DEF-9012' },
        update: {},
        create: {
            placa: 'DEF-9012',
            modelo: 'BMW G310 GS',
            marca: 'BMW',
            ano: 2024,
            hodometro_atual: 2100,
            status: 'ativa'
        }
    })

    // 2. Criar Técnicos
    console.log('👥 Criando técnicos...')
    const tech1 = await prisma.technician.create({
        data: {
            nome: 'João Silva',
            matricula: 'MAT-9842',
            regiao_atuacao: 'São Paulo - Centro',
            telefone: '(11) 98765-4321',
            status: 'ativo'
        }
    })

    const tech2 = await prisma.technician.create({
        data: {
            nome: 'Ricardo Souza',
            matricula: 'MAT-7721',
            regiao_atuacao: 'Rio de Janeiro - Sul',
            telefone: '(21) 91234-5678',
            status: 'ativo'
        }
    })

    // 3. Criar Vínculos (Assignments)
    console.log('🔗 Vinculando técnicos e motos...')
    await prisma.technicalAssignment.create({
        data: {
            tecnicoId: tech1.id,
            motoId: moto1.id,
            data_inicio: new Date()
        }
    })

    await prisma.technicalAssignment.create({
        data: {
            tecnicoId: tech2.id,
            motoId: moto2.id,
            data_inicio: new Date()
        }
    })

    // 4. Criar registros de óleo para testar alertas
    console.log('🛢️ Criando registros de óleo...')
    await prisma.oilChange.create({
        data: {
            motoId: moto1.id,
            tecnicoId: tech1.id,
            data: new Date(),
            quilometragem: 11600, // 12450 - 11600 = 850km (Deve gerar alerta no Dashboard > 800)
            quilometragem_ultima_troca: 10700,
            diferenca_km: 900,
            alerta_ultrapassou: false
        }
    })

    console.log('✅ Seed finalizado com sucesso!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

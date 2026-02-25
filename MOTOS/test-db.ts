import { Client } from 'pg';

async function test() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log('CONECTADO COM SUCESSO!');
        await client.end();
    } catch (err) {
        console.error('ERRO DE CONEXÃO:', err.message);
    }
}

test();

const { Client } = require('pg');

async function test() {
    const client = new Client({
        user: 'postgres.yxgynsajxtnqhjqlhhpt',
        host: 'db.yxgynsajxtnqhjqlhhpt.supabase.co',
        database: 'postgres',
        password: 'nFUZHcwx2B#xkCa',
        port: 6543,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('CONECTADO (MODO TRANSACIONAL)!');
        await client.end();
    } catch (err) {
        console.error('ERRO DE CONEXÃO TRANSACIONAL:', err.message);
    }
}

test();

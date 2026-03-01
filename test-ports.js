const { Client } = require('pg');

async function test6543() {
    const client = new Client({
        user: 'postgres',
        host: 'db.yxgynsajxtnqhjqlhhpt.supabase.co',
        database: 'postgres',
        password: 'nFUZHcwx2BxkCa',
        port: 6543,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('CONECTADO (Pgbouncer/Supavisor 6543)!');
        await client.end();
    } catch (err) {
        console.error('ERRO DE CONEXÃO 6543:', err.message);
    }
}

async function test5432() {
    const client = new Client({
        user: 'postgres',
        host: 'db.yxgynsajxtnqhjqlhhpt.supabase.co',
        database: 'postgres',
        password: 'nFUZHcwx2BxkCa',
        port: 5432,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('CONECTADO (Direta 5432)!');
        await client.end();
    } catch (err) {
        console.error('ERRO DE CONEXÃO 5432:', err.message);
    }
}

test6543().then(test5432);

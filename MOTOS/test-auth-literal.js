const { Client } = require('pg');

async function test() {
    const client = new Client({
        user: 'postgres',
        host: 'db.yxgynsajxtnqhjqlhhpt.supabase.co',
        database: 'postgres',
        password: 'nFUZHcwx2B#xkCa',
        port: 5432,
        ssl: { rejectUnauthorized: false }
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

const { Client } = require('pg');

const connectionString = "postgresql://postgres:nFUZHcwx2B%23xkCa@db.yxgynsajxtnqhjqlhhpt.supabase.co:5432/postgres";

async function test() {
    const client = new Client({
        connectionString: connectionString,
    });

    try {
        await client.connect();
        console.log('CONECTADO COM SUCESSO!');
        const res = await client.query('SELECT NOW()');
        console.log('Data do servidor:', res.rows[0]);
        await client.end();
    } catch (err) {
        console.error('ERRO DE CONEXÃO:', err.message);
    }
}

test();

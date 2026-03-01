const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yxgynsajxtnqhjqlhhpt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4Z3luc2FqeHRucWhqcWxoaHB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5Nzk2MDksImV4cCI6MjA4NzU1NTYwOX0.OevtIeYWKRAgQejDAzZFl4RYkowouduAwmSvUwdCkNM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    const { data, error } = await supabase.from('Technician').select('*').limit(1);
    if (error) {
        console.error('ERRO API:', error.message);
    } else {
        console.log('API CONECTADA (Tabelas podem estar vazias):', data);
    }
}

test();


const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://basnqmmcldjeiftyeorc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc25xbW1jbGRqZWlmdHllb3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MTA5NTEsImV4cCI6MjA4NjE4Njk1MX0.CyGqMoy7m-klq0MUXImXzsSrBczo2BJoZKleQCamWW4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectTable() {
    console.log('--- INSPECTING induction_content ---');

    // Check if we can select
    const { data: selectData, error: selectError } = await supabase
        .from('induction_content')
        .select('*')
        .eq('slug', 'main');

    if (selectError) {
        console.error('Select Error:', selectError);
    } else {
        console.log('Select Success, rows found:', selectData.length);
        console.log('Row details:', JSON.stringify(selectData, null, 2));
    }

    // Try to get table info via RPC or system tables if allowed
    const { data: schema, error: schemaError } = await supabase
        .rpc('get_table_info', { t_name: 'induction_content' }); // Probably won't work but worth a try

    if (schemaError) {
        console.log('RPC check failed (expected if not defined)');
    } else {
        console.log('Schema Info:', schema);
    }
}

inspectTable();

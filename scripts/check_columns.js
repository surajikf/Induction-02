const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://basnqmmcldjeiftyeorc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc25xbW1jbGRqZWlmdHllb3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MTA5NTEsImV4cCI6MjA4NjE4Njk1MX0.CyGqMoy7m-klq0MUXImXzsSrBczo2BJoZKleQCamWW4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkColumns() {
    const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'employees' });
    if (error) {
        // Fallback: fetch one record and check keys
        console.log('RPC failed, fetching one record...');
        const { data: recs, error: fetchError } = await supabase.from('employees').select('*').limit(1);
        if (fetchError) {
            console.error('Fetch error:', fetchError);
        } else {
            console.log('Record keys:', Object.keys(recs[0]));
        }
    } else {
        console.log('Columns:', data);
    }
}

checkColumns();

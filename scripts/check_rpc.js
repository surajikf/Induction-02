const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://basnqmmcldjeiftyeorc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc25xbW1jbGRqZWlmdHllb3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MTA5NTEsImV4cCI6MjA4NjE4Njk1MX0.CyGqMoy7m-klq0MUXImXzsSrBczo2BJoZKleQCamWW4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkRpc() {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: 'SELECT 1' });
    if (error) {
        console.log('Error:', error.message);
        if (error.message.includes('not found')) {
            console.log('RESULT: RPC exec_sql DOES NOT exist.');
        } else {
            console.log('RESULT: RPC exists but permission denied or other error.');
        }
    } else {
        console.log('RESULT: RPC exec_sql EXISTS and worked!', data);
    }
}

checkRpc();

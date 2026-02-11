
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://basnqmmcldjeiftyeorc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc25xbW1jbGRqZWlmdHllb3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MTA5NTEsImV4cCI6MjA4NjE4Njk1MX0.CyGqMoy7m-klq0MUXImXzsSrBczo2BJoZKleQCamWW4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testWrite() {
    console.log('Attempting to insert test client...');
    const { data, error } = await supabase.from('clients').insert([
        { name: 'Test Client', logo_url: 'https://example.com/logo.png', category: 'Test' }
    ]).select();

    if (error) {
        console.error('Write Failed:', error);
    } else {
        console.log('Write Successful:', data);
        // Clean up
        const { error: delError } = await supabase.from('clients').delete().eq('id', data[0].id);
        if (delError) console.error('Cleanup Failed:', delError);
        else console.log('Cleanup Successful');
    }
}

testWrite();

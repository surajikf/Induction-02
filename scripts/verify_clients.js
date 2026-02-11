
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://basnqmmcldjeiftyeorc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc25xbW1jbGRqZWlmdHllb3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MTA5NTEsImV4cCI6MjA4NjE4Njk1MX0.CyGqMoy7m-klq0MUXImXzsSrBczo2BJoZKleQCamWW4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyClients() {
    const { data, error } = await supabase.from('clients').select('*');
    if (error) {
        console.error('Error fetching clients:', error);
    } else {
        console.log(`Found ${data.length} clients.`);
        if (data.length > 0) {
            console.log('Top 5 Clients by Display Order:');
            data.slice(0, 5).forEach(c => console.log(`${c.display_order}: ${c.name} (${c.category})`));
        }
    }
}

verifyClients();

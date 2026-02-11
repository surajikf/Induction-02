
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://basnqmmcldjeiftyeorc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc25xbW1jbGRqZWlmdHllb3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MTA5NTEsImV4cCI6MjA4NjE4Njk1MX0.CyGqMoy7m-klq0MUXImXzsSrBczo2BJoZKleQCamWW4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixAndDebug() {
    console.log('--- Checking Employees ---');
    const { data: employees, error: empError } = await supabase.from('employees').select('id, name, img');
    if (empError) console.error('Error fetching employees:', empError);
    else console.log(`Found ${employees.length} employees. Sample:`, employees.slice(0, 3));

    console.log('\n--- Checking Social Links Table ---');
    const { data: social, error: socialError } = await supabase.from('social_links').select('*').limit(1);

    if (socialError && (socialError.code === '42P01' || socialError.message.includes('dtoes not exist') || socialError.status === 404)) {
        console.log('Social Links table missing. Need to create it.');
    } else if (socialError) {
        console.error('Other Social Links Error:', socialError);
    } else {
        console.log('Social Links table exists.');
    }
}

fixAndDebug();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://basnqmmcldjeiftyeorc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc25xbW1jbGRqZWlmdHllb3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MTA5NTEsImV4cCI6MjA4NjE4Njk1MX0.CyGqMoy7m-klq0MUXImXzsSrBczo2BJoZKleQCamWW4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verify() {
    const { data, count, error } = await supabase.from('employees').select('id', { count: 'exact' });
    if (error) {
        console.error('Error:', error);
    } else {
        console.log(`Total Employees in DB: ${count}`);

        // Check for a new employee from the list
        const { data: pawan } = await supabase.from('employees').select('*').eq('name', 'Pawan Sharad Shimpi').single();
        console.log('Verification (Pawan):', JSON.stringify(pawan, null, 2));

        // Check for updated employee
        const { data: sharvey } = await supabase.from('employees').select('*').eq('name', 'Sharvey Rukari').single();
        console.log('Verification (Sharvey - check dob/doj):', JSON.stringify(sharvey, null, 2));
    }
}

verify();

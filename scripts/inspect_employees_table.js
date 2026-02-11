
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://basnqmmcldjeiftyeorc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc25xbW1jbGRqZWlmdHllb3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MTA5NTEsImV4cCI6MjA4NjE4Njk1MX0.CyGqMoy7m-klq0MUXImXzsSrBczo2BJoZKleQCamWW4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectEmployees() {
    console.log('--- Inspecting Employees Table Structure ---');

    // Check if we can upsert
    const testId = 'test-id-' + Date.now();
    const { data, error } = await supabase.from('employees').upsert({
        id: testId,
        name: 'Test Entry',
        dept: 'Testing',
        role: 'Tester',
        img: 'https://via.placeholder.com/150'
    });

    if (error) {
        console.error('UPSERT FAILED:', error);
    } else {
        console.log('UPSERT SUCCESSFUL. Schema seems to permit these fields.');
        // Clean up
        await supabase.from('employees').delete().eq('id', testId);
    }

    // Try to get a sample with full columns
    const { data: sample, error: fetchError } = await supabase.from('employees').select('*').limit(1);
    if (fetchError) {
        console.error('FETCH ERROR:', fetchError);
    } else {
        console.log('Sample Data Columns:', Object.keys(sample[0]));
    }
}

inspectEmployees();


const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://basnqmmcldjeiftyeorc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc25xbW1jbGRqZWlmdHllb3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MTA5NTEsImV4cCI6MjA4NjE4Njk1MX0.CyGqMoy7m-klq0MUXImXzsSrBczo2BJoZKleQCamWW4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugEmployee() {
    const { data, error } = await supabase
        .from('employees')
        .select('*')
        .ilike('name', '%Suraj%');

    if (error) {
        console.error('Error fetching employee:', error);
    } else {
        console.log('Employee Data:', data);
        if (data.length > 0) {
            const imgUrl = data[0].img;
            console.log('Image URL:', imgUrl);
            // Verify if URL is valid format
            if (imgUrl.includes('supabase.co')) {
                console.log('URL format seems correct (Supabase Storage).');
            } else {
                console.log('URL format seems odd.');
            }
        }
    }
}

debugEmployee();

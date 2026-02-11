
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabaseUrl = 'https://basnqmmcldjeiftyeorc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc25xbW1jbGRqZWlmdHllb3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MTA5NTEsImV4cCI6MjA4NjE4Njk1MX0.CyGqMoy7m-klq0MUXImXzsSrBczo2BJoZKleQCamWW4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanup() {
    console.log('Cleaning up invalid "Career" clients...');

    // Delete where category is 'Career'
    // The screenshot showed "Career" as the header.
    const { data, error } = await supabase
        .from('clients')
        .delete()
        .eq('category', 'Career');

    if (error) {
        console.error('Error deleting:', error);
    } else {
        console.log('Cleanup successful. Deleted records.');
    }
}

cleanup();

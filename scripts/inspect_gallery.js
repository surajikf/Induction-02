const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://basnqmmcldjeiftyeorc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc25xbW1jbGRqZWlmdHllb3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MTA5NTEsImV4cCI6MjA4NjE4Njk1MX0.CyGqMoy7m-klq0MUXImXzsSrBczo2BJoZKleQCamWW4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectGallery() {
    const { data, error } = await supabase.from('gallery').select('*');
    if (error) {
        console.error('Error:', error);
        return;
    }
    console.log('Total items:', data.length);
    const categories = [...new Set(data.map(i => i.category))];
    console.log('Categories:', categories);
    console.log('Sample data (first 5):');
    console.log(JSON.stringify(data.slice(0, 5), null, 2));
}

inspectGallery();

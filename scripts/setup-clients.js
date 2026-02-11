const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://basnqmmcldjeiftyeorc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc25xbW1jbGRqZWlmdHllb3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MTA5NTEsImV4cCI6MjA4NjE4Njk1MX0.CyGqMoy7m-klq0MUXImXzsSrBczo2BJoZKleQCamWW4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupClientsTable() {
    console.log('🔧 Setting up clients table...\n');

    // Note: Table creation SQL should be run in Supabase SQL Editor
    // This script will insert sample clients

    const sampleClients = [
        { name: 'Oriental Rubber', logo_url: 'https://www.ikf.co.in/wp-content/uploads/2023/01/oriental-rubber-logo.png', category: 'Manufacturing', is_featured: true, display_order: 1 },
        { name: 'De Mandovi', logo_url: 'https://www.ikf.co.in/wp-content/uploads/2023/01/de-mandovi-logo.png', category: 'Luxury', is_featured: true, display_order: 2 },
        { name: 'Mahindra', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Mahindra_Logo.svg/320px-Mahindra_Logo.svg.png', category: 'Automotive', is_featured: true, display_order: 3 },
        { name: 'Tata Motors', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Tata_Motors_Logo.svg/320px-Tata_Motors_Logo.svg.png', category: 'Automotive', is_featured: true, display_order: 4 },
        { name: 'Bajaj', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Bajaj_Auto_Logo.svg/320px-Bajaj_Auto_Logo.svg.png', category: 'Automotive', is_featured: true, display_order: 5 },
        { name: 'Godrej', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Godrej_Logo.svg/320px-Godrej_Logo.svg.png', category: 'FMCG', is_featured: true, display_order: 6 },
        { name: 'Asian Paints', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Asian_Paints_Logo.svg/320px-Asian_Paints_Logo.svg.png', category: 'Paints', is_featured: true, display_order: 7 },
        { name: 'Pidilite', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Pidilite_Industries_Logo.svg/320px-Pidilite_Industries_Logo.svg.png', category: 'Chemicals', is_featured: true, display_order: 8 },
        { name: 'Crompton', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Crompton_Greaves_Logo.svg/320px-Crompton_Greaves_Logo.svg.png', category: 'Electronics', is_featured: true, display_order: 9 },
        { name: 'Voltas', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Voltas_Logo.svg/320px-Voltas_Logo.svg.png', category: 'Electronics', is_featured: true, display_order: 10 },
        { name: 'Blue Star', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Blue_Star_Limited_Logo.svg/320px-Blue_Star_Limited_Logo.svg.png', category: 'HVAC', is_featured: true, display_order: 11 },
        { name: 'Havells', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Havells_Logo.svg/320px-Havells_Logo.svg.png', category: 'Electronics', is_featured: true, display_order: 12 }
    ];

    console.log(`📤 Inserting ${sampleClients.length} sample clients...\n`);

    const { data, error } = await supabase
        .from('clients')
        .insert(sampleClients)
        .select();

    if (error) {
        console.error('❌ Error inserting clients:', error);
        return;
    }

    console.log(`✅ Successfully inserted ${data.length} clients!\n`);
    console.log('Clients:');
    data.forEach((client, idx) => {
        console.log(`${idx + 1}. ${client.name} (${client.category})`);
    });
}

setupClientsTable().catch(console.error);

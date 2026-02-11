
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://basnqmmcldjeiftyeorc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc25xbW1jbGRqZWlmdHllb3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MTA5NTEsImV4cCI6MjA4NjE4Njk1MX0.CyGqMoy7m-klq0MUXImXzsSrBczo2BJoZKleQCamWW4';

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: SUPABASE_URL and SUPABASE_KEY are required.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const clients = [
    // Vehicle Manufacturing
    { name: 'Tata Motors', category: 'Vehicle Manufacturing', logo_url: 'https://placehold.co/200x80?text=Tata+Motors', is_featured: true, display_order: 1 },
    { name: 'Mahindra', category: 'Vehicle Manufacturing', logo_url: 'https://placehold.co/200x80?text=Mahindra', is_featured: true, display_order: 2 },
    { name: 'Bajaj', category: 'Vehicle Manufacturing', logo_url: 'https://placehold.co/200x80?text=Bajaj', is_featured: true, display_order: 3 },

    // Consumer Goods & Appliances
    { name: 'Godrej', category: 'Consumer Goods & Appliances', logo_url: 'https://placehold.co/200x80?text=Godrej', is_featured: true, display_order: 4 },
    { name: 'Voltas', category: 'Consumer Goods & Appliances', logo_url: 'https://placehold.co/200x80?text=Voltas', is_featured: true, display_order: 5 },
    { name: 'Blue Star', category: 'Consumer Goods & Appliances', logo_url: 'https://placehold.co/200x80?text=Blue+Star', is_featured: true, display_order: 6 },
    { name: 'Havells', category: 'Consumer Goods & Appliances', logo_url: 'https://placehold.co/200x80?text=Havells', is_featured: true, display_order: 7 },
    { name: 'Crompton', category: 'Consumer Goods & Appliances', logo_url: 'https://placehold.co/200x80?text=Crompton', is_featured: true, display_order: 8 },

    // Industrial & Manufacturing
    { name: 'Asian Paints', category: 'Industrial & Manufacturing', logo_url: 'https://placehold.co/200x80?text=Asian+Paints', is_featured: true, display_order: 9 },
    { name: 'Pidilite', category: 'Industrial & Manufacturing', logo_url: 'https://placehold.co/200x80?text=Pidilite', is_featured: true, display_order: 10 },
    { name: 'Oriental Rubber', category: 'Industrial & Manufacturing', logo_url: 'https://placehold.co/200x80?text=Oriental+Rubber', is_featured: true, display_order: 11 },

    // Automotive Dealership
    { name: 'De Mandovi', category: 'Automotive Dealership', logo_url: 'https://placehold.co/200x80?text=De+Mandovi', is_featured: true, display_order: 12 }
];

async function populateClients() {
    console.log('--- Populating Clients Table ---');

    // 1. Clear existing data (optional, but good for reset)
    const { error: deleteError } = await supabase
        .from('clients')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
        console.error('Error clearing clients table:', deleteError);
        return;
    }
    console.log('Cleared existing clients.');

    // 2. Insert new data
    const { data, error } = await supabase
        .from('clients')
        .insert(clients)
        .select();

    if (error) {
        console.error('Error inserting clients:', error);
    } else {
        console.log(`Successfully inserted ${data.length} clients.`);
    }
}

populateClients();

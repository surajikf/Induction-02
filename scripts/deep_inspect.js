
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://basnqmmcldjeiftyeorc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc25xbW1jbGRqZWlmdHllb3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MTA5NTEsImV4cCI6MjA4NjE4Njk1MX0.CyGqMoy7m-klq0MUXImXzsSrBczo2BJoZKleQCamWW4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function deepInspect() {
    console.log('--- DEEP INSPECTION ---');

    // 1. Check existing rows
    const { data: rows, error: rowsErr } = await supabase.from('induction_content').select('*');
    console.log('Current rows:', JSON.stringify(rows, null, 2));

    // 2. Try to update 'main' slug via simple update (not upsert) to see if it works
    console.log('--- TESTING UPDATE ---');
    const { data: updateData, error: updateErr } = await supabase
        .from('induction_content')
        .update({ updated_at: new Date().toISOString() })
        .eq('slug', 'main');

    if (updateErr) {
        console.error('Update Error:', updateErr);
    } else {
        console.log('Update Success!');
    }

    // 3. Try to upsert AGAIN with explicit conflict target
    console.log('--- TESTING UPSERT WITH onConflict ---');
    const { data: upsertData, error: upsertErr } = await supabase
        .from('induction_content')
        .upsert({ slug: 'main', updated_at: new Date().toISOString() }, { onConflict: 'slug' });

    if (upsertErr) {
        console.error('Upsert Error:', upsertErr);
    } else {
        console.log('Upsert Success!');
    }
}

deepInspect();

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = 'https://pzvskzofasxnyaxunmly.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
    const sqlPath = path.join(__dirname, 'add_contact_columns.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Applying migration: add_contact_columns.sql');

    // Supabase JS client doesn't have a direct .sql() method for arbitrary SQL
    // We usually use RPC or a specific edge function for migrations
    // For this environment, we'll try to use the REST API if possible, 
    // but the most reliable way is often to manually run it in the dashboard.
    // However, I will try to use the PostgreSQL function approach if available.

    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
        console.error('Migration failed:', error.message);
        console.log('TIP: If "exec_sql" RPC is missing, please run the SQL manually in Supabase SQL Editor:');
        console.log(sql);
    } else {
        console.log('Migration successful!');
    }
}

applyMigration();

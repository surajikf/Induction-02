
const { createClient } = require('@supabase/supabase-js');

// Config
const supabaseUrl = 'https://basnqmmcldjeiftyeorc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc25xbW1jbGRqZWlmdHllb3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MTA5NTEsImV4cCI6MjA4NjE4Njk1MX0.CyGqMoy7m-klq0MUXImXzsSrBczo2BJoZKleQCamWW4';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runQATests() {
    console.log('--- STARTING QA AUTOMATION ---');
    let passed = 0;
    let failed = 0;

    // Helper for assertions
    const assert = (desc, condition) => {
        if (condition) {
            console.log(`[PASS] ${desc}`);
            passed++;
        } else {
            console.error(`[FAIL] ${desc}`);
            failed++;
        }
    };

    try {
        // --- TEST 1: GLOBAL CONTENT REFLECTION ---
        console.log('\n--- SCENARIO A: GLOBAL CONTENT REFLECTION ---');

        // 1. Fetch current content
        const { data: initialContent } = await supabase.from('induction_content').select('data').eq('slug', 'main').single();
        const originalBadge = initialContent.data.hero.badge;
        console.log(`Original Badge: "${originalBadge}"`);

        // 2. Update Badge
        const testBadge = "QA VALIDATION ACTIVE " + Date.now();
        initialContent.data.hero.badge = testBadge;

        const { error: updateErr } = await supabase
            .from('induction_content')
            .update({ data: initialContent.data, updated_at: new Date().toISOString() })
            .eq('slug', 'main');

        assert('Update Content Operation', !updateErr);

        // 3. Verify Reflection
        const { data: verifyContent } = await supabase.from('induction_content').select('data').eq('slug', 'main').single();
        assert('Content Reflection in DB', verifyContent.data.hero.badge === testBadge);

        // 4. Revert
        initialContent.data.hero.badge = originalBadge;
        await supabase
            .from('induction_content')
            .update({ data: initialContent.data, updated_at: new Date().toISOString() })
            .eq('slug', 'main');
        console.log('Reverted content changes.');

        // --- TEST 2: EMPLOYEE CRUD ---
        console.log('\n--- SCENARIO B: EMPLOYEE LIFE CYCLE ---');
        const testId = `qa-bot-${Date.now()}`;
        const newEmployee = {
            id: testId,
            name: 'QA Automation Bot',
            role: 'System Tester',
            dept: 'Engineering',
            is_leader: false,
            img: 'https://via.placeholder.com/150'
        };

        // 1. Create
        const { error: createErr } = await supabase.from('employees').upsert(newEmployee);
        assert('Create Employee', !createErr);

        // 2. Read
        const { data: readEmp } = await supabase.from('employees').select('*').eq('id', testId).single();
        assert('Read Employee', readEmp && readEmp.name === 'QA Automation Bot');

        // 3. Update
        const { error: updateEmpErr } = await supabase.from('employees').update({ role: 'Senior AI Tester' }).eq('id', testId);
        assert('Update Employee', !updateEmpErr);

        const { data: verifyUpdate } = await supabase.from('employees').select('*').eq('id', testId).single();
        assert('Verify Update', verifyUpdate.role === 'Senior AI Tester');

        // 4. Delete
        const { error: deleteErr } = await supabase.from('employees').delete().eq('id', testId);
        assert('Delete Employee', !deleteErr);

        const { data: verifyDelete } = await supabase.from('employees').select('*').eq('id', testId).single();
        assert('Verify Deletion', !verifyDelete);

        // --- TEST 3: CLIENTS CRUD ---
        console.log('\n--- SCENARIO C: CLIENT PARTNERS ---');
        const clientTestId = crypto.randomUUID();
        const newClient = {
            id: clientTestId,
            name: 'QA Tech Partners',
            category: 'Automated Testing',
            logo_url: 'https://via.placeholder.com/150',
            website_url: 'https://example.com',
            display_order: 9999
        };

        // 1. Create
        const { error: createClientErr } = await supabase.from('clients').upsert(newClient, { onConflict: 'id' });
        if (createClientErr) console.error('Create Client Error:', createClientErr);
        assert('Create Client', !createClientErr);

        // 2. Read
        const { data: readClient } = await supabase.from('clients').select('*').eq('id', clientTestId).single();
        assert('Read Client', readClient && readClient.name === 'QA Tech Partners');
        assert('Verify Category', readClient && readClient.category === 'Automated Testing');

        // 3. Update with Special Characters (to test escaping/persistence)
        const specialCategory = 'R&D "Special" Team';
        const { error: updateClientErr } = await supabase.from('clients').update({ category: specialCategory }).eq('id', clientTestId);
        assert('Update Client (Special Chars)', !updateClientErr);

        const { data: verifyClientUpdate } = await supabase.from('clients').select('*').eq('id', clientTestId).single();
        assert('Verify Client Update', verifyClientUpdate.category === specialCategory);

        // 4. Delete
        const { error: deleteClientErr } = await supabase.from('clients').delete().eq('id', clientTestId);
        assert('Delete Client', !deleteClientErr);

    } catch (err) {
        console.error('CRITICAL TEST FAILURE:', err);
        failed++;
    }

    console.log('\n--- QA SUMMARY ---');
    console.log(`PASSED: ${passed}`);
    console.log(`FAILED: ${failed}`);

    if (failed === 0) {
        console.log('RESULT: [SUCCESS] System is Production Ready.');
    } else {
        console.log('RESULT: [FAILURE] Critical issues found.');
        process.exit(1);
    }
}

runQATests();

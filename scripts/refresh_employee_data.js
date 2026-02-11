
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://basnqmmcldjeiftyeorc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc25xbW1jbGRqZWlmdHllb3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MTA5NTEsImV4cCI6MjA4NjE4Njk1MX0.CyGqMoy7m-klq0MUXImXzsSrBczo2BJoZKleQCamWW4';

const supabase = createClient(supabaseUrl, supabaseKey);

const monthsMap = {
    'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
    'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
};

function parseDate(dateStr) {
    if (!dateStr || dateStr === '-' || dateStr === '0') return null;
    // Format: 03-May-1975
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    const day = parts[0].padStart(2, '0');
    const month = monthsMap[parts[1].substring(0, 3)];
    const year = parts[2];
    if (!month) return null;
    return `${year}-${month}-${day}`;
}

async function refreshData() {
    console.log('--- Refreshing Employee Data from User Input ---');

    const filePath = path.join(__dirname, '..', 'data', 'received_employee_data.txt');
    const rawData = fs.readFileSync(filePath, 'utf8');
    const lines = rawData.split('\n');

    const parsedEmployees = [];
    let currentEmp = null;

    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) {
            if (currentEmp) {
                parsedEmployees.push(currentEmp);
                currentEmp = null;
            }
            return;
        }

        if (trimmed.includes('Birthday🎂 :')) {
            currentEmp.dob = parseDate(trimmed.split('Birthday🎂 :')[1].trim());
        } else if (trimmed.includes('Date of joining:')) {
            currentEmp.doj = parseDate(trimmed.split('Date of joining:')[1].trim());
        } else if (trimmed.includes('Mobile No. :')) {
            currentEmp.mobile = trimmed.split('Mobile No. :')[1].trim();
        } else if (trimmed.includes('Email-Id :')) {
            currentEmp.email = trimmed.split('Email-Id :')[1].trim();
        } else {
            // Likely Name or Role
            if (!currentEmp) {
                currentEmp = { name: trimmed, role: '', dob: null, doj: null, mobile: '', email: '' };
            } else if (!currentEmp.role) {
                // If the line is the same as the name, skip (user pasted name twice sometimes)
                if (trimmed.toLowerCase().replace(/\s+/g, '') === currentEmp.name.toLowerCase().replace(/\s+/g, '')) {
                    // skip
                } else if (!['-', '0'].includes(trimmed)) {
                    currentEmp.role = trimmed;
                }
            }
        }
    });
    if (currentEmp) parsedEmployees.push(currentEmp);

    console.log(`Parsed ${parsedEmployees.length} unique records.`);

    // Get existing employees from Supabase to match IDs
    const { data: dbEmployees, error: fetchError } = await supabase.from('employees').select('id, name');
    if (fetchError) {
        console.error('Error fetching employees:', fetchError);
        return;
    }

    let updated = 0;
    let found = 0;
    let created = 0;

    for (const emp of parsedEmployees) {
        const match = dbEmployees.find(e =>
            e.name.toLowerCase().trim().replace(/\s+/g, ' ') === emp.name.toLowerCase().trim().replace(/\s+/g, ' ')
        );

        const updateData = {
            name: emp.name,
            role: emp.role || 'Team Member',
            dob: emp.dob,
            doj: emp.doj,
            mobile: emp.mobile,
            email: emp.email
        };

        if (match) {
            found++;
            // console.log(`Syncing ${emp.name} (Matched ID: ${match.id})...`);
            const { error } = await supabase.from('employees').update(updateData).eq('id', match.id);
            if (error) {
                console.error(`Error updating ${emp.name}:`, error.message);
            } else {
                updated++;
            }
        } else {
            console.log(`Creating NEW entry for ${emp.name}...`);
            const { error } = await supabase.from('employees').insert({
                ...updateData,
                dept: 'Other', // default if not found
                is_leader: false
            });
            if (error) {
                console.error(`Error inserting ${emp.name}:`, error.message);
            } else {
                created++;
            }
        }
    }

    console.log('\n--- Final Sync Stats ---');
    console.log(`Matched & Updated: ${updated}`);
    console.log(`Newly Created: ${created}`);
    console.log(`Matching Failures: ${found - updated}`);
}

refreshData();

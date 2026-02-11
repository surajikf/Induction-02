
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://basnqmmcldjeiftyeorc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc25xbW1jbGRqZWlmdHllb3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MTA5NTEsImV4cCI6MjA4NjE4Njk1MX0.CyGqMoy7m-klq0MUXImXzsSrBczo2BJoZKleQCamWW4';

const supabase = createClient(supabaseUrl, supabaseKey);

const months = {
    'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
    'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
};

function parseDate(dateStr) {
    if (!dateStr || dateStr === '-') return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    const day = parts[0].padStart(2, '0');
    const month = months[parts[1]];
    const year = parts[2];
    if (!month) return null;
    return `${year}-${month}-${day}`;
}

async function updateEmployeeDates() {
    console.log('--- Updating Employee Dates ---');

    const extractedData = JSON.parse(fs.readFileSync('extracted_employees.json', 'utf8'));
    console.log(`Loaded ${extractedData.length} records from extraction.`);

    // Get existing employees from Supabase
    const { data: employees, error: fetchError } = await supabase.from('employees').select('id, name');
    if (fetchError) {
        console.error('Error fetching employees:', fetchError);
        return;
    }
    console.log(`Fetched ${employees.length} employees from Supabase.`);

    let updatedCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const record of extractedData) {
        const dob = parseDate(record.dob);
        const doj = parseDate(record.doj);

        if (!dob && !doj) {
            skipCount++;
            continue;
        }

        // Try to find a match by name (case-insensitive and trimming extra spaces)
        const match = employees.find(e =>
            e.name.toLowerCase().trim().replace(/\s+/g, ' ') === record.name.toLowerCase().trim().replace(/\s+/g, ' ')
        );

        if (match) {
            console.log(`Updating ${match.name} (ID: ${match.id})...`);
            const { error: updateError } = await supabase.from('employees').update({
                dob: dob,
                doj: doj
            }).eq('id', match.id);

            if (updateError) {
                console.error(`Error updating ${match.name}:`, updateError.message);
                if (updateError.message.includes('column "dob" does not exist')) {
                    console.error('CRITICAL: Columns missing. Please run scripts/add_employee_date_columns.sql in Supabase SQL editor.');
                    return;
                }
                errorCount++;
            } else {
                updatedCount++;
            }
        } else {
            // console.log(`No match found for ${record.name}`);
            skipCount++;
        }
    }

    console.log(`--- Finished ---`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Skipped/No Match: ${skipCount}`);
    console.log(`Errors: ${errorCount}`);
}

updateEmployeeDates();

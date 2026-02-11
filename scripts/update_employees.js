const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://basnqmmcldjeiftyeorc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc25xbW1jbGRqZWlmdHllb3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MTA5NTEsImV4cCI6MjA4NjE4Njk1MX0.CyGqMoy7m-klq0MUXImXzsSrBczo2BJoZKleQCamWW4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const rawData = `
Ashish Dalia
CEO
Birthday🎂 : 03-May-1975
Date of joining: 01-Jan-2000
Mobile No. : 9822190551/24226212
Email-Id : ashish@ikf.co.in

Sagar Chavan
Design Team Lead
Birthday🎂 : 13-Jul-1987
Date of joining: 25-May-2016
Mobile No. : 8600950110/7385157374
Email-Id : sagar.chavan@ikf.co.in

Ritu Dalia
-
Birthday🎂 : 17-Nov-1979
Date of joining: 09-Apr-2018
Mobile No. : 9822231631/02024226212
Email-Id : ritu@ikf.co.in

Neha Kakkad
Head of Sales and Marketing
Birthday🎂 : 06-Jul-1990
Date of joining: 31-Jan-2024
Mobile No. : 9892893517/9168845599
Email-Id : neha.kakkad@ikf.co.in

Suraj Santram Sonnar
Sr.Test Engineer
Birthday🎂 : 08-May-1992
Date of joining: 17-Jun-2019
Mobile No. : 9272850850/9421277767
Email-Id : suraj.sonnar@ikf.co.in

Vishal Kale
Team Lead - Web Design
Birthday🎂 : 24-May-1990
Date of joining: 05-Oct-2020
Mobile No. : 9730958692/9730657157
Email-Id : vishal.kale@ikf.co.in

Dhruvi Gandhi
Sr.Social Media Executive
Birthday🎂 : 23-Jul-2002
Date of joining: 05-Apr-2021
Mobile No. : 9767660616/9420460009
Email-Id : dhruvi.gandhi@ikf.co.in

Pushkar Sangle
Server Admin
Birthday🎂 : 20-Nov-1997
Date of joining: 03-Apr-2022
Mobile No. : 8080579017/8805286476
Email-Id : pushkar@ikf.co.in

Krupali Masavkar Thorat
Sr. Accountant
Birthday🎂 : 27-Oct-1996
Date of joining: 17-Jul-2023
Mobile No. : 8291141975/8149393172
Email-Id : krupali@ikf.co.in

Amruta Mane
Business Analyst
Birthday🎂 : 06-Oct-2000
Date of joining: 01-Oct-2024
Mobile No. : 7030899256/7030899256
Email-Id : Amruta.Mane@ikf.co.in

Adarssh Bhagwat
Account Manager- SEO and PPC
Birthday🎂 : 14-Feb-1998
Date of joining: 05-Dec-2024
Mobile No. : 7776903811/8149025648
Email-Id : adarssh.bhagwat@ikf.co.in

Pawan Sharad Shimpi
Software Engineer
Birthday🎂 : 21-Sep-2001
Date of joining: 13-Feb-2025
Mobile No. : 9921353589/9011959145
Email-Id : pawan.shimpi@ikf.co.in

Apoorva Gholap
HR Executive
Birthday🎂 : 12-May-1998
Date of joining: 07-Oct-2025
Mobile No. : 8237711440/9689890341
Email-Id : apoorva.gholap@ikf.co.in

Megha Ruparel
Sr. HR Executive
Birthday🎂 : 24-Dec-2002
Date of joining: 25-Nov-2025
Mobile No. : 8010744302/9623087631
Email-Id : megha.ruparel@ikf.co.in

Vivekananda Sai
AI- Engineer
Birthday🎂 : 10-Mar-2003
Date of joining: 05-Jan-2026
Mobile No. : 8866565959/9393288399
Email-Id : vivek@ikf.in

Rutwik Kamble
Sr. Social Media Executive
Birthday🎂 : 15-Nov-1999
Date of joining: 21-Jan-2026
Mobile No. : 7021636022/7977857249
Email-Id : rutwik.kamble@ikf.co.in

Sharvey Rukari
Sharvey Rukari
Sr.Social Media Executive & Production Lead
Birthday🎂 : 04-Feb-1999
Date of joining: 09-Feb-2026
Mobile No. : 999550562/999550562
Email-Id : sharveyr@gmail.com

Rohit Jagtap
Rohit Jagtap
Graphic Designer
Birthday🎂 : 13-Jun-2000
Date of joining: 04-Feb-2022
Mobile No. : 8830914117/8983730581
Email-Id : rohit.jagtap@ikf.co.in

Abhishek Kadam
Abhishek Kadam
Senior UI /UX Designer
Birthday🎂 : 12-Aug-1990
Date of joining: 23-Aug-2021
Mobile No. : 9423506233/7057533861
Email-Id : abhishek.kadam@ikf.co.in

Nitesh Hande
Nitesh Hande
Sr. Graphic Designer
Birthday🎂 : 17-Jul-1988
Date of joining: 06-Jan-2025
Mobile No. : 8149142070/8446655107
Email-Id : nitesh.hande@ikf.co.in

Tanishka Masaliya
Tanishka Masaliya
Sales Executive
Birthday🎂 : 02-Mar-2002
Date of joining: 23-Aug-2023
Mobile No. : 9359362634/9850180826
Email-Id : tanishka.masaliya@ikf.co.in

Kishor Mokashi
Kishor Mokashi
UI Developer
Birthday🎂 : 16-Mar-1989
Date of joining: 13-May-2016
Mobile No. : 7588447151/9405830764
Email-Id : kishor.mokashi@ikf.co.in

Aditya Kawankar
Aditya Kawankar
Sr. UI Developer
Birthday🎂 : 02-Feb-1992
Date of joining: 26-Feb-2018
Mobile No. : 8087603018/9763311655
Email-Id : aditya.kawankar@ikf.co.in

Pavan Gaikwad
Pavan Gaikwad
UI Developer
Birthday🎂 : 03-Jun-1998
Date of joining: 09-Feb-2022
Mobile No. : 8805173330/9850045801
Email-Id : pavan.gaikwad@ikf.co.in

Laxman Kendre
Laxman Kendre
Software Engineer
Birthday🎂 : 25-Jun-1992
Date of joining: 30-Aug-2021
Mobile No. : 8668282906/9049315652
Email-Id : Laxman.kendre@ikf.co.in

Saurabh Gunjkar
Saurabh Gunjkar
UI Developer
Birthday🎂 : 30-Aug-1996
Date of joining: 22-Mar-2022
Mobile No. : 8888680972/9881675224
Email-Id : saurabh.gunjkar@ikf.co.in

Amaan Bhombal
Amaan Bhombal
Social Media Executive
Birthday🎂 : 26-Oct-2002
Date of joining: 18-Dec-2023
Mobile No. : 8308261002/9890913799
Email-Id : amaan.bhombal@ikf.co.in

Pranav Yadav
Pranav Yadav
Media Production & Content Creator
Birthday🎂 : 08-Jun-2000
Date of joining: 06-Feb-2024
Mobile No. : 8888718804/7045036538
Email-Id : pranav.yadav@ikf.co.in

Nikhil Gurav
Nikhil Gurav
Video Editor
Birthday🎂 : 03-Aug-1992
Date of joining: 15-May-2024
Mobile No. : 8446050581/9922076475
Email-Id : nikhil.gurav@ikf.co.in

Varad Ghore
Varad Ghore
Video Editor
Birthday🎂 : 12-Feb-2005
Date of joining: 23-Oct-2024
Mobile No. : 9834254702/8208251265
Email-Id : varad.Ghore@ikf.co.in

Avisha Meshram
Avisha Meshram
Copywriter
Birthday🎂 : 20-Oct-2001
Date of joining: 20-Aug-2025
Mobile No. : 9145482228/9145482228
Email-Id : avisha.meshram@ikf.co.in

Khushbu Mantri
Khushbu Mantri
Social Media Intern
Birthday🎂 : 22-Jan-2004
Date of joining: 04-Nov-2025
Mobile No. : 9921171818/9225508304
Email-Id : ikfkhushbu@gmail.com

Diya Jain
Diya Jain
Social Media Intern
Birthday🎂 : 25-Feb-2002
Date of joining: 22-Dec-2025
Mobile No. : 9637529713/9637512907
Email-Id : diyajain5491@gmail.com

Amit Ranaware
Amit Ranaware
System Admin
Birthday🎂 : 11-Aug-1994
Date of joining: 01-Nov-2023
Mobile No. : 9011813339/9423874467
Email-Id : amit.ranaware@ikf.co.in

Pooja Purushottam Jambagi
Pooja Purushottam Jambagi
Account Executive
Birthday🎂 : 04-Sep-2002
Date of joining: 01-Jan-2025
Mobile No. : 8379076919/8379076919
Email-Id : Pooja.Jambagi@ikf.co.in

Ashwini Jeetendra Palange
Ashwini Jeetendra Palange
Business Analyst
Birthday🎂 : 23-Sep-1999
Date of joining: 02-Feb-2026
Mobile No. : 9740491489/9028871021
Email-Id : ashwinipalange1@gmail.com

Ganesh Wagh
Ganesh Wagh
SEO Analyst
Birthday🎂 : 07-Sep-1995
Date of joining: 24-May-2022
Mobile No. : 8975469356/9822944436
Email-Id : ganesh.wagh@ikf.co.in

Dheeraj Chuttar
Dheeraj Chuttar
SEO Analyst
Birthday🎂 : 13-May-1990
Date of joining: 01-Feb-2023
Mobile No. : 9511751322/9890860185
Email-Id : dheeraj.chuttar@ikf.co.in

Ruchita Tambitkar
Ruchita Tambitkar
SEO Executive
Birthday🎂 : 13-Feb-2000
Date of joining: 05-Sep-2023
Mobile No. : 8999502761/9922735017
Email-Id : ruchita.tambitkar@ikf.co.in

Sayali Aniruddha Dhotre
Sayali Aniruddha Dhotre
Sr.PPC Executive
Birthday🎂 : 01-Feb-1997
Date of joining: 02-Jul-2024
Mobile No. : 9960869019/9970594834
Email-Id : sayali.dhotre@ikf.co.in

Sakshi Dhumal
Sakshi Dhumal
PPC- Intern
Birthday🎂 : 03-Nov-2004
Date of joining: 12-Jan-2026
Mobile No. : 8888868471/9881374879
Email-Id : sakshidhumal296@gmail.com

Pranay Gaynar
Pranay Gaynar
Software Engineer
Birthday🎂 : 05-May-2001
Date of joining: 09-Jan-2025
Mobile No. : 9307768467/9370480886
Email-Id : pranay.gaynar@ikf.co.in

Mayur Tarate
Mayur Tarate
AI - LLM INTERN
Birthday🎂 : 20-Sep-2004
Date of joining: 24-Nov-2025
Mobile No. : 8010235742/7776982768
Email-Id : mtarate2004@gmail.com

Kunal Thakare
Kunal Thakare
AI - LLM Intern
Birthday🎂 : 24-Nov-2006
Date of joining: 24-Nov-2025
Mobile No. : 8080272822/9657961175
Email-Id : kunalavinashthakare3@gmail.com

Samyak Bhaisare
Samyak Bhaisare
AI - LLM Intern
Birthday🎂 : 15-Apr-2004
Date of joining: 24-Nov-2025
Mobile No. : 8010947463/7391814686
Email-Id : samyakbhaisare99@gmail.com

Samriddhi Gupta
Samriddhi Gupta
AI - LLM INTERN
Birthday🎂 : 11-Apr-2005
Date of joining: 22-Dec-2025
Mobile No. : 9216742986/9784249211
Email-Id : samriddhigupta426@gmail.com
`;

const deptMap = {
    'CEO': 'Management',
    'Sales': 'Sales',
    'Marketing': 'Marketing',
    'Design': 'Design',
    'Graphic': 'Design',
    'UI': 'Technology',
    'Developer': 'Technology',
    'Engineer': 'Technology',
    'Admin': 'Technology',
    'Software': 'Technology',
    'HR': 'HR',
    'Accountant': 'Accounts',
    'Account Executive': 'Accounts',
    'Business Analyst': 'Business',
    'Analyst': 'Marketing', // SEO Analyst
    'Production': 'Media',
    'Media': 'Media',
    'Video': 'Media',
    'Copywriter': 'Media',
    'Intern': 'Technology',
    'PPC': 'Marketing',
    'Social Media': 'Marketing'
};

function getDept(role) {
    if (!role || role === '-' || role.trim() === '') return 'Core Team';
    for (const [key, value] of Object.entries(deptMap)) {
        if (role.toLowerCase().includes(key.toLowerCase())) return value;
    }
    return 'Core Team';
}

function parseDate(dateStr) {
    if (!dateStr || dateStr.trim() === '-' || dateStr.trim() === '') return null;
    const parts = dateStr.trim().split('-');
    if (parts.length !== 3) return null;

    const [day, monthStr, year] = parts;
    const months = {
        'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
        'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    const month = months[monthStr];
    if (!month) return null;

    return `${year}-${month}-${day.padStart(2, '0')}`;
}

async function updateEmployees() {
    console.log('--- STARTING BULK UPDATE (IMPROVED PARSER) ---');

    const { data: existing, error: fetchError } = await supabase.from('employees').select('id, name');
    if (fetchError) return console.error('Fetch error:', fetchError);

    const existingMap = new Map();
    existing.forEach(e => existingMap.set(e.name.toLowerCase(), e.id));

    const records = [];
    const blocks = rawData.trim().split(/\n\s*\n/);

    for (const block of blocks) {
        const lines = block.trim().split('\n').map(l => l.trim()).filter(l => l !== '');
        if (lines.length < 2) continue;

        const name = lines[0];
        let role = '';
        let dob = null, doj = null, email = null, mobile = null;

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const lowerLine = line.toLowerCase();
            if (lowerLine.includes('birthday')) {
                dob = parseDate(line.split(':')[1]);
            } else if (lowerLine.includes('joining')) {
                doj = parseDate(line.split(':')[1]);
            } else if (lowerLine.includes('mobile')) {
                mobile = line.split(':')[1].trim();
            } else if (lowerLine.includes('email')) {
                email = line.split(':')[1].trim();
            } else if (lowerLine !== name.toLowerCase() && !role) {
                role = line === '-' ? 'Core Team Member' : line;
            }
        }

        const dept = getDept(role);
        const id = existingMap.get(name.toLowerCase()) || `emp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

        records.push({
            id,
            name,
            role,
            dept,
            dob,
            doj,
            email,
            mobile,
            is_leader: role.includes('CEO') || role.includes('Head') || role.includes('Lead')
        });
    }

    console.log(`Parsed ${records.length} records. Initiating upsert...`);
    for (let i = 0; i < records.length; i += 10) {
        const chunk = records.slice(i, i + 10);
        const { error: upsertError } = await supabase.from('employees').upsert(chunk, { onConflict: 'id' });
        if (upsertError) console.error('Upsert error:', upsertError);
        else console.log(`Synced chunk ${i / 10 + 1}.`);
    }

    console.log('--- SYNC COMPLETE ---');
}

updateEmployees();


const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabaseUrl = 'https://basnqmmcldjeiftyeorc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc25xbW1jbGRqZWlmdHllb3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MTA5NTEsImV4cCI6MjA4NjE4Njk1MX0.CyGqMoy7m-klq0MUXImXzsSrBczo2BJoZKleQCamWW4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyUpload() {
    console.log('Testing upload permissions...');

    // Create a dummy file
    const fileContent = new Blob(['Test file content'], { type: 'text/plain' });
    const fileName = `test_upload_${Date.now()}.txt`;

    const { data, error } = await supabase
        .storage
        .from('gallery')
        .upload(fileName, fileContent);

    if (error) {
        console.error('Upload Failed:', error);
    } else {
        console.log('Upload Successful:', data);

        // Get Public URL
        const { data: { publicUrl } } = supabase
            .storage
            .from('gallery')
            .getPublicUrl(fileName);

        console.log('Public URL:', publicUrl);

        // Cleanup
        const { error: delError } = await supabase
            .storage
            .from('gallery')
            .remove([fileName]);

        if (delError) console.error('Cleanup Failed:', delError);
        else console.log('Cleanup Successful');
    }
}

verifyUpload();


const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://basnqmmcldjeiftyeorc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc25xbW1jbGRqZWlmdHllb3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MTA5NTEsImV4cCI6MjA4NjE4Njk1MX0.CyGqMoy7m-klq0MUXImXzsSrBczo2BJoZKleQCamWW4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkGalleryBucket() {
    console.log('--- Checking Gallery Bucket ---');

    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();

    if (bucketError) {
        console.error('Error listing buckets:', bucketError);
        return;
    }

    const galleryBucket = buckets.find(b => b.name === 'gallery');
    if (!galleryBucket) {
        console.error('Bucket "gallery" NOT FOUND!');
    } else {
        console.log('Bucket "gallery" exists:', galleryBucket);
        console.log('Is Public?', galleryBucket.public);
    }

    console.log('\n--- Testing Upload Permissions ---');
    const testFile = Buffer.from('test content');
    const testPath = 'test_' + Date.now() + '.txt';

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(testPath, testFile, { contentType: 'text/plain' });

    if (uploadError) {
        console.error('Upload Permission Denied:', uploadError);
    } else {
        console.log('Upload Permission Verified!');
        // Cleanup
        await supabase.storage.from('gallery').remove([testPath]);
    }
}

checkGalleryBucket();

console.log('--- Checking Environment Variables ---');
const keys = Object.keys(process.env).filter(k => k.toLowerCase().includes('supabase'));
if (keys.length === 0) {
    console.log('No Supabase-related environment variables found.');
} else {
    keys.forEach(k => {
        console.log(`${k}: [FOUND]`); // Don't log the actual value for security, just check if it exists
    });
}

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://basnqmmcldjeiftyeorc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc25xbW1jbGRqZWlmdHllb3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MTA5NTEsImV4cCI6MjA4NjE4Njk1MX0.CyGqMoy7m-klq0MUXImXzsSrBczo2BJoZKleQCamWW4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupSocialLinks() {
    console.log('🔧 Setting up social links...\n');

    const socialLinks = [
        {
            platform: 'linkedin',
            profile_url: 'https://www.linkedin.com/company/i-knowledge-factory-pvt.-ltd./',
            username: 'i-knowledge-factory-pvt.-ltd.',
            display_name: 'IKF Official',
            follower_count: '25k+',
            description: 'Top Talent Hub',
            display_order: 1
        },
        {
            platform: 'instagram',
            profile_url: 'https://www.instagram.com/ikfdigital/',
            username: 'ikfdigital',
            display_name: 'Life At IKF',
            follower_count: '18k+',
            description: 'Culture & Life',
            display_order: 2
        },
        {
            platform: 'youtube',
            profile_url: 'https://www.youtube.com/c/IKFDigital',
            username: 'IKFDigital',
            display_name: 'IKF Insights',
            follower_count: '5k+',
            description: 'Expert Insights',
            display_order: 3
        },
        {
            platform: 'facebook',
            profile_url: 'https://www.facebook.com/IKFDigital/',
            username: 'IKFDigital',
            display_name: 'IKF Community',
            follower_count: '42k+',
            description: 'Community Rooted',
            display_order: 4
        }
    ];

    console.log(`📤 Inserting ${socialLinks.length} social media profiles...\n`);

    const { data, error } = await supabase
        .from('social_links')
        .insert(socialLinks)
        .select();

    if (error) {
        console.error('❌ Error inserting social links:', error);
        return;
    }

    console.log(`✅ Successfully inserted ${data.length} social links!\n`);
    console.log('Social Profiles:');
    data.forEach((link, idx) => {
        console.log(`${idx + 1}. ${link.display_name} (${link.platform}) - ${link.follower_count}`);
    });
}

setupSocialLinks().catch(console.error);

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://basnqmmcldjeiftyeorc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc25xbW1jbGRqZWlmdHllb3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MTA5NTEsImV4cCI6MjA4NjE4Njk1MX0.CyGqMoy7m-klq0MUXImXzsSrBczo2BJoZKleQCamWW4';

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Fetch latest YouTube videos using YouTube RSS feed
 * No API key required!
 */
async function fetchYouTubeVideos(channelId = 'UCxvt-g7JsPNnkzhPbvhJZrQ') {
    try {
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

        // Note: This needs to be called from the frontend due to CORS
        // Or use a CORS proxy in production
        const response = await fetch(rssUrl);
        const xmlText = await response.text();

        // Parse XML (simple parsing for demo)
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        const entries = xmlDoc.querySelectorAll('entry');

        const videos = Array.from(entries).slice(0, 6).map(entry => {
            const videoId = entry.querySelector('videoId')?.textContent;
            const title = entry.querySelector('title')?.textContent;
            const published = entry.querySelector('published')?.textContent;

            return {
                platform: 'YouTube',
                title,
                videoId,
                thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                url: `https://www.youtube.com/watch?v=${videoId}`,
                date: new Date(published).toLocaleDateString()
            };
        });

        return videos;
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        return [];
    }
}

/**
 * Get social media embed codes
 */
function getSocialEmbeds(socialLinks) {
    return socialLinks.map(link => {
        switch (link.platform) {
            case 'instagram':
                // Instagram embed widget
                return {
                    platform: 'Instagram',
                    embedCode: `
                        <blockquote class="instagram-media" data-instgrm-permalink="${link.profile_url}" data-instgrm-version="14">
                        </blockquote>
                        <script async src="//www.instagram.com/embed.js"></script>
                    `
                };

            case 'linkedin':
                // LinkedIn embed (company page)
                const companyId = link.profile_url.split('/company/')[1]?.replace('/', '');
                return {
                    platform: 'LinkedIn',
                    embedCode: `
                        <script src="https://platform.linkedin.com/in.js" type="text/javascript"></script>
                        <script type="IN/CompanyProfile" data-id="${companyId}" data-format="inline"></script>
                    `
                };

            case 'facebook':
                // Facebook page plugin
                return {
                    platform: 'Facebook',
                    embedCode: `
                        <iframe src="https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(link.profile_url)}&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true" 
                        width="340" height="500" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true"></iframe>
                    `
                };

            default:
                return null;
        }
    }).filter(Boolean);
}

module.exports = {
    fetchYouTubeVideos,
    getSocialEmbeds
};

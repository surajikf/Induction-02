
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../ikf_clients.html');
const outputPath = path.join(__dirname, '../extracted_clients.json');

try {
    const html = fs.readFileSync(htmlPath, 'utf8');

    // 1. Extract Tab Titles (ID -> Name)
    // <div id="elementor-tab-title-2061" ... >All</div>
    const titleMap = {};
    const titleRegex = /<div[^>]+id="(elementor-tab-title-[^"]+)"[^>]*>([\s\S]*?)<\/div>/g;

    let tMatch;
    while ((tMatch = titleRegex.exec(html)) !== null) {
        const id = tMatch[1];
        let name = tMatch[2].trim();
        name = name.replace(/&amp;/g, '&');
        titleMap[id] = name;
    }

    console.log('Found Titles:', Object.keys(titleMap).length);

    // 2. Extract Content Blocks matched by ID
    // <div id="elementor-tab-content-2061" ... aria-labelledby="elementor-tab-title-2061" ... > ... </div>
    // We split by "elementor-tab-content" again but look for aria-labelledby

    const contentChunks = html.split('id="elementor-tab-content-');

    const clients = [];
    const seenMap = new Set(); // To Deduplicate: Name + Category ? Or just Name if we want unique list? 
    // User wants "categorized". So we keep duplicates across categories if applicable.

    for (let i = 1; i < contentChunks.length; i++) {
        const chunk = contentChunks[i];

        // Find aria-labelledby
        const ariaMatch = chunk.match(/aria-labelledby="(elementor-tab-title-[^"]+)"/);
        if (!ariaMatch) continue;

        const titleId = ariaMatch[1];
        const category = titleMap[titleId] || 'General';

        if (category === 'All') continue; // Skip All

        // Regex for images within the chunk
        // We limit the chunk to the next div closing if possible, but splitting by ID is safer for siblings
        // The split breaks at the start of the next tab.
        // So 'chunk' contains the whole tab content + anything after it until the next tab.
        // Elementor tabs usually wrap content in the div. 
        // We should try to find the end of the div, but that's hard with regex.
        // However, since we split by the *start* of the next tab, the current chunk *contains* the current tab's content
        // (and potentially other stuff if the tabs are nested, but here they seem to be siblings).

        const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
        let imgMatch;
        while ((imgMatch = imgRegex.exec(chunk)) !== null) {
            const imgTag = imgMatch[0];
            let src = imgMatch[1];

            // Extract Alt
            const altMatch = imgTag.match(/alt=["']([^"']*)["']/);
            let alt = altMatch ? altMatch[1] : '';

            // Clean Alt
            alt = alt.replace(/^IKF Client - /i, '').trim();

            // Use Title if Alt is missing
            if (!alt) {
                const titleAttr = imgTag.match(/title=["']([^"']+)["']/);
                if (titleAttr) alt = titleAttr[1];
            }

            // Fallback to filename
            if (!alt) {
                const basename = src.split('/').pop().split('.')[0];
                alt = basename.replace(/-/g, ' ').replace(/_/g, ' ');
            }

            // Skip placeholders/icons
            if (src.includes('launch-icon') ||
                src.includes('callhdr') ||
                src.includes('emailhdr') ||
                src.includes('ikf-logo') ||
                src.includes('footer-bg') ||
                src.includes('whatsapp') ||
                !src.includes('wp-content/uploads')) {
                continue;
            }

            // Normalize
            alt = alt.replace(/\s+/g, ' ').trim();

            // Construct Client Obj
            const clientObj = {
                name: alt,
                logo_url: src,
                category: category
            };

            // Dedupe within category
            const key = `${category}-${alt}`;
            if (!seenMap.has(key)) {
                seenMap.add(key);
                clients.push(clientObj);
            }
        }
    }

    fs.writeFileSync(outputPath, JSON.stringify(clients, null, 2));
    console.log(`Extracted ${clients.length} clients.`);

} catch (err) {
    console.error('Error:', err);
}

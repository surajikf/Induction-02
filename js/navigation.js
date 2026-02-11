/**
 * navigation.js - Controls the SPA flow and UI updates
 */

window.AppNavigation = {
    contentData: null,
    showAllAnniversaries: false,
    imagesData: null,
    employees: [],
    galleryData: [],
    clientsData: [],
    socialLinks: [],

    // Lightbox State
    currentGalleryImages: [],
    currentImageIndex: 0,

    /**
     * Safely retrieves a value from a nested object path
     */
    getSafeValue: function (path, fallback = '') {
        if (!this.contentData) return fallback;
        const parts = path.split('.');
        let current = this.contentData;
        for (const part of parts) {
            if (current === null || current === undefined) return fallback;
            current = current[part];
        }
        return current !== undefined && current !== null ? current : fallback;
    },

    init: async function () {
        const self = this;

        // Load content from JSON
        await this.loadContent();

        // Apply hero data to landing page
        this._applyHeroData();

        // Handle Sidebar Clicks
        $(document).on('click', '.nav-link', function (e) {
            e.preventDefault();
            const sectionId = $(this).data('section');
            self.navigateTo(sectionId);
        });

        // Initialize Hash Change Listener
        $(window).on('hashchange', function () {
            const hash = window.location.hash.substring(1);
            if (hash) self.navigateTo(hash, true);
        });

        // Initialize Employees Data
        this.initEmployees();

        // Global Lightbox Keyboard Support
        $(document).on('keydown', function (e) {
            if ($('#gallery-lightbox').length > 0) {
                if (e.key === 'ArrowRight') self.changeLightboxImage(1);
                if (e.key === 'ArrowLeft') self.changeLightboxImage(-1);
                if (e.key === 'Escape') self.closeLightbox();
            }
        });
    },

    /**
     * Loads ALL content (Sections, Images, Employees) from Supabase in Parallel
     */
    loadContent: async function () {
        try {
            console.log('Fetching intelligence from Supabase Cloud...');

            // Parallel Fetch Strategy for maximum speed
            const [contentRes, imagesRes, employeesRes, galleryRes, clientsRes, socialRes] = await Promise.all([
                // Fetch induction content
                window.supabaseClient.from('induction_content').select('data, updated_at').eq('slug', 'main').single(),
                window.supabaseClient.from('image_manifest').select('data').eq('slug', 'main').single(),
                window.supabaseClient.from('employees').select('*').order('is_leader', { ascending: false }).order('name'),
                window.supabaseClient.from('gallery').select('*').order('created_at', { ascending: false }),
                window.supabaseClient.from('clients').select('*').order('display_order', { ascending: true }),
                window.supabaseClient.from('social_links').select('*').eq('is_active', true).order('display_order', { ascending: true })
            ]);

            // 1. Handle Content
            if (!contentRes.error && contentRes.data) {
                this.contentData = contentRes.data.data;
                console.log('âœ“ Content synced');
            } else {
                console.warn('! Content fetch issue, using local fallback');
                const res = await fetch('data/content.json');
                this.contentData = await res.json();
            }

            // 2. Handle Images
            if (!imagesRes.error && imagesRes.data) {
                this.imagesData = imagesRes.data.data;
                console.log('âœ“ Image Manifest synced');
            } else {
                console.warn('! Image manifest fetch issue, using local fallback');
                const res = await fetch('data/images-manifest.json');
                this.imagesData = await res.json();
            }

            // 3. Handle Employees
            if (!employeesRes.error && employeesRes.data && employeesRes.data.length > 0) {
                this.employees = employeesRes.data;
                console.log(`âœ“ ${this.employees.length} Agents synced`);
            } else {
                console.warn('! Employee directory fetch issue, initializing defaults');
                this.initEmployees(); // Use local hardcoded defaults
            }



            // 4. Handle Gallery
            if (!galleryRes.error && galleryRes.data) {
                this.galleryData = galleryRes.data;
                console.log(`âœ“ ${this.galleryData.length} Gallery items synced`);
            } else {
                console.warn('! Gallery fetch issue, initializing empty');
                this.galleryData = [];
            }

            // 5. Handle Clients
            if (!clientsRes.error && clientsRes.data) {
                this.clientsData = clientsRes.data;
                console.log(`âœ“ ${this.clientsData.length} Clients synced`);
            } else {
                console.warn('! Clients fetch issue, initializing empty');
                this.clientsData = [];
            }

            // 6. Handle Social Links
            if (!socialRes.error && socialRes.data) {
                this.socialLinks = socialRes.data;
                console.log(`âœ“ ${this.socialLinks.length} Social links synced`);
            } else {
                console.warn('! Social links fetch issue, initializing empty');
                this.socialLinks = [];
            }

            console.log('Supabase Sync Complete');

            // 5. Apply Dynamic Data to Landing Hero
            this._applyHeroData();
        } catch (error) {
            console.error('Critical Sync Error:', error);
            // Full system fallback
            const response = await fetch('data/content.json');
            this.contentData = await response.json();
            this.galleryData = [];
            this.initEmployees();
            this._applyHeroData();
        }
    },

    /**
     * Toggles between 'Upcoming' and 'View All' mode for anniversaries
     */
    toggleAnniversaryView: function () {
        this.showAllAnniversaries = !this.showAllAnniversaries;
        this.navigateTo('anniversary', true);

        // Re-scroll to bottom if needed? No, just render.
        console.log(`Anniversary filter toggled: ${this.showAllAnniversaries ? 'SHOW ALL' : 'UPCOMING'}`);
    },

    /**
     * Updates the landing hero on index.html with live data
     */
    /**
     * Extracts YouTube Video ID from various URL formats
     */
    extractYoutubeId: function (url) {
        if (!url) return '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : '';
    },

    _applyHeroData: function () {
        const hero = this.contentData?.hero;
        if (!hero) return;

        console.log('Applying live hero content to landing page...');

        // Badge & CTA
        if (hero.badge) $('#hero-badge').text(hero.badge);
        if (hero.cta) $('#hero-cta').text(hero.cta);

        // Title Construction (handling the yellow highlight spans)
        if (hero.title) {
            const line1 = hero.title.line1 || '';
            const highlight1 = hero.title.highlight1 || '';
            const line2 = hero.title.line2 || '';
            const highlight2 = hero.title.highlight2 || '';

            // Map parts into HTML structure - Support both substring replacement and concatenation
            let fullTitle = line1;
            if (highlight1) {
                if (fullTitle.includes(highlight1)) {
                    fullTitle = fullTitle.replace(highlight1, `<span class="text-ikf-yellow">${highlight1}</span>`);
                } else {
                    fullTitle += ` <span class="text-ikf-yellow">${highlight1}</span>`;
                }
            }

            fullTitle += `<br/>${line2}`;
            if (highlight2) {
                if (fullTitle.includes(highlight2)) {
                    // Only replace the second part's highlight if it exists in the second line
                    const secondLineIndex = fullTitle.lastIndexOf('<br/>') + 5;
                    const secondLine = fullTitle.substring(secondLineIndex);
                    const updatedSecondLine = secondLine.replace(highlight2, `<span class="text-white">${highlight2}</span>`);
                    fullTitle = fullTitle.substring(0, secondLineIndex) + updatedSecondLine;
                } else {
                    fullTitle += ` <span class="text-white">${highlight2}</span>`;
                }
            }

            $('#hero-title').html(fullTitle);
        }

        // Subtitle
        if (hero.subtitle) $('#hero-subtitle').html(hero.subtitle);

        // Stats
        if (hero.stats) {
            if (hero.stats.years) $('#hero-years').text(hero.stats.years);
            if (hero.stats.team) $('#hero-team').text(hero.stats.team);
        }

        // Update Meta for Home
        this._updatePageMeta("Welcome", hero.subtitle);
    },

    /**
     * Change the displayed content
     * @param {string} sectionId 
     * @param {boolean} fromHash 
     */
    navigateTo: function (sectionId, fromHash = false) {
        console.log('Navigating to:', sectionId);

        // 1. Update Sidebar Active State
        $('.nav-link').removeClass('active');
        $(`.nav-link[data-section="${sectionId}"]`).addClass('active');

        // 2. Update Header Info
        const title = $(`.nav-link[data-section="${sectionId}"] span`).text();
        $('#current-section-title').text(title || sectionId);
        $('.current-breadcrumb').text(title || sectionId);

        // 3. Update URL Hash
        if (!fromHash) {
            window.location.hash = sectionId;
        }

        // 4. Render Section Content
        const html = this.renderSection(sectionId);
        if (html) {
            $('#content-panel').html(html);
        }

        // 6. Scroll to Top
        $('#content-panel').scrollTop(0);

        // 6. Track Progress
        if (window.AppProgress) {
            window.AppProgress.markViewed(sectionId);
        }

        // 7. Save current section to storage
        const state = window.AppStorage.getState() || {};
        state.currentSection = sectionId;
        window.AppStorage.saveState(state);

        // 8. Update Page Meta
        const sectionTitle = $(`.nav-link[data-section="${sectionId}"] span`).text() || sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
        let desc = "Welcome to I Knowledge Factory.";

        // Try to get specific description
        if (this.contentData && this.contentData[sectionId]) {
            desc = this.contentData[sectionId].subtitle || this.contentData[sectionId].description || desc;
        }

        this._updatePageMeta(sectionTitle, desc);
    },

    /**
     * Updates the document title and meta description
     */
    _updatePageMeta: function (titleSuffix, description) {
        document.title = `IKF Induction | ${titleSuffix}`;
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = "description";
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute("content", description || 'Welcome to I Knowledge Factory Induction Portal.');
    },

    /**
     * Leader Modal Logic
     */
    showLeaderModal: function (id, name, role, image) {
        const notes = {
            ashish: "<p>Welcome to IKF! With over 25 years of digital excellence, we've grown alongside the internet itself. Our journey from a boutique setup to a multidisciplinary agency has been driven by one core philosophy: Innovation, Knowledge, and Factory.</p><p>We help global brands thrive across digital ecosystems using AI-refined strategies without losing the human lens. Your role here is crucial in maintaining our legacy of delivering high-impact solutions for our 1500+ clients.</p>",
            leadership: "<p>At IKF, we believe in a culture where 'respect begets respect.' We treat our employees, collaborators, and clients with dignity and consideration. Our leadship is committed to creating an environment that boosts creativity, efficiency, and productivity.</p>",
            hr: "<p>Our mission is to unlock the full growth potential of brands by pioneering new approaches. As you join our 50+ passionate team members, you'll find that transparency and openness are the guiding forces behind every decision we make.</p>",
            gunjan: "<p>Gunjan oversees strategic operations and technological integration, ensuring that the Factory operates at peak industrial precision. Her focus on process optimization drives our ability to deliver consistent quality at scale.</p>",
            ritu: "<p>Ritu leads the creative and brand strategy units, focusing on human-centric digital storytelling. Her vision bridges the gap between data-driven performance and emotional brand connection.</p>"
        };

        $('#modal-leader-name').text(name);
        $('#modal-leader-role').text(role);
        $('#modal-leader-note').html(notes[id] || notes.ashish);

        // Set Image
        const $img = $('#modal-leader-image');
        if (image) {
            $img.attr('src', image);
        } else {
            // Fallback
            $img.attr('src', 'https://png.pngtree.com/png-vector/20220319/ourmid/pngtree-account-icon-profiles-and-users-vector-info-silhouette-vector-png-image_44982146.jpg');
        }

        const $modal = $('#leader-modal');
        const $content = $('#modal-content');

        $modal.removeClass('hidden').addClass('flex');
        setTimeout(() => {
            $content.removeClass('scale-95 opacity-0').addClass('scale-100 opacity-100');
        }, 10);
    },

    hideModal: function () {
        const $modal = $('#leader-modal');
        const $content = $('#modal-content');

        $content.removeClass('scale-100 opacity-100').addClass('scale-95 opacity-0');
        setTimeout(() => {
            $modal.addClass('hidden').removeClass('flex');
        }, 300);
    },


    /**
     * Directory Logic
     */
    initEmployees: function () {
        // If already initialized from Supabase, don't overwrite
        if (this.employees && this.employees.length > 0) {
            console.log('Skipping initialization, cloud sync active');
            return;
        }

        // Use dynamic data from management leaders if available
        const dynamicLeaders = (this.contentData?.management?.leaders || []).map(leader => ({
            id: leader.id,
            name: leader.name,
            role: leader.role,
            dept: 'Management',
            img: leader.image,
            skills: [leader.skill]
        }));

        // Initialize with leaders only - NO HARDCODED FALLBACKS
        this.employees = [...dynamicLeaders];

        // Ensure every employee has a fallback image if missing or "null"
        const defaultAvatar = 'https://png.pngtree.com/png-vector/20220319/ourmid/pngtree-account-icon-profiles-and-users-vector-info-silhouette-vector-png-image_44982146.jpg';
        this.employees.forEach(emp => {
            if (!emp.img || emp.img === 'null' || emp.img === 'undefined' || emp.img === '') {
                emp.img = defaultAvatar;
            }
        });
    },

    renderDirectoryGrid: function (filteredList = null) {
        const list = filteredList || this.employees;
        const grid = document.getElementById('directory-grid');
        if (!grid) return;

        // Group by Department
        const grouped = list.reduce((acc, emp) => {
            const dept = emp.dept || 'Other';
            if (!acc[dept]) acc[dept] = [];
            acc[dept].push(emp);
            return acc;
        }, {});

        // Sort departments to keep Management first
        const depts = Object.keys(grouped).sort((a, b) => {
            if (a === 'Management') return -1;
            if (b === 'Management') return 1;
            return a.localeCompare(b);
        });

        let finalHtml = '';
        depts.forEach(dept => {
            // Add Section Header
            finalHtml += `
                <div class="col-span-full mt-10 mb-6 first:mt-0">
                    <div class="flex items-center gap-4">
                        <h3 class="text-xl font-black text-ikf-blue uppercase tracking-widest">${dept} Ecosystem</h3>
                        <div class="h-px flex-1 bg-slate-200"></div>
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">${grouped[dept].length} Members</span>
                    </div>
                </div>
            `;

            // Add Employee Cards
            finalHtml += grouped[dept].map((emp, index) => {
                const defaultAvatar = 'https://png.pngtree.com/png-vector/20220319/ourmid/pngtree-account-icon-profiles-and-users-vector-info-silhouette-vector-png-image_44982146.jpg';
                const displayImg = (emp.img && emp.img !== 'null' && emp.img !== 'undefined') ? emp.img : defaultAvatar;

                return `
                    <div class="employee-card card-clean group cursor-pointer p-6"
                         onclick="AppNavigation.showLeaderModal('${emp.id === 'ashish' || emp.id === 'gunjan' || emp.id === 'ritu' ? emp.id : 'leadership'}', '${emp.name}', '${emp.role}', \`${displayImg}\`)"
                         style="animation: fadeInUp 0.5s ease-out backwards ${index * 50}ms">
                        
                        <!-- Avatar Section -->
                        <div class="relative mb-5 mx-auto w-24 h-24">
                            <div class="w-full h-full rounded-full p-0.5 bg-gradient-to-br from-slate-100 to-slate-200 shadow-md">
                                <img src="${displayImg}" class="w-full h-full object-cover rounded-full bg-white" alt="${emp.name}" onerror="this.src='${defaultAvatar}'">
                            </div>
                            
                            <!-- Status Dot -->
                            <div class="absolute bottom-1 right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                                <div class="w-2.5 h-2.5 bg-green-500 rounded-full subtle-pulse"></div>
                            </div>
                        </div>

                        <!-- Content -->
                        <div class="text-center">
                            <h4 class="text-lg font-bold text-slate-800 mb-1.5 group-hover:text-ikf-blue transition-colors">${emp.name}</h4>
                            <div class="inline-block px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 mb-4">
                                <p class="text-[10px] font-semibold uppercase tracking-wide text-slate-500">${emp.role}</p>
                            </div>

                            <!-- Skills Chips -->
                            <div class="flex flex-wrap justify-center gap-2">
                                ${(emp.skills || []).slice(0, 3).map(skill =>
                    `<span class="px-2.5 py-1 bg-slate-100 text-[9px] font-medium text-slate-600 rounded-md border border-slate-200 hover:bg-ikf-blue hover:text-white hover:border-ikf-blue transition-colors">${skill}</span>`
                ).join('')}
                            </div>
                        </div>

                        <!-- View Profile Indicator -->
                        <div class="mt-4 pt-4 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span class="text-ikf-blue font-semibold text-xs flex items-center justify-center gap-2">
                                View Profile <i class="fas fa-arrow-right text-[10px]"></i>
                            </span>
                        </div>
                    </div>
                `;
            }).join('');
        });

        // Add 'Join Us' Card
        finalHtml += `
            <div class="card-clean group cursor-pointer p-8 flex flex-col items-center justify-center min-h-[280px] mt-10">
                <div class="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center shadow-sm mb-5 group-hover:bg-ikf-yellow/10 group-hover:shadow-md transition-all">
                    <i class="fas fa-plus text-2xl text-slate-400 group-hover:text-ikf-yellow transition-colors"></i>
                </div>
                <h4 class="text-lg font-bold text-slate-600 group-hover:text-slate-800 transition-colors mb-2">Join Our Team</h4>
                <p class="text-xs text-slate-500 text-center max-w-[160px] leading-relaxed">We're always looking for talented individuals</p>
            </div>
        `;

        grid.innerHTML = finalHtml;
    },

    quickFilter: function (category) {
        $('#dept-filter').val(category);
        this.filterDirectory();
    },



    /**
     * Directory Filtering
     */
    filterDirectory: function () {
        const query = $('#directory-search').val().toLowerCase();
        const dept = $('#dept-filter').val();

        if (!this.employees) this.initEmployees();

        const filtered = this.employees.filter(emp => {
            const matchesQuery = emp.name.toLowerCase().includes(query) || emp.role.toLowerCase().includes(query);
            const matchesDept = (dept === 'all' || emp.dept === dept);
            return matchesQuery && matchesDept;
        });

        this.renderDirectoryGrid(filtered);
    },

    /**
     * Final Acknowledgement Logic
     */
    handleAcknowledgement: function (el) {
        const isChecked = $(el).is(':checked');
        const $msg = $('#completion-message');

        if (isChecked) {
            $msg.hide().removeClass('hidden').fadeIn(300);
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#0E0057', '#d9a417', '#ffffff']
            });
        } else {
            $msg.fadeOut(300, () => $msg.addClass('hidden'));
        }
    },

    /**
     * Initializes hover-to-play video previews for the social section
     */
    initSocialVideos: function () {
        const _this = this;
        $('.video-card').each(function () {
            const $card = $(this);
            const videoId = $card.data('video');
            if (!videoId) return;

            $card.on('mouseenter', function () {
                const $container = $card.find('.video-container');
                const $img = $card.find('.thumbnail-img');
                const $playIcon = $card.find('.play-icon');

                // Inject iframe if not present or empty
                if ($container.is(':empty')) {
                    $container.html(`
                < iframe
            width = "100%"
            height = "100%"
            src = "https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&rel=0&modestbranding=1"
            frameborder = "0"
            allow = "autoplay; encrypted-media"
            class="w-full h-full scale-125 pointer-events-none" >
                        </iframe >
                `);
                }

                // Show video with proper layering
                $container.removeClass('opacity-0').addClass('opacity-100');
                $img.addClass('opacity-0');
                $playIcon.addClass('opacity-0');
            }).on('mouseleave', function () {
                const $container = $card.find('.video-container');
                const $img = $card.find('.thumbnail-img');
                const $playIcon = $card.find('.play-icon');

                // Fade back to thumbnail
                $container.removeClass('opacity-100').addClass('opacity-0');
                $img.removeClass('opacity-0');
                $playIcon.removeClass('opacity-0');

                // Cleanup after transition to save resources
                setTimeout(() => {
                    if ($container.hasClass('opacity-0')) {
                        $container.empty();
                    }
                }, 500);
            });
        });
    },

    /**
     * Replaces the content in the main panel
     * @param {string} sectionId 
     */
    renderSection: function (sectionId) {
        const $panel = $('#section-content');

        // Fade out transition
        $panel.fadeOut(150, () => {
            $panel.html(this.getTemplate(sectionId));

            // Special Init for Directory
            if (sectionId === 'directory') {
                this.renderDirectoryGrid();
            }

            // Special Init for Social Videos
            if (sectionId === 'social') {
                this.initSocialVideos();
            }

            $panel.fadeIn(200);
        });
    },

    /**
     * Returns the HTML for a given section
     */
    getTemplate: function (sectionId) {
        switch (sectionId) {
            case 'intro':
                const introData = this.contentData?.intro || {
                    badge: "Onboarding Portal",
                    title: 'Welcome to <span class="text-transparent bg-clip-text bg-gradient-to-r from-ikf-blue to-ikf-yellow">I Knowledge Factory.</span>',
                    subtitle: "Where strategy meets digital craftsmanship. We've been shaping the internet since 2000.",
                    mission: {
                        title: "The Mission",
                        content: "IKF is a multidisciplinary agency that blends strategy, design, and performance marketing to help brands thrive across digital ecosystems. We survive market shifts by staying true to our core: <span class=\"text-ikf-blue font-bold\">Human Intelligence.</span>",
                        badges: ["25+ Years", "360Â° Digital", "Pune HQ"]
                    },
                    stats: {
                        strategies: { title: "Strategies", number: "800+", label: "Deployed Successfully" },
                        clients: { title: "Global Presence", number: "1.5k+", label: "Happy Clients" }
                    },
                    footer: "Explore the sidebar to begin your induction journey."
                };
                return `
                <div class="max-w-7xl mx-auto py-8 fade-in">
                    <!-- Hero Header -->
                    <div class="mb-16 flex flex-col md:flex-row items-end justify-between gap-8 border-b border-slate-100 pb-12">
                        <div class="max-w-3xl">
                            <span class="text-ikf-yellow font-bold uppercase tracking-[0.2em] text-xs mb-4 block">${introData.badge}</span>
                            <h1 class="text-4xl md:text-6xl font-black text-[#0E0057] tracking-tight leading-tight mb-6">
                                ${introData.title}
                            </h1>
                            <p class="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
                                ${introData.subtitle}
                            </p>
                        </div>
                        <div class="hidden md:block">
                            <div class="w-16 h-16 rounded-2xl bg-ikf-blue/5 text-ikf-blue flex items-center justify-center text-2xl">
                                <i class="fas fa-building"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Content Grid -->
                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                        <!-- Left: Mission & Vision Card -->
                        <div class="lg:col-span-8">
                            <div class="bg-white rounded-[2rem] p-10 shadow-sm border border-slate-100 h-full relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
                                <div class="absolute top-0 right-0 w-64 h-64 bg-ikf-blue/5 rounded-full -mr-20 -mt-20 transition-transform group-hover:scale-105 duration-700"></div>
                                
                                <h3 class="text-2xl font-bold text-slate-800 mb-6 relative z-10">${introData.mission.title}</h3>
                                <p class="text-slate-500 leading-relaxed mb-8 relative z-10 text-lg">
                                    ${introData.mission.content}
                                </p>

                                <div class="flex flex-wrap gap-4 relative z-10">
                                    ${(introData.mission.badges || []).map(badge => `
                                        <div class="px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-600">
                                            <i class="fas fa-check text-ikf-yellow mr-2"></i> ${badge}
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <!-- Right: Key Stats -->
                        <div class="lg:col-span-4 flex flex-col gap-6">
                            <!-- Stat Card 1 -->
                            <div class="bg-ikf-blue p-8 rounded-[2rem] text-white relative overflow-hidden flex-1 group">
                                <div class="absolute -right-4 -bottom-4 text-white/10 text-9xl">
                                    <i class="fas fa-chart-line"></i>
                                </div>
                                <div class="relative z-10">
                                    <p class="text-ikf-yellow font-bold uppercase tracking-wider text-xs mb-2">${introData.stats.strategies.title || 'Strategies'}</p>
                                    <h4 class="text-5xl font-extrabold mb-1">${introData.stats.strategies.number}</h4>
                                    <p class="text-blue-200 text-sm">${introData.stats.strategies.label}</p>
                                </div>
                            </div>

                            <!-- Stat Card 2 -->
                            <div class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden flex-1 group hover:border-ikf-blue/30 transition-colors">
                                <div class="relative z-10">
                                    <p class="text-slate-400 font-bold uppercase tracking-wider text-xs mb-2">${introData.stats.clients.title || 'Global Presence'}</p>
                                    <h4 class="text-5xl font-extrabold text-slate-800 mb-1">${introData.stats.clients.number}</h4>
                                    <p class="text-slate-500 text-sm">${introData.stats.clients.label}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Footer Note -->
                    <div class="flex items-center gap-2 text-slate-400 text-xs font-medium pl-2">
                        <i class="fas fa-info-circle"></i>
                        <p>${introData.footer}</p>
                    </div>
                </div>`;

            case 'management':
                const mData = this.contentData?.management || {
                    badge: "System Architects",
                    title: "The <span class=\"text-[#d9a417]\">Visionaries</span>",
                    subtitle: "Guiding the IKF mainframes with over <span class=\"text-ikf-blue font-bold\">75 years</span> of combined digital intelligence.",
                    leaders: []
                };

                return `
                <div class="max-w-7xl mx-auto py-6 fade-in">
                    <div class="mb-16 text-center">
                        <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">${mData.badge}</span>
                        <h1 class="text-4xl md:text-6xl font-black text-[#0E0057] tracking-tighter leading-none mb-6">
                            ${mData.title}
                        </h1>
                        <p class="text-slate-400 max-w-2xl mx-auto text-sm font-medium leading-relaxed">
                            ${mData.subtitle}
                        </p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                        ${(Array.isArray(mData.leaders) ? mData.leaders : []).map(leader => `
                            <div class="group relative perspective-1000 cursor-pointer" onclick="AppNavigation.showLeaderModal('${leader.id}', '${leader.name}', '${leader.role}', '${leader.image}')">
                                <div class="bg-white rounded-[3rem] p-4 relative z-10 transition-all duration-500 transform preserve-3d group-hover:rotate-y-6 group-hover:shadow-2xl border border-slate-100 h-full flex flex-col">
                                    <div class="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 bg-slate-100">
                                        <img src="${leader.image}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="${leader.name}">
                                        
                                        <!-- Smart Overlay -->
                                        <div class="absolute inset-0 bg-gradient-to-t from-ikf-blue via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                                        
                                        <!-- Data Overlay -->
                                        <div class="absolute inset-x-0 bottom-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                            <div class="flex items-center justify-between text-white mb-2">
                                                <span class="text-[10px] font-bold uppercase tracking-widest">${leader.skill || 'Expertise'}</span>
                                                <span class="text-[10px] font-bold">${leader.skillLevel || '95%'}</span>
                                            </div>
                                            <div class="w-full h-1 bg-white/20 rounded-full overflow-hidden mb-4">
                                                <div class="h-full bg-ikf-yellow shadow-[0_0_10px_rgba(255,255,255,0.5)]" style="width: ${leader.skillLevel || '95%'}"></div>
                                            </div>
                                            <div class="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest border border-white/30 rounded-full px-3 py-1 bg-white/10 backdrop-blur-md w-max">
                                                <i class="fas fa-fingerprint text-ikf-yellow"></i> Access Profile
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="px-4 pb-4 text-center">
                                        <h3 class="text-2xl font-black text-slate-800 group-hover:text-ikf-blue transition-colors mb-1">${leader.name}</h3>
                                        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">${leader.role}</p>
                                        
                                        <div class="flex justify-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity duration-700">
                                            <div class="w-1 h-1 bg-ikf-blue rounded-full"></div>
                                            <div class="w-1 h-1 bg-ikf-blue rounded-full"></div>
                                            <div class="w-8 h-1 bg-ikf-blue rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                                <!-- 3D Glow Backing -->
                                <div class="absolute inset-4 bg-ikf-yellow/30 rounded-[3rem] blur-2xl -z-10 group-hover:blur-3xl transition-all opacity-0 group-hover:opacity-70"></div>
                            </div>
                        `).join('')}
                    </div>
                    </div>
                </div>`;

            case 'clients':
            case 'departments':
                // Group clients by category from Supabase
                const clientsByCategory = {};
                (this.clientsData || []).forEach(client => {
                    if (!clientsByCategory[client.category]) {
                        clientsByCategory[client.category] = [];
                    }
                    clientsByCategory[client.category].push(client);
                });

                const totalClients = this.clientsData?.length || 0;
                const totalCategories = Object.keys(clientsByCategory).length;

                return `
                    <div class="max-w-7xl mx-auto py-8 fade-in">
                        <!-- Header -->
                        <div class="mb-12 text-center">
                            <span class="text-ikf-yellow font-bold uppercase tracking-[0.2em] text-xs mb-3 block">${this.getSafeValue('clients.badge', 'Trusted Partners')}</span>
                            <h1 class="text-4xl md:text-5xl font-black text-[#0E0057] tracking-tight mb-4">
                                ${this.getSafeValue('clients.title', 'Our <span class="text-[#d9a417]">Client</span> Showcase')}
                            </h1>
                            <p class="text-slate-500 text-lg max-w-2xl mx-auto">
                                ${this.getSafeValue('clients.subtitle', `Proudly serving ${totalClients || 1500}+ leading brands across ${totalCategories || 12}+ industries.`)}
                            </p>
                        </div>

                        <!-- Client Categories -->
                        <div class="space-y-16">
                            ${Object.entries(clientsByCategory).length > 0 ? Object.entries(clientsByCategory).map(([category, clients]) => `
                                <div>
                                    <h3 class="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                                        <span class="w-8 h-8 rounded-lg bg-ikf-blue/10 text-ikf-blue flex items-center justify-center">
                                            <i class="fas fa-building"></i>
                                        </span>
                                        ${category}
                                    </h3>
                                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                        ${clients.map(client => `
                                            <div class="card-clean p-6 flex flex-col items-center justify-center text-center group hover:border-ikf-blue/20 transition-all h-40">
                                                 <div class="h-16 flex items-center justify-center mb-4">
                                                    <img src="${client.logo_url || client.logo}" alt="${client.name}" class="h-full w-auto object-contain mix-blend-multiply" onerror="this.src='https://via.placeholder.com/150x60?text=${encodeURIComponent(client.name)}'">
                                                </div>
                                                <p class="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-tight">${client.name}</p>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            `).join('') : `
                                <div class="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                                    <p class="text-slate-400 font-medium">${this.getSafeValue('clients.fallback', 'Digital intelligence gathering in progress...')}</p>
                                </div>
                            `}
                        </div>

                        <!-- Stats Footer -->
                        <div class="mt-20 p-12 bg-gradient-to-br from-ikf-blue to-slate-900 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
                            <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                            <div class="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                                <div>
                                    <p class="text-5xl font-black text-ikf-yellow mb-2">${this.getSafeValue('clients.stats.count', '1500+')}</p>
                                    <p class="text-xs font-bold uppercase tracking-[0.2em] opacity-60">${this.getSafeValue('clients.stats.label1', 'Happy Clients')}</p>
                                </div>
                                <div class="md:border-x border-white/10 md:px-12">
                                    <p class="text-5xl font-black text-ikf-yellow mb-2">${this.getSafeValue('clients.stats.years', '25+')}</p>
                                    <p class="text-xs font-bold uppercase tracking-[0.2em] opacity-60">${this.getSafeValue('clients.stats.label2', 'Years Experience')}</p>
                                </div>
                                <div>
                                    <p class="text-5xl font-black text-ikf-yellow mb-2">${totalCategories || 12}+</p>
                                    <p class="text-xs font-bold uppercase tracking-[0.2em] opacity-60">${this.getSafeValue('clients.stats.label3', 'Industries Served')}</p>
                                </div>
                            </div>
                        </div>
                    </div>`;


            case 'social':
                const socData = this.contentData?.social || {
                    badge: "Digital Pulse",
                    bgLogoText: "HUB",
                    title: "The <span class=\"text-[#d9a417]\">Social</span> Sphere",
                    liveStatus: "Live Feed // Real-time connection established.",
                    updatesTitle: "Latest Updates",
                    youtubeTitle: "Latest Videos",
                    featuredTitle: "Featured Posts",
                    cta: {
                        title: "Join the Conversation",
                        subtitle: "Follow us on social media to stay updated with the latest news, events, and behind-the-scenes action at IKF."
                    }
                };

                return `
                    <div class="max-w-7xl mx-auto py-12 fade-in relative">
                         <!--Background Watermark-->
                        <div class="absolute top-0 right-0 text-[200px] font-black text-slate-100 opacity-20 select-none pointer-events-none -z-10 leading-none overflow-hidden">
                            ${socData.bgLogoText}
                        </div>

                        <div class="mb-16 relative">
                            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6">
                                <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                ${socData.badge}
                            </div>
                            <h1 class="text-5xl md:text-7xl font-black text-[#0E0057] tracking-tighter mb-4">${socData.title}</h1>
                            <p class="text-slate-500 font-mono text-sm border-l-2 border-ikf-yellow pl-4">
                                ${socData.liveStatus}
                            </p>
                        </div>

                        <!--LinkedIn Feed Section-->
                        <div class="mb-20">
                            <div class="flex items-center justify-between mb-8">
                                <h3 class="text-2xl font-black text-[#0E0057] flex items-center gap-3">
                                    <i class="fab fa-linkedin text-[#0077b5]"></i> ${socData.updatesTitle}
                                </h3>
                                <a href="https://www.linkedin.com/company/ikf-industrial-kinetics-factory" target="_blank" class="text-xs font-bold text-slate-400 hover:text-[#0077b5] uppercase tracking-widest transition-colors">View All <i class="fas fa-arrow-right ml-1"></i></a>
                            </div>
                            
                            <!-- Elfsight LinkedIn Feed Widget -->
                            <div class="bg-white rounded-[2.5rem] p-4 shadow-sm border border-slate-100 min-h-[400px]">
                                <script src="https://static.elfsight.com/platform/platform.js" async></script>
                                <div class="elfsight-app-17d722de-16e8-4660-b6df-2016556d028e" data-elfsight-app-lazy></div>
                            </div>
                        </div>

                        <!--YouTube Feed Section-->
                        <div class="mb-20">
                            <div class="flex items-center justify-between mb-8">
                                <h3 class="text-2xl font-black text-[#0E0057] flex items-center gap-3">
                                    <i class="fab fa-youtube text-[#FF0000]"></i> ${socData.youtubeTitle}
                                </h3>
                                <a href="https://www.youtube.com/@IKF" target="_blank" class="text-xs font-bold text-slate-400 hover:text-[#FF0000] uppercase tracking-widest transition-colors">View Channel <i class="fas fa-arrow-right ml-1"></i></a>
                            </div>

                            <!-- Elfsight YouTube Gallery Widget -->
                            <div class="bg-white rounded-[2.5rem] p-4 shadow-sm border border-slate-100 min-h-[400px]">
                                <div class="elfsight-app-0444983a-44d2-43ce-9457-37207dc3390c" data-elfsight-app-lazy></div>
                            </div>
                        </div>

                        <!--Instagram / Featured Grid-->
                        <div class="mb-20">
                             <div class="flex items-center justify-between mb-8">
                                <h3 class="text-2xl font-black text-[#0E0057] flex items-center gap-3">
                                    <i class="fab fa-instagram text-[#E1306C]"></i> ${socData.featuredTitle}
                                </h3>
                            </div>
                            
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <!-- Placeholder for Instagram grid - could also be an Elfsight widget if available -->
                                <div class="aspect-square bg-slate-100 rounded-2xl relative group overflow-hidden cursor-pointer">
                                    <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                                    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                        <i class="fab fa-instagram text-3xl"></i>
                                    </div>
                                </div>
                                <div class="aspect-square bg-slate-100 rounded-2xl relative group overflow-hidden cursor-pointer">
                                    <img src="https://images.unsplash.com/photo-1611262588024-d12430b9816e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                                    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                        <i class="fab fa-instagram text-3xl"></i>
                                    </div>
                                </div>
                                 <div class="aspect-square bg-slate-100 rounded-2xl relative group overflow-hidden cursor-pointer">
                                    <img src="https://images.unsplash.com/photo-1585250003058-20892c222ba2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                                    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                        <i class="fab fa-instagram text-3xl"></i>
                                    </div>
                                </div>
                                 <div class="aspect-square bg-slate-100 rounded-2xl relative group overflow-hidden cursor-pointer">
                                    <img src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                                    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                        <i class="fab fa-instagram text-3xl"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!--CTA -->
                <div class="bg-slate-900 rounded-[3rem] p-12 text-center relative overflow-hidden group">
                    <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div class="relative z-10">
                        <h3 class="text-3xl font-black text-white mb-4">${(socData.cta || {}).title || 'Join the Conversation'}</h3>
                        <p class="text-slate-400 max-w-xl mx-auto mb-8 font-medium">
                            ${(socData.cta || {}).subtitle || 'Follow us on social media to stay updated with the latest news, events, and behind-the-scenes action at IKF.'}
                        </p>
                        <div class="flex justify-center gap-4">
                            <a href="#" class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-[#0077b5] hover:text-white transition-all"><i class="fab fa-linkedin-in"></i></a>
                            <a href="#" class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-[#FF0000] hover:text-white transition-all"><i class="fab fa-youtube"></i></a>
                            <a href="#" class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-[#E1306C] hover:text-white transition-all"><i class="fab fa-instagram"></i></a>
                        </div>
                    </div>
                </div>
                    </div>`; case 'directory':
                // Initialize employees if not already done
                if (!this.employees || this.employees.length === 0) {
                    this.initEmployees();
                }

                const dirData = this.contentData?.directory || {
                    badge: "Meet Your Team",
                    title: "The Collective.",
                    description: `Get to know your ${this.employees ? this.employees.length : '50+'} new colleagues! Browse by department, search by name, and start building connections.`,
                    stats: [
                        { label: "Active", value: "100", suffix: "%" },
                        { label: "Depts", value: "09", suffix: "" }
                    ],
                    searchPlaceholder: "Search for a colleague by name or role..."
                };

                return `
                    <div class="max-w-7xl mx-auto py-6 fade-in">
                        <!--Creative Header / Dashboard-->
                        <div class="mb-16">
                            <div class="flex flex-col md:flex-row items-end justify-between gap-8 mb-10">
                                <div>
                                    <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block animate-pulse">${dirData.badge}</span>
                                    <h1 class="text-4xl md:text-6xl font-black text-[#0E0057] tracking-tighter leading-none mb-2">
                                        ${(dirData.title || "The Collective.").replace('Collective.', '<span class="text-[#d9a417]">Collective.</span>')}
                                    </h1>
                                    <p class="text-slate-400 font-medium max-w-xl text-sm">${dirData.description || dirData.subtitle || ""}</p>
                                </div>
                                
                                <!-- Live Stats Ticker -->
                                <div class="flex flex-wrap gap-4">
                                    ${(Array.isArray(dirData.stats) ? dirData.stats : []).map(stat => `
                                        <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-lg text-center min-w-[100px] hover:-translate-y-1 transition-transform">
                                            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">${stat.label}</p>
                                            <p class="text-2xl font-black text-ikf-blue">${stat.value}<span class="text-sm align-top">${stat.suffix || ""}</span></p>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- Floating Search & Filter Bar -->
                            <div class="bg-white p-4 rounded-[2rem] shadow-xl shadow-ikf-blue/5 border border-slate-50 flex flex-col lg:flex-row flex-wrap gap-4 items-center relative z-30">
                                <!-- Search -->
                                <div class="relative flex-1 w-full group">
                                    <div class="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                        <i class="fas fa-fingerprint text-slate-300 group-focus-within:text-ikf-blue transition-colors text-lg"></i>
                                    </div>
                                    <input type="text" id="directory-search" 
                                        class="block w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-3xl text-sm font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-ikf-blue/20 focus:ring-4 focus:ring-ikf-blue/5 transition-all" 
                                        placeholder="${dirData.searchPlaceholder}" 
                                        oninput="AppNavigation.filterDirectory()">
                                    <div class="absolute inset-y-0 right-4 flex items-center">
                                        <span class="px-2 py-1 bg-white rounded-lg text-[10px] font-bold text-slate-300 border border-slate-100 shadow-sm">${this.getSafeValue('directory.searchShortcut', 'CTRL + K')}</span>
                                    </div>
                                </div>

                                <!-- Separator (Mobile) -->
                                <div class="w-full h-px bg-slate-100 lg:w-px lg:h-12"></div>

                                <!-- Filter Dropdown -->
                                <div class="relative min-w-[200px] w-full lg:w-auto group">
                                    <i class="fas fa-layer-group absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-ikf-yellow transition-colors"></i>
                                    <select id="dept-filter" class="w-full pl-12 pr-10 py-4 bg-slate-50 border-2 border-transparent rounded-3xl text-sm font-bold text-slate-600 focus:outline-none focus:bg-white focus:border-ikf-yellow/30 cursor-pointer hover:bg-white transition-colors appearance-none" onchange="AppNavigation.filterDirectory()">
                                        <option value="all">${this.getSafeValue('directory.filterLabel', 'All Ecosystems')}</option>
                                        ${[...new Set((this.employees || []).map(e => e.dept))].sort().filter(d => d).map(dept => `
                                            <option value="${dept}">${dept}</option>
                                        `).join('')}
                                    </select>
                                    <i class="fas fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 text-xs pointer-events-none"></i>
                                </div>
                            </div>
                        </div>

                        <!--Quick Filters Pills-->
                        <div class="flex flex-wrap justify-center gap-3 mb-12 opacity-60 hover:opacity-100 transition-opacity">
                            <span class="text-[10px] font-black uppercase tracking-widest text-slate-300 py-2">${this.getSafeValue('directory.quickAccessLabel', 'Quick Access:')}</span>
                            <button onclick="AppNavigation.quickFilter('Development')" class="px-4 py-1.5 bg-white/50 hover:bg-white text-slate-400 hover:text-ikf-blue rounded-full text-[10px] font-bold border border-transparent hover:border-ikf-blue/20 transition-all hover:shadow-lg">Development</button>
                            <button onclick="AppNavigation.quickFilter('Marketing')" class="px-4 py-1.5 bg-white/50 hover:bg-white text-slate-400 hover:text-ikf-blue rounded-full text-[10px] font-bold border border-transparent hover:border-ikf-blue/20 transition-all hover:shadow-lg">Marketing</button>
                            <button onclick="AppNavigation.quickFilter('Design')" class="px-4 py-1.5 bg-white/50 hover:bg-white text-slate-400 hover:text-ikf-blue rounded-full text-[10px] font-bold border border-transparent hover:border-ikf-blue/20 transition-all hover:shadow-lg">Design</button>
                        </div>

                        <!--Dynamic Grid-->
                <div id="directory-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 px-4 sm:px-0">
                    <!-- Content will be injected by renderDirectoryGrid() -->
                </div>
                    </div>`;

            case 'philosophy':
                const pData = this.contentData?.philosophy || {
                    badge: "Core Directives",
                    title: "I • K • F",
                    subtitle: "The DNA of Our Identity",
                    pillars: [
                        { letter: "I", title: "Innovation", description: "Obsessive curiosity. We don't just use technology; we blend AI-refined strategies with a human lens to solve business challenges." },
                        { letter: "K", title: "Knowledge", description: "Synthesized wisdom. Over 25 years of mastery in digital ecosystems fuels our strategic consultations and execution." },
                        { letter: "F", title: "Factory", description: "Precision at scale. Our industrialized processes ensure high-impact delivery for 1500+ global clients." }
                    ]
                };

                return `
                    <div class="max-w-6xl mx-auto py-12 px-6 fade-in selection:bg-ikf-yellow selection:text-white">
                        <!--Header Section-->
                        <div class="mb-20 text-center lg:text-left relative">
                            <div class="absolute -top-10 -left-10 text-[120px] font-black text-slate-50 -z-10 select-none">IKF</div>
                            <span class="bg-[#0E0057] text-white px-5 py-2 rounded-sm text-[10px] font-black uppercase tracking-[0.4em] mb-6 inline-block">
                                ${pData.badge || 'Core Directives'}
                            </span>
                            <h1 class="text-5xl md:text-7xl font-black text-[#0E0057] leading-none tracking-tighter mb-6">
                                ${this.getSafeValue('philosophy.title', 'The <span class="text-[#d9a417]">Philosophy</span>')}
                            </h1>
                            <p class="text-xl text-slate-400 font-medium max-w-2xl leading-relaxed">
                                ${pData.subtitle || 'Engineering growth through master-level digital strategies and industrialized precision.'}
                            </p>
                        </div>

                        <!--Pillars Grid-->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                            ${(Array.isArray(pData.pillars) ? pData.pillars : []).map((pillar, idx) => {
                    const pLetter = pillar.letter || pillar.id || "?";
                    const isYellow = pLetter === 'K';
                    const colorClass = isYellow ? 'text-[#d9a417]' : 'text-[#0E0057]';
                    const borderClass = isYellow ? 'border-[#d9a417]' : 'border-[#0E0057]/10';

                    return `
                                    <div class="group bg-white p-10 rounded-[3rem] border ${borderClass} shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 relative overflow-hidden">
                                        <!-- Decorative Background Letter -->
                                        <div class="absolute -right-4 -bottom-4 text-[120px] font-black opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 select-none pointer-events-none ${colorClass}">
                                            ${pLetter}
                                        </div>
                                        
                                        <div class="flex items-center gap-4 mb-8">
                                            <div class="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${isYellow ? 'bg-[#d9a417] text-white' : 'bg-[#0E0057] text-white'}">
                                                ${pLetter}
                                            </div>
                                            <span class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">${this.getSafeValue('philosophy.pillarPrefix', 'Pillar')} 0${idx + 1}</span>
                                        </div>

                                        <h3 class="text-3xl font-black mb-6 ${colorClass}">${pillar.title || ''}</h3>
                                        <p class="text-slate-500 text-sm leading-relaxed font-medium mb-10">
                                            ${pillar.description || pillar.content || ''}
                                        </p>

                                        <div class="pt-6 border-t border-slate-50 flex justify-between items-center">
                                            <span class="text-[9px] font-black text-slate-300 uppercase tracking-widest">${this.getSafeValue('philosophy.versionLabel', 'Protocol v25.0')}</span>
                                            <i class="fas fa-chevron-right text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ${colorClass}"></i>
                                        </div>
                                    </div>
                                `;
                }).join('')}
                        </div>

                        <!--Formal Brand Manifesto-->
                <div class="bg-[#0E0057] rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden group">
                    <!-- Background Accent -->
                    <div class="absolute top-0 right-0 w-1/2 h-full bg-[#d9a417]/5 -skew-x-12 translate-x-1/2"></div>

                    <div class="relative z-10 max-w-4xl">
                        <h2 class="text-4xl md:text-6xl font-black mb-12 leading-tight tracking-tighter">
                            ${this.getSafeValue('philosophy.manifesto.title', 'Beyond Services, <br /> <span class="text-[#d9a417]">We Build Legacies.</span>')}
                        </h2>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                            <p class="text-lg text-slate-300 font-medium leading-relaxed">
                                ${this.getSafeValue('philosophy.manifesto.para1', "At IKF, our philosophy is the engine of our growth. For 25 years, we've refined digital tools through a human lens, ensuring every output is a blend of precision and heart.")}
                            </p>
                            <p class="text-lg text-slate-300 font-medium leading-relaxed">
                                ${this.getSafeValue('philosophy.manifesto.para2', "We are obsessed with curiosity and mastered in digital wisdom, engineering competitive advantages for 1500+ global partners.")}
                            </p>
                        </div>

                        <div class="flex flex-wrap gap-12 pt-12 border-t border-white/10">
                            <div class="flex flex-col">
                                <span class="text-5xl font-black text-[#d9a417] mb-2">${this.getSafeValue('philosophy.manifesto.years', '25+')}</span>
                                <span class="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">${this.getSafeValue('philosophy.manifesto.label1', 'Years Legacy')}</span>
                            </div>
                            <div class="flex flex-col">
                                <span class="text-5xl font-black text-white mb-2">${this.getSafeValue('philosophy.manifesto.partners', '1500+')}</span>
                                <span class="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">${this.getSafeValue('philosophy.manifesto.label2', 'Global Partners')}</span>
                            </div>
                        </div>
                    </div>
                </div>
                    </div>`;

            case 'mission':
                const missData = this.contentData?.mission || {
                    badge: "Strategic Imperatives",
                    title: "Mission & <span class=\"text-transparent bg-clip-text bg-gradient-to-r from-ikf-blue to-ikf-yellow\">Vision</span>",
                    vision: { title: "The Vision", content: "\"To be a globally respected, multidisciplinary digital agency known for its commitment to excellence and innovation.\"" },
                    mission: { title: "The Mission", content: "\"To unlock the full growth potential of brands by pioneering new approaches and delivering high-impact digital solutions.\"" },
                    valuesTitle: "Our Core Values (T.R.I.I.I.P)",
                    values: [
                        { icon: "fa-search", title: "Transparent", desc: "Openness in all we do." },
                        { icon: "fa-heart", title: "Respectful", desc: "Respect begets respect." },
                        { icon: "fa-lightbulb", title: "Innovative", desc: "Challenge the norm." },
                        { icon: "fa-bolt", title: "Inspired", desc: "Inspired & Inspiring." },
                        { icon: "fa-user-tie", title: "Professional", desc: "Excellence in delivery." }
                    ]
                };
                return `
                    <div class="max-w-6xl mx-auto py-6 fade-in">
                        <div class="mb-16">
                            <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">${missData.badge}</span>
                            <h1 class="text-4xl md:text-6xl font-black text-[#0E0057] tracking-tight">${missData.title}</h1>
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
                            <div class="bg-white p-12 lg:p-16 rounded-[3rem] premium-card relative overflow-hidden group">
                                <div class="absolute top-0 right-0 p-8 opacity-5 transform group-hover:scale-110 transition-transform"><i class="fas fa-eye text-[120px] text-ikf-blue"></i></div>
                                <h3 class="text-3xl font-black text-ikf-blue mb-6">${missData.vision?.title || 'The Vision'}</h3>
                                <p class="text-slate-500 text-lg leading-relaxed italic">
                                    ${missData.vision?.content || ''}
                                </p>
                                <div class="mt-10 flex items-center gap-4 text-ikf-yellow">
                                    <div class="h-px flex-1 bg-ikf-yellow/20"></div>
                                    <span class="text-[10px] font-black uppercase tracking-[0.3em]">${this.getSafeValue('mission.vision.label', 'Ambition')}</span>
                                </div>
                            </div>
                            <div class="bg-ikf-blue p-12 lg:p-16 rounded-[3rem] premium-card relative overflow-hidden group text-white">
                                <div class="absolute top-0 right-0 p-8 opacity-10 transform group-hover:scale-110 transition-transform"><i class="fas fa-rocket text-[120px] text-white"></i></div>
                                <h3 class="text-3xl font-black mb-6">${missData.mission?.title || 'The Mission'}</h3>
                                <p class="text-blue-100 text-lg leading-relaxed">
                                    ${missData.mission?.content || ''}
                                </p>
                                <div class="mt-10 flex items-center gap-4 text-ikf-yellow">
                                    <div class="h-px flex-1 bg-white/10"></div>
                                    <span class="text-[10px] font-black uppercase tracking-[0.3em]">${this.getSafeValue('mission.mission.label', 'Execution')}</span>
                                </div>
                            </div>
                        </div>

                        <div class="bg-slate-50 p-12 lg:p-24 rounded-[4rem] mb-16">
                            <div class="max-w-4xl mx-auto text-center mb-20">
                                <h3 class="text-4xl md:text-5xl font-black text-[#0E0057] mb-6">${missData.valuesTitle}</h3>
                                <p class="text-slate-400 font-medium text-lg leading-relaxed">The foundational principles that drive our creative spirit and industrialized precision.</p>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                ${(Array.isArray(missData.values) ? missData.values : []).map((val, idx) => {
                    const firstLetter = val.title.charAt(0);
                    return `
                                        <div class="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden h-full flex flex-col justify-between hover:-translate-y-2 border border-slate-50">
                                            <!-- Massive BG Letter -->
                                            <div class="absolute -right-2 -bottom-4 text-[100px] font-black pointer-events-none opacity-[0.03] group-hover:opacity-[0.07] transition-all transform group-hover:scale-110 text-[#0E0057] select-none">
                                                ${firstLetter}
                                            </div>
                                            
                                            <div class="relative z-10">
                                                <div class="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#d9a417] group-hover:text-white transition-all shadow-inner">
                                                    <i class="fas ${val.icon} text-lg"></i>
                                                </div>
                                                <h4 class="text-xl font-black text-[#0E0057] mb-3">${val.title}</h4>
                                                <p class="text-slate-500 text-sm font-medium leading-relaxed">${val.desc}</p>
                                            </div>
                                            
                                            <div class="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span class="text-[8px] font-black text-slate-300 uppercase tracking-widest">${this.getSafeValue('mission.valuesLabel', 'Core DNA')}</span>
                                                <div class="w-1.5 h-1.5 rounded-full bg-[#d9a417]"></div>
                                            </div>
                                        </div>
                                    `;
                }).join('')}
                            </div>
                        </div>
                    </div>`;

            case 'culture':
                const cultData = this.contentData?.culture || {
                    badge: "System Core",
                    title: "The IKF Culture <span class=\"text-transparent bg-clip-text bg-gradient-to-r from-ikf-blue to-ikf-yellow\">Code</span>",
                    subtitle: "Running on version 4.0. Optimized for high performance, creativity, and human-centric processing.",
                    stats: [
                        { icon: "fa-laugh-beam", value: "4.8", suffix: "/5", label: "Happiness Index", color: "blue" },
                        { icon: "fa-pizza-slice", value: "52", suffix: "+", label: "Friday Parties", color: "yellow" },
                        { icon: "fa-brain", value: "200", suffix: "h", label: "Learning / Yr", color: "purple" },
                        { icon: "fa-seedling", value: "0", suffix: "%", label: "Boredom", color: "green" }
                    ],
                    mainMessage: {
                        title: "We Debug <br /><span class=\"text-ikf-yellow\">Problems</span>, Not People.",
                        description: "In a high-pressure agency environment, we prioritize psychological safety. Mistakes are compile errors, not fatal crashes. We fix them together."
                    },
                    values: [
                        { icon: "fa-rocket", title: "Growth Mindset", description: "Fail fast, learn faster.", color: "ikf-blue" },
                        { icon: "fa-coffee", title: "Fuel Creativity", description: "Caffeine & Ideas.", color: "ikf-yellow" }
                    ],
                    gallery: { title: "Life @ IKF", tag: "#TeamBonding", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
                };
                return `
                    <div class="max-w-7xl mx-auto py-6 fade-in">
                        <div class="mb-16 text-center">
                            <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">${cultData.badge}</span>
                            <h1 class="text-4xl md:text-6xl font-black text-[#0E0057] tracking-tight">${cultData.title}</h1>
                            <p class="text-slate-400 mt-4 max-w-2xl mx-auto text-sm font-medium">${cultData.subtitle}</p>
                        </div>

                        <!--Culture Stats Grid-->
                        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                            ${(Array.isArray(cultData.stats) ? cultData.stats : []).map(stat => `
                                <div class="p-8 bg-white rounded-[2.5rem] shadow-lg hover:shadow-xl transition-all border border-slate-50 text-center group cursor-pointer hover:-translate-y-2">
                                    <div class="w-16 h-16 rounded-2xl bg-${stat.color || 'blue'}-50 text-${stat.color === 'ikf-blue' ? 'ikf-blue' : stat.color === 'ikf-yellow' ? 'ikf-yellow' : (stat.color || 'blue') + '-500'} flex items-center justify-center mx-auto mb-6 text-2xl group-hover:scale-110 transition-transform">
                                        <i class="fas ${stat.icon || 'fa-chart-bar'}"></i>
                                    </div>
                                    <h3 class="text-4xl font-black text-slate-800 mb-2">${stat.value || '0'}<span class="text-lg text-slate-300 font-bold ml-1">${stat.suffix || ''}</span></h3>
                                    <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">${stat.label || 'Metric'}</p>
                                </div>
                            `).join('')}
                        </div>

                        <!--Main Culture Modules-->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 h-[600px] md:h-auto">
                    <!-- Left: Smart Values -->
                    <div class="md:col-span-2 space-y-6">
                        <div class="bg-gradient-to-br from-ikf-blue to-slate-900 rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden group">
                            <div class="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-ikf-yellow/20 transition-colors duration-700"></div>
                            <div class="relative z-10">
                                <div class="flex items-center gap-4 mb-8">
                                    <span class="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-mono border border-white/20">values.json</span>
                                    <div class="h-[1px] flex-1 bg-white/10"></div>
                                </div>
                                <h3 class="text-3xl md:text-5xl font-black mb-6 leading-tight">${(cultData.mainMessage || cultData.mainValue || {}).title || ''}</h3>
                                <p class="text-slate-300 max-w-lg text-sm leading-relaxed mb-8">${(cultData.mainMessage || cultData.mainValue || {}).description || ''}</p>
                                <div class="flex gap-4">
                                    <div class="flex -space-x-4">
                                        <div class="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700"></div>
                                        <div class="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-600"></div>
                                        <div class="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-500 flex items-center justify-center text-[10px] font-bold">+</div>
                                    </div>
                                    <div class="flex items-center gap-2 text-xs font-bold text-ikf-yellow">
                                        <i class="fas fa-check-circle"></i>
                                        <span>${this.getSafeValue('culture.collabStatus', 'Collaboration Mode: Active')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-6">
                            ${(Array.isArray(cultData.values || cultData.secondaryValues) ? (cultData.values || cultData.secondaryValues) : []).map(val => `
                                            <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                                                <i class="fas ${val.icon || 'fa-star'} text-3xl text-${val.color || 'ikf-yellow'} mb-4 group-hover:scale-110 transition-transform block"></i>
                                                <h4 class="font-black text-lg mb-2">${val.title || ''}</h4>
                                                <p class="text-xs text-slate-400">${val.description || val.desc || ''}</p>
                                            </div>
                                        `).join('')}
                        </div>
                    </div>

                    <!-- Right: Life Gallery (Smart Vertical) -->
                    <div class="bg-slate-50 rounded-[3rem] p-4 flex flex-col gap-4 overflow-hidden relative border border-slate-100">
                        <div class="absolute top-8 left-8 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-black shadow-sm">
                            <i class="fas fa-camera text-ikf-blue mr-2"></i> ${(cultData.gallery || {}).title || 'Life @ IKF'}
                        </div>
                        <div class="flex-1 rounded-[2.5rem] bg-cover bg-center" style="background-image: url('${(cultData.gallery || {}).image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}');"></div>
                        <div class="h-40 rounded-[2.5rem] bg-ikf-yellow/10 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                            <div class="absolute inset-0 bg-ikf-yellow/80 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center">
                                <span class="text-white font-black uppercase text-xs tracking-widest">${this.getSafeValue('culture.gallery.cta', 'View Gallery')}</span>
                            </div>
                            <span class="text-ikf-blue/30 font-black text-xl rotate-12 group-hover:rotate-0 transition-transform">${(cultData.gallery || {}).tag || '#IKFLife'}</span>
                        </div>
                    </div>
                </div>
                    </div>`;



            case 'referral':
                const refData = this.contentData?.referral || {
                    badge: "Ambassador Protocol",
                    title: "Referral <span class=\"text-[#d9a417]\">Program</span>",
                    subtitle: "Connect high-caliber talent with our industrial excellence and earn professional rewards.",
                    tiers: [
                        { title: "Junior Agent", experience: "0-2 Years Exp", reward: "₹5,000", label: "Successfully Hired" },
                        { title: "Specialist", experience: "2-5 Years Exp", reward: "₹15,000", label: "Successfully Hired" },
                        { title: "Architect", experience: "5+ Years Exp", reward: "₹25,000", label: "Successfully Hired" }
                    ],
                    process: [
                        { step: "1. Identify", description: "Locate a candidate matching our cultural code." },
                        { step: "2. Submit", description: "Forward coordinates (CV) to HR via secure channel." }
                    ],
                    policies: [
                        { title: "Eligibility", description: "All active employees are eligible except HR and Leadership teams." },
                        { title: "Payout", description: "Rewards are processed after 90 days of successful candidate probation." }
                    ]
                };

                return `
                    <div class="max-w-6xl mx-auto py-12 px-6 fade-in">
                        <!--Header Section-->
                        <div class="mb-20 text-center lg:text-left relative">
                            <div class="absolute -top-10 -left-10 text-[120px] font-black text-slate-50 -z-10 select-none">IKF</div>
                            <span class="bg-[#0E0057] text-white px-5 py-2 rounded-sm text-[10px] font-black uppercase tracking-[0.4em] mb-6 inline-block">
                                ${refData.badge}
                            </span>
                            <h1 class="text-5xl md:text-7xl font-black text-[#0E0057] leading-none tracking-tighter mb-6">
                                ${refData.title}
                            </h1>
                            <p class="text-xl text-slate-400 font-medium max-w-2xl leading-relaxed">
                                ${refData.subtitle}
                            </p>
                        </div>

                        <!--Rewards Tiers-->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                            ${(Array.isArray(refData.tiers) ? refData.tiers : []).map((tier, idx) => {
                    const isFeatured = tier.featured || idx === 1;
                    const borderClass = isFeatured ? 'border-[#d9a417] shadow-xl ring-4 ring-[#d9a417]/5' : 'border-slate-100 shadow-sm';
                    const colorClass = isFeatured ? 'text-[#d9a417]' : 'text-[#0E0057]';

                    return `
                                    <div class="group bg-white p-10 rounded-[3rem] border-2 ${borderClass} relative overflow-hidden transition-all duration-500 hover:-translate-y-2">
                                        <div class="absolute -right-4 -bottom-4 text-[120px] font-black opacity-[0.03] group-hover:opacity-[0.06] transition-opacity select-none pointer-events-none">0${idx + 1}</div>
                                        
                                        <div class="flex items-center justify-between mb-8">
                                            <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 shadow-inner group-hover:bg-[#0E0057] group-hover:text-white transition-all">
                                                <i class="fas ${isFeatured ? 'fa-gem' : 'fa-award'} text-xl"></i>
                                            </div>
                                            <span class="text-[9px] font-black uppercase tracking-widest text-slate-300">Tier L${tier.level || idx + 1}</span>
                                        </div>

                                        <h3 class="text-3xl font-black mb-1 ${colorClass}">${tier.reward}</h3>
                                        <p class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">${tier.title}</p>
                                        
                                        <div class="space-y-3 pt-6 border-t border-slate-50">
                                            <div class="flex items-center gap-3 text-xs font-semibold text-slate-500">
                                                <i class="fas fa-check-circle text-[#d9a417] text-[10px]"></i>
                                                <span>${tier.experience}</span>
                                            </div>
                                            <div class="flex items-center gap-3 text-xs font-semibold text-slate-500">
                                                <i class="fas fa-check-circle text-[#d9a417] text-[10px]"></i>
                                                <span>${tier.roles || 'Strategic Roles'}</span>
                                            </div>
                                        </div>
                                    </div>
                                `;
                }).join('')}
                        </div>

                        <!--Process Section-->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
                            <div class="bg-white p-12 lg:p-16 rounded-[4rem] border border-slate-100 shadow-sm">
                                <h3 class="text-3xl font-black text-[#0E0057] mb-12">${this.getSafeValue('referral.protocolTitle', 'The Protocol')}</h3>
                                <div class="space-y-12">
                                    ${(Array.isArray(refData.process) ? refData.process : []).map((step, idx) => `
                                        <div class="flex gap-6 relative group">
                                            <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-[#0E0057] relative z-10 group-hover:bg-[#d9a417] group-hover:text-white transition-all">0${idx + 1}</div>
                                            ${idx < refData.process.length - 1 ? '<div class="absolute left-6 top-12 w-px h-12 bg-slate-100"></div>' : ''}
                                            <div>
                                                <h4 class="text-xl font-bold text-[#0E0057] mb-2">${step.title || step.step}</h4>
                                                <p class="text-slate-400 text-sm font-medium leading-relaxed">${step.description || step.desc}</p>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <div class="bg-[#0E0057] p-12 lg:p-16 rounded-[4rem] text-white relative overflow-hidden group">
                                <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
                                <h3 class="text-3xl font-black mb-12 relative z-10">Program Policies</h3>
                                <div class="space-y-8 relative z-10">
                                    ${(Array.isArray(refData.policies) ? refData.policies : []).map(policy => `
                                        <div>
                                            <h4 class="text-xs font-black uppercase tracking-widest text-[#d9a417] mb-2">${policy.title}</h4>
                                            <p class="text-blue-100/70 text-sm font-medium leading-relaxed">${policy.description}</p>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <!--CTA Section-->
                <div class="bg-slate-50 rounded-[4rem] p-12 md:p-20 text-center border-2 border-dashed border-slate-200">
                    <div class="max-w-2xl mx-auto">
                        <h2 class="text-3xl md:text-5xl font-black text-[#0E0057] mb-8 leading-tight">Ready to expand our intelligence network?</h2>
                        <p class="text-slate-400 font-medium mb-12">Submit your candidate's details through our secure acquisition portal.</p>
                        <a href="https://forms.gle/referral-example" target="_blank" class="inline-flex items-center gap-4 px-12 py-6 bg-[#0E0057] text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-[#d9a417] transition-all shadow-xl shadow-blue-900/10 group">
                            <i class="fas fa-paper-plane group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                            Initialize Submission
                        </a>
                    </div>
                </div>
                    </div>`;

            case 'org_chart': {

                const orgData = this.contentData?.org_chart || {};
                const depts = orgData.departments || [];

                return `
                    <div class="max-w-7xl mx-auto py-12 px-6 fade-in">
                        <!--Premium Header-->
                        <div class="mb-20 text-center lg:text-left relative">
                            <div class="absolute -top-10 -left-10 text-[120px] font-black text-slate-50 -z-10 select-none">STRUCTURE</div>
                            <span class="bg-[#0E0057] text-white px-5 py-2 rounded-sm text-[10px] font-black uppercase tracking-[0.4em] mb-6 inline-block">
                                ${orgData.badge || 'Organizational Architecture'}
                            </span>
                            <h1 class="text-5xl md:text-7xl font-black text-[#0E0057] leading-none tracking-tighter mb-6">
                                ${orgData.title || 'How We\'re <span class="text-[#d9a417]">Organized</span>'}
                            </h1>
                            <p class="text-xl text-slate-400 font-medium max-w-2xl leading-relaxed">
                                ${orgData.subtitle || 'A high-level view of our functional ecosystem and reporting hierarchies.'}
                            </p>
                        </div>

                        <!--Leadership Node(Top Level)-->
                        <div class="flex justify-center mb-24">
                            <div class="bg-[#0E0057] text-white p-10 rounded-[3rem] text-center max-w-md relative group shadow-2xl">
                                <div class="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-ikf-yellow rounded-2xl flex items-center justify-center text-[#0E0057] shadow-lg">
                                    <i class="fas fa-crown"></i>
                                </div>
                                <h3 class="text-2xl font-black mb-2">${orgData.leadership?.title || 'Leadership Team'}</h3>
                                <p class="text-blue-200 text-sm font-medium leading-relaxed">
                                    ${orgData.leadership?.subtitle || 'Strategic guidance and vision.'}
                                </p>
                                <div class="absolute -bottom-12 left-1/2 -translate-x-1/2 w-px h-12 bg-slate-200"></div>
                            </div>
                        </div>

                        <!--Departments Grid-->
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                            ${depts.map((dept, idx) => {
                    const colors = {
                        blue: 'bg-blue-50 text-blue-600 border-blue-100',
                        green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
                        purple: 'bg-purple-50 text-purple-600 border-purple-100',
                        orange: 'bg-orange-50 text-orange-600 border-orange-100'
                    };
                    const theme = colors[dept.color] || colors.blue;

                    return `
                                    <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative flex flex-col items-center text-center">
                                        <div class="w-16 h-16 rounded-2xl ${theme} flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                                            <i class="fas ${dept.icon || 'fa-users'} text-2xl"></i>
                                        </div>
                                        <h4 class="text-xl font-black text-[#0E0057] mb-4">${dept.title}</h4>
                                        <p class="text-slate-400 text-xs font-medium leading-relaxed mb-6">
                                            ${dept.description}
                                        </p>
                                        <div class="w-full space-y-2 pt-6 border-t border-slate-50">
                                            ${(dept.items || []).map(item => `
                                                <div class="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 py-2 rounded-xl">
                                                    ${item}
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                `;
                }).join('')}
                        </div>

                        <!--Legend / Footer-->
                <div class="bg-slate-50 p-12 rounded-[4rem] text-center border-2 border-dashed border-slate-200">
                    <p class="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Ecosystem Version 25.0 // Synchronized</p>
                </div>
                    </div>`;
            }

            case 'anniversary': {
                const employees = this.employees || [];
                const now = new Date();
                const showAll = this.showAllAnniversaries || false;
                const annivData = this.contentData?.anniversary || {
                    badge: "Legacy System",
                    title: showAll ? 'Hall of <span class="text-[#d9a417]">Fame</span>' : 'Upcoming <span class="text-[#d9a417]">Legends</span>',
                    totalExperience: "142+"
                };

                // Helper for precise tenure (Years and Days)
                const calculatePreciseTenure = (dojStr) => {
                    if (!dojStr) return { years: 0, days: 0, totalDays: 0 };
                    const doj = new Date(dojStr);
                    const diffTime = now - doj;
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                    const years = Math.floor(diffDays / 365.25);
                    const remainingDays = Math.floor(diffDays % 365.25);
                    return { years: Math.max(0, years), days: Math.max(0, remainingDays), totalDays: diffDays };
                };

                // Helper to check if anniversary is in next 2 months
                const isUpcomingAnniversary = (dojStr) => {
                    if (!dojStr) return false;
                    const doj = new Date(dojStr);
                    const annivThisYear = new Date(now.getFullYear(), doj.getMonth(), doj.getDate());

                    // If anniversary already happened this year, check next year's date
                    if (annivThisYear < now) {
                        annivThisYear.setFullYear(now.getFullYear() + 1);
                    }

                    const diffTime = annivThisYear - now;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays >= 0 && diffDays <= 60; // Next 60 days
                };

                // Group employees by milestones
                const milestoneGroups = [
                    { years: 5, label: '5+ Years', badge: 'LEGEND', title: 'The Architects', members: [] },
                    { years: 3, label: '3+ Years', badge: 'ELITE', title: 'The Pillars', members: [] },
                    { years: 1, label: '1+ Year', badge: 'VETERAN', title: 'The Growth Drivers', members: [] },
                    { years: 0, label: 'Rising Stars', badge: 'PIONEER', title: 'The New Wave', members: [] }
                ];

                let processedEmployees = employees;

                // Filter for upcoming if not showing all
                if (!showAll) {
                    processedEmployees = employees.filter(emp => isUpcomingAnniversary(emp.doj));
                }

                processedEmployees.forEach(emp => {
                    const tenure = calculatePreciseTenure(emp.doj);

                    for (const milestone of milestoneGroups) {
                        if (tenure.years >= milestone.years) {
                            milestone.members.push({
                                ...emp,
                                ...tenure,
                                displayTenure: `${tenure.years} Yrs, ${tenure.days} Days`
                            });
                            break;
                        }
                    }
                });

                // Sort members within milestones by DOJ (descending tenure)
                milestoneGroups.forEach(m => {
                    m.members.sort((a, b) => new Date(a.doj) - new Date(b.doj));
                });

                return `
                <div class="max-w-7xl mx-auto py-8 fade-in">
                        <!--Premium Header-->
                        <div class="mb-16 flex flex-col lg:flex-row items-end justify-between gap-10">
                            <div class="max-w-2xl">
                                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ikf-yellow/10 border border-ikf-yellow/20 text-ikf-yellow text-[10px] font-black uppercase tracking-widest mb-6">
                                    <i class="fas fa-crown"></i>
                                    ${annivData.badge}
                                </div>
                                <h1 class="text-5xl md:text-7xl font-black text-[#0E0057] tracking-tight leading-none">
                                    ${annivData.title}
                                </h1>
                                <p class="text-slate-500 mt-6 text-lg font-medium max-w-xl">
                                    ${showAll ? 'Celebrating every architect of our 25-year journey.' : 'Celebrating the architects reaching new milestones in the next 60 days.'}
                                </p>
                                
                                <div class="mt-8 flex gap-4">
                                    <button onclick="window.AppNavigation.toggleAnniversaryView()" 
                                        class="px-6 py-3 ${showAll ? 'bg-slate-100 text-slate-600' : 'bg-ikf-blue text-white'} rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:shadow-lg">
                                        ${showAll ? '<i class="fas fa-filter mr-2"></i> Show Upcoming' : '<i class="fas fa-list mr-2"></i> View All History'}
                                    </button>
                                </div>
                            </div>
                            <div class="bg-gradient-to-br from-[#0E0057] to-slate-800 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group min-w-[320px]">
                                <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                                <div class="relative z-10">
                                    <p class="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black mb-2">Cumulative Intelligence</p>
                                    <div class="flex items-baseline gap-2">
                                        <span class="text-5xl font-black text-ikf-yellow">${annivData.totalExperience}</span>
                                        <span class="text-sm font-bold text-slate-300">YEARS</span>
                                    </div>
                                    <div class="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                        <i class="fas fa-microchip"></i>
                                        <span>SYSTEM INTEGRITY: 100%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!--Milestone Grid-->
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                            ${milestoneGroups.map((m, idx) => {
                    const colors = [
                        { bg: 'bg-slate-900', text: 'text-white' },
                        { bg: 'bg-ikf-blue', text: 'text-white' },
                        { bg: 'bg-ikf-yellow', text: 'text-[#0E0057]' },
                        { bg: 'bg-slate-200', text: 'text-slate-600' }
                    ];
                    const theme = colors[idx % colors.length];

                    if (!showAll && m.members.length === 0) return '';

                    return `
                                    <div class="relative group">
                                        <div class="absolute inset-0 bg-slate-900 rounded-[2.5rem] translate-y-2 opacity-5"></div>
                                        <div class="relative bg-white border border-slate-100 p-8 rounded-[2.5rem] hover:shadow-xl transition-all duration-500 flex flex-col items-center text-center h-full">
                                            <div class="w-16 h-16 rounded-2xl ${theme.bg} ${theme.text} flex items-center justify-center mb-6 shadow-lg relative transform group-hover:rotate-6 transition-transform">
                                                <span class="text-2xl font-black italic tracking-tighter">${m.years}</span>
                                                <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-slate-900 border border-slate-200 text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
                                                    ${m.badge}
                                                </div>
                                            </div>
                                            
                                            <h3 class="text-lg font-black text-[#0E0057] mb-6">${m.title}</h3>
                                            
                                            <div class="w-full space-y-3">
                                                ${m.members.length > 0 ? m.members.map(p => `
                                                    <div class="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100">
                                                        <div class="w-10 h-10 rounded-lg overflow-hidden border border-white shadow-sm flex-shrink-0">
                                                            <img src="${p.img || 'https://png.pngtree.com/png-vector/20220319/ourmid/pngtree-account-icon-profiles-and-users-vector-info-silhouette-vector-png-image_44982146.jpg'}" class="w-full h-full object-cover">
                                                        </div>
                                                        <div class="text-left flex-1 min-w-0">
                                                            <p class="text-[10px] font-black text-slate-800 truncate">${p.name}</p>
                                                            <p class="text-[8px] font-bold text-slate-400 uppercase truncate">${p.role}</p>
                                                        </div>
                                                        <div class="text-[7px] font-black text-ikf-yellow text-right whitespace-nowrap">
                                                            ${p.displayTenure}
                                                        </div>
                                                    </div>
                                                `).join('') : `<p class="text-[10px] text-slate-300 font-bold uppercase italic">No signals detected</p>`}
                                            </div>
                                        </div>
                                    </div>
                                `;
                }).join('')}
                        </div>
                        
                        <!--Terminal Footer-->
                <div class="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-center relative overflow-hidden flex flex-col items-center justify-center">
                    <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    <div class="relative z-10 w-full max-w-lg text-left">
                        <div class="bg-slate-800 rounded-t-xl p-3 flex gap-2">
                            <div class="w-2 h-2 rounded-full bg-red-500"></div>
                            <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <div class="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                        <div class="bg-black/50 backdrop-blur-md p-6 rounded-b-xl border-t border-white/5 font-mono text-xs text-slate-300 shadow-2xl">
                            <p class="mb-2"><span class="text-green-400">➜</span> <span class="text-blue-400">~</span> system_check --anniversary</p>
                            <p class="mb-2"><span class="text-green-400">✔</span> milestone_detection: <span class="text-ikf-yellow">active</span></p>
                            <p class="mb-2"><span class="text-green-400">✔</span> current_view: <span class="text-ikf-yellow">${showAll ? 'historical_archive' : 'upcoming_milestones'}</span></p>
                            <p class="text-slate-500 mt-4">// Digital legacies are built one day at a time.</p>
                        </div>
                    </div>
                </div>
                    </div>`;
            }

            case 'birthdays': {
                const employees = this.employees || [];
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentDate = now.getDate();

                // Logic for finding upcoming birthdays (this month and next month)
                const findUpcomingBirthdays = () => {
                    const results = [];
                    employees.forEach(emp => {
                        if (!emp.dob) return;
                        const dob = new Date(emp.dob);
                        const bMonth = dob.getMonth();
                        const bDate = dob.getDate();

                        let status = '';
                        if (bMonth === currentMonth) {
                            if (bDate === currentDate) status = 'TODAY! 🎂';
                            else if (bDate > currentDate && bDate <= currentDate + 15) status = 'UPCOMING';
                            else if (bDate < currentDate && bDate >= currentDate - 7) status = 'RECENT';

                            if (status) {
                                results.push({
                                    name: emp.name,
                                    role: emp.role,
                                    dept: emp.dept,
                                    image: emp.img,
                                    date: `${bDate} ${['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][bMonth]}`,
                                    status: status,
                                    rawDate: bDate
                                });
                            }
                        }
                    });
                    return results.sort((a, b) => a.rawDate - b.rawDate);
                };

                const upcoming = findUpcomingBirthdays();
                const bdayData = this.contentData?.birthdays || {};
                const bdayTerminal = bdayData.terminal || { command: "broadcast_pulse.sh", output: ["system: ready"] };

                const nextBday = upcoming.find(b => b.status === 'UPCOMING' || b.status === 'TODAY! 🎂');
                const nextEventText = nextBday ? nextBday.date : 'SCANNING...';

                return `
                <div class="max-w-7xl mx-auto py-8 fade-in">
                        <!--Creative Vibrant Header-->
                        <div class="mb-16 flex flex-col lg:flex-row items-center justify-between gap-12">
                            <div class="max-w-2xl text-center lg:text-left">
                                <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 text-pink-600 text-[10px] font-black uppercase tracking-widest mb-6">
                                    <i class="fas fa-star-of-life animate-spin-slow"></i>
                                    ${bdayData.badge || 'Solar Returns'}
                                </div>
                                <h1 class="text-5xl md:text-7xl font-black text-[#0E0057] tracking-tighter leading-none mb-6">
                                    ${bdayData.title || 'Party <span class="text-[#d9a417]">Protocol</span>'}
                                </h1>
                                <p class="text-slate-500 text-lg font-medium">
                                    Celebrating another rotation around the digital sun. Let's sync our energy and share the joy!
                                </p>
                            </div>
                            
                            <div class="relative">
                                <div class="absolute -inset-4 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                                 <div class="relative bg-white border border-slate-100 p-8 rounded-[3rem] shadow-xl text-center min-w-[280px]">
                                      <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Next Event Signal</p>
                                      <p class="text-4xl font-black text-[#0E0057]">${nextEventText}</p>
                                      <div class="mt-4 flex justify-center gap-1">
                                         <div class="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
                                         <div class="w-1.5 h-1.5 rounded-full bg-pink-500/30"></div>
                                         <div class="w-1.5 h-1.5 rounded-full bg-pink-500/10"></div>
                                      </div>
                                 </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 px-4 md:px-0">
                            ${upcoming.length > 0 ? upcoming.map(b => `
                                <div class="group relative">
                                    <div class="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                    <div class="relative bg-white border border-slate-50 p-6 rounded-[3rem] shadow-sm hover:shadow-xl transition-all duration-500 flex items-center gap-6 overflow-hidden">
                                        <div class="w-24 h-24 rounded-[2rem] bg-slate-100 relative overflow-hidden group-hover:scale-95 transition-transform duration-500 shadow-inner">
                                            <img src="${b.image || 'https://png.pngtree.com/png-vector/20220319/ourmid/pngtree-account-icon-profiles-and-users-vector-info-silhouette-vector-png-image_44982146.jpg'}" class="w-full h-full object-cover">
                                            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                        </div>
                                        
                                        <div class="flex-1">
                                            <div class="inline-block px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-[9px] font-black uppercase tracking-widest mb-3">
                                                ${b.date}
                                            </div>
                                            <h3 class="text-xl font-black text-[#0E0057] mb-1">${b.name}</h3>
                                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">${b.dept || 'Ecosystem'}</p>
                                            
                                            <div class="flex items-center gap-2">
                                                <div class="flex gap-0.5">
                                                    <div class="w-1.5 h-1.5 rounded-full bg-ikf-yellow animate-pulse"></div>
                                                </div>
                                                <span class="text-[9px] font-black text-slate-300 uppercase tracking-widest">${b.status}</span>
                                            </div>
                                        </div>
                                        
                                        <i class="fas fa-gift absolute -top-4 -right-4 text-6xl text-slate-50 group-hover:text-pink-100 transition-colors -rotate-12 group-hover:rotate-0"></i>
                                    </div>
                                </div>
                            `).join('') : `
                                <div class="col-span-full py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                                    <i class="fas fa-calendar-alt text-4xl text-slate-200 mb-4"></i>
                                    <h3 class="text-xl font-black text-slate-400">No signals detected in the immediate horizon.</h3>
                                    <p class="text-slate-300 text-sm">Synchronizing for future solar returns...</p>
                                </div>
                            `}
                        </div>
                    </div>`;
            }

            case 'holidays':
                const holidayData = this.contentData?.holidays || {};
                const strategicResets = holidayData.strategicResets || holidayData.list || [
                    { name: "Republic Day", date: "JANUARY 26", type: "Mandatory" },
                ];
                const holidayPolicy = holidayData.policy || {
                    title: "Execution Protocol",
                    description: "IKF publishes its final holiday list at the start of every calendar year.",
                    compensatory: "Holidays falling on Sundays are not carried forward."
                };

                return `
                    <div class="max-w-6xl mx-auto py-6 fade-in">
                        <div class="mb-16">
                            <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">${holidayData.badge || 'Global Calendar'}</span>
                            <h1 class="text-4xl md:text-6xl font-black text-[#0E0057] tracking-tight">${holidayData.title || 'Holidays <span class="text-[#d9a417]">2025-26</span>'}</h1>
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
                            <div class="bg-white p-12 lg:p-16 rounded-[3.5rem] premium-card">
                                <h3 class="text-2xl font-black text-ikf-blue mb-10">Strategic Resets</h3>
                                <div class="space-y-6">
                                    ${(Array.isArray(strategicResets) ? strategicResets : []).map(h => `
                                        <div class="flex items-center justify-between p-6 bg-slate-50 rounded-2xl group hover:bg-ikf-blue hover:text-white transition-all">
                                            <div><p class="font-black text-sm uppercase mb-1">${h.name}</p><p class="text-xs opacity-50 font-bold">${h.date}</p></div>
                                            <div class="text-[10px] font-black uppercase tracking-widest bg-ikf-yellow text-white px-3 py-1 rounded-full">${h.type}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                             <div class="bg-slate-900 p-12 lg:p-16 rounded-[3.5rem] premium-card text-white relative overflow-hidden flex flex-col justify-center">
                                <div class="absolute inset-0 bg-ikf-blue/10"></div>
                                <i class="fas fa-umbrella-beach text-[120px] absolute -right-4 -bottom-4 opacity-5"></i>
                                <h4 class="text-2xl font-black mb-6">${this.getSafeValue('holidays.policy.title', 'Execution Protocol')}</h4>
                                <p class="text-slate-400 leading-relaxed mb-8">
                                    ${this.getSafeValue('holidays.policy.description', 'IKF publishes its final holiday list at the start of every calendar year.')}
                                </p>
                                <div class="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                    <p class="text-[10px] font-black text-ikf-yellow uppercase tracking-widest mb-2">${this.getSafeValue('holidays.policy.label', 'Compensatory Policy')}</p>
                                    <p class="text-xs text-slate-400">${this.getSafeValue('holidays.policy.compensatory', 'Holidays falling on Sundays are not carried forward.')}</p>
                                </div>
                            </div>
                        </div>
                    </div>`;

            case 'attendance':
                const attendData = this.contentData?.attendance || {};
                const schedule = attendData.schedule || [
                    { title: "Work Week", value: "Monday - Friday", note: "Strategic Fridays" },
                    { title: "Core Hours", value: "09:30 AM - 06:15 PM", note: "Productive Sync" }
                ];
                const punctuality = attendData.punctuality || { title: "The Punctuality DNA", description: "Precision is our product.", rules: ["Entry: 09:30 AM"] };

                return `
                    <div class="max-w-6xl mx-auto py-6 fade-in">
                        <div class="mb-16">
                            <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">${attendData.badge || 'Operation Hours'}</span>
                            <h1 class="text-4xl md:text-6xl font-black text-[#0E0057] tracking-tight">${attendData.title || 'Sync & <span class="text-[#d9a417]">Flow</span>'}</h1>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                            ${(Array.isArray(schedule) ? schedule : []).map((card, idx) => {
                    const icons = ["fa-calendar-alt", "fa-stopwatch", "fa-fingerprint"];
                    return `
                                    <div class="bg-white p-12 rounded-[2.5rem] premium-card text-center group">
                                        <div class="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-ikf-blue group-hover:text-white transition-all shadow-lg">
                                            <i class="fas ${icons[idx] || 'fa-clock'} text-2xl"></i>
                                        </div>
                                        <h4 class="text-xl font-black text-ikf-blue mb-2">${card.title}</h4>
                                        <p class="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">${card.value}</p>
                                        <p class="text-[10px] text-slate-300 mt-4 font-medium uppercase tracking-tighter">${card.note}</p>
                                    </div>
                                `;
                }).join('')}
                        </div>

                        <div class="bg-slate-900 p-12 lg:p-20 rounded-[4rem] premium-card text-white flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
                            <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-10"></div>
                            <div class="flex-1 z-10">
                                <h3 class="text-4xl font-extrabold mb-6">${punctuality.title}</h3>
                                <p class="text-slate-400 leading-relaxed mb-10 text-lg">
                                    ${punctuality.description}
                                </p>
                                <div class="space-y-6">
                                    ${(punctuality.rules || []).map((rule, idx) => `
                                        <div class="flex items-center gap-6">
                                            <span class="w-3 h-3 ${idx === 0 ? 'bg-ikf-yellow shadow-[0_0_15px_rgba(217,164,23,1)]' : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)]'} rounded-full"></span>
                                            <p class="font-bold text-xs uppercase tracking-widest">${rule}</p>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="w-full md:w-96 aspect-square bg-white/5 backdrop-blur-3xl rounded-[3rem] border-4 border-white/5 z-10 shadow-2xl flex items-center justify-center text-white/20 text-4xl font-black italic">PORTAL</div>
                        </div>
                    </div>`; case 'policies':
                const policyData = this.contentData?.policies || {};
                const policyStats = policyData.stats || [
                    { value: "06", label: "Probation" },
                    { value: "90", label: "Notice Period" }
                ];
                const policyTerminal = policyData.terminal || { command: "initializing_handshake_protocol...", output: ["policies_loaded: true"] };

                return `
                    <div class="max-w-6xl mx-auto py-6 fade-in">
                        <div class="mb-16">
                            <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">${policyData.badge || 'Legal Framework'}</span>
                            <h1 class="text-4xl md:text-6xl font-black text-[#0E0057] tracking-tight">${policyData.title || 'Operational <span class="text-[#d9a417]">Directives</span>'}</h1>
                        </div>

                        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                            ${(Array.isArray(policyStats) ? policyStats : []).map((stat, idx) => {
                    const icons = ["fa-hourglass-start", "fa-history", "fa-wallet", "fa-file-contract"];
                    return `
                                    <div class="p-8 bg-white rounded-[2.5rem] text-center border border-slate-50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group cursor-default">
                                        <div class="w-16 h-16 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center text-ikf-blue mb-6 text-2xl group-hover:scale-110 transition-transform"><i class="fas ${icons[idx] || 'fa-info-circle'}"></i></div>
                                        <h3 class="text-3xl font-black text-slate-800 mb-1">${stat.value}</h3>
                                        <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">${stat.label}</p>
                                    </div>
                                `;
                }).join('')}
                        </div>

                        <div class="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-center relative overflow-hidden flex flex-col items-center justify-center">
                            <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                            <div class="relative z-10 w-full max-w-lg mb-10 text-left">
                                <div class="bg-slate-800 rounded-t-xl p-3 flex gap-2">
                                    <div class="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div class="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div class="bg-black/50 backdrop-blur-md p-6 rounded-b-xl border-t border-white/5 font-mono text-xs md:text-sm text-slate-300 shadow-2xl">
                                    <p class="mb-2"><span class="text-green-400">➜</span> <span class="text-blue-400">~</span> ${policyTerminal.command}</p>
                                    ${(policyTerminal.output || []).map(line => `<p class="mb-2"><span class="text-green-400">✔</span> ${line}</p>`).join('')}
                                </div>
                            </div>

                            <label class="flex items-center gap-4 cursor-pointer group">
                                <input type="checkbox" class="w-6 h-6 rounded-lg border-2 border-white/20 bg-white/5 text-ikf-yellow focus:ring-ikf-yellow transition-all">
                                <span class="text-white text-sm font-bold uppercase tracking-widest group-hover:text-ikf-yellow transition-colors">I acknowledge and accept the protocol</span>
                            </label>
                        </div>
                    </div>`;

            case 'gallery':
                const gData = this.galleryData || [];
                const gCategories = [...new Set(gData.map(item => item.category))];

                return `
                    <div class="max-w-7xl mx-auto py-8 fade-in">
                        <div class="mb-12 flex flex-col lg:flex-row items-end justify-between gap-6">
                            <div class="text-center lg:text-left">
                                <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Visual Archive</span>
                                <h1 class="text-4xl md:text-6xl font-black text-[#0E0057] tracking-tight mb-4">
                                    IKF <span class="text-[#d9a417]">Gallery</span>
                                </h1>
                                <p class="text-slate-400 font-medium max-w-xl text-sm">Capturing the moments that define our culture, from high-stakes formal events to our favorite celebrations.</p>
                            </div>
                            
                            <!-- Filter Bar -->
                            <div class="w-full lg:w-auto max-w-full overflow-hidden">
                                <div class="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto no-scrollbar touch-pan-x">
                                    <button onclick="AppNavigation.filterGallery('all')" class="gallery-filter-btn active flex-shrink-0 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap">All Capsules</button>
                                    ${gCategories.map(cat => `
                                        <button onclick="AppNavigation.filterGallery('${cat}')" class="gallery-filter-btn flex-shrink-0 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-slate-400 hover:text-ikf-blue whitespace-nowrap">${cat}</button>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <!--Gallery View Container-->
                <div id="gallery-container" class="min-h-[400px]">
                    ${this.renderGalleryFolders(gCategories)}
                </div>
                    </div>`;

            default:
                return `
                    <div class="max-w-4xl mx-auto py-20 text-center">
                        <div class="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6"><i class="fas fa-tools text-2xl text-slate-400"></i></div>
                        <h2 class="text-2xl font-bold text-ikf-blue">Module Under Construction</h2>
                        <p class="text-slate-500 mt-2 text-lg">We are building high-quality content for <span class="font-bold text-ikf-yellow italic">${sectionId}</span>.</p>
                        <button onclick="AppNavigation.navigateTo('intro')" class="mt-8 text-ikf-blue font-bold hover:underline"><i class="fas fa-arrow-left mr-2"></i> Back to Intro</button>
                    </div>`;
        }
    },

    /**
     * Filters gallery by category
     */
    filterGallery: function (category) {
        $('.gallery-filter-btn').removeClass('active bg-ikf-blue text-white').addClass('text-slate-400 hover:text-ikf-blue');
        $(`button[onclick = "AppNavigation.filterGallery('${category}')"]`).addClass('active bg-ikf-blue text-white').removeClass('text-slate-400 hover:text-ikf-blue');

        if (category === 'all') {
            const categories = [...new Set(this.galleryData.map(item => item.category))];
            $('#gallery-container').html(this.renderGalleryFolders(categories));
        } else {
            this.viewGalleryFolder(category);
        }
    },

    /**
     * Renders folder-wise category grid
     */
    renderGalleryFolders: function (categories) {
        if (!categories || categories.length === 0) {
            return `
                <div class="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                    <i class="fas fa-folder-open text-slate-100 text-8xl mb-6"></i>
                    <p class="text-slate-400 font-bold uppercase tracking-widest text-xs">No capsules found in the archive</p>
                </div>`;
        }

        return `
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 fade-in">
                    ${categories.map(cat => {
            const catImages = this.galleryData.filter(i => i.category === cat);
            const count = catImages.length;
            const previewImages = catImages.slice(0, 5); // Fetch 5 images

            return `
                    <div onclick="AppNavigation.viewGalleryFolder('${cat}')" 
                            class="group bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer relative overflow-visible h-[380px] flex flex-col z-0 hover:z-50">
                        
                        <!-- Creative Hand of Cards Fan -->
                        <div class="relative flex-1 w-full mb-8 mt-8 perspective-1000 flex items-center justify-center">
                            ${previewImages.length > 0 ? previewImages.map((img, idx) => `
                                <div class="absolute w-44 h-52 rounded-2xl bg-white shadow-lg border-2 border-slate-50 overflow-hidden transform transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) origin-bottom
                                    ${idx === 0 ? 'z-50 scale-100 rotate-0 group-hover:-translate-y-6 group-hover:scale-110 shadow-xl' : ''}
                                    ${idx === 1 ? 'z-40 scale-95 rotate-[-3deg] group-hover:rotate-[-15deg] group-hover:translate-x-[-50px] group-hover:translate-y-[-10px]' : ''}
                                    ${idx === 2 ? 'z-40 scale-95 rotate-[3deg] group-hover:rotate-[15deg] group-hover:translate-x-[50px] group-hover:translate-y-[-10px]' : ''}
                                    ${idx === 3 ? 'z-30 scale-90 rotate-[-6deg] group-hover:rotate-[-30deg] group-hover:translate-x-[-90px] group-hover:translate-y-[10px] opacity-80 group-hover:opacity-100' : ''}
                                    ${idx === 4 ? 'z-30 scale-90 rotate-[6deg] group-hover:rotate-[30deg] group-hover:translate-x-[90px] group-hover:translate-y-[10px] opacity-80 group-hover:opacity-100' : ''}
                                ">
                                    <img src="${img.url}" class="w-full h-full object-cover bg-slate-100" loading="lazy" onerror="this.src='https://via.placeholder.com/300x400?text=IMG'">
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                            `).join('') : `
                                <div class="w-44 h-52 bg-slate-50 rounded-2xl flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200">
                                    <i class="fas fa-images text-4xl mb-2"></i>
                                    <span class="text-[10px] font-bold uppercase tracking-widest">Empty</span>
                                </div>
                            `}
                        </div>

                        <div class="relative z-50 bg-white/95 backdrop-blur-sm pt-4 border-t border-slate-50 mx-[-1.5rem] px-6 pb-2 rounded-b-[2.5rem]">
                            <h3 class="text-xl font-black text-slate-800 mb-1 group-hover:text-ikf-blue transition-colors truncate">${cat}</h3>
                            <div class="flex items-center justify-between">
                                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">${count} Moments</p>
                                <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-ikf-yellow group-hover:text-[#0E0057] transition-all transform group-hover:rotate-[-45deg]">
                                    <i class="fas fa-arrow-right text-xs"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
        }).join('')
            }
            </div > `;
    },

    /**
     * Renders images within a specific folder
     */
    viewGalleryFolder: function (category) {
        // Fix URLs (trim trailing spaces)
        const images = this.galleryData
            .filter(i => i.category === category)
            .map(img => ({ ...img, url: img.url.trim() }));

        this.currentGalleryImages = images;
        const container = $('#gallery-container');

        const html = `
                    <div class="fade-in">
                <button onclick="AppNavigation.filterGallery('all')" 
                        class="flex items-center gap-3 text-[10px] font-black text-slate-400 hover:text-ikf-blue mb-10 transition-colors uppercase tracking-widest">
                    <i class="fas fa-arrow-left"></i> Back to Archive
                </button>
                
                <h2 class="text-2xl font-black text-slate-800 mb-8 flex items-center gap-4">
                    <span class="w-2 h-8 bg-ikf-yellow rounded-full"></span>
                    ${category}
                </h2>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    ${images.map((img, idx) => `
                        <div class="aspect-square bg-slate-100 rounded-3xl overflow-hidden group relative cursor-zoom-in shadow-sm hover:shadow-xl transition-all"
                                onclick="AppNavigation.openLightbox(${idx})">
                            <img src="${img.url}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" onerror="this.src='https://placehold.co/600x600?text=Image+Not+Found'">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex items-end">
                                <p class="text-white text-[10px] font-black uppercase tracking-widest">${img.title || 'View Metadata'}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>`;

        container.html(html);
        if (category !== 'all') {
            $('.gallery-filter-btn').removeClass('active bg-ikf-blue text-white').addClass('text-slate-400 hover:text-ikf-blue');
            $(`button[onclick = "AppNavigation.filterGallery('${category}')"]`).addClass('active bg-ikf-blue text-white').removeClass('text-slate-400 hover:text-ikf-blue');
        }
    },

    /**
     * Opens lightbox for gallery images with navigation
     */
    openLightbox: function (index) {
        this.currentImageIndex = index;
        const img = this.currentGalleryImages[index];
        if (!img) return;

        const modalHtml = `
                <div id="gallery-lightbox" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/98 backdrop-blur-2xl fade-in" onclick="AppNavigation.closeLightbox()">
                <!--Close Button-->
                <button class="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white hover:bg-red-500 hover:rotate-90 transition-all z-50">
                    <i class="fas fa-times text-xl"></i>
                </button>

                <!--Navigation Arrows-->
                <button onclick="event.stopPropagation(); AppNavigation.changeLightboxImage(-1)" 
                        class="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white hover:bg-ikf-blue hover:scale-110 transition-all z-50 group">
                    <i class="fas fa-chevron-left text-2xl group-hover:-translate-x-1 transition-transform"></i>
                </button>
                <button onclick="event.stopPropagation(); AppNavigation.changeLightboxImage(1)" 
                        class="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white hover:bg-ikf-blue hover:scale-110 transition-all z-50 group">
                    <i class="fas fa-chevron-right text-2xl group-hover:translate-x-1 transition-transform"></i>
                </button>

                <!--Image Container-->
                <div class="max-w-6xl w-full h-full flex flex-col items-center justify-center relative scale-in" onclick="event.stopPropagation()">
                    <img id="lightbox-main-img" src="${img.url}" class="max-w-full max-h-[75vh] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 object-contain" onerror="this.src='https://placehold.co/800x600?text=Image+Not+Found'">

                        <div class="mt-8 text-center">
                            <p class="text-ikf-yellow font-black uppercase tracking-[0.4em] text-[10px] mb-2">${img.category}</p>
                            <h3 class="text-white text-xl font-bold mb-4">${img.title || 'Visual Asset'}</h3>
                            <div class="flex items-center justify-center gap-4">
                                <span class="text-white/40 text-[10px] font-bold uppercase tracking-widest">${index + 1} / ${this.currentGalleryImages.length}</span>
                            </div>
                        </div>
                </div>
            </div>`;

        if ($('#gallery-lightbox').length) $('#gallery-lightbox').remove();
        $('body').append(modalHtml);
        $('body').css('overflow', 'hidden');
    },

    changeLightboxImage: function (direction) {
        let newIndex = this.currentImageIndex + direction;
        if (newIndex < 0) newIndex = this.currentGalleryImages.length - 1;
        if (newIndex >= this.currentGalleryImages.length) newIndex = 0;

        this.currentImageIndex = newIndex;
        const img = this.currentGalleryImages[newIndex];

        // Simple crossfade effect
        $('#lightbox-main-img').fadeOut(200, function () {
            $(this).attr('src', img.url).fadeIn(200);
            $('#gallery-lightbox p').text(img.category);
            $('#gallery-lightbox h3').text(img.title || 'Visual Asset');
            $('#gallery-lightbox span').text(`${newIndex + 1} / ${AppNavigation.currentGalleryImages.length}`);
        });
    },

    closeLightbox: function () {
        $('#gallery-lightbox').fadeOut(300, function () {
            $(this).remove();
            $('body').css('overflow', '');
        });
    }
};


/**
 * navigation.js - Controls the SPA flow and UI updates
 */

window.AppNavigation = {
    contentData: null,

    init: async function () {
        const self = this;

        // Load content from JSON
        await this.loadContent();

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
    },

    /**
     * Loads content from JSON file
     */
    loadContent: async function () {
        try {
            const response = await fetch('data/content.json');
            this.contentData = await response.json();
            console.log('Content loaded successfully');
        } catch (error) {
            console.error('Error loading content:', error);
            // Fallback for missing content will be handled in templates
        }
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
    },

    /**
     * Leader Modal Logic
     */
    showLeaderModal: function (id, name, role) {
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
        // Use dynamic data from management leaders if available, otherwise use hardcoded defaults
        const dynamicLeaders = (this.contentData?.management?.leaders || []).map(leader => ({
            id: leader.id,
            name: leader.name,
            role: leader.role,
            dept: 'Management',
            img: leader.image,
            skills: [leader.skill]
        }));

        const hardcodedEmployees = [
            // Smart Avatars Distributed
            { id: 'emp1', name: 'Vikram Singh', role: 'Sr. Brand Strategist', dept: 'Digital Marketing', img: 'images/avatars/avatar_marketing_male.png', skills: ['Brand Positioning', 'Market Analysis', 'Campaign Strategy'] },
            { id: 'emp2', name: 'Priya Sharma', role: 'Client Servicing', dept: 'Digital Marketing', img: 'images/avatars/avatar_creative_female.png', skills: ['CRM', 'Negotiation', 'Project Mgmt'] },
            { id: 'emp3', name: 'Rahul Verma', role: 'Tech Lead', dept: 'Web Development', img: 'images/avatars/avatar_dev_male.png', skills: ['Full Stack', 'Cloud Arch', 'Team Leadership'] },
            { id: 'emp4', name: 'Sneha Patel', role: 'UI/UX Designer', dept: 'Branding', img: 'images/avatars/avatar_creative_female.png', skills: ['Figma', 'User Research', 'Prototyping'] },
            { id: 'emp5', name: 'Amit Kumar', role: 'SEO Manager', dept: 'Digital Marketing', img: 'images/avatars/avatar_marketing_male.png', skills: ['Technical SEO', 'Analytics', 'Content Strategy'] },
            { id: 'emp6', name: 'Neha Gupta', role: 'Content Head', dept: 'Branding', img: 'images/avatars/avatar_creative_female.png', skills: ['Copywriting', 'Editorial', 'Social Trends'] },
            { id: 'emp7', name: 'Rohan Deshmukh', role: 'Full Stack Dev', dept: 'Web Development', img: 'images/avatars/avatar_dev_male.png', skills: ['React', 'Node.js', 'Database Design'] },
            { id: 'emp8', name: 'Kavita Reddy', role: 'Social Media Lead', dept: 'Digital Marketing', img: 'images/avatars/avatar_creative_female.png', skills: ['Instagram Growth', 'Community Mgmt', 'Viral Content'] },
            { id: 'emp9', name: 'Arjun Nair', role: 'Video Editor', dept: 'Branding', img: 'images/avatars/avatar_dev_male.png', skills: ['Premiere Pro', 'After Effects', 'Motion Graphics'] },
            { id: 'emp10', name: 'Meera Iyer', role: 'HR Manager', dept: 'Management', img: 'images/avatars/avatar_creative_female.png', skills: ['Talent Acquisition', 'Culture', 'Compliance'] },
            { id: 'emp11', name: 'Suresh Joshi', role: 'App Developer', dept: 'App Development', img: 'images/avatars/avatar_dev_male.png', skills: ['Flutter', 'React Native', 'API Integration'] },
            { id: 'emp12', name: 'Pooja Malhotra', role: 'Graphic Designer', dept: 'Branding', img: 'images/avatars/avatar_creative_female.png', skills: ['Adobe Suite', 'Illustration', 'Print Design'] },
            { id: 'emp13', name: 'Karan Malhotra', role: 'Performance Marketer', dept: 'Digital Marketing', img: 'images/avatars/avatar_marketing_male.png', skills: ['Google Ads', 'Meta Ads', 'ROI Optimization'] },
            { id: 'emp14', name: 'Swati Kulkarni', role: 'Backend Developer', dept: 'Web Development', img: 'images/avatars/avatar_creative_female.png', skills: ['Python', 'Django', 'AWS'] },
            { id: 'emp15', name: 'Rajesh Chavan', role: 'Operations Head', dept: 'Management', img: 'images/avatars/avatar_marketing_male.png', skills: ['Resource Planning', 'Process Flow', 'Logistics'] }
        ];

        // Combine them, avoiding duplicates if any by ID
        this.employees = [...dynamicLeaders];
        const leaderIds = new Set(dynamicLeaders.map(l => l.id));

        hardcodedEmployees.forEach(emp => {
            if (!leaderIds.has(emp.id)) {
                this.employees.push(emp);
            }
        });
    },

    renderDirectoryGrid: function (filteredList = null) {
        const list = filteredList || this.employees;
        const grid = document.getElementById('directory-grid');
        if (!grid) return;

        grid.innerHTML = list.map((emp, index) => `
            <div class="employee-card card-clean group cursor-pointer p-6"
                 onclick="AppNavigation.showLeaderModal('${emp.id === 'ashish' || emp.id === 'gunjan' || emp.id === 'ritu' ? emp.id : 'leadership'}', '${emp.name}', '${emp.role}')"
                 style="animation: fadeInUp 0.5s ease-out backwards ${index * 50}ms">
                
                <!-- Avatar Section -->
                <div class="relative mb-5 mx-auto w-24 h-24">
                    <div class="w-full h-full rounded-full p-0.5 bg-gradient-to-br from-slate-100 to-slate-200 shadow-md">
                        <img src="${emp.img}" class="w-full h-full object-cover rounded-full bg-white" alt="${emp.name}">
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
        `).join('') + `
            <!-- 'Join Us' Card -->
            <div class="card-clean group cursor-pointer p-8 flex flex-col items-center justify-center min-h-[280px]">
                <div class="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center shadow-sm mb-5 group-hover:bg-ikf-yellow/10 group-hover:shadow-md transition-all">
                    <i class="fas fa-plus text-2xl text-slate-400 group-hover:text-ikf-yellow transition-colors"></i>
                </div>
                <h4 class="text-lg font-bold text-slate-600 group-hover:text-slate-800 transition-colors mb-2">Join Our Team</h4>
                <p class="text-xs text-slate-500 text-center max-w-[160px] leading-relaxed">We're always looking for talented individuals</p>
            </div>
        `;
    },

    quickFilter: function (category) {
        $('#dept-filter').val(category);
        this.filterDirectory();
    },

    /**
     * Org Chart Toggle
     */
    toggleDept: function (deptId) {
        const $dept = $(`#dept-${deptId}`);
        // Target the specific toggle icon (chevron) not the main icon
        const $btn = $dept.parent().find('.fa-chevron-down, .fa-chevron-up');
        const $card = $dept.parent().find('.org-node-inner');

        if ($dept.hasClass('hidden')) {
            $dept.hide().removeClass('hidden').slideDown(400, 'swing');
            $btn.removeClass('fa-chevron-down').addClass('fa-chevron-up');
            // Add "smart" focus effect
            $card.addClass('ring-4 ring-ikf-blue/20 shadow-2xl scale-[1.02]');
            $card.find('i').first().removeClass('opacity-20').addClass('opacity-100 text-ikf-yellow');
        } else {
            $dept.slideUp(300, () => {
                $dept.addClass('hidden');
            });
            $btn.removeClass('fa-chevron-up').addClass('fa-chevron-down');
            // Remove focus effect
            $card.removeClass('ring-4 ring-ikf-blue/20 shadow-2xl scale-[1.02]');
            $card.find('i').first().addClass('opacity-20').removeClass('opacity-100 text-ikf-yellow');
        }
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
                        <iframe 
                            width="100%" 
                            height="100%" 
                            src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&rel=0&modestbranding=1" 
                            frameborder="0" 
                            allow="autoplay; encrypted-media" 
                            class="w-full h-full scale-125 pointer-events-none">
                        </iframe>
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
                        badges: ["25+ Years", "360° Digital", "Pune HQ"]
                    },
                    stats: {
                        strategies: { number: "800+", label: "Deployed Successfully" },
                        clients: { number: "1.5k+", label: "Happy Clients" }
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
                                <!-- Subtle decorative logo or element -->
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
                                        <p class="text-ikf-yellow font-bold uppercase tracking-wider text-xs mb-2">Strategies</p>
                                        <h4 class="text-5xl font-extrabold mb-1">${introData.stats.strategies.number}</h4>
                                        <p class="text-blue-200 text-sm">${introData.stats.strategies.label}</p>
                                    </div>
                                </div>

                                <!-- Stat Card 2 -->
                                <div class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden flex-1 group hover:border-ikf-blue/30 transition-colors">
                                    <div class="relative z-10">
                                        <p class="text-slate-400 font-bold uppercase tracking-wider text-xs mb-2">Global Presence</p>
                                        <h4 class="text-5xl font-extrabold text-slate-800 mb-1">${introData.stats.clients.number}</h4>
                                        <p class="text-slate-500 text-sm">${introData.stats.clients.label}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Footer Note (Subtle) -->
                        <div class="flex items-center gap-2 text-slate-400 text-xs font-medium pl-2">
                            <i class="fas fa-info-circle"></i>
                            <p>${introData.footer}</p>
                        </div>
                    </div>`;

            case 'management':
                return `
                    <div class="max-w-7xl mx-auto py-6 fade-in">
                        <div class="mb-16 text-center">
                            <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">System Architects</span>
                            <h1 class="text-4xl md:text-6xl font-black text-[#0E0057] tracking-tighter leading-none mb-6">
                                The <span class="text-[#d9a417]">Visionaries</span>
                            </h1>
                            <p class="text-slate-400 max-w-2xl mx-auto text-sm font-medium leading-relaxed">
                                Guiding the IKF mainframes with over <span class="text-ikf-blue font-bold">75 years</span> of combined digital intelligence.
                            </p>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                            <!-- Leader 1: Ashish Dalia -->
                            <div class="group relative perspective-1000" onclick="AppNavigation.showLeaderModal('ashish', 'Ashish Dalia', 'Founder')">
                                <div class="bg-white rounded-[3rem] p-4 relative z-10 transition-all duration-500 transform preserve-3d group-hover:rotate-y-6 group-hover:shadow-2xl border border-slate-100 h-full flex flex-col">
                                    <div class="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 bg-slate-100">
                                        <img src="images/IKFLOGO/Ashish-Dalia-Sir.jpg" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Ashish Dalia">
                                        
                                        <!-- Smart Overlay -->
                                        <div class="absolute inset-0 bg-gradient-to-t from-ikf-blue via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                                        
                                        <!-- Data Overlay (Normally Hidden, shows on hover) -->
                                        <div class="absolute inset-x-0 bottom-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                            <div class="flex items-center justify-between text-white mb-2">
                                                <span class="text-[10px] font-bold uppercase tracking-widest">Strategy</span>
                                                <span class="text-[10px] font-bold">98%</span>
                                            </div>
                                            <div class="w-full h-1 bg-white/20 rounded-full overflow-hidden mb-4">
                                                <div class="h-full bg-ikf-yellow w-[98%] shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                                            </div>
                                            <div class="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest border border-white/30 rounded-full px-3 py-1 bg-white/10 backdrop-blur-md w-max">
                                                <i class="fas fa-fingerprint text-ikf-yellow"></i> Access Profile
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="px-4 pb-4 text-center">
                                        <h3 class="text-2xl font-black text-slate-800 group-hover:text-ikf-blue transition-colors mb-1">Ashish Dalia</h3>
                                        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Founder</p>
                                        
                                        <!-- Decorative Tech Elements -->
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

                            <!-- Leader 2: Ritu Dalia -->
                            <div class="group relative perspective-1000" onclick="AppNavigation.showLeaderModal('ritu', 'Ritu Dalia', 'Co-Founder')">
                                <div class="bg-white rounded-[3rem] p-4 relative z-10 transition-all duration-500 transform preserve-3d group-hover:rotate-y-6 group-hover:shadow-2xl border border-slate-100 h-full flex flex-col">
                                    <div class="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 bg-slate-100">
                                        <img src="images/IKFLOGO/Ritu-Dalia-IMG.jpg" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Ritu Dalia">
                                        <div class="absolute inset-0 bg-gradient-to-t from-ikf-blue via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                                        
                                        <div class="absolute inset-x-0 bottom-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                            <div class="flex items-center justify-between text-white mb-2">
                                                <span class="text-[10px] font-bold uppercase tracking-widest">Creativity</span>
                                                <span class="text-[10px] font-bold">100%</span>
                                            </div>
                                            <div class="w-full h-1 bg-white/20 rounded-full overflow-hidden mb-4">
                                                <div class="h-full bg-pink-500 w-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                                            </div>
                                            <div class="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest border border-white/30 rounded-full px-3 py-1 bg-white/10 backdrop-blur-md w-max">
                                                <i class="fas fa-fingerprint text-pink-500"></i> Access Profile
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="px-4 pb-4 text-center">
                                        <h3 class="text-2xl font-black text-slate-800 group-hover:text-ikf-blue transition-colors mb-1">Ritu Dalia</h3>
                                        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Co-Founder</p>
                                        
                                        <div class="flex justify-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity duration-700">
                                            <div class="w-1 h-1 bg-pink-500 rounded-full"></div>
                                            <div class="w-1 h-1 bg-pink-500 rounded-full"></div>
                                            <div class="w-8 h-1 bg-pink-500 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="absolute inset-4 bg-pink-500/30 rounded-[3rem] blur-2xl -z-10 group-hover:blur-3xl transition-all opacity-0 group-hover:opacity-70"></div>
                            </div>

                            <!-- Leader 3: Gunjan Bhansali -->
                            <div class="group relative perspective-1000" onclick="AppNavigation.showLeaderModal('gunjan', 'Gunjan Bhansali', 'Operations Head')">
                                <div class="bg-white rounded-[3rem] p-4 relative z-10 transition-all duration-500 transform preserve-3d group-hover:rotate-y-6 group-hover:shadow-2xl border border-slate-100 h-full flex flex-col">
                                    <div class="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 bg-slate-100">
                                        <img src="images/IKFLOGO/Gunjan-Bhansali-IMG.jpg" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Gunjan Bhansali">
                                        <div class="absolute inset-0 bg-gradient-to-t from-ikf-blue via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                                        
                                        <div class="absolute inset-x-0 bottom-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                            <div class="flex items-center justify-between text-white mb-2">
                                                <span class="text-[10px] font-bold uppercase tracking-widest">Operations</span>
                                                <span class="text-[10px] font-bold">99%</span>
                                            </div>
                                            <div class="w-full h-1 bg-white/20 rounded-full overflow-hidden mb-4">
                                                <div class="h-full bg-cyan-400 w-[99%] shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                                            </div>
                                            <div class="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest border border-white/30 rounded-full px-3 py-1 bg-white/10 backdrop-blur-md w-max">
                                                <i class="fas fa-fingerprint text-cyan-400"></i> Access Profile
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="px-4 pb-4 text-center">
                                        <h3 class="text-2xl font-black text-slate-800 group-hover:text-ikf-blue transition-colors mb-1">Gunjan Bhansali</h3>
                                        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Operations Head</p>
                                        
                                        <div class="flex justify-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity duration-700">
                                            <div class="w-1 h-1 bg-cyan-500 rounded-full"></div>
                                            <div class="w-1 h-1 bg-cyan-500 rounded-full"></div>
                                            <div class="w-8 h-1 bg-cyan-500 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="absolute inset-4 bg-cyan-500/30 rounded-[3rem] blur-2xl -z-10 group-hover:blur-3xl transition-all opacity-0 group-hover:opacity-70"></div>
                            </div>
                        </div>

                        <!--Enhanced Leader Modal-- >
                    <div id="leader-modal" class="fixed inset-0 z-[100] hidden flex items-center justify-center p-4">
                        <div class="absolute inset-0 bg-slate-900/90 backdrop-blur-2xl" onclick="AppNavigation.hideModal()">
                            <!-- Matrix Rain / Cyber Overlay can be added here -->
                            <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
                        </div>
                        <div class="bg-white w-full max-w-5xl rounded-[3rem] overflow-hidden relative shadow-2xl scale-95 opacity-0 transition-all duration-500 border border-white/20 flex flex-col md:flex-row" id="modal-content">

                            <button class="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-all z-50 border border-white/20" onclick="AppNavigation.hideModal()"><i class="fas fa-times text-xl"></i></button>

                            <!-- Left Panel: Avatar & Stats -->
                            <div class="md:w-2/5 relative bg-slate-100 overflow-hidden">
                                <div class="absolute inset-0 bg-gradient-to-br from-ikf-blue to-slate-900 opacity-90"></div>
                                <div class="relative z-10 h-full flex flex-col items-center justify-center p-12 text-center text-white">
                                    <div class="w-40 h-40 rounded-[2.5rem] p-1 bg-gradient-to-br from-ikf-yellow to-transparent mb-6 shadow-2xl">
                                        <div class="w-full h-full rounded-[2.3rem] overflow-hidden bg-slate-800">
                                            <!-- Dynamic Avatar injection could happen here, simpler to just use icons or text for now -->
                                            <i class="fas fa-user-astronaut text-6xl mt-10 text-white/50"></i>
                                        </div>
                                    </div>
                                    <h4 id="modal-leader-name" class="text-3xl font-black mb-2 leading-none"></h4>
                                    <p id="modal-leader-role" class="text-ikf-yellow font-bold uppercase tracking-widest text-xs mb-8"></p>

                                    <div class="grid grid-cols-2 gap-4 w-full">
                                        <div class="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                                            <p class="text-2xl font-black">25+</p>
                                            <p class="text-[9px] uppercase tracking-widest opacity-60">Years</p>
                                        </div>
                                        <div class="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                                            <p class="text-2xl font-black">TOP</p>
                                            <p class="text-[9px] uppercase tracking-widest opacity-60">Tier</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Right Panel: Content -->
                            <div class="md:w-3/5 p-12 lg:p-16 bg-white relative">
                                <i class="fas fa-quote-left text-6xl text-slate-100 absolute top-10 left-10 -z-0"></i>
                                <div class="relative z-10">
                                    <h3 class="text-2xl font-black text-slate-900 mb-8 uppercase tracking-wide flex items-center gap-3">
                                        <span class="w-2 h-2 bg-ikf-blue rounded-full"></span>
                                        Vision Archive
                                    </h3>
                                    <div id="modal-leader-note" class="text-slate-500 text-lg leading-relaxed space-y-6 font-medium"></div>

                                    <div class="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                                        <div class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Status: Online
                                        </div>
                                        <button onclick="AppNavigation.hideModal()" class="text-ikf-blue font-black text-xs uppercase tracking-widest hover:text-ikf-yellow transition-colors">Close Terminal <i class="fas fa-arrow-right ml-1"></i></button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    </div>`;

            case 'org-chart':
                return `
                    <div class="max-w-7xl mx-auto py-8 fade-in">
                        <!-- Header -->
                        <div class="mb-12 text-center">
                            <span class="text-ikf-yellow font-bold uppercase tracking-[0.2em] text-xs mb-3 block">Our Structure</span>
                            <h1 class="text-4xl md:text-5xl font-black text-[#0E0057] tracking-tight mb-4">
                                How We're <span class="text-[#d9a417]">Organized</span>
                            </h1>
                            <p class="text-slate-500 text-lg max-w-2xl mx-auto">
                                A simple overview of our departments and what they do
                            </p>
                        </div>

                        <!-- Leadership Section -->
                        <div class="mb-12">
                            <div class="bg-gradient-to-br from-ikf-blue to-slate-800 rounded-2xl p-8 text-white text-center shadow-lg">
                                <div class="inline-flex items-center gap-3 mb-3">
                                    <i class="fas fa-crown text-ikf-yellow text-2xl"></i>
                                    <h2 class="text-2xl font-bold">Leadership Team</h2>
                                </div>
                                <p class="text-blue-200 text-sm max-w-xl mx-auto">
                                    Our Board of Directors provides strategic guidance and vision for the company
                                </p>
                            </div>
                        </div>

                        <!-- Departments Grid -->
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            
                            <!-- Web Development -->
                            <div class="card-clean p-6 group">
                                <div class="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                                    <i class="fas fa-laptop-code text-2xl text-blue-600"></i>
                                </div>
                                <h3 class="text-lg font-bold text-slate-800 mb-2">Web Development</h3>
                                <p class="text-sm text-slate-500 mb-4">Building high-performance websites and web applications</p>
                                <div class="space-y-2">
                                    <div class="text-xs text-slate-600 flex items-center gap-2">
                                        <i class="fas fa-check-circle text-ikf-yellow text-xs"></i>
                                        <span>Website Design</span>
                                    </div>
                                    <div class="text-xs text-slate-600 flex items-center gap-2">
                                        <i class="fas fa-check-circle text-ikf-yellow text-xs"></i>
                                        <span>E-Commerce</span>
                                    </div>
                                    <div class="text-xs text-slate-600 flex items-center gap-2">
                                        <i class="fas fa-check-circle text-ikf-yellow text-xs"></i>
                                        <span>Maintenance</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Digital Marketing -->
                            <div class="card-clean p-6 group">
                                <div class="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                                    <i class="fas fa-bullhorn text-2xl text-green-600"></i>
                                </div>
                                <h3 class="text-lg font-bold text-slate-800 mb-2">Digital Marketing</h3>
                                <p class="text-sm text-slate-500 mb-4">Driving growth through strategic digital campaigns</p>
                                <div class="space-y-2">
                                    <div class="text-xs text-slate-600 flex items-center gap-2">
                                        <i class="fas fa-check-circle text-ikf-yellow text-xs"></i>
                                        <span>Social Media</span>
                                    </div>
                                    <div class="text-xs text-slate-600 flex items-center gap-2">
                                        <i class="fas fa-check-circle text-ikf-yellow text-xs"></i>
                                        <span>SEO</span>
                                    </div>
                                    <div class="text-xs text-slate-600 flex items-center gap-2">
                                        <i class="fas fa-check-circle text-ikf-yellow text-xs"></i>
                                        <span>Performance Marketing</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Branding & Creative -->
                            <div class="card-clean p-6 group">
                                <div class="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
                                    <i class="fas fa-palette text-2xl text-purple-600"></i>
                                </div>
                                <h3 class="text-lg font-bold text-slate-800 mb-2">Branding & Creative</h3>
                                <p class="text-sm text-slate-500 mb-4">Creating compelling visual identities and content</p>
                                <div class="space-y-2">
                                    <div class="text-xs text-slate-600 flex items-center gap-2">
                                        <i class="fas fa-check-circle text-ikf-yellow text-xs"></i>
                                        <span>Video Production</span>
                                    </div>
                                    <div class="text-xs text-slate-600 flex items-center gap-2">
                                        <i class="fas fa-check-circle text-ikf-yellow text-xs"></i>
                                        <span>Content Marketing</span>
                                    </div>
                                    <div class="text-xs text-slate-600 flex items-center gap-2">
                                        <i class="fas fa-check-circle text-ikf-yellow text-xs"></i>
                                        <span>Corporate Branding</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Application Development -->
                            <div class="card-clean p-6 group">
                                <div class="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
                                    <i class="fas fa-server text-2xl text-orange-600"></i>
                                </div>
                                <h3 class="text-lg font-bold text-slate-800 mb-2">Application Development</h3>
                                <p class="text-sm text-slate-500 mb-4">Custom software solutions for business needs</p>
                                <div class="space-y-2">
                                    <div class="text-xs text-slate-600 flex items-center gap-2">
                                        <i class="fas fa-check-circle text-ikf-yellow text-xs"></i>
                                        <span>Cloud Telephony</span>
                                    </div>
                                    <div class="text-xs text-slate-600 flex items-center gap-2">
                                        <i class="fas fa-check-circle text-ikf-yellow text-xs"></i>
                                        <span>Task Management</span>
                                    </div>
                                    <div class="text-xs text-slate-600 flex items-center gap-2">
                                        <i class="fas fa-check-circle text-ikf-yellow text-xs"></i>
                                        <span>Custom Apps</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <!-- Info Footer -->
                        <div class="mt-12 p-6 bg-slate-50 rounded-xl border border-slate-200">
                            <div class="flex items-start gap-3">
                                <i class="fas fa-info-circle text-ikf-blue text-lg mt-0.5"></i>
                                <div>
                                    <h4 class="font-bold text-slate-800 mb-1 text-sm">How We Work Together</h4>
                                    <p class="text-slate-600 text-sm leading-relaxed">
                                        All departments collaborate closely to deliver comprehensive digital solutions. Our integrated approach ensures seamless project execution from strategy to deployment.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>`;

            case 'departments':
                return `
                    <div class="max-w-7xl mx-auto py-8 fade-in">
                        <!-- Header -->
                        <div class="mb-12 text-center">
                            <span class="text-ikf-yellow font-bold uppercase tracking-[0.2em] text-xs mb-3 block">Global Impact</span>
                            <h1 class="text-4xl md:text-5xl font-black text-[#0E0057] tracking-tight mb-4">
                                Our <span class="text-[#d9a417]">Client Showcase</span>
                            </h1>
                            <p class="text-slate-500 text-lg max-w-2xl mx-auto">
                                We partner with leading national and global brands to create powerful, insight-driven digital experiences.
                            </p>
                        </div>

                        <!-- Client Categories -->
                        <div class="space-y-16">
                            
                            <!-- Category: Automotive & Industrial -->
                            <div>
                                <h3 class="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                                    <span class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><i class="fas fa-car-side"></i></span>
                                    Automotive & Industrial
                                </h3>
                                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                    ${[
                        { name: 'Tata Autocomp', logo: 'https://www.ikf.co.in/wp-content/uploads/TataAutoComp.jpg' },
                        { name: 'Mercedes-Benz School', logo: 'https://www.ikf.co.in/wp-content/uploads/MercedesBenzSchool.jpg' },
                        { name: 'Force Motors', logo: 'https://www.ikf.co.in/wp-content/uploads/force-motors-logo.jpg' },
                        { name: 'Kalyani Group', logo: 'https://www.ikf.co.in/wp-content/uploads/Kalyani2.jpg' },
                        { name: 'Kirloskar', logo: 'https://www.ikf.co.in/wp-content/uploads/Kirloskar.jpg' }
                    ].map(client => `
                                        <div class="card-clean p-6 flex flex-col items-center justify-center text-center group hover:border-blue-200 transition-all h-40">
                                            <div class="h-16 flex items-center justify-center mb-4">
                                                <img src="${client.logo}" alt="${client.name}" class="h-full w-auto object-contain mix-blend-multiply">
                                            </div>
                                            <p class="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-tight">${client.name}</p>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- Category: Education & Institutions -->
                            <div>
                                <h3 class="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                                    <span class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><i class="fas fa-graduation-cap"></i></span>
                                    Education & Culture
                                </h3>
                                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                    ${[
                        { name: 'Symbiosis', logo: 'https://www.ikf.co.in/wp-content/uploads/Symbiosis.jpg' },
                        { name: 'MIT School', logo: 'https://www.ikf.co.in/wp-content/uploads/MITSchool.jpg' },
                        { name: 'MIT-WPU', logo: 'https://www.ikf.co.in/wp-content/uploads/MIT-WPU-1.jpg' },
                        { name: 'MITCON', logo: 'https://www.ikf.co.in/wp-content/uploads/MITCON.jpg' },
                        { name: 'MIT ADT', logo: 'https://www.ikf.co.in/wp-content/uploads/MIT-ADT-1.jpg' }
                    ].map(client => `
                                        <div class="card-clean p-6 flex flex-col items-center justify-center text-center group hover:border-indigo-200 transition-all h-40">
                                             <div class="h-16 flex items-center justify-center mb-4">
                                                <img src="${client.logo}" alt="${client.name}" class="h-full w-auto object-contain mix-blend-multiply">
                                            </div>
                                            <p class="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-tight">${client.name}</p>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- Category: Tech & Enterprise -->
                            <div>
                                <h3 class="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                                    <span class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><i class="fas fa-microchip"></i></span>
                                    Tech & Innovation
                                </h3>
                                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                    ${[
                        { name: 'Persistent', logo: 'https://www.ikf.co.in/wp-content/uploads/Persistent.jpg' },
                        { name: 'Bharat Electronics', logo: 'https://www.ikf.co.in/wp-content/uploads/BharatElectronics.jpg' },
                        { name: 'Poonawalla Group', logo: 'https://www.ikf.co.in/wp-content/uploads/poonawalla-group-jpg.webp' },
                        { name: 'Mindgate', logo: 'https://www.ikf.co.in/wp-content/uploads/Mindgate.jpg' },
                        { name: 'ARAI', logo: 'https://www.ikf.co.in/wp-content/uploads/ARAI-1.jpg' }
                    ].map(client => `
                                        <div class="card-clean p-6 flex flex-col items-center justify-center text-center group hover:border-emerald-200 transition-all h-40">
                                             <div class="h-16 flex items-center justify-center mb-4">
                                                <img src="${client.logo}" alt="${client.name}" class="h-full w-auto object-contain mix-blend-multiply">
                                            </div>
                                            <p class="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-tight">${client.name}</p>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                        </div>

                        <!-- Stats Footer -->
                        <div class="mt-20 p-12 bg-gradient-to-br from-ikf-blue to-slate-900 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
                            <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                            <div class="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                                <div>
                                    <p class="text-5xl font-black text-ikf-yellow mb-2">1500+</p>
                                    <p class="text-xs font-bold uppercase tracking-[0.2em] opacity-60">Global Brands</p>
                                </div>
                                <div class="md:border-x border-white/10 md:px-12">
                                    <p class="text-5xl font-black text-ikf-yellow mb-2">25+</p>
                                    <p class="text-xs font-bold uppercase tracking-[0.2em] opacity-60">Years Excellence</p>
                                </div>
                                <div>
                                    <p class="text-5xl font-black text-ikf-yellow mb-2">Pune</p>
                                    <p class="text-xs font-bold uppercase tracking-[0.2em] opacity-60">Innovation Hub</p>
                                </div>
                            </div>
                        </div>
                    </div>`;

            case 'directory':
                // Initialize employees if not already done
                if (!this.employees || this.employees.length === 0) {
                    this.initEmployees();
                }

                const dirData = this.contentData?.directory || {
                    badge: "Live Neural Network",
                    title: "The Collective.",
                    description: `Accessing biosignatures of ${this.employees ? this.employees.length : '60+'} active agents operating across the IKF ecosystem.`,
                    stats: [
                        { label: "Active", value: "100", suffix: "%" },
                        { label: "Depts", value: "05", suffix: "" }
                    ],
                    searchPlaceholder: "Scan for agent name or clearance level..."
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
                                <div class="flex gap-4">
                                    ${(Array.isArray(dirData.stats) ? dirData.stats : []).map(stat => `
                                        <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-lg text-center min-w-[100px] hover:-translate-y-1 transition-transform">
                                            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">${stat.label}</p>
                                            <p class="text-2xl font-black text-ikf-blue">${stat.value}<span class="text-sm align-top">${stat.suffix || ""}</span></p>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- Floating Search & Filter Bar -->
                            <div class="bg-white p-4 rounded-[2rem] shadow-xl shadow-ikf-blue/5 border border-slate-50 flex flex-col lg:flex-row gap-4 items-center relative z-30">
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
                                        <span class="px-2 py-1 bg-white rounded-lg text-[10px] font-bold text-slate-300 border border-slate-100 shadow-sm">CTRL + K</span>
                                    </div>
                                </div>

                                <!-- Destroyer Line (Mobile) -->
                                <div class="w-full h-px bg-slate-100 lg:w-px lg:h-12"></div>

                                <!-- Filter Dropdown -->
                                <div class="relative min-w-[200px] w-full lg:w-auto group">
                                    <i class="fas fa-layer-group absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-ikf-yellow transition-colors"></i>
                                    <select id="dept-filter" class="w-full pl-12 pr-10 py-4 bg-slate-50 border-2 border-transparent rounded-3xl text-sm font-bold text-slate-600 focus:outline-none focus:bg-white focus:border-ikf-yellow/30 cursor-pointer hover:bg-white transition-colors appearance-none" onchange="AppNavigation.filterDirectory()">
                                        <option value="all">All Ecosystems</option>
                                        <option value="Management">Management Core</option>
                                        <option value="Web Development">Web Development</option>
                                        <option value="Digital Marketing">Digital Marketing</option>
                                        <option value="Branding">Branding Unit</option>
                                        <option value="App Development">App Development</option>
                                    </select>
                                    <i class="fas fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 text-xs pointer-events-none"></i>
                                </div>
                            </div>
                        </div>

                        <!--Quick Filters Pills(Visual Only)-->
                        <div class="flex flex-wrap justify-center gap-3 mb-12 opacity-60 hover:opacity-100 transition-opacity">
                            <span class="text-[10px] font-black uppercase tracking-widest text-slate-300 py-2">Quick Access:</span>
                            <button onclick="AppNavigation.quickFilter('Web Development')" class="px-4 py-1.5 bg-white/50 hover:bg-white text-slate-400 hover:text-ikf-blue rounded-full text-[10px] font-bold border border-transparent hover:border-ikf-blue/20 transition-all hover:shadow-lg">Web Dev</button>
                            <button onclick="AppNavigation.quickFilter('Digital Marketing')" class="px-4 py-1.5 bg-white/50 hover:bg-white text-slate-400 hover:text-ikf-blue rounded-full text-[10px] font-bold border border-transparent hover:border-ikf-blue/20 transition-all hover:shadow-lg">Marketing</button>
                            <button onclick="AppNavigation.quickFilter('Branding')" class="px-4 py-1.5 bg-white/50 hover:bg-white text-slate-400 hover:text-ikf-blue rounded-full text-[10px] font-bold border border-transparent hover:border-ikf-blue/20 transition-all hover:shadow-lg">Branding</button>
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
                        <!-- Header Section -->
                        <div class="mb-20 text-center lg:text-left relative">
                            <div class="absolute -top-10 -left-10 text-[120px] font-black text-slate-50 -z-10 select-none">IKF</div>
                            <span class="bg-[#0E0057] text-white px-5 py-2 rounded-sm text-[10px] font-black uppercase tracking-[0.4em] mb-6 inline-block">
                                ${pData.badge || 'Core Directives'}
                            </span>
                            <h1 class="text-5xl md:text-7xl font-black text-[#0E0057] leading-none tracking-tighter mb-6">
                                The <span class="text-[#d9a417]">Philosophy</span>
                            </h1>
                            <p class="text-xl text-slate-400 font-medium max-w-2xl leading-relaxed">
                                ${pData.subtitle || 'Engineering growth through master-level digital strategies and industrialized precision.'}
                            </p>
                        </div>

                        <!-- Pillars Grid -->
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
                                            <span class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Pillar 0${idx + 1}</span>
                                        </div>

                                        <h3 class="text-3xl font-black mb-6 ${colorClass}">${pillar.title || ''}</h3>
                                        <p class="text-slate-500 text-sm leading-relaxed font-medium mb-10">
                                            ${pillar.description || pillar.content || ''}
                                        </p>

                                        <div class="pt-6 border-t border-slate-50 flex justify-between items-center">
                                            <span class="text-[9px] font-black text-slate-300 uppercase tracking-widest">Protocol v25.0</span>
                                            <i class="fas fa-chevron-right text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ${colorClass}"></i>
                                        </div>
                                    </div>
                                `;
                }).join('')}
                        </div>

                        <!-- Formal Brand Manifesto -->
                        <div class="bg-[#0E0057] rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden group">
                            <!-- Background Accent -->
                            <div class="absolute top-0 right-0 w-1/2 h-full bg-[#d9a417]/5 -skew-x-12 translate-x-1/2"></div>
                            
                            <div class="relative z-10 max-w-4xl">
                                <h2 class="text-4xl md:text-6xl font-black mb-12 leading-tight tracking-tighter">
                                    Beyond Services, <br />
                                    <span class="text-[#d9a417]">We Build Legacies.</span>
                                </h2>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                                    <p class="text-lg text-slate-300 font-medium leading-relaxed">
                                        At IKF, our philosophy is the engine of our growth. For 25 years, we've refined digital tools through a human lens, ensuring every output is a blend of precision and heart.
                                    </p>
                                    <p class="text-lg text-slate-300 font-medium leading-relaxed">
                                        We are obsessed with curiosity and mastered in digital wisdom, engineering competitive advantages for 1500+ global partners.
                                    </p>
                                </div>

                                <div class="flex flex-wrap gap-12 pt-12 border-t border-white/10">
                                    <div class="flex flex-col">
                                        <span class="text-5xl font-black text-[#d9a417] mb-2">25+</span>
                                        <span class="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Years Legacy</span>
                                    </div>
                                    <div class="flex flex-col">
                                        <span class="text-5xl font-black text-white mb-2">1500+</span>
                                        <span class="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Global Partners</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;

            case 'mission':
                const missData = this.contentData?.mission_vision || {
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
                        <div class="max-w-6xl mx-auto py-6 fade-in" >
                        <div class="mb-16">
                            <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">${missData.badge}</span>
                            <h1 class="text-4xl md:text-6xl font-black text-[#0E0057] tracking-tight">${missData.title}</h1>
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
                            <div class="bg-white p-12 lg:p-16 rounded-[3rem] premium-card relative overflow-hidden group">
                                <div class="absolute top-0 right-0 p-8 opacity-5 transform group-hover:scale-110 transition-transform"><i class="fas fa-eye text-[120px] text-ikf-blue"></i></div>
                                <h3 class="text-3xl font-black text-ikf-blue mb-6">${missData.vision.title}</h3>
                                <p class="text-slate-500 text-lg leading-relaxed italic">
                                    ${missData.vision.content}
                                </p>
                                <div class="mt-10 flex items-center gap-4 text-ikf-yellow">
                                    <div class="h-px flex-1 bg-ikf-yellow/20"></div>
                                    <span class="text-[10px] font-black uppercase tracking-[0.3em]">Ambition</span>
                                </div>
                            </div>
                            <div class="bg-ikf-blue p-12 lg:p-16 rounded-[3rem] premium-card relative overflow-hidden group text-white">
                                <div class="absolute top-0 right-0 p-8 opacity-10 transform group-hover:scale-110 transition-transform"><i class="fas fa-rocket text-[120px] text-white"></i></div>
                                <h3 class="text-3xl font-black mb-6">${missData.mission.title}</h3>
                                <p class="text-blue-100 text-lg leading-relaxed">
                                    ${missData.mission.content}
                                </p>
                                <div class="mt-10 flex items-center gap-4 text-ikf-yellow">
                                    <div class="h-px flex-1 bg-white/10"></div>
                                    <span class="text-[10px] font-black uppercase tracking-[0.3em]">Execution</span>
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
                                                <span class="text-[8px] font-black text-slate-300 uppercase tracking-widest">Core DNA</span>
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

                        <!--Culture Stats Grid-- >
                        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                            ${(Array.isArray(cultData.stats) ? cultData.stats : []).map(stat => `
                                <div class="p-8 bg-white rounded-[2.5rem] shadow-lg hover:shadow-xl transition-all border border-slate-50 text-center group cursor-pointer hover:-translate-y-2">
                                    <div class="w-16 h-16 rounded-2xl bg-${stat.color}-50 text-${stat.color === 'ikf-blue' ? 'ikf-blue' : stat.color === 'ikf-yellow' ? 'ikf-yellow' : stat.color + '-500'} flex items-center justify-center mx-auto mb-6 text-2xl group-hover:scale-110 transition-transform"><i class="fas ${stat.icon}"></i></div>
                                    <h3 class="text-4xl font-black text-slate-800 mb-2">${stat.value}<span class="text-lg text-slate-300">${stat.suffix}</span></h3>
                                    <p class="text-xs font-bold uppercase tracking-widest text-slate-400">${stat.label}</p>
                                </div>
                            `).join('')}
                        </div>

                        <!--Main Culture Modules-- >
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
                                                <span>Collaboration Mode: Active</span>
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
                                        <span class="text-white font-black uppercase text-xs tracking-widest">View Gallery</span>
                                    </div>
                                    <span class="text-ikf-blue/30 font-black text-xl rotate-12 group-hover:rotate-0 transition-transform">${(cultData.gallery || {}).tag || '#IKFLife'}</span>
                                </div>
                            </div>
                        </div>
                    </div>`;

            case 'social':
                const socData = this.contentData?.social || {};
                const stats = socData.platforms || [
                    { name: "LinkedIn", stat: "25k+", label: "Connections", growth: "Top Talent Hub", url: "#" },
                    { name: "Instagram", stat: "18k+", label: "Followers", growth: "Culture & Life", url: "#" },
                    { name: "YouTube", stat: "5k+", label: "Subscribers", growth: "Expert Insights", url: "#" },
                    { name: "Facebook", stat: "42k+", label: "Fans", growth: "Community Rooted", url: "#" }
                ];
                const feed = socData.feed || [];

                return `
                    <div class="max-w-7xl mx-auto py-12 px-6 fade-in">
                        <!-- Header -->
                        <div class="mb-16 text-center lg:text-left relative">
                            <div class="absolute -top-10 -left-10 text-[120px] font-black text-slate-50 -z-10 select-none opacity-50">HUB</div>
                            <span class="bg-[#0E0057] text-white px-5 py-2 rounded-sm text-[10px] font-black uppercase tracking-[0.4em] mb-6 inline-block">
                                ${socData.badge || 'Stay Connected'}
                            </span>
                            <h1 class="text-5xl md:text-7xl font-black text-[#0E0057] leading-none tracking-tighter mb-6">
                                The <span class="text-[#d9a417]">Social Hub</span>
                            </h1>
                            <p class="text-xl text-slate-400 font-medium max-w-2xl leading-relaxed">
                                Join the IKF digital ecosystem. Follow our journey, celebrate our culture, and stay updated with the latest from our global network.
                            </p>
                        </div>

                        <!-- Platform Stats Grid -->
                        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                            ${stats.map(stat => {
                    const platformMeta = {
                        'LinkedIn': { color: '#0077b5', icon: 'fa-linkedin-in' },
                        'Instagram': { color: '#E1306C', icon: 'fa-instagram' },
                        'Facebook': { color: '#1877F2', icon: 'fa-facebook-f' },
                        'YouTube': { color: '#FF0000', icon: 'fa-youtube' }
                    };
                    const meta = platformMeta[stat.name] || { color: '#0E0057', icon: 'fa-share-nodes' };
                    return `
                                    <a href="${stat.url}" target="_blank" class="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                                        <div class="absolute top-0 right-0 w-32 h-32 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity duration-500 -mr-8 -mt-8">
                                            <i class="fab ${meta.icon} text-8xl"></i>
                                        </div>
                                        <div class="flex items-center justify-between mb-8">
                                            <span class="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg transition-transform group-hover:scale-110" style="background-color: ${meta.color}">
                                                <i class="fab ${meta.icon}"></i>
                                            </span>
                                            <span class="text-[10px] font-bold text-slate-300 uppercase tracking-widest group-hover:text-[#d9a417] transition-colors">Follow Us</span>
                                        </div>
                                        <h3 class="text-4xl font-black text-slate-800 mb-1 tracking-tighter">${stat.stat}</h3>
                                        <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">${stat.label}</p>
                                        <div class="flex items-center gap-2 text-[10px] font-black text-[#d9a417] uppercase tracking-wider">
                                            <span class="w-1.5 h-1.5 rounded-full bg-[#d9a417] animate-pulse"></span>
                                            ${stat.growth}
                                        </div>
                                    </a>
                                `;
                }).join('')}
                        </div>

                        <!-- Social Feed Visualization -->
                        <div class="mb-12">
                            <div class="flex items-center justify-between mb-10">
                                <h2 class="text-3xl font-black text-[#0E0057] tracking-tight">Recent <span class="text-[#d9a417]">Transmissions</span></h2>
                                <div class="hidden md:flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <span class="w-2 h-2 rounded-full bg-green-500"></span>
                                    Live Sync Active
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                ${feed.map(post => {
                    const platformLinks = {
                        'LinkedIn': 'https://www.linkedin.com/company/i-knowledge-factory-pvt.-ltd./',
                        'Instagram': 'https://www.instagram.com/ikfdigital/',
                        'Facebook': 'https://www.facebook.com/IKFDigital/',
                        'YouTube': 'https://www.youtube.com/c/IKFDigital'
                    };
                    const postUrl = platformLinks[post.platform] || '#';

                    return `
                                    <div class="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-500">
                                        <!-- Post Header -->
                                        <div class="p-5 flex items-center justify-between border-b border-slate-50">
                                            <div class="flex items-center gap-3">
                                                <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#0E0057] text-xs font-black">
                                                    ${post.user.substring(0, 1)}
                                                </div>
                                                <div>
                                                    <p class="text-[11px] font-black text-slate-800 leading-none mb-1">${post.user}</p>
                                                    <p class="text-[10px] font-bold text-slate-400 leading-none">${post.handle}</p>
                                                </div>
                                            </div>
                                            <i class="fab ${post.icon} text-slate-200 group-hover:text-[#d9a417] transition-colors"></i>
                                        </div>
                                        
                                        <!-- Post Image -->
                                        <div class="aspect-square bg-slate-100 overflow-hidden relative video-card" ${post.platform === 'YouTube' ? `data-video="${post.url.split('v=')[1]}"` : ''}>
                                            <img src="${post.image}" alt="Social Post" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 thumbnail-img" referrerpolicy="no-referrer">
                                            
                                            ${post.platform === 'YouTube' ? `
                                                <div class="absolute inset-0 flex items-center justify-center z-10 play-icon pointer-events-none">
                                                    <div class="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform duration-500">
                                                        <i class="fas fa-play text-xl ml-1"></i>
                                                    </div>
                                                </div>
                                                <div class="absolute inset-0 video-container opacity-0 transition-opacity duration-500 pointer-events-none z-0"></div>
                                            ` : ''}

                                            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                                <div class="absolute bottom-4 left-4 right-4">
                                                     <a href="${post.url || postUrl}" target="_blank" class="w-full py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#d9a417] hover:border-[#d9a417] transition-all">
                                                        ${post.platform === 'YouTube' ? 'Watch on YouTube' : 'View on ' + post.platform} <i class="fas fa-external-link-alt text-[8px]"></i>
                                                     </a>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Post Content -->
                                        <div class="p-6 flex-1 flex flex-col">
                                            <p class="text-xs text-slate-600 leading-relaxed mb-6 flex-1 line-clamp-3">
                                                ${post.text}
                                            </p>
                                            <div class="flex items-center justify-between pt-4 border-t border-slate-50">
                                                <div class="flex items-center gap-4">
                                                    <span class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                                        <i class="fas fa-heart text-red-100 group-hover:text-red-500 transition-colors"></i> ${post.likes}
                                                    </span>
                                                    <span class="text-[10px] font-bold text-slate-300 tracking-tight">${post.date}</span>
                                                </div>
                                                <i class="fas fa-arrow-right text-[10px] text-slate-100 group-hover:text-[#0E0057] group-hover:translate-x-1 transition-all"></i>
                                            </div>
                                        </div>
                                    </div>
                                `;
                }).join('')}
                            </div>
                        </div>

                        <!-- Dark CTA Section -->
                        <div class="mt-24 bg-[#0E0057] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
                            <div class="absolute top-0 right-0 w-96 h-96 bg-blue-900 rounded-full -mr-48 -mt-48 opacity-20"></div>
                            <div class="absolute bottom-0 left-0 w-64 h-64 bg-[#d9a417] rounded-full -ml-32 -mb-32 opacity-10"></div>
                            
                            <div class="relative z-10 max-w-2xl mx-auto">
                                <h3 class="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">Become an <span class="text-[#d9a417]">Amplifier</span></h3>
                                <p class="text-blue-200 text-lg font-medium mb-10 leading-relaxed">
                                    Our employees are our biggest ambassadors. Join the conversation, share our stories, and help us grow the IKF global community.
                                </p>
                                <div class="flex flex-wrap justify-center gap-4">
                                    <button class="px-8 py-4 bg-[#d9a417] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white hover:text-[#0E0057] transition-all shadow-xl">
                                        Access Media Kit
                                    </button>
                                    <button class="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all backdrop-blur-md">
                                        View Guidelines
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

            case 'referral':
                const refData = this.contentData?.referral || {};
                const tiers = refData.tiers || [
                    { title: "Junior Agent", experience: "0-2 Years Exp", reward: "₹5,000", label: "Successfully Hired" },
                    { title: "Specialist", experience: "2-5 Years Exp", reward: "₹15,000", label: "Successfully Hired" },
                    { title: "Architect", experience: "5+ Years Exp", reward: "₹25,000", label: "Successfully Hired" }
                ];
                const refProcess = refData.process || [
                    { step: "1. Identify", description: "Locate a candidate matching our cultural code." },
                    { step: "2. Submit", description: "Forward coordinates (CV) to HR via secure channel." }
                ];

                const refPolicies = refData.policies || [
                    { title: "Eligibility", description: "All active employees are eligible except HR and Leadership teams." },
                    { title: "Payout", description: "Rewards are processed after 90 days of successful candidate probation." }
                ];

                return `
                    <div class="max-w-6xl mx-auto py-12 px-6 fade-in">
                        <!-- Header Section -->
                        <div class="mb-20 text-center lg:text-left relative">
                            <div class="absolute -top-10 -left-10 text-[120px] font-black text-slate-50 -z-10 select-none">IKF</div>
                            <span class="bg-[#0E0057] text-white px-5 py-2 rounded-sm text-[10px] font-black uppercase tracking-[0.4em] mb-6 inline-block">
                                ${refData.badge || 'Ambassador Protocol'}
                            </span>
                            <h1 class="text-5xl md:text-7xl font-black text-[#0E0057] leading-none tracking-tighter mb-6">
                                Referral <span class="text-[#d9a417]">Program</span>
                            </h1>
                            <p class="text-xl text-slate-400 font-medium max-w-2xl leading-relaxed">
                                ${refData.subtitle || 'Connect high-caliber talent with our industrial excellence and earn professional rewards.'}
                            </p>
                        </div>

                        <!-- Rewards Tiers -->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                            ${(Array.isArray(tiers) ? tiers : []).map((tier, idx) => {
                    const isFeatured = tier.featured || idx === 1;
                    const borderClass = isFeatured ? 'border-[#d9a417] shadow-xl ring-4 ring-[#d9a417]/5' : 'border-slate-100 shadow-sm';
                    const colorClass = isFeatured ? 'text-[#d9a417]' : 'text-[#0E0057]';

                    return `
                                    <div class="group bg-white p-10 rounded-[3rem] border-2 ${borderClass} relative overflow-hidden transition-all duration-500 hover:-translate-y-2">
                                        <div class="absolute -right-4 -bottom-4 text-[120px] font-black opacity-[0.03] group-hover:opacity-[0.06] transition-opacity select-none pointer-events-none">
                                            0${idx + 1}
                                        </div>
                                        
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

                        <!-- Process Section -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
                            <div class="bg-white p-12 lg:p-16 rounded-[4rem] border border-slate-100 shadow-sm">
                                <h3 class="text-3xl font-black text-[#0E0057] mb-12">The Protocol</h3>
                                <div class="space-y-12">
                                    ${(Array.isArray(refProcess) ? refProcess : []).map((step, idx) => `
                                        <div class="flex gap-6 relative group">
                                            <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-[#0E0057] relative z-10 group-hover:bg-[#d9a417] group-hover:text-white transition-all">
                                                0${idx + 1}
                                            </div>
                                            ${idx < refProcess.length - 1 ? '<div class="absolute left-6 top-12 w-px h-12 bg-slate-100"></div>' : ''}
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
                                    ${(Array.isArray(refPolicies) ? refPolicies : []).map(policy => `
                                        <div>
                                            <h4 class="text-xs font-black uppercase tracking-widest text-[#d9a417] mb-2">${policy.title}</h4>
                                            <p class="text-blue-100/70 text-sm font-medium leading-relaxed">${policy.description}</p>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <!-- CTA Section -->
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

            case 'anniversary':
                const annivData = this.contentData?.anniversary || {};
                const milestones = annivData.milestones || [
                    { years: "10+", badge: "Titan", title: "Founding Pillars", members: [{ name: "Ashish Dalia", role: "Founder", image: "images/avatars/ashish_real.jpg" }] },
                    { years: "5+", badge: "Core", title: "The Architects", members: [{ name: "Vikram Singh", role: "Sr. Strategist", image: "images/avatars/avatar_marketing_male.png" }] }
                ];

                return `
                    < div class="max-w-6xl mx-auto py-6 fade-in" >
                        <div class="mb-16 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div>
                                <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">${annivData.badge || 'Legacy System'}</span>
                                <h1 class="text-4xl md:text-6xl font-black text-[#0E0057] tracking-tight">${annivData.title || 'Hall of <span class="text-[#d9a417]">Fame</span>'}</h1>
                            </div>
                            <div class="bg-slate-900 text-white px-8 py-4 rounded-[2rem] flex items-center gap-4 shadow-xl">
                                <div class="text-right">
                                    <p class="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Total Experience</p>
                                    <p class="text-2xl font-black text-ikf-yellow">${annivData.totalExperience || '142+'}<span class="text-sm text-white"> Years</span></p>
                                </div>
                                <i class="fas fa-hourglass-half text-3xl text-slate-700"></i>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                            ${(Array.isArray(milestones) ? milestones : []).map(m => `
                                <div class="p-8 bg-white rounded-[2.5rem] border border-slate-50 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all group flex flex-col items-center text-center relative overflow-hidden">
                                    <div class="absolute inset-x-0 top-0 h-2 bg-slate-900"></div>
                                    <div class="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-900 border-4 border-slate-900 relative">
                                        <span class="text-3xl font-black">${m.years}</span>
                                        <div class="absolute -bottom-3 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">${m.badge || m.label || 'Elite'}</div>
                                    </div>
                                    <h3 class="text-xl font-black text-slate-800 mb-4">${m.title}</h3>
                                    <div class="space-y-3 w-full">
                                        ${(Array.isArray(m.members || m.people) ? (m.members || m.people) : []).map(p => `
                                            <div class="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                                                <img src="${p.image || p.img || 'images/avatars/avatar_dev_male.png'}" class="w-10 h-10 rounded-xl object-cover">
                                                <div class="text-left">
                                                    <p class="text-xs font-bold">${p.name}</p>
                                                    <p class="text-[9px] text-slate-400">${p.role}</p>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        <div class="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-center relative overflow-hidden flex flex-col items-center justify-center">
                            <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                            <div class="relative z-10 w-full max-w-lg text-left">
                                <div class="bg-slate-800 rounded-t-xl p-3 flex gap-2">
                                    <div class="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div class="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div class="bg-black/50 backdrop-blur-md p-6 rounded-b-xl border-t border-white/5 font-mono text-xs md:text-sm text-slate-300 shadow-2xl">
                                    <p class="mb-2"><span class="text-green-400">➜</span> <span class="text-blue-400">~</span> system_check --legacy</p>
                                    <p class="mb-2"><span class="text-green-400">✔</span> core_values_integrity: <span class="text-ikf-yellow">100%</span></p>
                                    <p class="mb-2"><span class="text-green-400">✔</span> knowledge_transfer: <span class="text-ikf-yellow">active</span></p>
                                    <p class="text-slate-500">// Join the league. Build your legacy.</p>
                            </div>
                        </div>
                    </div>`;

            case 'birthdays':
                const bdayData = this.contentData?.birthdays || {};
                const upcoming = bdayData.upcoming || [
                    { name: "Priya Sharma", date: "Feb 14", dept: "Creative Dept", image: "images/avatars/avatar_creative_female.png" },
                    { name: "Rohan D.", date: "Feb 22", dept: "Development", image: "images/avatars/avatar_dev_male.png" }
                ];
                const bdayTerminal = bdayData.terminal || { command: "execute_party_protocol.sh", output: ["cake_logistics: scheduled"] };

                return `
                    < div class="max-w-6xl mx-auto py-6 fade-in" >
                        <div class="mb-12 flex items-end justify-between">
                            <div>
                                <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">${bdayData.badge || 'Solar Returns'}</span>
                                <h1 class="text-4xl md:text-6xl font-black text-[#0E0057] tracking-tight">${bdayData.title || 'Party <span class="text-[#d9a417]">Protocol</span>'}</h1>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                            ${(Array.isArray(upcoming) ? upcoming : []).map(b => `
                                <div class="bg-white rounded-[2.5rem] border border-slate-50 p-6 flex items-center gap-4 hover:shadow-lg transition-all group cursor-default">
                                    <div class="w-20 h-20 rounded-2xl bg-slate-100 relative overflow-hidden">
                                        <img src="${b.image || b.img || 'images/avatars/avatar_dev_male.png'}" class="w-full h-full object-cover group-hover:scale-110 transition-transform">
                                    </div>
                                    <div>
                                        <div class="flex items-center gap-2 mb-1">
                                            <span class="bg-pink-100 text-pink-500 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">${b.date || 'TBD'}</span>
                                        </div>
                                        <h3 class="text-lg font-black text-slate-800">${b.name}</h3>
                                        <p class="text-xs text-slate-400 mb-2">${b.dept || 'Ecosystem'}</p>
                                        <div class="flex items-center gap-1 text-[10px] text-ikf-blue font-bold">
                                            <i class="fas ${b.status === 'Upcoming' ? 'fa-clock' : 'fa-gift'}"></i> ${b.status || 'Wishing Pending'}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        <div class="bg-slate-900 rounded-[3rem] p-10 text-center relative overflow-hidden flex flex-col items-center justify-center">
                            <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                            <div class="relative z-10 w-full max-w-lg mb-8 text-left">
                                <div class="bg-slate-800 rounded-t-xl p-3 flex gap-2">
                                    <div class="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div class="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div class="bg-black/50 backdrop-blur-md p-6 rounded-b-xl border-t border-white/5 font-mono text-xs md:text-sm text-slate-300 shadow-2xl">
                                    <p class="mb-2"><span class="text-green-400">➜</span> <span class="text-blue-400">~</span> ${bdayTerminal.command}</p>
                                    ${(bdayTerminal.output || []).map(line => `<p class="mb-2"><span class="text-green-400">✔</span> ${line}</p>`).join('')}
                                </div>
                            </div>
                            <button onclick="alert('Broadcasting wishes to the specific channels... 🎈')" class="relative z-10 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl text-white font-black uppercase tracking-[0.2em] shadow-lg hover:shadow-pink-500/30 hover:scale-105 transition-all flex items-center gap-4">
                                <i class="fas fa-bullhorn animate-pulse"></i> ${bdayData.cta || 'Broadcast Wishes'}
                            </button>
                        </div>
                    </div > `;

            case 'holidays':
                const holidayData = this.contentData?.holidays || {};
                const strategicResets = holidayData.strategicResets || holidayData.list || [
                    { name: "Republic Day", date: "JANUARY 26", type: "Mandatory" },
                    { name: "Independence Day", date: "AUGUST 15", type: "Mandatory" }
                ];
                const holidayPolicy = holidayData.policy || {
                    title: "Execution Protocol",
                    description: "IKF publishes its final holiday list at the start of every calendar year.",
                    compensatory: "Holidays falling on Sundays are not carried forward."
                };

                return `
                    < div class="max-w-6xl mx-auto py-6 fade-in" >
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
                                <h4 class="text-2xl font-black mb-6">${holidayPolicy.title}</h4>
                                <p class="text-slate-400 leading-relaxed mb-8">
                                    ${holidayPolicy.description}
                                </p>
                                <div class="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                    <p class="text-[10px] font-black text-ikf-yellow uppercase tracking-widest mb-2">Compensatory Policy</p>
                                    <p class="text-xs text-slate-400">${holidayPolicy.compensatory}</p>
                                </div>
                            </div>
                        </div>
                    </div > `;

            case 'attendance':
                const attendData = this.contentData?.attendance || {};
                const schedule = attendData.schedule || [
                    { title: "Work Week", value: "Monday - Friday", note: "Strategic Fridays" },
                    { title: "Core Hours", value: "09:30 AM - 06:15 PM", note: "Productive Sync" }
                ];
                const punctuality = attendData.punctuality || { title: "The Punctuality DNA", description: "Precision is our product.", rules: ["Entry: 09:30 AM"] };

                return `
                    < div class="max-w-6xl mx-auto py-6 fade-in" >
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
                    </div > `;

            case 'policies':
                const policyData = this.contentData?.policies || {};
                const policyStats = policyData.stats || [
                    { value: "06", label: "Probation" },
                    { value: "90", label: "Notice Period" }
                ];
                const policyTerminal = policyData.terminal || { command: "initializing_handshake_protocol...", output: ["policies_loaded: true"] };

                return `
                    < div class="max-w-6xl mx-auto py-6 fade-in" >
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
                    </div > `;

            default:
                return `
                    < div class="max-w-4xl mx-auto py-20 text-center" >
                        <div class="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6"><i class="fas fa-tools text-2xl text-slate-400"></i></div>
                        <h2 class="text-2xl font-bold text-ikf-blue">Module Under Construction</h2>
                        <p class="text-slate-500 mt-2 text-lg">We are building high-quality content for <span class="font-bold text-ikf-yellow italic">${sectionId}</span>.</p>
                        <button onclick="AppNavigation.navigateTo('intro')" class="mt-8 text-ikf-blue font-bold hover:underline"><i class="fas fa-arrow-left mr-2"></i> Back to Intro</button>
                    </div > `;
        }
    }
};

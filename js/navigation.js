/**
 * navigation.js - Controls the SPA flow and UI updates
 */

window.AppNavigation = {
    sections: {}, // Will be populated with template content

    init: function () {
        const self = this;

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

        // 5. Special Init for Directory
        if (sectionId === 'directory') {
            setTimeout(() => {
                this.renderDirectoryGrid();
            }, 50); // Small delay to ensure DOM is ready
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
            jayraj: "<p>Jayraj oversees strategic operations and technological integration, ensuring that the Factory operates at peak industrial precision. His focus on process optimization drives our ability to deliver consistent quality at scale.</p>",
            anuja: "<p>Anuja leads the creative and brand strategy units, focusing on human-centric digital storytelling. Her vision bridges the gap between data-driven performance and emotional brand connection.</p>"
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
        this.employees = [
            { id: 'ashish', name: 'Ashish Dalia', role: 'Managing Director', dept: 'Management', img: 'images/avatars/ashish_real.jpg', skills: ['Visionary', 'Strategy', 'Leadership'] },
            { id: 'jayraj', name: 'Jayraj Mehta', role: 'Director', dept: 'Management', img: 'images/avatars/jayraj.png', skills: ['Operations', 'Tech Integration', 'Scale'] },
            { id: 'anuja', name: 'Anuja Kapoor', role: 'Director', dept: 'Management', img: 'images/avatars/anuja.png', skills: ['Creative Direction', 'Brand Strategy', 'Storytelling'] },

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
    },

    renderDirectoryGrid: function (filteredList = null) {
        const list = filteredList || this.employees;
        const grid = document.getElementById('directory-grid');
        if (!grid) return;

        grid.innerHTML = list.map((emp, index) => `
            <div class="employee-card group relative bg-white rounded-[2.5rem] p-6 hover:-translate-y-2 transition-all duration-500 overflow-visible z-10 hover:z-20"
                 onclick="AppNavigation.showLeaderModal('${emp.id === 'ashish' || emp.id === 'jayraj' || emp.id === 'anuja' ? emp.id : 'leadership'}', '${emp.name}', '${emp.role}')"
                 style="animation: fadeInUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) backwards ${index * 60}ms">
                
                <!-- Glow Effect Behind Card -->
                <div class="absolute inset-4 bg-ikf-blue/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                
                <!-- Card Body -->
                <div class="relative bg-white border border-slate-100 rounded-[2.5rem] p-6 h-full flex flex-col shadow-sm group-hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    
                    <!-- Top Gradient Decoration -->
                    <div class="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-slate-50 to-transparent opacity-50"></div>
                    <div class="absolute top-4 right-4 text-[10px] font-black uppercase text-slate-300 tracking-widest group-hover:text-ikf-blue transition-colors">IKF-ID-${Math.floor(Math.random() * 9000) + 1000}</div>

                    <!-- Avatar Section -->
                    <div class="relative mb-6 mx-auto w-28 h-28 transform transition-transform duration-500 group-hover:scale-105">
                        <!-- Rotating Ring -->
                        <div class="absolute -inset-2 rounded-full border border-dashed border-ikf-blue/30 opacity-0 group-hover:opacity-100 animate-spin-slow transition-opacity"></div>
                        
                        <div class="w-full h-full rounded-full p-1 bg-white shadow-lg relative z-10">
                            <img src="${emp.img}" class="w-full h-full object-cover rounded-full" alt="${emp.name}">
                        </div>
                        
                        <!-- Status Dot -->
                        <div class="absolute bottom-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center z-20 shadow-sm">
                            <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="text-center relative z-10 flex-1 flex flex-col">
                        <h4 class="text-xl font-black text-slate-800 mb-1 group-hover:text-ikf-blue transition-colors">${emp.name}</h4>
                        <div class="inline-block mx-auto px-3 py-1 rounded-full bg-slate-50 border border-slate-100 mb-4 group-hover:bg-ikf-yellow/10 group-hover:border-ikf-yellow/20 transition-colors">
                            <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-ikf-yellow transition-colors">${emp.role}</p>
                        </div>

                        <!-- Skills Chips -->
                        <div class="flex flex-wrap justify-center gap-2 mt-auto">
                            ${(emp.skills || []).slice(0, 3).map(skill =>
            `<span class="px-2.5 py-1 bg-slate-50 text-[9px] font-bold text-slate-500 rounded-md border border-slate-100 hover:bg-ikf-blue hover:text-white hover:border-ikf-blue transition-colors cursor-default">${skill}</span>`
        ).join('')}
                        </div>
                    </div>

                    <!-- View Profile Slide-up Overlay -->
                    <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ikf-blue via-ikf-blue/95 to-transparent pt-12 pb-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center z-20">
                        <span class="text-white font-black uppercase text-xs tracking-[0.2em] flex items-center gap-2">
                            View Profile <i class="fas fa-arrow-right"></i>
                        </span>
                    </div>
                </div>
            </div>
        `).join('') + `
            <!-- 'Join Us' Card (Creative) -->
            <div class="group relative bg-slate-50 rounded-[2.5rem] p-1 h-full min-h-[360px] cursor-pointer hover:-translate-y-2 transition-transform duration-500 z-0">
                <div class="absolute inset-0 border-2 border-dashed border-slate-200 rounded-[2.5rem] group-hover:border-ikf-yellow transition-colors duration-500"></div>
                <div class="h-full flex flex-col items-center justify-center p-8 relative z-10">
                    <div class="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6 group-hover:shadow-xl">
                        <i class="fas fa-plus text-3xl text-slate-300 group-hover:text-ikf-yellow transition-colors"></i>
                    </div>
                    <h4 class="text-xl font-black text-slate-400 group-hover:text-slate-800 transition-colors mb-2">You?</h4>
                    <p class="text-xs text-slate-400 font-medium text-center max-w-[150px] leading-relaxed">We are always looking for the next visionary.</p>
                </div>
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
     * Replaces the content in the main panel
     * @param {string} sectionId 
     */
    renderSection: function (sectionId) {
        const $panel = $('#section-content');

        // Fade out transition
        $panel.fadeOut(150, () => {
            $panel.html(this.getTemplate(sectionId));
            $panel.fadeIn(200);
        });
    },

    /**
     * Returns the HTML for a given section
     */
    getTemplate: function (sectionId) {
        switch (sectionId) {
            case 'intro':
                return `
                    <div class="max-w-7xl mx-auto py-8 fade-in">
                        <!-- Hero Header -->
                        <div class="mb-16 flex flex-col md:flex-row items-end justify-between gap-8 border-b border-slate-100 pb-12">
                            <div class="max-w-3xl">
                                <span class="text-ikf-yellow font-bold uppercase tracking-[0.2em] text-xs mb-4 block">Onboarding Portal</span>
                                <h1 class="text-4xl md:text-6xl font-extrabold text-slate-800 tracking-tight leading-tight mb-6">
                                    Welcome to <span class="text-transparent bg-clip-text bg-gradient-to-r from-ikf-blue to-ikf-yellow">I Knowledge Factory.</span>
                                </h1>
                                <p class="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
                                    Where strategy meets digital craftsmanship. We've been shaping the internet since 2000.
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
                                    
                                    <h3 class="text-2xl font-bold text-slate-800 mb-6 relative z-10">The Mission</h3>
                                    <p class="text-slate-500 leading-relaxed mb-8 relative z-10 text-lg">
                                        IKF is a multidisciplinary agency that blends strategy, design, and performance marketing to help brands thrive across digital ecosystems. We survive market shifts by staying true to our core: <span class="text-ikf-blue font-bold">Human Intelligence.</span>
                                    </p>

                                    <div class="flex flex-wrap gap-4 relative z-10">
                                        <div class="px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-600">
                                            <i class="fas fa-check text-ikf-yellow mr-2"></i> 25+ Years
                                        </div>
                                        <div class="px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-600">
                                            <i class="fas fa-check text-ikf-yellow mr-2"></i> 360° Digital
                                        </div>
                                        <div class="px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-600">
                                            <i class="fas fa-check text-ikf-yellow mr-2"></i> Pune HQ
                                        </div>
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
                                        <h4 class="text-5xl font-extrabold mb-1">800+</h4>
                                        <p class="text-blue-200 text-sm">Deployed Successfully</p>
                                    </div>
                                </div>

                                <!-- Stat Card 2 -->
                                <div class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden flex-1 group hover:border-ikf-blue/30 transition-colors">
                                    <div class="relative z-10">
                                        <p class="text-slate-400 font-bold uppercase tracking-wider text-xs mb-2">Global Presence</p>
                                        <h4 class="text-5xl font-extrabold text-slate-800 mb-1">1.5k+</h4>
                                        <p class="text-slate-500 text-sm">Happy Clients</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Footer Note (Subtle) -->
                        <div class="flex items-center gap-2 text-slate-400 text-xs font-medium pl-2">
                            <i class="fas fa-info-circle"></i>
                            <p>Explore the sidebar to begin your induction journey.</p>
                        </div>
                    </div>`;

            case 'management':
                return `
                    <div class="max-w-7xl mx-auto py-6 fade-in">
                        <div class="mb-16 text-center">
                            <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">System Architects</span>
                            <h1 class="text-4xl md:text-6xl font-extrabold text-ikf-blue tracking-tighter leading-none mb-6">
                                The <span class="text-transparent bg-clip-text bg-gradient-to-r from-ikf-blue to-ikf-yellow">Visionaries</span>
                            </h1>
                            <p class="text-slate-400 max-w-2xl mx-auto text-sm font-medium leading-relaxed">
                                Guiding the IKF mainframes with over <span class="text-ikf-blue font-bold">75 years</span> of combined digital intelligence.
                            </p>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                            <!-- Leader 1: Ashish Dalia -->
                            <div class="group relative perspective-1000" onclick="AppNavigation.showLeaderModal('ashish', 'Ashish Dalia', 'CEO')">
                                <div class="bg-white rounded-[3rem] p-4 relative z-10 transition-all duration-500 transform preserve-3d group-hover:rotate-y-6 group-hover:shadow-2xl border border-slate-100 h-full flex flex-col">
                                    <div class="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 bg-slate-100">
                                        <img src="images/avatars/ashish_real.jpg" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Ashish Dalia">
                                        
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
                                        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">The Architect (CEO)</p>
                                        
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

                            <!-- Leader 2: Jayraj Mehta -->
                            <div class="group relative perspective-1000" onclick="AppNavigation.showLeaderModal('jayraj', 'Jayraj Mehta', 'Director')">
                                <div class="bg-white rounded-[3rem] p-4 relative z-10 transition-all duration-500 transform preserve-3d group-hover:rotate-y-6 group-hover:shadow-2xl border border-slate-100 h-full flex flex-col">
                                    <div class="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 bg-slate-100">
                                        <img src="images/avatars/jayraj.png" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Jayraj Mehta">
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
                                        <h3 class="text-2xl font-black text-slate-800 group-hover:text-ikf-blue transition-colors mb-1">Jayraj Mehta</h3>
                                        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">The Engine (Director)</p>
                                        
                                        <div class="flex justify-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity duration-700">
                                            <div class="w-1 h-1 bg-cyan-500 rounded-full"></div>
                                            <div class="w-1 h-1 bg-cyan-500 rounded-full"></div>
                                            <div class="w-8 h-1 bg-cyan-500 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="absolute inset-4 bg-cyan-500/30 rounded-[3rem] blur-2xl -z-10 group-hover:blur-3xl transition-all opacity-0 group-hover:opacity-70"></div>
                            </div>

                            <!-- Leader 3: Anuja Kapoor -->
                            <div class="group relative perspective-1000" onclick="AppNavigation.showLeaderModal('anuja', 'Anuja Kapoor', 'Director')">
                                <div class="bg-white rounded-[3rem] p-4 relative z-10 transition-all duration-500 transform preserve-3d group-hover:rotate-y-6 group-hover:shadow-2xl border border-slate-100 h-full flex flex-col">
                                    <div class="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 bg-slate-100">
                                        <img src="images/avatars/anuja.png" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Anuja Kapoor">
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
                                        <h3 class="text-2xl font-black text-slate-800 group-hover:text-ikf-blue transition-colors mb-1">Anuja Kapoor</h3>
                                        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">The Soul (Director)</p>
                                        
                                        <div class="flex justify-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity duration-700">
                                            <div class="w-1 h-1 bg-pink-500 rounded-full"></div>
                                            <div class="w-1 h-1 bg-pink-500 rounded-full"></div>
                                            <div class="w-8 h-1 bg-pink-500 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="absolute inset-4 bg-pink-500/30 rounded-[3rem] blur-2xl -z-10 group-hover:blur-3xl transition-all opacity-0 group-hover:opacity-70"></div>
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
                    <div class="max-w-7xl mx-auto py-6 fade-in">
                        <div class="mb-16">
                            <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">System Architecture</span>
                            <h1 class="text-4xl md:text-6xl font-extrabold text-ikf-blue tracking-tight">The Ecosystem <span class="text-transparent bg-clip-text bg-gradient-to-r from-ikf-blue to-ikf-yellow">Hierarchy</span></h1>
                        </div>
                        
                        <div class="bg-white p-12 lg:p-12 rounded-[3.5rem] premium-card overflow-x-auto min-h-[700px] flex justify-center">
                            <div class="org-container relative pt-10 min-w-[800px]">
                                <!-- Root Node -->
                                <div class="flex justify-center mb-24">
                                    <div class="org-node active group relative" data-dept="board">
                                        <div class="org-node-inner p-6 bg-ikf-blue text-white rounded-[2rem] shadow-2xl border-2 border-ikf-yellow/30 text-center w-64 relative z-10 hover:scale-105 transition-transform">
                                            <p class="text-[10px] text-ikf-yellow font-black uppercase tracking-widest mb-1">Steering</p>
                                            <p class="text-lg font-black">Board of Directors</p>
                                            <p class="text-[10px] opacity-50 uppercase font-bold mt-1">Strategic Command</p>
                                        </div>
                                        <div class="w-0.5 h-24 bg-gradient-to-b from-ikf-yellow to-ikf-blue absolute left-1/2 -bottom-24"></div>
                                    </div>
                                </div>

                                <!-- Specialized Units -->
                                <div class="flex justify-between gap-8 relative px-4">
                                    <!-- Connection Line -->
                                    <div class="absolute top-0 left-32 right-32 h-0.5 bg-ikf-blue/10"></div>
                                    
                                    <!-- Web Development -->
                                    <div class="flex flex-col items-center w-52">
                                        <div class="w-0.5 h-10 bg-ikf-blue/10"></div>
                                        <div class="org-node group w-full" onclick="AppNavigation.toggleDept('web')">
                                            <div class="org-node-inner p-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] group-hover:border-ikf-yellow group-hover:bg-white group-hover:shadow-xl transition-all text-center cursor-pointer relative overflow-hidden">
                                                <i class="fas fa-laptop-code text-2xl text-ikf-blue mb-2 opacity-20 group-hover:opacity-100 transition-opacity"></i>
                                                <p class="font-black text-ikf-blue uppercase text-[10px] tracking-wider">Web Development</p>
                                                <div class="flex items-center justify-center gap-2 text-ikf-yellow pt-3 border-t border-slate-200/50 mt-2">
                                                    <span class="text-[8px] font-black tracking-widest uppercase">Explore</span>
                                                    <i class="fas fa-chevron-down text-[8px] transition-transform group-hover:rotate-180"></i>
                                                </div>
                                            </div>
                                            <div id="dept-web" class="hidden mt-4 space-y-2">
                                                <div class="p-2 bg-white rounded-lg text-[9px] font-bold text-slate-500 border border-slate-100 text-center shadow-sm animate-fadeIn">Website Designing</div>
                                                <div class="p-2 bg-white rounded-lg text-[9px] font-bold text-slate-500 border border-slate-100 text-center shadow-sm animate-fadeIn">E-Commerce</div>
                                                <div class="p-2 bg-white rounded-lg text-[9px] font-bold text-slate-500 border border-slate-100 text-center shadow-sm animate-fadeIn">Landing Pages</div>
                                                <div class="p-2 bg-white rounded-lg text-[9px] font-bold text-slate-500 border border-slate-100 text-center shadow-sm animate-fadeIn">Maintenance</div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Digital Marketing -->
                                    <div class="flex flex-col items-center w-52">
                                        <div class="w-0.5 h-10 bg-ikf-blue/10"></div>
                                        <div class="org-node group w-full" onclick="AppNavigation.toggleDept('marketing')">
                                            <div class="org-node-inner p-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] group-hover:border-ikf-yellow group-hover:bg-white group-hover:shadow-xl transition-all text-center cursor-pointer relative overflow-hidden">
                                                <i class="fas fa-bullhorn text-2xl text-ikf-blue mb-2 opacity-20 group-hover:opacity-100 transition-opacity"></i>
                                                <p class="font-black text-ikf-blue uppercase text-[10px] tracking-wider">Digital Marketing</p>
                                                <div class="flex items-center justify-center gap-2 text-ikf-yellow pt-3 border-t border-slate-200/50 mt-2">
                                                    <span class="text-[8px] font-black tracking-widest uppercase">Explore</span>
                                                    <i class="fas fa-chevron-down text-[8px] transition-transform group-hover:rotate-180"></i>
                                                </div>
                                            </div>
                                            <div id="dept-marketing" class="hidden mt-4 space-y-2">
                                                <div class="p-2 bg-white rounded-lg text-[9px] font-bold text-slate-500 border border-slate-100 text-center shadow-sm animate-fadeIn">Social Media</div>
                                                <div class="p-2 bg-white rounded-lg text-[9px] font-bold text-slate-500 border border-slate-100 text-center shadow-sm animate-fadeIn">SEO</div>
                                                <div class="p-2 bg-white rounded-lg text-[9px] font-bold text-slate-500 border border-slate-100 text-center shadow-sm animate-fadeIn">Performance Marketing</div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Branding Collaterals -->
                                    <div class="flex flex-col items-center w-52">
                                        <div class="w-0.5 h-10 bg-ikf-blue/10"></div>
                                        <div class="org-node group w-full" onclick="AppNavigation.toggleDept('branding')">
                                            <div class="org-node-inner p-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] group-hover:border-ikf-yellow group-hover:bg-white group-hover:shadow-xl transition-all text-center cursor-pointer relative overflow-hidden">
                                                <i class="fas fa-palette text-2xl text-ikf-blue mb-2 opacity-20 group-hover:opacity-100 transition-opacity"></i>
                                                <p class="font-black text-ikf-blue uppercase text-[10px] tracking-wider">Branding Collaterals</p>
                                                <div class="flex items-center justify-center gap-2 text-ikf-yellow pt-3 border-t border-slate-200/50 mt-2">
                                                    <span class="text-[8px] font-black tracking-widest uppercase">Explore</span>
                                                    <i class="fas fa-chevron-down text-[8px] transition-transform group-hover:rotate-180"></i>
                                                </div>
                                            </div>
                                            <div id="dept-branding" class="hidden mt-4 space-y-2">
                                                <div class="p-2 bg-white rounded-lg text-[9px] font-bold text-slate-500 border border-slate-100 text-center shadow-sm animate-fadeIn">Video Production</div>
                                                <div class="p-2 bg-white rounded-lg text-[9px] font-bold text-slate-500 border border-slate-100 text-center shadow-sm animate-fadeIn">Content Marketing</div>
                                                <div class="p-2 bg-white rounded-lg text-[9px] font-bold text-slate-500 border border-slate-100 text-center shadow-sm animate-fadeIn">Photoshoot</div>
                                                <div class="p-2 bg-white rounded-lg text-[9px] font-bold text-slate-500 border border-slate-100 text-center shadow-sm animate-fadeIn">Corporate Kit</div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Application Dev -->
                                    <div class="flex flex-col items-center w-52">
                                        <div class="w-0.5 h-10 bg-ikf-blue/10"></div>
                                        <div class="org-node group w-full" onclick="AppNavigation.toggleDept('app')">
                                            <div class="org-node-inner p-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] group-hover:border-ikf-yellow group-hover:bg-white group-hover:shadow-xl transition-all text-center cursor-pointer relative overflow-hidden">
                                                <i class="fas fa-server text-2xl text-ikf-blue mb-2 opacity-20 group-hover:opacity-100 transition-opacity"></i>
                                                <p class="font-black text-ikf-blue uppercase text-[10px] tracking-wider">Application Dev</p>
                                                <div class="flex items-center justify-center gap-2 text-ikf-yellow pt-3 border-t border-slate-200/50 mt-2">
                                                    <span class="text-[8px] font-black tracking-widest uppercase">Explore</span>
                                                    <i class="fas fa-chevron-down text-[8px] transition-transform group-hover:rotate-180"></i>
                                                </div>
                                            </div>
                                            <div id="dept-app" class="hidden mt-4 space-y-2">
                                                <div class="p-2 bg-white rounded-lg text-[9px] font-bold text-slate-500 border border-slate-100 text-center shadow-sm animate-fadeIn">Cloud Telephony</div>
                                                <div class="p-2 bg-white rounded-lg text-[9px] font-bold text-slate-500 border border-slate-100 text-center shadow-sm animate-fadeIn">Task Delegation</div>
                                                <div class="p-2 bg-white rounded-lg text-[9px] font-bold text-slate-500 border border-slate-100 text-center shadow-sm animate-fadeIn">Custom App Dev</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;

            case 'departments':
                return `
                    <div class="max-w-7xl mx-auto py-6 fade-in">
                        <div class="mb-16">
                            <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Execution Engine</span>
                            <h1 class="text-4xl md:text-6xl font-extrabold text-ikf-blue tracking-tight">Our Specialized <span class="text-transparent bg-clip-text bg-gradient-to-r from-ikf-blue to-ikf-yellow">Units</span></h1>
                            <p class="mt-4 text-slate-400 max-w-2xl">Explore our four pillars of digital excellence. Click on any specialized service to visit its dedicated page on our main website.</p>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-20">
                            <!-- Unit 1: Web Development -->
                            <div class="bg-white rounded-[2.5rem] premium-card overflow-hidden group hover:shadow-2xl hover:shadow-ikf-blue/10 transition-all duration-500 border border-slate-100/50">
                                <div class="h-48 bg-slate-50 relative flex items-center justify-center overflow-hidden">
                                    <div class="absolute inset-0 bg-gradient-to-br from-ikf-blue opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                                    <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-ikf-blue/5 rounded-full blur-2xl group-hover:bg-ikf-yellow/10 transition-colors duration-500"></div>
                                    
                                    <i class="fas fa-laptop-code text-6xl text-slate-200 group-hover:text-ikf-blue group-hover:scale-110 transition-all duration-500"></i>
                                    <div class="absolute bottom-4 left-6 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400 border border-slate-100">Unit 01</div>
                                    <a href="https://www.ikf.co.in/website-development-company-pune/" target="_blank" class="absolute top-4 right-6 w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-300 hover:text-white hover:bg-ikf-blue transition-all shadow-sm group/link transform translate-x-12 group-hover:translate-x-0" title="Visit Web Dev Page">
                                        <i class="fas fa-external-link-alt text-xs"></i>
                                    </a>
                                </div>
                                <div class="p-10 relative">
                                    <h3 class="text-2xl font-black text-ikf-blue mb-3 group-hover:text-ikf-yellow transition-colors">Web Development</h3>
                                    <p class="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">High-performance custom websites. We build digital assets that don't just exist but perform, ensuring speed, security, and scalability.</p>
                                    
                                    <div class="space-y-4">
                                        <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest">Quick Access Modules</p>
                                        <div class="flex flex-wrap gap-2">
                                            <a href="https://www.ikf.co.in/web-design-company-pune/" target="_blank" class="px-4 py-2 bg-slate-50 hover:bg-ikf-blue hover:text-white rounded-xl text-[10px] font-bold text-slate-500 transition-all border border-slate-100 flex items-center gap-2 group/tag">
                                                Website Design <i class="fas fa-arrow-right opacity-0 group-hover/tag:opacity-100 -ml-2 group-hover/tag:ml-0 transition-all"></i>
                                            </a>
                                            <a href="https://www.ikf.co.in/e-commerce-website-development-company-pune/" target="_blank" class="px-4 py-2 bg-slate-50 hover:bg-ikf-blue hover:text-white rounded-xl text-[10px] font-bold text-slate-500 transition-all border border-slate-100 flex items-center gap-2 group/tag">
                                                E-Commerce <i class="fas fa-arrow-right opacity-0 group-hover/tag:opacity-100 -ml-2 group-hover/tag:ml-0 transition-all"></i>
                                            </a>
                                            <a href="https://www.ikf.co.in/website-maintenance-services-pune/" target="_blank" class="px-4 py-2 bg-slate-50 hover:bg-ikf-blue hover:text-white rounded-xl text-[10px] font-bold text-slate-500 transition-all border border-slate-100 flex items-center gap-2 group/tag">
                                                Maintenance <i class="fas fa-arrow-right opacity-0 group-hover/tag:opacity-100 -ml-2 group-hover/tag:ml-0 transition-all"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Unit 2: Digital Marketing -->
                            <div class="bg-white rounded-[2.5rem] premium-card overflow-hidden group hover:shadow-2xl hover:shadow-ikf-blue/10 transition-all duration-500 border border-slate-100/50">
                                <div class="h-48 bg-slate-50 relative flex items-center justify-center overflow-hidden">
                                    <div class="absolute inset-0 bg-gradient-to-br from-ikf-blue opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                                    <div class="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-ikf-yellow/10 transition-colors duration-500"></div>

                                    <i class="fas fa-bullhorn text-6xl text-slate-200 group-hover:text-ikf-blue group-hover:scale-110 transition-all duration-500"></i>
                                    <div class="absolute bottom-4 left-6 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400 border border-slate-100">Unit 02</div>
                                    <a href="https://www.ikf.co.in/digital-marketing-company-pune/" target="_blank" class="absolute top-4 right-6 w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-300 hover:text-white hover:bg-ikf-blue transition-all shadow-sm group/link transform translate-x-12 group-hover:translate-x-0" title="Visit Digital Marketing Page">
                                        <i class="fas fa-external-link-alt text-xs"></i>
                                    </a>
                                </div>
                                <div class="p-10 relative">
                                    <h3 class="text-2xl font-black text-ikf-blue mb-3 group-hover:text-ikf-yellow transition-colors">Digital Marketing</h3>
                                    <p class="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">Data-driven growth strategies. From SEO to Social Media, we ensure your brand reaches the right audience at the right time.</p>
                                    
                                    <div class="space-y-4">
                                        <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest">Quick Access Modules</p>
                                        <div class="flex flex-wrap gap-2">
                                            <a href="https://www.ikf.co.in/seo-company-pune/" target="_blank" class="px-4 py-2 bg-slate-50 hover:bg-ikf-blue hover:text-white rounded-xl text-[10px] font-bold text-slate-500 transition-all border border-slate-100 flex items-center gap-2 group/tag">
                                                SEO <i class="fas fa-arrow-right opacity-0 group-hover/tag:opacity-100 -ml-2 group-hover/tag:ml-0 transition-all"></i>
                                            </a>
                                            <a href="https://www.ikf.co.in/social-media-marketing-services-pune/" target="_blank" class="px-4 py-2 bg-slate-50 hover:bg-ikf-blue hover:text-white rounded-xl text-[10px] font-bold text-slate-500 transition-all border border-slate-100 flex items-center gap-2 group/tag">
                                                Social Media <i class="fas fa-arrow-right opacity-0 group-hover/tag:opacity-100 -ml-2 group-hover/tag:ml-0 transition-all"></i>
                                            </a>
                                            <a href="https://www.ikf.co.in/ppc-management-services-company-in-pune/" target="_blank" class="px-4 py-2 bg-slate-50 hover:bg-ikf-blue hover:text-white rounded-xl text-[10px] font-bold text-slate-500 transition-all border border-slate-100 flex items-center gap-2 group/tag">
                                                Performance Ads <i class="fas fa-arrow-right opacity-0 group-hover/tag:opacity-100 -ml-2 group-hover/tag:ml-0 transition-all"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Unit 3: Branding Collaterals -->
                            <div class="bg-white rounded-[2.5rem] premium-card overflow-hidden group hover:shadow-2xl hover:shadow-ikf-blue/10 transition-all duration-500 border border-slate-100/50">
                                <div class="h-48 bg-slate-50 relative flex items-center justify-center overflow-hidden">
                                    <div class="absolute inset-0 bg-gradient-to-br from-ikf-blue opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                                    <div class="absolute -right-10 top-0 w-40 h-40 bg-pink-500/5 rounded-full blur-2xl group-hover:bg-ikf-yellow/10 transition-colors duration-500"></div>

                                    <i class="fas fa-palette text-6xl text-slate-200 group-hover:text-ikf-blue group-hover:scale-110 transition-all duration-500"></i>
                                    <div class="absolute bottom-4 left-6 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400 border border-slate-100">Unit 03</div>
                                    <a href="https://www.ikf.co.in/branding-collaterals/" target="_blank" class="absolute top-4 right-6 w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-300 hover:text-white hover:bg-ikf-blue transition-all shadow-sm group/link transform translate-x-12 group-hover:translate-x-0" title="Visit Branding Page">
                                        <i class="fas fa-external-link-alt text-xs"></i>
                                    </a>
                                </div>
                                <div class="p-10 relative">
                                    <h3 class="text-2xl font-black text-ikf-blue mb-3 group-hover:text-ikf-yellow transition-colors">Branding Collaterals</h3>
                                    <p class="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">Visual storytelling that captivates. From corporate kits to high-end video production, we define how the world sees your brand.</p>
                                    
                                    <div class="space-y-4">
                                        <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest">Quick Access Modules</p>
                                        <div class="flex flex-wrap gap-2">
                                            <a href="https://www.ikf.co.in/video-production-services-company/" target="_blank" class="px-4 py-2 bg-slate-50 hover:bg-ikf-blue hover:text-white rounded-xl text-[10px] font-bold text-slate-500 transition-all border border-slate-100 flex items-center gap-2 group/tag">
                                                Video Production <i class="fas fa-arrow-right opacity-0 group-hover/tag:opacity-100 -ml-2 group-hover/tag:ml-0 transition-all"></i>
                                            </a>
                                            <a href="https://www.ikf.co.in/corporate-photoshoot-services/" target="_blank" class="px-4 py-2 bg-slate-50 hover:bg-ikf-blue hover:text-white rounded-xl text-[10px] font-bold text-slate-500 transition-all border border-slate-100 flex items-center gap-2 group/tag">
                                                Photoshoot <i class="fas fa-arrow-right opacity-0 group-hover/tag:opacity-100 -ml-2 group-hover/tag:ml-0 transition-all"></i>
                                            </a>
                                            <a href="https://www.ikf.co.in/corporate-kit-and-branding-solutions/" target="_blank" class="px-4 py-2 bg-slate-50 hover:bg-ikf-blue hover:text-white rounded-xl text-[10px] font-bold text-slate-500 transition-all border border-slate-100 flex items-center gap-2 group/tag">
                                                Corporate Kit <i class="fas fa-arrow-right opacity-0 group-hover/tag:opacity-100 -ml-2 group-hover/tag:ml-0 transition-all"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Unit 4: Application Development -->
                            <div class="bg-white rounded-[2.5rem] premium-card overflow-hidden group hover:shadow-2xl hover:shadow-ikf-blue/10 transition-all duration-500 border border-slate-100/50">
                                <div class="h-48 bg-slate-50 relative flex items-center justify-center overflow-hidden">
                                    <div class="absolute inset-0 bg-gradient-to-br from-ikf-blue opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                                    <div class="absolute -left-10 top-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-ikf-yellow/10 transition-colors duration-500"></div>

                                    <i class="fas fa-server text-6xl text-slate-200 group-hover:text-ikf-blue group-hover:scale-110 transition-all duration-500"></i>
                                    <div class="absolute bottom-4 left-6 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400 border border-slate-100">Unit 04</div>
                                    <a href="https://www.ikf.co.in/web-application-development-company/" target="_blank" class="absolute top-4 right-6 w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-300 hover:text-white hover:bg-ikf-blue transition-all shadow-sm group/link transform translate-x-12 group-hover:translate-x-0" title="Visit App Dev Page">
                                        <i class="fas fa-external-link-alt text-xs"></i>
                                    </a>
                                </div>
                                <div class="p-10 relative">
                                    <h3 class="text-2xl font-black text-ikf-blue mb-3 group-hover:text-ikf-yellow transition-colors">Application Dev</h3>
                                    <p class="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">Enterprise-grade solutions. Empowering businesses with custom web apps, cloud telephony, and automated workflows.</p>
                                    
                                    <div class="space-y-4">
                                        <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest">Quick Access Modules</p>
                                        <div class="flex flex-wrap gap-2">
                                            <a href="https://www.ikf.co.in/web-application-development-agency/" target="_blank" class="px-4 py-2 bg-slate-50 hover:bg-ikf-blue hover:text-white rounded-xl text-[10px] font-bold text-slate-500 transition-all border border-slate-100 flex items-center gap-2 group/tag">
                                                Custom Web Apps <i class="fas fa-arrow-right opacity-0 group-hover/tag:opacity-100 -ml-2 group-hover/tag:ml-0 transition-all"></i>
                                            </a>
                                            <a href="#" class="px-4 py-2 bg-slate-50 hover:bg-ikf-blue hover:text-white rounded-xl text-[10px] font-bold text-slate-500 transition-all border border-slate-100 flex items-center gap-2 group/tag cursor-not-allowed opacity-60">
                                                Cloud Telephony <i class="fas fa-lock text-[8px] opacity-0 group-hover/tag:opacity-100 -ml-2 group-hover/tag:ml-0 transition-all"></i>
                                            </a>
                                            <a href="#" class="px-4 py-2 bg-slate-50 hover:bg-ikf-blue hover:text-white rounded-xl text-[10px] font-bold text-slate-500 transition-all border border-slate-100 flex items-center gap-2 group/tag cursor-not-allowed opacity-60">
                                                Task Automation <i class="fas fa-lock text-[8px] opacity-0 group-hover/tag:opacity-100 -ml-2 group-hover/tag:ml-0 transition-all"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        </div>
                    </div>`;

            case 'directory':
                // Initialize employees if not already done
                if (!this.employees || this.employees.length === 0) {
                    this.initEmployees();
                }

                return `
                    <div class="max-w-7xl mx-auto py-6 fade-in">
                        <!--Creative Header / Dashboard-->
                        <div class="mb-16">
                            <div class="flex flex-col md:flex-row items-end justify-between gap-8 mb-10">
                                <div>
                                    <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block animate-pulse">Live Neural Network</span>
                                    <h1 class="text-4xl md:text-6xl font-extrabold text-ikf-blue tracking-tighter leading-none mb-2">
                                        The <span class="text-transparent bg-clip-text bg-gradient-to-r from-ikf-blue to-ikf-yellow">Collective.</span>
                                    </h1>
                                    <p class="text-slate-400 font-medium max-w-xl text-sm">Accessing biosignatures of ${this.employees ? this.employees.length : '60+'} active agents operating across the IKF ecosystem.</p>
                                </div>
                                
                                <!-- Live Stats Ticker -->
                                <div class="flex gap-4">
                                    <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-lg text-center min-w-[100px] hover:-translate-y-1 transition-transform">
                                        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Active</p>
                                        <p class="text-2xl font-black text-ikf-blue">100<span class="text-sm align-top">%</span></p>
                                    </div>
                                    <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-lg text-center min-w-[100px] hover:-translate-y-1 transition-transform">
                                        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Depts</p>
                                        <p class="text-2xl font-black text-ikf-yellow">05</p>
                                    </div>
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
                                        placeholder="Scan for agent name or clearance level..." 
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
                        <!-- Content will be injected by renderDirectory() -->
                    </div>

                        </div>
                    </div>`;

            case 'philosophy':
                return `
                    <div class="max-w-6xl mx-auto py-6 fade-in">
                        <div class="mb-16">
                            <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Core Directives</span>
                            <h1 class="text-4xl md:text-6xl font-extrabold text-ikf-blue tracking-tighter leading-none mb-4">
                                <span class="text-transparent bg-clip-text bg-gradient-to-r from-ikf-blue to-ikf-yellow">I • K • F</span> <br/><span class="text-slate-400 text-2xl md:text-3xl font-light">The DNA of Our Identity</span>
                            </h1>
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
                            <!-- Innovation -->
                            <div class="premium-card bg-white p-12 group overflow-hidden relative">
                                <div class="absolute -top-10 -right-10 text-[120px] font-black text-slate-50 group-hover:text-ikf-blue/5 transition-colors">I</div>
                                <div class="relative z-10">
                                    <div class="w-16 h-16 bg-ikf-blue text-white rounded-[1.5rem] flex items-center justify-center font-black text-3xl mb-8 shadow-xl shadow-ikf-blue/20">I</div>
                                    <h3 class="text-2xl font-black text-ikf-blue mb-4">Innovation</h3>
                                    <p class="text-slate-500 leading-relaxed">
                                        Obsessive curiosity. We don't just use technology; we blend AI-refined strategies with a human lens to solve business challenges.
                                    </p>
                                </div>
                            </div>
                            <!-- Knowledge -->
                            <div class="premium-card bg-white p-12 group overflow-hidden relative">
                                <div class="absolute -top-10 -right-10 text-[120px] font-black text-slate-50 group-hover:text-ikf-blue/5 transition-colors">K</div>
                                <div class="relative z-10">
                                    <div class="w-16 h-16 bg-ikf-blue text-white rounded-[1.5rem] flex items-center justify-center font-black text-3xl mb-8 shadow-xl shadow-ikf-blue/20">K</div>
                                    <h3 class="text-2xl font-black text-ikf-blue mb-4">Knowledge</h3>
                                    <p class="text-slate-500 leading-relaxed">
                                        Synthesized wisdom. Over 25 years of mastery in digital ecosystems fuels our strategic consultations and execution.
                                    </p>
                                </div>
                            </div>
                            <!-- Factory -->
                            <div class="premium-card bg-white p-12 group overflow-hidden relative">
                                <div class="absolute -top-10 -right-10 text-[120px] font-black text-slate-50 group-hover:text-ikf-blue/5 transition-colors">F</div>
                                <div class="relative z-10">
                                    <div class="w-16 h-16 bg-ikf-blue text-white rounded-[1.5rem] flex items-center justify-center font-black text-3xl mb-8 shadow-xl shadow-ikf-blue/20">F</div>
                                    <h3 class="text-2xl font-black text-ikf-blue mb-4">Factory</h3>
                                    <p class="text-slate-500 leading-relaxed">
                                        Precision at scale. Our industrialized processes ensure high-impact delivery for 1500+ global clients.
                                    </p>
                                </div>
                            </div>
                        </div>

                        </div>
                    </div>`;

            case 'mission':
                return `
                    <div class="max-w-6xl mx-auto py-6 fade-in">
                        <div class="mb-16">
                            <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Strategic Compass</span>
                            <h1 class="text-4xl md:text-6xl font-extrabold text-ikf-blue tracking-tight">Mission & <span class="text-transparent bg-clip-text bg-gradient-to-r from-ikf-blue to-ikf-yellow">Vision</span></h1>
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
                            <div class="bg-white p-12 lg:p-16 rounded-[3rem] premium-card relative overflow-hidden group">
                                <div class="absolute top-0 right-0 p-8 opacity-5 transform group-hover:scale-110 transition-transform"><i class="fas fa-eye text-[120px] text-ikf-blue"></i></div>
                                <h3 class="text-3xl font-black text-ikf-blue mb-6">The Vision</h3>
                                <p class="text-slate-500 text-lg leading-relaxed italic">
                                    "To be a globally respected, multidisciplinary digital agency known for its commitment to excellence and innovation."
                                </p>
                                <div class="mt-10 flex items-center gap-4 text-ikf-yellow">
                                    <div class="h-px flex-1 bg-ikf-yellow/20"></div>
                                    <span class="text-[10px] font-black uppercase tracking-[0.3em]">Ambition</span>
                                </div>
                            </div>
                            <div class="bg-ikf-blue p-12 lg:p-16 rounded-[3rem] premium-card relative overflow-hidden group text-white">
                                <div class="absolute top-0 right-0 p-8 opacity-10 transform group-hover:scale-110 transition-transform"><i class="fas fa-rocket text-[120px] text-white"></i></div>
                                <h3 class="text-3xl font-black mb-6">The Mission</h3>
                                <p class="text-blue-100 text-lg leading-relaxed">
                                    "To unlock the full growth potential of brands by pioneering new approaches and delivering high-impact digital solutions."
                                </p>
                                <div class="mt-10 flex items-center gap-4 text-ikf-yellow">
                                    <div class="h-px flex-1 bg-white/10"></div>
                                    <span class="text-[10px] font-black uppercase tracking-[0.3em]">Execution</span>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white p-12 lg:p-20 rounded-[4rem] premium-card mb-16">
                            <h3 class="text-3xl font-black text-ikf-blue mb-12 text-center uppercase tracking-widest">Our Core Values (T.R.I.I.I.P)</h3>
                            <div class="grid grid-cols-1 md:grid-cols-5 gap-8">
                                <div class="text-center group">
                                    <div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-ikf-blue group-hover:text-white transition-all shadow-lg">
                                        <i class="fas fa-search text-xl"></i>
                                    </div>
                                    <h4 class="font-black text-ikf-blue mb-1 text-sm">Transparent</h4>
                                    <p class="text-[10px] text-slate-400 font-medium">Openness in all we do.</p>
                                </div>
                                <div class="text-center group">
                                    <div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-ikf-blue group-hover:text-white transition-all shadow-lg">
                                        <i class="fas fa-heart text-xl"></i>
                                    </div>
                                    <h4 class="font-black text-ikf-blue mb-1 text-sm">Respectful</h4>
                                    <p class="text-[10px] text-slate-400 font-medium">Respect begets respect.</p>
                                </div>
                                <div class="text-center group">
                                    <div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-ikf-blue group-hover:text-white transition-all shadow-lg">
                                        <i class="fas fa-lightbulb text-xl"></i>
                                    </div>
                                    <h4 class="font-black text-ikf-blue mb-1 text-sm">Innovative</h4>
                                    <p class="text-[10px] text-slate-400 font-medium">Challenge the norm.</p>
                                </div>
                                <div class="text-center group">
                                    <div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-ikf-blue group-hover:text-white transition-all shadow-lg">
                                        <i class="fas fa-bolt text-xl"></i>
                                    </div>
                                    <h4 class="font-black text-ikf-blue mb-1 text-sm">Inspired</h4>
                                    <p class="text-[10px] text-slate-400 font-medium">Inspired & Inspiring.</p>
                                </div>
                                <div class="text-center group">
                                    <div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-ikf-blue group-hover:text-white transition-all shadow-lg">
                                        <i class="fas fa-user-tie text-xl"></i>
                                    </div>
                                    <h4 class="font-black text-ikf-blue mb-1 text-sm">Professional</h4>
                                    <p class="text-[10px] text-slate-400 font-medium">Excellence in delivery.</p>
                                </div>
                            </div>
                        </div>

                        </div>
                    </div>`;

            case 'culture':
                return `
                    <div class="max-w-7xl mx-auto py-6 fade-in">
                        <div class="mb-16 text-center">
                            <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">System Core</span>
                            <h1 class="text-4xl md:text-6xl font-extrabold text-ikf-blue tracking-tight">The IKF Culture <span class="text-transparent bg-clip-text bg-gradient-to-r from-ikf-blue to-ikf-yellow">Code</span></h1>
                            <p class="text-slate-400 mt-4 max-w-2xl mx-auto text-sm font-medium">Running on version 4.0. Optimized for high performance, creativity, and human-centric processing.</p>
                        </div>

                        <!--Culture Stats Grid-->
                        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                            <div class="p-8 bg-white rounded-[2.5rem] shadow-lg hover:shadow-xl transition-all border border-slate-50 text-center group cursor-pointer hover:-translate-y-2">
                                <div class="w-16 h-16 rounded-2xl bg-blue-50 text-ikf-blue flex items-center justify-center mx-auto mb-6 text-2xl group-hover:scale-110 transition-transform"><i class="fas fa-laugh-beam"></i></div>
                                <h3 class="text-4xl font-black text-slate-800 mb-2">4.8<span class="text-lg text-slate-300">/5</span></h3>
                                <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Happiness Index</p>
                            </div>
                            <div class="p-8 bg-white rounded-[2.5rem] shadow-lg hover:shadow-xl transition-all border border-slate-50 text-center group cursor-pointer hover:-translate-y-2">
                                <div class="w-16 h-16 rounded-2xl bg-yellow-50 text-ikf-yellow flex items-center justify-center mx-auto mb-6 text-2xl group-hover:scale-110 transition-transform"><i class="fas fa-pizza-slice"></i></div>
                                <h3 class="text-4xl font-black text-slate-800 mb-2">52<span class="text-lg text-slate-300">+</span></h3>
                                <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Friday Parties</p>
                            </div>
                            <div class="p-8 bg-white rounded-[2.5rem] shadow-lg hover:shadow-xl transition-all border border-slate-50 text-center group cursor-pointer hover:-translate-y-2">
                                <div class="w-16 h-16 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center mx-auto mb-6 text-2xl group-hover:scale-110 transition-transform"><i class="fas fa-brain"></i></div>
                                <h3 class="text-4xl font-black text-slate-800 mb-2">200<span class="text-lg text-slate-300">h</span></h3>
                                <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Learning / Yr</p>
                            </div>
                            <div class="p-8 bg-white rounded-[2.5rem] shadow-lg hover:shadow-xl transition-all border border-slate-50 text-center group cursor-pointer hover:-translate-y-2">
                                <div class="w-16 h-16 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center mx-auto mb-6 text-2xl group-hover:scale-110 transition-transform"><i class="fas fa-seedling"></i></div>
                                <h3 class="text-4xl font-black text-slate-800 mb-2">0<span class="text-lg text-slate-300">%</span></h3>
                                <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Boredom</p>
                            </div>
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
                                    <h3 class="text-3xl md:text-5xl font-black mb-6 leading-tight">We Debug <br /><span class="text-ikf-yellow">Problems</span>, Not People.</h3>
                                    <p class="text-slate-300 max-w-lg text-sm leading-relaxed mb-8">In a high-pressure agency environment, we prioritize psychological safety. Mistakes are compile errors, not fatal crashes. We fix them together.</p>
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
                                <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                                    <i class="fas fa-rocket text-3xl text-ikf-blue mb-4 group-hover:scale-110 transition-transform block"></i>
                                    <h4 class="font-black text-lg mb-2">Growth Mindset</h4>
                                    <p class="text-xs text-slate-400">Fail fast, learn faster.</p>
                                </div>
                                <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                                    <i class="fas fa-coffee text-3xl text-ikf-yellow mb-4 group-hover:scale-110 transition-transform block"></i>
                                    <h4 class="font-black text-lg mb-2">Fuel Creativity</h4>
                                    <p class="text-xs text-slate-400">Caffeine & Ideas.</p>
                                </div>
                            </div>
                        </div>

                        <!-- Right: Life Gallery (Smart Vertical) -->
                        <div class="bg-slate-50 rounded-[3rem] p-4 flex flex-col gap-4 overflow-hidden relative border border-slate-100">
                            <div class="absolute top-8 left-8 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-black shadow-sm">
                                <i class="fas fa-camera text-ikf-blue mr-2"></i> Life @ IKF
                            </div>
                            <div class="flex-1 rounded-[2.5rem] bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80');"></div>
                            <div class="h-40 rounded-[2.5rem] bg-ikf-yellow/10 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                                <div class="absolute inset-0 bg-ikf-yellow/80 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center">
                                    <span class="text-white font-black uppercase text-xs tracking-widest">View Gallery</span>
                                </div>
                                <span class="text-ikf-blue/30 font-black text-xl rotate-12 group-hover:rotate-0 transition-transform">#TeamBonding</span>
                            </div>
                        </div>
                    </div>
                    </div >
                    `;

            case 'social':
                return `
                    <div class="max-w-7xl mx-auto py-6 fade-in">
                        <div class="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Digital Command Center</span>
                                <h1 class="text-4xl md:text-6xl font-extrabold text-ikf-blue tracking-tight">The <span class="text-transparent bg-clip-text bg-gradient-to-r from-ikf-blue to-ikf-yellow">Ecosystem</span></h1>
                            </div>
                            <div class="flex items-center gap-2 text-green-500 font-bold text-xs bg-green-50 px-4 py-2 rounded-full border border-green-100 animate-pulse">
                                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                                Live Sync: Active
                            </div>
                        </div>

                        <!--Live Stats Grid-->
                        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                            <!-- LinkedIn -->
                            <a href="https://www.linkedin.com/company/i-knowledge-factory-pvt.-ltd./" target="_blank" class="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden">
                                <div class="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-8 -mt-8 group-hover:bg-[#0077b5] transition-colors duration-500"></div>
                                <i class="fab fa-linkedin-in text-3xl mb-4 text-[#0077b5] group-hover:text-white relative z-10 transition-colors"></i>
                                <div class="relative z-10">
                                    <h3 class="text-3xl font-black text-slate-800 mb-1">25k<span class="text-sm font-bold text-slate-400">+</span></h3>
                                    <p class="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Connections</p>
                                </div>
                                <div class="mt-4 flex items-center gap-2 text-[10px] font-bold text-green-500">
                                    <i class="fas fa-arrow-up"></i> 12% vs last month
                                </div>
                            </a>

                            <!-- Instagram -->
                            <a href="https://www.instagram.com/ikfdigital/" target="_blank" class="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden">
                                <div class="absolute top-0 right-0 w-24 h-24 bg-pink-50 rounded-full -mr-8 -mt-8 group-hover:bg-[#E1306C] transition-colors duration-500"></div>
                                <i class="fab fa-instagram text-3xl mb-4 text-[#E1306C] group-hover:text-white relative z-10 transition-colors"></i>
                                <div class="relative z-10">
                                    <h3 class="text-3xl font-black text-slate-800 mb-1">18k<span class="text-sm font-bold text-slate-400">+</span></h3>
                                    <p class="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Followers</p>
                                </div>
                                <div class="mt-4 flex items-center gap-2 text-[10px] font-bold text-green-500">
                                    <i class="fas fa-arrow-up"></i> 8.5% Engagement
                                </div>
                            </a>

                            <!-- Facebook -->
                            <a href="https://www.facebook.com/IKFDigital/" target="_blank" class="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden">
                                <div class="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-8 -mt-8 group-hover:bg-[#1877F2] transition-colors duration-500"></div>
                                <i class="fab fa-facebook-f text-3xl mb-4 text-[#1877F2] group-hover:text-white relative z-10 transition-colors"></i>
                                <div class="relative z-10">
                                    <h3 class="text-3xl font-black text-slate-800 mb-1">42k<span class="text-sm font-bold text-slate-400">+</span></h3>
                                    <p class="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Community</p>
                                </div>
                                <div class="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                    <i class="fas fa-minus"></i> Stable
                                </div>
                            </a>

                            <!-- YouTube -->
                            <a href="https://www.youtube.com/c/IKFDigital" target="_blank" class="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden">
                                <div class="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-full -mr-8 -mt-8 group-hover:bg-[#FF0000] transition-colors duration-500"></div>
                                <i class="fab fa-youtube text-3xl mb-4 text-[#FF0000] group-hover:text-white relative z-10 transition-colors"></i>
                                <div class="relative z-10">
                                    <h3 class="text-3xl font-black text-slate-800 mb-1">500<span class="text-sm font-bold text-slate-400">k</span></h3>
                                    <p class="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Views</p>
                                </div>
                                <div class="mt-4 flex items-center gap-2 text-[10px] font-bold text-green-500">
                                    <i class="fas fa-arrow-up"></i> New Viral Hit
                                </div>
                            </a>
                        </div>

                        <!--Recent Transmissions(Feed Simulation)-->
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 md:h-96">
                        <!-- Featured Post -->
                        <div class="lg:col-span-2 bg-gradient-to-br from-slate-900 to-ikf-blue rounded-[3rem] p-10 text-white relative overflow-hidden group">
                            <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-20 group-hover:scale-105 transition-transform duration-700"></div>
                            <div class="absolute top-8 right-8 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20">
                                Latest Transmission
                            </div>
                            <div class="relative z-10 h-full flex flex-col justify-end">
                                <div class="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
                                    <i class="fas fa-play text-white ml-1"></i>
                                </div>
                                <h3 class="text-2xl md:text-4xl font-black leading-tight mb-4">"The Future of AI in Marketing"</h3>
                                <p class="text-blue-100 max-w-lg text-sm leading-relaxed mb-8 line-clamp-2">Our Director, Ashish Dalia, breaks down how generative AI is reshaping the agency landscape. Watch the full keynote now.</p>
                                <a href="https://www.youtube.com/c/IKFDigital" target="_blank" class="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest hover:text-ikf-yellow transition-colors">
                                    Watch Video <i class="fas fa-arrow-right"></i>
                                </a>
                            </div>
                        </div>

                        <!-- Feed List -->
                        <div class="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm flex flex-col">
                            <h4 class="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Recent Activity</h4>
                            <div class="flex-1 space-y-6 overflow-hidden">
                                <div class="flex gap-4 group cursor-pointer">
                                    <div class="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0 bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80')"></div>
                                    <div>
                                        <p class="text-xs font-bold text-slate-700 leading-tight mb-1 group-hover:text-ikf-blue transition-colors">IKF celebrates 23 years of excellence! 🎉</p>
                                        <p class="text-[10px] text-slate-400">2 hours ago • Instagram</p>
                                    </div>
                                </div>
                                <div class="flex gap-4 group cursor-pointer">
                                    <div class="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0 bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80')"></div>
                                    <div>
                                        <p class="text-xs font-bold text-slate-700 leading-tight mb-1 group-hover:text-ikf-blue transition-colors">We are hiring! Join our creative team. 🚀</p>
                                        <p class="text-[10px] text-slate-400">5 hours ago • LinkedIn</p>
                                    </div>
                                </div>
                                <div class="flex gap-4 group cursor-pointer">
                                    <div class="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0 bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80')"></div>
                                    <div>
                                        <p class="text-xs font-bold text-slate-700 leading-tight mb-1 group-hover:text-ikf-blue transition-colors">New case study: Rebranding a tech giant.</p>
                                        <p class="text-[10px] text-slate-400">1 day ago • Behance</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                        </div>
                    </div>`;

            case 'referral':
                return `
                    <div class="max-w-6xl mx-auto py-6 fade-in">
                        <div class="mb-16 text-center">
                            <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Talent Acquisition Protocol</span>
                            <h1 class="text-4xl md:text-6xl font-extrabold text-ikf-blue tracking-tight">The Bounty <span class="text-transparent bg-clip-text bg-gradient-to-r from-ikf-blue to-ikf-yellow">Board</span></h1>
                            <p class="text-slate-400 mt-4 max-w-lg mx-auto text-sm font-medium">Earn rewards by expanding our intelligence network. Quality over quantity.</p>
                        </div>

                        <!--Bounty Tiers-->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 px-4">
                            <!-- Tier 1 -->
                            <div class="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl hover:-translate-y-2 transition-transform duration-500 relative overflow-hidden group">
                                <div class="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-100 transition-opacity">
                                    <i class="fas fa-medal text-8xl text-indigo-100"></i>
                                </div>
                                <div class="relative z-10">
                                    <div class="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 text-2xl font-black">1</div>
                                    <h3 class="text-2xl font-black text-slate-800 mb-2">Junior Agent</h3>
                                    <p class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">0-2 Years Exp</p>
                                    <div class="text-4xl font-black text-ikf-blue mb-1">₹5,000</div>
                                    <p class="text-[10px] text-slate-400">Successfully Hired</p>
                                </div>
                                <div class="mt-8 pt-8 border-t border-slate-100">
                                    <div class="flex items-center gap-3 text-xs font-bold text-slate-500">
                                        <i class="fas fa-user-tag text-indigo-500"></i>
                                        <span>exec / junior designer</span>
                                    </div>
                                </div>
                            </div>
                            <!-- Tier 2 -->
                            <div class="bg-gradient-to-br from-ikf-blue to-blue-900 rounded-[3rem] p-10 shadow-2xl hover:-translate-y-2 transition-transform duration-500 relative overflow-hidden group text-white transform md:scale-105 z-10 border-4 border-white">
                                <div class="absolute top-0 right-0 p-6 opacity-20">
                                    <i class="fas fa-star text-8xl text-white"></i>
                                </div>
                                <div class="relative z-10">
                                    <span class="absolute top-0 right-0 bg-ikf-yellow text-ikf-blue text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">Most Popular</span>
                                    <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 text-2xl font-black">2</div>
                                    <h3 class="text-2xl font-black mb-2">Specialist</h3>
                                    <p class="text-xs font-bold uppercase tracking-widest text-blue-200 mb-6">2-5 Years Exp</p>
                                    <div class="text-5xl font-black text-ikf-yellow mb-1">₹15,000</div>
                                    <p class="text-[10px] text-blue-200">Successfully Hired</p>
                                </div>
                                <div class="mt-8 pt-8 border-t border-white/10">
                                    <div class="flex items-center gap-3 text-xs font-bold text-blue-100">
                                        <i class="fas fa-user-shield text-ikf-yellow"></i>
                                        <span>manager / lead dev</span>
                                    </div>
                                </div>
                            </div>
                            <!-- Tier 3 -->
                            <div class="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl hover:-translate-y-2 transition-transform duration-500 relative overflow-hidden group">
                                <div class="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-100 transition-opacity">
                                    <i class="fas fa-crown text-8xl text-yellow-100"></i>
                                </div>
                                <div class="relative z-10">
                                    <div class="w-16 h-16 rounded-2xl bg-yellow-50 text-yellow-600 flex items-center justify-center mb-6 text-2xl font-black">3</div>
                                    <h3 class="text-2xl font-black text-slate-800 mb-2">Architect</h3>
                                    <p class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">5+ Years Exp</p>
                                    <div class="text-4xl font-black text-ikf-blue mb-1">₹25,000</div>
                                    <p class="text-[10px] text-slate-400">Successfully Hired</p>
                                </div>
                                <div class="mt-8 pt-8 border-t border-slate-100">
                                    <div class="flex items-center gap-3 text-xs font-bold text-slate-500">
                                        <i class="fas fa-chess-king text-yellow-500"></i>
                                        <span>director / head</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!--Process Flow "Smart Path" -->
                    <div class="bg-slate-50 rounded-[4rem] p-12 lg:p-16 relative overflow-hidden">
                        <div class="absolute left-1/2 top-0 bottom-0 w-[1px] bg-slate-200 -translate-x-1/2 hidden md:block"></div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                            <div class="text-right pr-0 md:pr-12 md:pt-12">
                                <div class="inline-block p-6 bg-white rounded-[2rem] shadow-lg mb-4 hover:scale-105 transition-transform">
                                    <i class="fas fa-fingerprint text-3xl text-ikf-blue"></i>
                                </div>
                                <h3 class="text-xl font-black text-slate-800">1. Identify</h3>
                                <p class="text-xs text-slate-500 mt-2 font-medium">Locate a candidate matching our cultural code.</p>
                            </div>
                            <div class="text-left pl-0 md:pl-12"></div>

                            <div class="text-right pr-0 md:pr-12"></div>
                            <div class="text-left pl-0 md:pl-12 md:pt-4">
                                <div class="inline-block p-6 bg-white rounded-[2rem] shadow-lg mb-4 hover:scale-105 transition-transform">
                                    <i class="fas fa-file-export text-3xl text-ikf-yellow"></i>
                                </div>
                                <h3 class="text-xl font-black text-slate-800">2. Submit</h3>
                                <p class="text-xs text-slate-500 mt-2 font-medium">Forward coordinates (CV) to HR via secure channel.</p>
                            </div>

                            <div class="text-right pr-0 md:pr-12 md:pb-12">
                                <div class="inline-block p-6 bg-white rounded-[2rem] shadow-lg mb-4 hover:scale-105 transition-transform">
                                    <i class="fas fa-wallet text-3xl text-green-500"></i>
                                </div>
                                <h3 class="text-xl font-black text-slate-800">3. Reward</h3>
                                <p class="text-xs text-slate-500 mt-2 font-medium">Payment released upon 3-month survival confirmation.</p>
                            </div>
                            <div class="text-left pl-0 md:pl-12"></div>
                        </div>

                        <!-- Central Node -->
                        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-ikf-blue rounded-full border-4 border-white shadow-xl hidden md:block"></div>
                        <div class="absolute left-1/2 top-[20%] -translate-x-1/2 w-4 h-4 bg-slate-300 rounded-full border-2 border-white hidden md:block"></div>
                        <div class="absolute left-1/2 bottom-[20%] -translate-x-1/2 w-4 h-4 bg-slate-300 rounded-full border-2 border-white hidden md:block"></div>
                    </div>
                    </div > `;

            case 'anniversary':
                return `
                    <div class="max-w-6xl mx-auto py-6 fade-in">
                        <div class="mb-16 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div>
                                <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Legacy System</span>
                                <h1 class="text-4xl md:text-6xl font-extrabold text-ikf-blue tracking-tight">Hall of <span class="text-transparent bg-clip-text bg-gradient-to-r from-ikf-blue to-ikf-yellow">Fame</span></h1>
                            </div>
                            <div class="bg-slate-900 text-white px-8 py-4 rounded-[2rem] flex items-center gap-4 shadow-xl">
                                <div class="text-right">
                                    <p class="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Total Experience</p>
                                    <p class="text-2xl font-black text-ikf-yellow">142<span class="text-sm text-white"> Years</span></p>
                                </div>
                                <i class="fas fa-hourglass-half text-3xl text-slate-700"></i>
                            </div>
                        </div>

                        <!--Milestone Track-->
                    <div class="space-y-8 relative">
                        <div class="absolute left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-ikf-blue via-ikf-yellow to-slate-200 hidden md:block"></div>

                        <!-- 10 Years -->
                        <div class="ml-0 md:ml-16 bg-white rounded-[2.5rem] p-8 md:p-10 shadow-lg border-l-8 border-slate-900 group hover:-translate-x-2 transition-transform duration-500">
                            <div class="flex flex-col md:flex-row items-start md:items-center gap-8">
                                <div class="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-xl relative">
                                    <div class="absolute inset-0 border-4 border-slate-100 rounded-full animate-ping opacity-20"></div>
                                    <span class="text-2xl font-black">10+</span>
                                    <p class="absolute -bottom-6 text-[10px] font-bold text-slate-900 uppercase tracking-widest">Titan</p>
                                </div>
                                <div class="flex-1">
                                    <h3 class="text-xl font-black text-slate-800 mb-4">The Founding Pillars</h3>
                                    <div class="flex flex-wrap gap-4">
                                        <div class="flex items-center gap-3 bg-slate-50 pl-2 pr-5 py-2 rounded-full border border-slate-100 hover:bg-slate-900 hover:text-white transition-colors group/pill">
                                            <img src="images/avatars/ashish_real.jpg" class="w-8 h-8 rounded-full object-cover">
                                                <div class="text-left">
                                                    <p class="text-xs font-bold">Ashish Dalia</p>
                                                    <p class="text-[9px] text-slate-400 group-hover/pill:text-slate-500">Founder</p>
                                                </div>
                                        </div>
                                        <div class="flex items-center gap-3 bg-slate-50 pl-2 pr-5 py-2 rounded-full border border-slate-100 hover:bg-slate-900 hover:text-white transition-colors group/pill">
                                            <img src="images/avatars/jayraj.png" class="w-8 h-8 rounded-full object-cover">
                                                <div class="text-left">
                                                    <p class="text-xs font-bold">Jayraj Mehta</p>
                                                    <p class="text-[9px] text-slate-400 group-hover/pill:text-slate-500">Director</p>
                                                </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 5 Years -->
                        <div class="ml-0 md:ml-16 bg-white rounded-[2.5rem] p-8 md:p-10 shadow-lg border-l-8 border-ikf-blue group hover:-translate-x-2 transition-transform duration-500">
                            <div class="flex flex-col md:flex-row items-start md:items-center gap-8">
                                <div class="w-20 h-20 bg-ikf-blue rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-xl">
                                    <span class="text-xl font-black">5+</span>
                                    <p class="absolute -bottom-6 text-[10px] font-bold text-ikf-blue uppercase tracking-widest">Core</p>
                                </div>
                                <div class="flex-1">
                                    <h3 class="text-xl font-black text-slate-800 mb-4">The Architects</h3>
                                    <div class="flex flex-wrap gap-4">
                                        <div class="flex items-center gap-3 bg-slate-50 pl-2 pr-5 py-2 rounded-full border border-slate-100 hover:bg-ikf-blue hover:text-white transition-colors group/pill">
                                            <img src="images/avatars/avatar_marketing_male.png" class="w-8 h-8 rounded-full object-cover">
                                                <div class="text-left">
                                                    <p class="text-xs font-bold">Vikram Singh</p>
                                                    <p class="text-[9px] text-slate-400 group-hover/pill:text-blue-100">Sr. Strategist</p>
                                                </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 1 Year -->
                        <div class="ml-0 md:ml-16 bg-white rounded-[2.5rem] p-8 md:p-10 shadow-lg border-l-8 border-ikf-yellow group hover:-translate-x-2 transition-transform duration-500">
                            <div class="flex flex-col md:flex-row items-start md:items-center gap-8">
                                <div class="w-16 h-16 bg-ikf-yellow rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-xl">
                                    <span class="text-lg font-black">1+</span>
                                    <p class="absolute -bottom-6 text-[10px] font-bold text-ikf-yellow uppercase tracking-widest">Rising</p>
                                </div>
                                <div class="flex-1">
                                    <h3 class="text-xl font-black text-slate-800 mb-4">The Rising Stars</h3>
                                    <div class="flex flex-wrap gap-4">
                                        <div class="flex items-center gap-3 bg-slate-50 pl-2 pr-5 py-2 rounded-full border border-slate-100 hover:bg-ikf-yellow hover:text-white transition-colors group/pill">
                                            <img src="images/avatars/avatar_creative_female.png" class="w-8 h-8 rounded-full object-cover">
                                                <div class="text-left">
                                                    <p class="text-xs font-bold">Sneha Patel</p>
                                                    <p class="text-[9px] text-slate-400 group-hover/pill:text-white">Designer</p>
                                                </div>
                                        </div>
                                        <div class="flex items-center gap-3 bg-slate-50 pl-2 pr-5 py-2 rounded-full border border-slate-100 hover:bg-ikf-yellow hover:text-white transition-colors group/pill">
                                            <img src="images/avatars/avatar_dev_male.png" class="w-8 h-8 rounded-full object-cover">
                                                <div class="text-left">
                                                    <p class="text-xs font-bold">Rahul Verma</p>
                                                    <p class="text-[9px] text-slate-400 group-hover/pill:text-white">Tech Lead</p>
                                                </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                        </div>
                    </div>`;

            case 'birthdays':
                return `
                    <div class="max-w-6xl mx-auto py-6 fade-in">
                        <div class="mb-12 flex items-end justify-between">
                            <div>
                                <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Solar Returns</span>
                                <h1 class="text-4xl md:text-6xl font-extrabold text-ikf-blue tracking-tight">Party <span class="text-transparent bg-clip-text bg-gradient-to-r from-ikf-blue to-ikf-yellow">Protocol</span></h1>
                            </div>
                            <div class="hidden md:block">
                                <div class="px-6 py-2 bg-white rounded-full border border-slate-100 shadow-sm text-xs font-bold text-slate-500">
                                    Next Event: <span class="text-ikf-blue">2 Days</span>
                                </div>
                            </div>
                        </div>

                        <!--Upcoming Birthdays Horizontal Scroll-->
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                            <!-- Card 1 -->
                            <div class="bg-white rounded-[3rem] p-2 pr-8 shadow-lg border border-slate-50 flex items-center gap-6 group hover:-translate-y-1 transition-transform cursor-default">
                                <div class="w-24 h-24 rounded-[2.5rem] bg-slate-100 overflow-hidden relative">
                                    <img src="images/avatars/avatar_creative_female.png" class="w-full h-full object-cover">
                                    <div class="absolute inset-0 bg-ikf-blue/20 hidden group-hover:flex items-center justify-center backdrop-blur-sm transition-all text-white text-2xl animate-pulse">
                                        🎂
                                    </div>
                                </div>
                                <div>
                                    <span class="px-2 py-0.5 bg-pink-50 text-pink-500 text-[9px] font-black uppercase tracking-widest rounded-md mb-2 inline-block">Feb 14</span>
                                    <h4 class="text-lg font-black text-slate-800">Priya Sharma</h4>
                                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Creative</p>
                                    <div class="flex items-center gap-1 text-[10px] text-slate-300">
                                        <i class="fas fa-star text-ikf-yellow"></i> Aquarius
                                    </div>
                                </div>
                            </div>

                            <!-- Card 2 -->
                            <div class="bg-white rounded-[3rem] p-2 pr-8 shadow-lg border border-slate-50 flex items-center gap-6 group hover:-translate-y-1 transition-transform cursor-default">
                                <div class="w-24 h-24 rounded-[2.5rem] bg-slate-100 overflow-hidden relative">
                                    <img src="images/avatars/avatar_dev_male.png" class="w-full h-full object-cover">
                                    <div class="absolute inset-0 bg-ikf-blue/20 hidden group-hover:flex items-center justify-center backdrop-blur-sm transition-all text-white text-2xl animate-pulse">
                                        🎁
                                    </div>
                                </div>
                                <div>
                                    <span class="px-2 py-0.5 bg-blue-50 text-blue-500 text-[9px] font-black uppercase tracking-widest rounded-md mb-2 inline-block">Feb 22</span>
                                    <h4 class="text-lg font-black text-slate-800">Rohan D.</h4>
                                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Developer</p>
                                    <div class="flex items-center gap-1 text-[10px] text-slate-300">
                                        <i class="fas fa-water text-blue-300"></i> Pisces
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Card 3 -->
                            <div class="bg-white rounded-[3rem] p-2 pr-8 shadow-lg border border-slate-50 flex items-center gap-6 group hover:-translate-y-1 transition-transform cursor-default opacity-60 hover:opacity-100">
                                <div class="w-24 h-24 rounded-[2.5rem] bg-slate-100 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all">
                                    <img src="images/avatars/avatar_marketing_male.png" class="w-full h-full object-cover">
                                </div>
                                <div>
                                    <span class="px-2 py-0.5 bg-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-md mb-2 inline-block">Mar 05</span>
                                    <h4 class="text-lg font-black text-slate-800">Amit K.</h4>
                                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">SEO</p>
                                    <div class="flex items-center gap-1 text-[10px] text-slate-300">
                                        <i class="fas fa-water text-blue-300"></i> Pisces
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!--Celebration CTA-->
                    <div class="bg-gradient-to-r from-pink-500 to-purple-600 rounded-[3rem] p-12 text-center text-white relative overflow-hidden group cursor-pointer" onclick="alert('Wishing everyone a fantastic year ahead! 🎉')">
                        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div class="relative z-10">
                            <i class="fas fa-birthday-cake text-5xl mb-6 block animate-bounce"></i>
                            <h3 class="text-3xl font-black mb-2">Send Group Wish</h3>
                            <p class="text-pink-100 text-sm font-medium">Click to confetti blast the office channel.</p>
                        </div>
                    </div>

                        </div>
                    </div>`;

            case 'holidays':
                return `
                    <div class="max-w-6xl mx-auto py-6 fade-in">
                        <div class="mb-16">
                            <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Global Calendar</span>
                            <h1 class="text-4xl md:text-6xl font-extrabold text-ikf-blue tracking-tight">Holidays <span class="text-transparent bg-clip-text bg-gradient-to-r from-ikf-blue to-ikf-yellow">2025-26</span></h1>
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
                            <div class="bg-white p-12 lg:p-16 rounded-[3.5rem] premium-card">
                                <h3 class="text-2xl font-black text-ikf-blue mb-10">Strategic Resets</h3>
                                <div class="space-y-6">
                                    <div class="flex items-center justify-between p-6 bg-slate-50 rounded-2xl group hover:bg-ikf-blue hover:text-white transition-all">
                                        <div><p class="font-black text-sm uppercase mb-1">Republic Day</p><p class="text-xs opacity-50 font-bold">JANUARY 26</p></div>
                                        <div class="text-[10px] font-black uppercase tracking-widest bg-ikf-yellow text-white px-3 py-1 rounded-full">Mandatory</div>
                                    </div>
                                    <div class="flex items-center justify-between p-6 bg-slate-50 rounded-2xl group hover:bg-ikf-blue hover:text-white transition-all">
                                        <div><p class="font-black text-sm uppercase mb-1">Independence Day</p><p class="text-xs opacity-50 font-bold">AUGUST 15</p></div>
                                        <div class="text-[10px] font-black uppercase tracking-widest bg-ikf-yellow text-white px-3 py-1 rounded-full">Mandatory</div>
                                    </div>
                                    <div class="flex items-center justify-between p-6 bg-slate-50 rounded-2xl group hover:bg-ikf-blue hover:text-white transition-all">
                                        <div><p class="font-black text-sm uppercase mb-1">Gandhi Jayanti</p><p class="text-xs opacity-50 font-bold">OCTOBER 02</p></div>
                                        <div class="text-[10px] font-black uppercase tracking-widest bg-ikf-yellow text-white px-3 py-1 rounded-full">Mandatory</div>
                                    </div>
                                    <div class="flex items-center justify-between p-6 bg-slate-50 rounded-2xl group hover:bg-ikf-blue hover:text-white transition-all">
                                        <div><p class="font-black text-sm uppercase mb-1">Diwali (Priti/Padwa)</p><p class="text-xs opacity-50 font-bold">NOVEMBER</p></div>
                                        <div class="text-[10px] font-black uppercase tracking-widest bg-ikf-yellow text-white px-3 py-1 rounded-full">Regional</div>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-slate-900 p-12 lg:p-16 rounded-[3.5rem] premium-card text-white relative overflow-hidden flex flex-col justify-center">
                                <div class="absolute inset-0 bg-ikf-blue/10"></div>
                                <i class="fas fa-umbrella-beach text-[120px] absolute -right-4 -bottom-4 opacity-5"></i>
                                <h4 class="text-2xl font-black mb-6">Execution Protocol</h4>
                                <p class="text-slate-400 leading-relaxed mb-8">
                                    IKF publishes its final holiday list at the start of every calendar year. Regional variations 
                                    between Pune, Mumbai, and Noida offices are detailed in the official HR circular.
                                </p>
                                <div class="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                    <p class="text-[10px] font-black text-ikf-yellow uppercase tracking-widest mb-2">Compensatory Policy</p>
                                    <p class="text-xs text-slate-400">Holidays falling on Sundays are not carried forward as per agency standards.</p>
                                </div>
                            </div>
                        </div>

                        </div>
                    </div>`;

            case 'attendance':
                return `
                    <div class="max-w-6xl mx-auto py-6 fade-in">
                        <div class="mb-16">
                            <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Operation Hours</span>
                            <h1 class="text-4xl md:text-6xl font-extrabold text-ikf-blue tracking-tight">Sync & <span class="text-transparent bg-clip-text bg-gradient-to-r from-ikf-blue to-ikf-yellow">Flow</span></h1>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                            <!-- Card 1 -->
                            <div class="bg-white p-12 rounded-[2.5rem] premium-card text-center group">
                                <div class="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-ikf-blue group-hover:text-white transition-all shadow-lg">
                                    <i class="fas fa-calendar-alt text-2xl"></i>
                                </div>
                                <h4 class="text-xl font-black text-ikf-blue mb-2">Work Week</h4>
                                <p class="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">Monday - Friday</p>
                                <p class="text-[10px] text-slate-300 mt-4 font-medium uppercase tracking-tighter">Occasional Strategic Saturdays</p>
                            </div>
                            <!-- Card 2 -->
                            <div class="bg-white p-12 rounded-[2.5rem] premium-card text-center group">
                                <div class="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-ikf-blue group-hover:text-white transition-all shadow-lg">
                                    <i class="fas fa-stopwatch text-2xl"></i>
                                </div>
                                <h4 class="text-xl font-black text-ikf-blue mb-2">Core Hours</h4>
                                <p class="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">09:30 AM - 06:15 PM</p>
                                <p class="text-[10px] text-slate-300 mt-4 font-medium uppercase tracking-tighter">8.75 Hours of Productive Sync</p>
                            </div>
                            <!-- Card 3 -->
                            <div class="bg-white p-12 rounded-[2.5rem] premium-card text-center group">
                                <div class="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-ikf-blue group-hover:text-white transition-all shadow-lg">
                                    <i class="fas fa-fingerprint text-2xl"></i>
                                </div>
                                <h4 class="text-xl font-black text-ikf-blue mb-2">Digital Log</h4>
                                <p class="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">Bio-Auth / App Sync</p>
                                <p class="text-[10px] text-slate-300 mt-4 font-medium uppercase tracking-tighter">Automated Attendance Tracking</p>
                            </div>
                        </div>

                        <div class="bg-slate-900 p-12 lg:p-20 rounded-[4rem] premium-card text-white flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
                            <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-10"></div>
                            <div class="flex-1 z-10">
                                <h3 class="text-4xl font-extrabold mb-6">The Punctuality DNA</h3>
                                <p class="text-slate-400 leading-relaxed mb-10 text-lg">
                                    Precision is our product. At IKF, synchronization starts with timing. 
                                    Ensuring you're logged in by 09:30 AM helps the entire Factory begin 
                                    its creative and technical operations without friction.
                                </p>
                                <div class="space-y-6">
                                    <div class="flex items-center gap-6"><span class="w-3 h-3 bg-ikf-yellow rounded-full shadow-[0_0_15px_rgba(217,164,23,1)]"></span><p class="font-bold text-xs uppercase tracking-widest">Entry: 09:30 AM SHARP</p></div>
                                    <div class="flex items-center gap-6"><span class="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,1)]"></span><p class="font-bold text-xs uppercase tracking-widest">Grace: 15 Mins (Max 3/Month)</p></div>
                                </div>
                            </div>
                            <div class="w-full md:w-96 aspect-square bg-white/5 backdrop-blur-3xl rounded-[3rem] border-4 border-white/5 z-10 shadow-2xl flex items-center justify-center text-white/20 text-4xl font-black italic">PORTAL</div>
                        </div>

                        </div>
                    </div>`;



            case 'policies':
                return `
                    <div class="max-w-6xl mx-auto py-6 fade-in">
                        <div class="mb-16">
                            <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Legal Framework</span>
                            <h1 class="text-4xl md:text-6xl font-extrabold text-ikf-blue tracking-tight">The <span class="text-transparent bg-clip-text bg-gradient-to-r from-ikf-blue to-ikf-yellow">Commitment</span></h1>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
                            <div class="p-12 bg-white rounded-[3.5rem] premium-card">
                                <h3 class="text-2xl font-black text-ikf-blue mb-8">Evolution & Growth</h3>
                                <div class="space-y-6">
                                    <div class="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                        <i class="fas fa-user-shield text-ikf-blue mt-1"></i>
                                        <p class="text-xs text-slate-600 font-medium">Standard probation: 6 Months (Performance Linked).</p>
                                    </div>
                                    <div class="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                        <i class="fas fa-sign-out-alt text-ikf-blue mt-1"></i>
                                        <p class="text-xs text-slate-600 font-medium">Notice period: 60 - 90 Days (Post-Confirmation).</p>
                                    </div>
                                </div>
                            </div>
                            <div class="p-12 bg-white rounded-[3.5rem] premium-card">
                                <h3 class="text-2xl font-black text-ikf-blue mb-8">Financial Hub</h3>
                                <div class="space-y-6">
                                    <div class="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                        <i class="fas fa-credit-card text-ikf-yellow mt-1"></i>
                                        <p class="text-xs text-slate-600 font-medium">Salary Disbursement: Typically 10th of every month.</p>
                                    </div>
                                    <div class="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                        <i class="fas fa-file-invoice-dollar text-ikf-yellow mt-1"></i>
                                        <p class="text-xs text-slate-600 font-medium">Compliance: Automated TDS / Statutory Deductions.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bg-gradient-to-br from-ikf-yellow to-orange-500 p-12 lg:p-20 rounded-[4rem] text-white premium-card text-center relative overflow-hidden">
                            <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <div class="z-10 relative">
                                <h3 class="text-4xl font-black mb-6">Finish Your Sync</h3>
                                <p class="text-white/80 max-w-2xl mx-auto mb-12 text-lg">
                                    By acknowledging this, you confirm that you have understood the I-K-F philosophy, 
                                    operational standards, and HR policies of I Knowledge Factory.
                                </p>
                                
                                <label class="flex items-center justify-center gap-6 cursor-pointer group bg-black/10 hover:bg-black/20 p-8 rounded-3xl transition-all max-w-xl mx-auto border border-white/20">
                                    <input type="checkbox" id="final-ack-check" class="w-8 h-8 rounded-xl border-none focus:ring-4 focus:ring-white/20 text-slate-900" onchange="AppNavigation.handleAcknowledgement(this)">
                                    <span class="font-black text-xl select-none">I'm Ready to Build</span>
                                </label>

                                <div id="completion-message" class="hidden mt-12 p-8 bg-white rounded-[2.5rem] text-ikf-blue animate-bounce-y shadow-2xl inline-block">
                                    <div class="flex items-center gap-6">
                                        <div class="w-14 h-14 bg-green-500 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-green-500/20">
                                            <i class="fas fa-check-circle"></i>
                                        </div>
                                        <div class="text-left">
                                            <p class="text-2xl font-black">Sync Successful</p>
                                            <p class="text-xs text-slate-400 uppercase font-black tracking-widest">Welcome to the Factory</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div > `;

            default:
                return `
                    <div class="max-w-4xl mx-auto py-20 text-center">
                        <div class="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6"><i class="fas fa-tools text-2xl text-slate-400"></i></div>
                        <h2 class="text-2xl font-bold text-ikf-blue">Module Under Construction</h2>
                        <p class="text-slate-500 mt-2 text-lg">We are building high-quality content for <span class="font-bold text-ikf-yellow italic">${sectionId}</span>.</p>
                        <button onclick="AppNavigation.navigateTo('intro')" class="mt-8 text-ikf-blue font-bold hover:underline"><i class="fas fa-arrow-left mr-2"></i> Back to Intro</button>
                    </div > `;
        }
    }
};

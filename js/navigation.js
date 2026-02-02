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
            <div class="employee-card premium-card bg-white p-6 text-center group cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-50 relative overflow-hidden" 
                 onclick="AppNavigation.showLeaderModal('${emp.id === 'ashish' || emp.id === 'jayraj' || emp.id === 'anuja' ? emp.id : 'leadership'}', '${emp.name}', '${emp.role}')"
                 style="animation: fadeInUp 0.5s ease backwards ${index * 50}ms">
                
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ikf-blue to-ikf-yellow opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div class="relative mb-5 mx-auto w-24 h-24">
                    <div class="absolute inset-0 bg-gradient-to-br from-ikf-blue/10 to-ikf-yellow/10 rounded-full transform rotate-6 group-hover:rotate-12 transition-transform"></div>
                    <img src="${emp.img}" class="relative w-full h-full object-cover rounded-full shadow-md border-2 border-white group-hover:border-ikf-blue/20 transition-colors" alt="${emp.name}">
                    <div class="absolute bottom-0 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm" title="Online"></div>
                </div>
                
                <h4 class="text-lg font-black text-slate-800 group-hover:text-ikf-blue transition-colors mb-0.5">${emp.name}</h4>
                <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">${emp.role}</p>
                
                <!-- Smart Skills Tags -->
                <div class="flex flex-wrap justify-center gap-1.5 mb-4 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                    ${(emp.skills || []).slice(0, 2).map(skill =>
            `<span class="px-2 py-0.5 bg-slate-50 text-[8px] font-bold text-slate-500 rounded-full border border-slate-100">${skill}</span>`
        ).join('')}
                </div>

                <span class="inline-block px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-bold text-slate-400 border border-slate-100 group-hover:bg-ikf-blue group-hover:text-white group-hover:border-ikf-blue transition-all w-full">${emp.dept}</span>
            </div>
        `).join('') + `
            <div class="premium-card bg-slate-50 p-6 text-center group border-2 border-dashed border-slate-200 opacity-60 hover:opacity-100 transition-opacity cursor-pointer hover:bg-white hover:border-ikf-yellow/50 hover:shadow-lg flex flex-col justify-center items-center h-full min-h-[300px]">
                <div class="relative mb-5 w-20 h-20 flex items-center justify-center bg-white rounded-full shadow-sm text-slate-300 group-hover:text-ikf-yellow transition-colors">
                    <i class="fas fa-user-plus text-2xl"></i>
                </div>
                <h4 class="text-lg font-black text-slate-500 group-hover:text-ikf-blue transition-colors mb-0.5">Join the Team</h4>
                <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3">Open Positions</p>
                <span class="inline-block px-3 py-1 bg-transparent rounded-lg text-[9px] font-bold text-slate-400 border border-slate-300 group-hover:border-ikf-yellow group-hover:text-ikf-yellow transition-all">Apply Now</span>
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
                    <div class="max-w-6xl mx-auto py-10 fade-in">
                        <div class="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div>
                                <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Onboarding Portal v2.0</span>
                                <h1 class="text-4xl md:text-6xl font-extrabold text-ikf-blue tracking-tighter leading-none">
                                    Welcome to <br/><span class="text-ikf-yellow italic">I Knowledge Factory.</span>
                                </h1>
                            </div>
                            <div class="flex gap-4">
                                <div class="px-6 py-4 bg-white rounded-3xl premium-card text-center min-w-[120px]">
                                    <p class="text-2xl font-bold text-ikf-blue">25+</p>
                                    <p class="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Years Exp</p>
                                </div>
                                <div class="px-6 py-4 bg-white rounded-3xl premium-card text-center min-w-[120px]">
                                    <p class="text-2xl font-bold text-ikf-blue">1500+</p>
                                    <p class="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Clients</p>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
                            <div class="lg:col-span-7 bg-white p-12 rounded-[2.5rem] premium-card relative overflow-hidden group">
                                <div class="absolute top-0 right-0 w-64 h-64 bg-ikf-blue/5 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110"></div>
                                <h3 class="text-2xl font-extrabold text-ikf-blue mb-6">Mission Briefing</h3>
                                <p class="text-slate-500 leading-relaxed mb-8 text-lg">
                                    IKF is a multidisciplinary agency that blends strategy, design, and performance marketing to help brands thrive across digital ecosystems. We've stayed relevant for over 25 years by moving with internet shifts and user behavior.
                                </p>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div class="flex items-start gap-4">
                                        <div class="w-10 h-10 rounded-xl bg-ikf-blue/5 flex items-center justify-center text-ikf-blue"><i class="fas fa-rocket"></i></div>
                                        <div><p class="font-bold text-sm text-ikf-blue uppercase">800+</p><p class="text-xs text-slate-400 leading-relaxed">Strategies Delivered Successfully.</p></div>
                                    </div>
                                    <div class="flex items-start gap-4">
                                        <div class="w-10 h-10 rounded-xl bg-ikf-yellow/10 flex items-center justify-center text-ikf-yellow"><i class="fas fa-desktop"></i></div>
                                        <div><p class="font-bold text-sm text-ikf-blue uppercase">750+</p><p class="text-xs text-slate-400 leading-relaxed">Websites Launched and Optimized.</p></div>
                                    </div>
                                </div>
                            </div>
                            <div class="lg:col-span-5 h-[400px] lg:h-auto overflow-hidden rounded-[2.5rem] premium-card group relative">
                                <img src="https://www.ikf.co.in/wp-content/uploads/About-IKF-Img.jpg" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="IKF Office">
                                <div class="absolute inset-0 bg-ikf-blue/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-12 text-center">
                                    <p class="text-white font-bold leading-relaxed">"We don't believe in overengineering, but in working in tune with the market and the moment."</p>
                                </div>
                            </div>
                        </div>

                        <div class="bg-gradient-to-r from-ikf-blue to-primary-light p-10 md:p-14 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
                            <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                            <div class="z-10 flex-1">
                                <h3 class="text-3xl font-extrabold mb-3">Begin the Journey</h3>
                                <p class="text-blue-200/80 max-w-md">Your induction covers the DNA of IKF. Meet the visionary leadership team leading our 50+ experts.</p>
                            </div>
                            <button onclick="AppNavigation.navigateTo('management')" 
                                class="z-10 group bg-ikf-yellow hover:white text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white hover:text-ikf-blue transition-all shadow-xl shadow-black/20 flex items-center gap-4">
                                Launch Induction <i class="fas fa-arrow-right animate-bounce-x"></i>
                            </button>
                        </div>
                    </div>`;

            case 'management':
                return `
                    <div class="max-w-6xl mx-auto py-10 fade-in">
                        <div class="mb-16">
                            <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Leadership Core</span>
                            <h1 class="text-4xl md:text-5xl font-extrabold text-ikf-blue tracking-tight">Meet the Visionaries</h1>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
                            <!-- Card 1 -->
                            <div class="group cursor-pointer" onclick="AppNavigation.showLeaderModal('ashish', 'Ashish Dalia', 'CEO')">
                                <div class="premium-card bg-white p-8 group-hover:bg-ikf-blue transition-all duration-500">
                                    <div class="relative mb-8 overflow-hidden rounded-2xl">
                                        <img src="images/avatars/ashish_real.jpg" class="aspect-square w-full object-cover bg-slate-50 transition-transform duration-700 group-hover:scale-110" alt="Ashish Dalia">
                                        <div class="absolute inset-0 bg-gradient-to-t from-ikf-blue/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                            <p class="text-[10px] text-white/70 uppercase font-black tracking-widest">View Profile</p>
                                        </div>
                                    </div>
                                    <h3 class="text-2xl font-extrabold text-ikf-blue group-hover:text-white transition-colors mb-1">Ashish Dalia</h3>
                                    <p class="text-ikf-yellow text-[11px] font-black uppercase tracking-widest mb-4">Chief Executive Officer</p>
                                    <p class="text-slate-500 group-hover:text-blue-100 text-sm leading-relaxed mb-6">A visionary leader with 25+ years of experience in digital transformation...</p>
                                    <div class="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-white/10 flex items-center justify-center text-ikf-blue group-hover:text-white transition-all">
                                        <i class="fas fa-chevron-right text-xs"></i>
                                    </div>
                                </div>
                            </div>
                            <!-- Card 2 -->
                            <div class="group cursor-pointer" onclick="AppNavigation.showLeaderModal('jayraj', 'Jayraj Mehta', 'Director')">
                                <div class="premium-card bg-white p-8 group-hover:bg-ikf-blue transition-all duration-500">
                                    <div class="relative mb-8 overflow-hidden rounded-2xl">
                                        <img src="images/avatars/jayraj.png" class="aspect-square w-full object-cover bg-slate-50 transition-transform duration-700 group-hover:scale-110" alt="Jayraj Mehta">
                                        <div class="absolute inset-0 bg-gradient-to-t from-ikf-blue/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                            <p class="text-[10px] text-white/70 uppercase font-black tracking-widest">View Profile</p>
                                        </div>
                                    </div>
                                    <h3 class="text-2xl font-extrabold text-ikf-blue group-hover:text-white transition-colors mb-1">Jayraj Mehta</h3>
                                    <p class="text-ikf-yellow text-[11px] font-black uppercase tracking-widest mb-4">Director</p>
                                    <p class="text-slate-500 group-hover:text-blue-100 text-sm leading-relaxed mb-6">Jayraj oversees strategic operations and technological integration...</p>
                                    <div class="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-white/10 flex items-center justify-center text-ikf-blue group-hover:text-white transition-all">
                                        <i class="fas fa-chevron-right text-xs"></i>
                                    </div>
                                </div>
                            </div>
                            <!-- Card 3 -->
                            <div class="group cursor-pointer" onclick="AppNavigation.showLeaderModal('anuja', 'Anuja Kapoor', 'Director')">
                                <div class="premium-card bg-white p-8 group-hover:bg-ikf-blue transition-all duration-500">
                                    <div class="relative mb-8 overflow-hidden rounded-2xl">
                                        <img src="images/avatars/anuja.png" class="aspect-square w-full object-cover bg-slate-50 transition-transform duration-700 group-hover:scale-110" alt="Anuja Kapoor">
                                        <div class="absolute inset-0 bg-gradient-to-t from-ikf-blue/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                            <p class="text-[10px] text-white/70 uppercase font-black tracking-widest">View Profile</p>
                                        </div>
                                    </div>
                                    <h3 class="text-2xl font-extrabold text-ikf-blue group-hover:text-white transition-colors mb-1">Anuja Kapoor</h3>
                                    <p class="text-ikf-yellow text-[11px] font-black uppercase tracking-widest mb-4">Director</p>
                                    <p class="text-slate-500 group-hover:text-blue-100 text-sm leading-relaxed mb-6">Anuja leads the creative and brand strategy units...</p>
                                    <div class="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-white/10 flex items-center justify-center text-ikf-blue group-hover:text-white transition-all">
                                        <i class="fas fa-chevron-right text-xs"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Leader Modal -->
                        <div id="leader-modal" class="fixed inset-0 z-[100] hidden flex items-center justify-center p-4">
                            <div class="absolute inset-0 bg-ikf-blue/90 backdrop-blur-xl" onclick="AppNavigation.hideModal()"></div>
                            <div class="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden relative shadow-2xl scale-95 opacity-0 transition-all duration-500 border border-white/20" id="modal-content">
                                <button class="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-ikf-blue hover:text-white transition-all z-10" onclick="AppNavigation.hideModal()"><i class="fas fa-times text-xl"></i></button>
                                <div class="flex flex-col md:flex-row">
                                    <div class="md:w-2/5 p-12 bg-slate-50 flex flex-col justify-center items-center text-center">
                                        <div class="w-48 h-48 bg-white rounded-[2.5rem] mb-8 shadow-2xl ring-8 ring-white overflow-hidden flex items-center justify-center">
                                            <i class="fas fa-user-tie text-7xl text-slate-100"></i>
                                        </div>
                                        <h4 id="modal-leader-name" class="text-3xl font-black text-ikf-blue mb-2"></h4>
                                        <p id="modal-leader-role" class="text-ikf-yellow font-black uppercase tracking-[0.2em] text-[10px]"></p>
                                    </div>
                                    <div class="md:w-3/5 p-12 lg:p-16 flex flex-col justify-center">
                                        <i class="fas fa-quote-left text-5xl text-ikf-yellow/20 mb-6"></i>
                                        <h3 class="text-3xl font-extrabold text-ikf-blue mb-8 leading-tight">Driving the future <br/>of digital growth.</h3>
                                        <div id="modal-leader-note" class="text-slate-500 text-lg leading-relaxed space-y-6"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;

            case 'org-chart':
                return `
                    <div class="max-w-7xl mx-auto py-10 fade-in">
                        <div class="mb-16">
                            <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">System Architecture</span>
                            <h1 class="text-4xl md:text-5xl font-extrabold text-ikf-blue tracking-tight">The Ecosystem Hierarchy</h1>
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

                        <div class="mt-20 bg-slate-900 p-12 lg:p-16 rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden premium-card">
                            <div class="absolute top-0 right-0 w-96 h-96 bg-ikf-yellow/10 rounded-full -mr-48 -mt-48 blur-[100px]"></div>
                            <div class="z-10 flex-1">
                                <h3 class="text-3xl font-extrabold mb-4">Functional Deep-Dive</h3>
                                <p class="text-slate-400 max-w-lg">Now that you've seen the hierarchy, let's explore the specialized toolsets and responsibilities of each department.</p>
                            </div>
                            <button onclick="AppNavigation.navigateTo('departments')" class="z-10 group bg-ikf-yellow text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-ikf-blue transition-all flex items-center gap-4">
                                Explorer Departments <i class="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>`;

            case 'departments':
                return `
                    <div class="max-w-7xl mx-auto py-10 fade-in">
                        <div class="mb-16">
                            <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Execution Engine</span>
                            <h1 class="text-4xl md:text-5xl font-extrabold text-ikf-blue tracking-tight">Our Specialized Units</h1>
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

                        <div class="bg-ikf-blue p-12 lg:p-16 rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden premium-card">
                            <div class="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full -mb-32 -mr-32 animate-pulse"></div>
                            <div class="z-10 flex-1">
                                <h3 class="text-3xl font-extrabold mb-4">The Human Capital</h3>
                                <p class="text-blue-100 max-w-lg">Every great unit is powered by exceptional talent. Meet the individuals who form the backbone of IKF.</p>
                            </div>
                            <button onclick="AppNavigation.navigateTo('directory')" class="z-10 group bg-ikf-yellow text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-ikf-blue transition-all flex items-center gap-4 shadow-lg shadow-ikf-yellow/20">
                                Browse Directory <i class="fas fa-people-group group-hover:scale-110 transition-transform"></i>
                            </button>
                        </div>
                    </div>`;

            case 'directory':
                // Initialize employees if not already done
                if (!this.employees || this.employees.length === 0) {
                    this.initEmployees();
                }

                return `
                    <div class="max-w-7xl mx-auto py-10 fade-in">
                        <div class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div>
                                <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Team Matrix</span>
                                <h1 class="text-4xl md:text-5xl font-extrabold text-ikf-blue tracking-tight">The Minds of IKF</h1>
                            </div>
                            <div class="flex flex-col sm:flex-row gap-4">
                                <div class="relative group z-20">
                                    <i class="fas fa-filter absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-ikf-blue transition-colors text-xs"></i>
                                    <select id="dept-filter" class="pl-10 pr-10 py-3.5 bg-white border border-slate-100 rounded-2xl text-xs font-bold text-slate-500 focus:ring-4 focus:ring-ikf-blue/5 outline-none appearance-none cursor-pointer premium-card shadow-sm hover:shadow-md transition-all w-full sm:w-48" onchange="AppNavigation.filterDirectory()">
                                        <option value="all">All Ecosystems</option>
                                        <option value="Management">Management</option>
                                        <option value="Web Development">Web Development</option>
                                        <option value="Digital Marketing">Digital Marketing</option>
                                        <option value="Branding">Branding</option>
                                        <option value="App Development">App Development</option>
                                    </select>
                                    <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none"></i>
                                </div>
                                <div class="relative group z-20">
                                    <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-ikf-blue transition-colors text-xs"></i>
                                    <input type="text" id="directory-search" placeholder="Search by name or role..." class="pl-10 pr-6 py-3.5 bg-white border border-slate-100 rounded-2xl text-xs font-bold text-slate-500 w-full sm:w-64 focus:ring-4 focus:ring-ikf-blue/5 outline-none premium-card shadow-sm hover:shadow-md transition-all" oninput="AppNavigation.filterDirectory()">
                                </div>
                            </div>
                        </div>

                        <!-- Quick Filters -->
                        <div class="flex flex-wrap gap-2 mb-10">
                            <button onclick="AppNavigation.quickFilter('all')" class="px-4 py-2 bg-ikf-blue text-white rounded-xl text-[10px] font-bold shadow-lg shadow-ikf-blue/20 hover:scale-105 transition-transform">All</button>
                            <button onclick="AppNavigation.quickFilter('Web Development')" class="px-4 py-2 bg-white text-slate-500 hover:text-ikf-blue rounded-xl text-[10px] font-bold border border-slate-100 hover:border-ikf-blue/30 transition-all">Web Dev</button>
                            <button onclick="AppNavigation.quickFilter('Digital Marketing')" class="px-4 py-2 bg-white text-slate-500 hover:text-ikf-blue rounded-xl text-[10px] font-bold border border-slate-100 hover:border-ikf-blue/30 transition-all">Marketing</button>
                            <button onclick="AppNavigation.quickFilter('Branding')" class="px-4 py-2 bg-white text-slate-500 hover:text-ikf-blue rounded-xl text-[10px] font-bold border border-slate-100 hover:border-ikf-blue/30 transition-all">Branding</button>
                            <button onclick="AppNavigation.quickFilter('App Development')" class="px-4 py-2 bg-white text-slate-500 hover:text-ikf-blue rounded-xl text-[10px] font-bold border border-slate-100 hover:border-ikf-blue/30 transition-all">App Dev</button>
                        </div>

                        <!-- Dynamic Grid -->
                        <div id="directory-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 fade-in-up">
                            <!-- Content will be injected by renderDirectory() -->
                        </div>

                        <div class="bg-gradient-to-br from-ikf-yellow to-orange-500 p-12 lg:p-16 rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden premium-card">
                            <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <div class="z-10 flex-1">
                                <h3 class="text-3xl font-extrabold mb-4">Foundational DNA</h3>
                                <p class="text-white/80 max-w-lg">What does I-K-F actually stand for? Dive into the core philosophy that drives our daily operations.</p>
                            </div>
                            <button onclick="AppNavigation.navigateTo('philosophy')" class="z-10 group bg-white text-ikf-blue px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center gap-4">
                                Discover Philosophy <i class="fas fa-microchip"></i>
                            </button>
                        </div>
                    </div>
                `;

            case 'philosophy':
                return `
                    <div class="max-w-6xl mx-auto py-10 fade-in">
                        <div class="mb-16">
                            <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Core Directives</span>
                            <h1 class="text-4xl md:text-6xl font-extrabold text-ikf-blue tracking-tighter leading-none mb-4">
                                I • K • F <br/><span class="text-slate-400 text-2xl md:text-3xl font-light">The DNA of Our Identity</span>
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

                        <div class="bg-slate-900 p-12 lg:p-16 rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden premium-card">
                            <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(14,0,87,0.5),transparent)]"></div>
                            <div class="z-10 flex-1">
                                <h3 class="text-3xl font-extrabold mb-4">The Horizon</h3>
                                <p class="text-slate-400 max-w-lg">Our philosophy is anchored in our Mission & Vision. Explore how we translate values into global impact.</p>
                            </div>
                            <button onclick="AppNavigation.navigateTo('mission')" class="z-10 group bg-ikf-yellow text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-ikf-blue transition-all flex items-center gap-4">
                                Target: Mission <i class="fas fa-bullseye"></i>
                            </button>
                        </div>
                    </div>`;

            case 'mission':
                return `
                    <div class="max-w-6xl mx-auto py-10 fade-in">
                        <div class="mb-16">
                            <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Strategic Compass</span>
                            <h1 class="text-4xl md:text-5xl font-extrabold text-ikf-blue tracking-tight">Mission & Vision</h1>
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

                        <button onclick="AppNavigation.navigateTo('culture')" class="w-full bg-slate-900 p-8 rounded-[2.5rem] flex items-center justify-between text-white premium-card group hover:bg-ikf-blue transition-all">
                            <div class="flex items-center gap-6">
                                <div class="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center"><i class="fas fa-heart text-ikf-yellow"></i></div>
                                <div class="text-left">
                                    <p class="text-[10px] font-black uppercase tracking-[0.2em] text-ikf-yellow mb-1">Next Evolution</p>
                                    <p class="text-xl font-bold">Immerse in Our Culture</p>
                                </div>
                            </div>
                            <i class="fas fa-arrow-right text-2xl opacity-30 group-hover:opacity-100 group-hover:translate-x-2 transition-all"></i>
                        </button>
                    </div>`;

            case 'culture':
                return `
                    <div class="max-w-7xl mx-auto py-10 fade-in">
                        <div class="mb-16 text-center">
                            <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">System Core</span>
                            <h1 class="text-4xl md:text-6xl font-extrabold text-ikf-blue tracking-tight">The IKF Culture Code</h1>
                            <p class="text-slate-400 mt-4 max-w-2xl mx-auto text-sm font-medium">Running on version 4.0. Optimized for high performance, creativity, and human-centric processing.</p>
                        </div>

                        <!-- Culture Stats Grid -->
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

                        <!-- Main Culture Modules -->
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
                                        <h3 class="text-3xl md:text-5xl font-black mb-6 leading-tight">We Debug <br/><span class="text-ikf-yellow">Problems</span>, Not People.</h3>
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
                    </div>
                `;

            case 'social':
                return `
                    <div class="max-w-7xl mx-auto py-10 fade-in">
                        <div class="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Digital Command Center</span>
                                <h1 class="text-4xl md:text-6xl font-extrabold text-ikf-blue tracking-tight">The Ecosystem</h1>
                            </div>
                            <div class="flex items-center gap-2 text-green-500 font-bold text-xs bg-green-50 px-4 py-2 rounded-full border border-green-100 animate-pulse">
                                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                                Live Sync: Active
                            </div>
                        </div>

                        <!-- Live Stats Grid -->
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

                        <!-- Recent Transmissions (Feed Simulation) -->
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

                        <div class="bg-indigo-900 p-12 lg:p-16 rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden premium-card">
                            <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
                            <div class="z-10 text-left">
                                <h3 class="text-3xl font-extrabold mb-4">Grow the Family</h3>
                                <p class="text-indigo-200 max-w-lg">Identify talent and earn rewards through our official Referral Program.</p>
                            </div>
                            <button onclick="AppNavigation.navigateTo('referral')" class="z-10 group bg-white text-indigo-900 px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-ikf-yellow hover:text-white transition-all flex items-center gap-4">
                                Referral Policy <i class="fas fa-user-plus"></i>
                            </button>
                        </div>
                    </div>`;

            case 'referral':
                return `
                    <div class="max-w-6xl mx-auto py-10 fade-in">
                        <div class="mb-16 text-center">
                            <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Talent Acquisition Protocol</span>
                            <h1 class="text-4xl md:text-6xl font-extrabold text-ikf-blue tracking-tight">The Bounty Board</h1>
                            <p class="text-slate-400 mt-4 max-w-lg mx-auto text-sm font-medium">Earn rewards by expanding our intelligence network. Quality over quantity.</p>
                        </div>

                        <!-- Bounty Tiers -->
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

                        <!-- Process Flow "Smart Path" -->
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
                    </div>`;

            case 'anniversary':
                return `
                    <div class="max-w-7xl mx-auto py-10 fade-in">
                        <div class="mb-16 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div>
                                <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Legacy System</span>
                                <h1 class="text-4xl md:text-5xl font-extrabold text-ikf-blue tracking-tight">Hall of Fame</h1>
                            </div>
                            <div class="bg-slate-900 text-white px-8 py-4 rounded-[2rem] flex items-center gap-4 shadow-xl">
                                <div class="text-right">
                                    <p class="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Total Experience</p>
                                    <p class="text-2xl font-black text-ikf-yellow">142<span class="text-sm text-white"> Years</span></p>
                                </div>
                                <i class="fas fa-hourglass-half text-3xl text-slate-700"></i>
                            </div>
                        </div>

                        <!-- Milestone Track -->
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

                        <button onclick="AppNavigation.navigateTo('birthdays')" class="mt-20 w-full bg-slate-900 p-8 rounded-[2.5rem] flex items-center justify-between text-white premium-card group hover:bg-ikf-blue transition-all">
                            <div class="flex items-center gap-6">
                                <div class="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center"><i class="fas fa-cake-candles text-ikf-yellow"></i></div>
                                <div class="text-left">
                                    <p class="text-[10px] font-black uppercase tracking-[0.2em] text-ikf-yellow mb-1">Celebrations</p>
                                    <p class="text-xl font-bold">Upcoming Birthdays</p>
                                </div>
                            </div>
                            <i class="fas fa-arrow-right text-2xl opacity-30 group-hover:opacity-100 group-hover:translate-x-2 transition-all"></i>
                        </button>
                    </div>`;

            case 'birthdays':
                return `
                    <div class="max-w-6xl mx-auto py-10 fade-in">
                        <div class="mb-12 flex items-end justify-between">
                            <div>
                                <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Solar Returns</span>
                                <h1 class="text-4xl md:text-5xl font-extrabold text-ikf-blue tracking-tight">Party Protocol</h1>
                            </div>
                            <div class="hidden md:block">
                                <div class="px-6 py-2 bg-white rounded-full border border-slate-100 shadow-sm text-xs font-bold text-slate-500">
                                    Next Event: <span class="text-ikf-blue">2 Days</span>
                                </div>
                            </div>
                        </div>

                        <!-- Upcoming Birthdays Horizontal Scroll -->
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
                        
                        <!-- Celebration CTA -->
                        <div class="bg-gradient-to-r from-pink-500 to-purple-600 rounded-[3rem] p-12 text-center text-white relative overflow-hidden group cursor-pointer" onclick="alert('Wishing everyone a fantastic year ahead! 🎉')">
                             <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                             <div class="relative z-10">
                                <i class="fas fa-birthday-cake text-5xl mb-6 block animate-bounce"></i>
                                <h3 class="text-3xl font-black mb-2">Send Group Wish</h3>
                                <p class="text-pink-100 text-sm font-medium">Click to confetti blast the office channel.</p>
                             </div>
                        </div>

                        <div class="mt-20 bg-ikf-blue p-12 lg:p-16 rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden premium-card">
                            <div class="z-10 flex-1">
                                <h3 class="text-3xl font-extrabold mb-4">When do we break?</h3>
                                <p class="text-blue-100 max-w-lg">Check out our official holiday calendar for the current year.</p>
                            </div>
                            <button onclick="AppNavigation.navigateTo('holidays')" class="z-10 group bg-ikf-yellow text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-ikf-blue transition-all flex items-center gap-4">
                                Global Holidays <i class="fas fa-calendar-check"></i>
                            </button>
                        </div>
                    </div>`;

            case 'holidays':
                return `
                    <div class="max-w-6xl mx-auto py-10 fade-in">
                        <div class="mb-16">
                            <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Global Calendar</span>
                            <h1 class="text-4xl md:text-5xl font-extrabold text-ikf-blue tracking-tight">Holidays 2025-26</h1>
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

                        <button onclick="AppNavigation.navigateTo('attendance')" class="w-full bg-ikf-blue p-8 rounded-[2.5rem] flex items-center justify-between text-white premium-card group hover:bg-slate-900 transition-all">
                            <div class="flex items-center gap-6">
                                <div class="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center"><i class="fas fa-clock text-ikf-yellow"></i></div>
                                <div class="text-left">
                                    <p class="text-[10px] font-black uppercase tracking-[0.2em] text-ikf-yellow mb-1">Operational Flow</p>
                                    <p class="text-xl font-bold">Attendance & Schedule</p>
                                </div>
                            </div>
                            <i class="fas fa-arrow-right text-2xl opacity-30 group-hover:opacity-100 group-hover:translate-x-2 transition-all"></i>
                        </button>
                    </div>`;

            case 'attendance':
                return `
                    <div class="max-w-6xl mx-auto py-10 fade-in">
                        <div class="mb-16">
                            <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Operation Hours</span>
                            <h1 class="text-4xl md:text-5xl font-extrabold text-ikf-blue tracking-tight">Sync & Flow</h1>
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

                        <button onclick="AppNavigation.navigateTo('policies')" class="mt-16 w-full bg-ikf-yellow p-8 rounded-[2.5rem] flex items-center justify-between text-white premium-card group hover:bg-white hover:text-ikf-blue transition-all">
                            <div class="flex items-center gap-6">
                                <div class="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center"><i class="fas fa-shield-halved text-white"></i></div>
                                <div class="text-left">
                                    <p class="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-1">Final Integration</p>
                                    <p class="text-xl font-bold">HR Policies & Acknowledgement</p>
                                </div>
                            </div>
                            <i class="fas fa-arrow-right text-2xl opacity-30 group-hover:opacity-100 group-hover:translate-x-2 transition-all"></i>
                        </button>
                    </div>`;

            case 'policies':
                return `
                    <div class="max-w-6xl mx-auto py-10 fade-in">
                        <div class="mb-16">
                            <span class="text-ikf-yellow font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Legal Framework</span>
                            <h1 class="text-4xl md:text-5xl font-extrabold text-ikf-blue tracking-tight">The Commitment</h1>
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
    }
};

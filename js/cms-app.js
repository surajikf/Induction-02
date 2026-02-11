/**
 * IKF Induction CMS Application - Minimal Professional Edition
 * Handles content editing, multi-table sync, and media management
 */

const CMSApp = {
    // Configuration
    config: {
        defaultPassword: 'admin123',
        sessionTimeout: 3600000,
        bucketName: 'gallery',
        maxFileSize: 5 * 1024 * 1024,
    },

    // State
    state: {
        isAuthenticated: false,
        currentSection: null,
        contentData: null,
        imagesData: null,
        employeesData: null,
        galleryData: null,
        clientsData: null,
        socialData: null,
        hasUnsavedChanges: false,
        isSyncing: false,
        lastSyncedData: null,
        // Gallery State
        mediaVaultFolder: 'root' // 'root' or specific category name
    },

    // Human-Friendly Metadata for Fields
    metadata: {
        fields: {
            'hero.badge': { title: 'Hero Badge', help: 'Small text above main heading', limit: 30 },
            'hero.title.line1': { title: 'Headline Part 1', help: 'First line of the big welcome text', limit: 40 },
            'hero.title.highlight1': { title: 'Highlight 1', help: 'Yellow accented word in line 1', limit: 20 },
            'hero.title.line2': { title: 'Headline Part 2', help: 'Second line of the big welcome text', limit: 40 },
            'hero.title.highlight2': { title: 'Highlight 2', help: 'Yellow accented word in line 2', limit: 20 },
            'hero.subtitle': { title: 'Welcome Description', help: 'Introduction paragraph below headline', limit: 350 },
            'hero.cta': { title: 'Main Button Label', help: 'Text for the primary action button', limit: 25 },
            'hero.stats.years': { title: 'Year Badge', help: 'Stat shown in the bottom bar', limit: 15 },
            'hero.stats.team': { title: 'Team Badge', help: 'Stat shown in the bottom bar', limit: 15 },

            'intro.badge': { title: 'Intro Badge', help: 'Small label at top of intro section', limit: 30 },
            'intro.title': { title: 'Intro Heading', help: 'Supports HTML tags like <span>', limit: 80 },
            'intro.subtitle': { title: 'Intro Paragraph', help: 'Main introduction text', limit: 400 },
            'intro.mission.title': { title: 'Mission Title', help: 'Heading for the mission card', limit: 40 },
            'intro.mission.content': { title: 'Mission Content', help: 'Body text for mission', limit: 500 },

            'management.badge': { title: 'Leadership Badge', help: 'Tagline at top of leaders page', limit: 30 },
            'management.title': { title: 'Page Title', help: 'Main heading for meeting the team', limit: 50 },
            'management.subtitle': { title: 'Section Vision', help: 'Description of the leadership vision', limit: 400 },

            'clients.badge': { title: 'Clients Badge', help: 'Tagline above title', limit: 30 },
            'clients.title': { title: 'Clients Title', help: 'Supports HTML', limit: 80 },
            'clients.subtitle': { title: 'Clients Subtitle', help: 'Description text', limit: 200 },
            'clients.fallback': { title: 'Clients Fallback', help: 'Text when no clients load', limit: 100 },

            'culture.badge': { title: 'Culture Badge', help: 'Tagline above culture title', limit: 30 },
            'culture.title': { title: 'Culture Heading', help: 'Main title for the culture section', limit: 50 },
            'culture.subtitle': { title: 'Culture Text', help: 'Description of the office vibe and DNA', limit: 400 },

            'social.badge': { title: 'Social Tagline', help: 'Small text above title', limit: 30 },
            'social.bgLogoText': { title: 'Background Watermark', help: 'Large ghost text (e.g. HUB)', limit: 10 },
            'social.title': { title: 'Social Title', help: 'Supports HTML', limit: 80 },
            'social.liveStatus': { title: 'Live Update Note', help: 'Subtitle below main title', limit: 200 },
            'social.updatesTitle': { title: 'Updates Heading', help: 'e.g. Latest Updates', limit: 50 },
            'social.youtubeTitle': { title: 'Youtube Heading', help: 'e.g. Latest Videos', limit: 50 },
            'social.featuredTitle': { title: 'Featured Heading', help: 'e.g. Featured Posts', limit: 50 },
            'social.cta.title': { title: 'Footer CTA Heading', help: 'Heading in dark card', limit: 100 },
            'social.cta.subtitle': { title: 'Footer CTA Description', help: 'Paragraph in dark card', limit: 400 },

            'directory.badge': { title: 'Directory Badge', help: 'Tagline at top', limit: 30 },
            'directory.title': { title: 'Directory Title', help: 'Main heading', limit: 50 },
            'directory.description': { title: 'Directory Intro', help: 'Description text', limit: 200 },
            'directory.filterLabel': { title: 'Filter Label', help: 'Default dropdown option', limit: 30 },
            'directory.searchPlaceholder': { title: 'Search Hint', help: 'Text inside search box', limit: 100 },
            'directory.searchShortcut': { title: 'Shortcut Label', help: 'e.g. CTRL + K', limit: 20 },
            'directory.quickAccessLabel': { title: 'Quick Access Tag', help: 'Label before pills', limit: 30 },

            'philosophy.badge': { title: 'Philosophy Badge', help: 'Tagline at top', limit: 30 },
            'philosophy.title': { title: 'Philosophy Title', help: 'Main heading', limit: 50 },
            'philosophy.subtitle': { title: 'Philosophy Intro', help: 'Description text', limit: 400 },
            'philosophy.pillarPrefix': { title: 'Pillar Prefix', help: 'e.g. Pillar', limit: 20 },
            'philosophy.versionLabel': { title: 'Version Label', help: 'Small footer text', limit: 30 },
            'philosophy.manifesto.title': { title: 'Manifesto Title', help: 'Heading in dark card', limit: 100 },
            'philosophy.manifesto.para1': { title: 'Manifesto Para 1', help: 'Left column text', limit: 500 },
            'philosophy.manifesto.para2': { title: 'Manifesto Para 2', help: 'Right column text', limit: 500 },
            'philosophy.manifesto.years': { title: 'Manifesto Stat 1', help: 'e.g. 25+', limit: 20 },
            'philosophy.manifesto.label1': { title: 'Stat 1 Label', help: 'e.g. Years Legacy', limit: 30 },
            'philosophy.manifesto.partners': { title: 'Manifesto Stat 2', help: 'e.g. 1500+', limit: 20 },
            'philosophy.manifesto.label2': { title: 'Stat 2 Label', help: 'e.g. Global Partners', limit: 30 },

            'mission.badge': { title: 'Mission Badge', help: 'Tagline for section', limit: 30 },
            'mission.title': { title: 'Mission Title', help: 'Main heading', limit: 50 },
            'mission.vision.label': { title: 'Vision Tag', help: 'Small yellow label', limit: 20 },
            'mission.mission.label': { title: 'Mission Tag', help: 'Small yellow label', limit: 20 },
            'mission.valuesLabel': { title: 'Values Badge', help: 'Small footer text', limit: 20 },

            'culture.badge': { title: 'Culture Badge', help: 'Tagline at top', limit: 30 },
            'culture.title': { title: 'Culture Title', help: 'Main heading', limit: 80 },
            'culture.subtitle': { title: 'Culture Intro', help: 'Description text', limit: 400 },
            'culture.collabStatus': { title: 'Collab Status', help: 'Text with check icon', limit: 50 },
            'culture.gallery.cta': { title: 'Gallery Button', help: 'Button text on hover', limit: 30 },

            'referral.badge': { title: 'Referral Badge', help: 'Ambassador protocol label', limit: 30 },
            'referral.title': { title: 'Referral Title', help: 'Main heading', limit: 50 },
            'referral.subtitle': { title: 'Referral Intro', help: 'Description text', limit: 200 },
            'referral.protocolTitle': { title: 'Protocol Heading', help: 'Heading for steps section', limit: 50 },

            'anniversary.badge': { title: 'Legacy Badge', help: 'Tagline for hall of fame', limit: 30 },
            'anniversary.title': { title: 'Anniversary Title', help: 'Main heading', limit: 50 },
            'anniversary.totalExperience': { title: 'Total Exp Counter', help: 'Total years across team', limit: 20 },

            'birthdays.badge': { title: 'Solar Badge', help: 'Signal label for birthdays', limit: 30 },
            'birthdays.title': { title: 'Birthday Title', help: 'Main heading', limit: 50 },
            'birthdays.cta': { title: 'CTA Button', help: 'Label for broadcast wishes', limit: 30 },
            'birthdays.terminal.command': { title: 'Broadcast Command', help: 'Terminal script name', limit: 40 },

            'holidays.badge': { title: 'Holiday Badge', help: 'Global Calendar label', limit: 30 },
            'holidays.title': { title: 'Holiday Title', help: 'Main heading', limit: 50 },
            'holidays.policy.title': { title: 'Policy Title', help: 'Heading for the dark policy card', limit: 60 },
            'holidays.policy.description': { title: 'Policy Description', help: 'Main text for reset protocol', limit: 400 },
            'holidays.policy.label': { title: 'Internal Policy Label', help: 'Small yellow label', limit: 50 },
            'holidays.policy.compensatory': { title: 'Compensatory Note', help: 'Note about Sunday holidays etc.', limit: 200 },

            'attendance.badge': { title: 'Attendance Badge', help: 'Operation hours label', limit: 30 },
            'attendance.title': { title: 'Attendance Title', help: 'Main heading', limit: 50 },

            'policies.badge': { title: 'Policy Badge', help: 'Legal framework label', limit: 30 },
            'policies.title': { title: 'Policy Title', help: 'Main heading', limit: 50 },
            'policies.acknowledgement': { title: 'CTA Label', help: 'Text for acknowledgment button', limit: 30 },

            'philosophy.badge': { title: 'Philosophy Badge', help: 'Tagline at top', limit: 30 },
            'philosophy.title': { title: 'Philosophy Title', help: 'Main heading', limit: 50 },
            'philosophy.subtitle': { title: 'Philosophy Intro', help: 'Description text', limit: 400 },
            'philosophy.pillarPrefix': { title: 'Pillar Prefix', help: 'e.g. Pillar', limit: 20 },
            'philosophy.versionLabel': { title: 'Version Label', help: 'Small footer text', limit: 30 },
            'philosophy.manifesto.title': { title: 'Manifesto Title', help: 'Heading in dark card', limit: 100 },
            'philosophy.manifesto.para1': { title: 'Manifesto Para 1', help: 'Left column text', limit: 500 },
            'philosophy.manifesto.para2': { title: 'Manifesto Para 2', help: 'Right column text', limit: 500 },
            'philosophy.manifesto.years': { title: 'Manifesto Stat 1', help: 'e.g. 25+', limit: 20 },
            'philosophy.manifesto.label1': { title: 'Stat 1 Label', help: 'e.g. Years Legacy', limit: 30 },
            'philosophy.manifesto.partners': { title: 'Manifesto Stat 2', help: 'e.g. 1500+', limit: 20 },
            'philosophy.manifesto.label2': { title: 'Stat 2 Label', help: 'e.g. Global Partners', limit: 30 },

            // Nested / Array item metadata (Generic matching by key suffix)
            'schedule.title': { title: 'Schedule Name', help: 'e.g. Work Week', limit: 30 },
            'schedule.value': { title: 'Schedule Time', help: 'e.g. Mon - Fri', limit: 40 },
            'schedule.note': { title: 'Schedule Note', help: 'Small annotation', limit: 30 },

            'punctuality.title': { title: 'Punctuality Heading', help: 'Card title', limit: 40 },
            'punctuality.description': { title: 'Punctuality Text', help: 'Description', limit: 200 },

            'tiers.title': { title: 'Tier Name', help: 'e.g. Junior Agent', limit: 30 },
            'tiers.experience': { title: 'Exp Requirement', help: 'e.g. 0-2 Years', limit: 30 },
            'tiers.reward': { title: 'Reward Amount', help: 'e.g. ₹5,000', limit: 20 },
            'tiers.label': { title: 'Tier Label', help: 'e.g. Successfully Hired', limit: 30 },

            'stats.value': { title: 'Stat Value', help: 'e.g. 4.8', limit: 10 },
            'stats.label': { title: 'Stat Label', help: 'e.g. Happiness Index', limit: 30 },
            'stats.icon': { title: 'FontAwesome Icon', help: 'e.g. fa-star', limit: 30 },

            'values.title': { title: 'Value Title', help: 'e.g. Growth Mindset', limit: 30 },
            'values.description': { title: 'Value Description', help: 'Short explanation', limit: 100 }
        }
    },

    // Initialization
    init: function () {
        console.log('--- CMS CORE INITIALIZING ---');
        this.checkAuth();
        this.bindEvents();
    },

    bindEvents: function () {
        $('#login-form').on('submit', (e) => {
            e.preventDefault();
            this.login($('#cms-password').val());
        });

        $('#logout-btn').on('click', () => this.logout());
        $('#save-all-btn').on('click', () => this.saveData());
        $('#discard-changes').on('click', () => this.restoreLastSync());
        $('#image-manager-btn').on('click', () => this.openImageManager());
        $('#close-image-manager').on('click', () => this.closeImageManager());
        $('#image-upload-input').on('change', (e) => this.handleImageUpload(e.target));

        // Smart Upload Logic
        $('#upload-folder-select').on('change', (e) => {
            if (e.target.value === '__NEW__') {
                $('#new-folder-input-container').removeClass('hidden');
                $('#new-folder-name').focus();
            } else {
                $('#new-folder-input-container').addClass('hidden');
            }
        });

        // Global key listeners
        $(window).on('beforeunload', (e) => {
            if (this.state.hasUnsavedChanges) {
                return "You have unsaved changes. Are you sure you want to leave?";
            }
        });

        // Prevent ALL accidental form submissions (blocks the ? refresh)
        $(document).on('submit', 'form', (e) => {
            e.preventDefault();
            console.warn('Blocked a standard form submission to prevent state loss.');
            return false;
        });
    },

    // Auth Logic
    checkAuth: function () {
        const session = localStorage.getItem('cms_session_id');
        if (session === 'active') {
            this.state.isAuthenticated = true;
            this.showCMS();
        } else {
            this.showLogin();
        }
    },

    login: function (password) {
        if (password === this.config.defaultPassword) {
            localStorage.setItem('cms_session_id', 'active');
            this.state.isAuthenticated = true;
            this.showCMS();
            this.showToast('Authentication Successful', 'success');
        } else {
            this.showToast('Invalid Access Key', 'error');
        }
    },

    logout: function () {
        if (this.state.hasUnsavedChanges) {
            Swal.fire({
                title: 'Unsaved Progress',
                text: 'You have changes that haven\'t been synced. Exit anyway?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Exit Without Saving',
                confirmButtonColor: '#ef4444'
            }).then((result) => {
                if (result.isConfirmed) this.doLogout();
            });
        } else {
            this.doLogout();
        }
    },

    doLogout: function () {
        localStorage.removeItem('cms_session_id');
        location.reload();
    },

    // UI Orchestration
    showLogin: function () {
        $('#login-screen').removeClass('hidden');
        $('#cms-interface').addClass('hidden');
    },

    showCMS: async function () {
        $('#login-screen').addClass('hidden');
        $('#cms-interface').removeClass('hidden');
        await this.loadData();
        this.renderNavigation();
    },

    // Data Sync
    loadData: async function () {
        try {
            console.log('--- SYNCING WITH CLOUD NODES ---');

            const [contentRes, imagesRes, employeesRes, galleryRes, clientsRes, socialRes] = await Promise.all([
                window.supabaseClient.from('induction_content').select('data').eq('slug', 'main').single(),
                window.supabaseClient.from('image_manifest').select('data').eq('slug', 'main').single(),
                window.supabaseClient.from('employees').select('*'),
                window.supabaseClient.from('gallery').select('*').order('created_at', { ascending: false }),
                window.supabaseClient.from('clients').select('*').order('display_order', { ascending: true }),
                window.supabaseClient.from('social_links').select('*').order('display_order', { ascending: true })
            ]);

            this.state.contentData = contentRes.data?.data || null;
            this.state.imagesData = imagesRes.data?.data || null;
            this.state.employeesData = employeesRes.data || [];
            this.state.galleryData = galleryRes.data || [];
            this.state.clientsData = clientsRes.data || [];
            this.state.socialData = socialRes.data || [];

            console.log(`Loaded ${this.state.employeesData.length} employees`);

            this.state.lastSyncedData = JSON.parse(JSON.stringify(this.state.contentData));

            console.log('Cloud Sync 100%');
            $('#sync-status-dot').removeClass('bg-orange-500').addClass('bg-green-500');
            $('#sync-status-text').text('Cloud Synchronized');
        } catch (err) {
            console.error('Sync failure:', err);
            this.showToast('Cloud Sync Offline', 'error');
        }
    },

    // Navigation (EXACT FRONTEND ORDER)
    renderNavigation: function () {
        const nav = $('#cms-nav');
        nav.empty();

        const menuItems = [
            { id: 'hero', name: 'Home Hero', icon: 'fa-home' },
            { id: 'intro', name: 'Introduction', icon: 'fa-info-circle' },
            { id: 'management', name: 'Management Team', icon: 'fa-user-tie' },

            { id: 'clients', name: 'Major Clients', icon: 'fa-star' },
            { id: 'directory', name: 'Employee Directory', icon: 'fa-address-book' },
            { id: 'philosophy', name: 'IKF Philosophy', icon: 'fa-brain' },
            { id: 'mission', name: 'Mission & Vision', icon: 'fa-flag' },
            { id: 'culture', name: 'Company Culture', icon: 'fa-users' },
            { id: 'gallery', name: 'IKF Gallery', icon: 'fa-images' },
            { id: 'social', name: 'Social Media', icon: 'fa-share-nodes' },
            { id: 'referral', name: 'Referral Policy', icon: 'fa-user-plus' },
            { id: 'anniversary', name: 'Work Anniversaries', icon: 'fa-award' },
            { id: 'birthdays', name: 'Team Birthdays', icon: 'fa-birthday-cake' },
            { id: 'holidays', name: 'Company Holidays', icon: 'fa-calendar-alt' },
            { id: 'attendance', name: 'Schedule & Attendance', icon: 'fa-clock' },
            { id: 'policies', name: 'Policies & Performance', icon: 'fa-file-contract' }
        ];

        menuItems.forEach(item => {
            const el = $(`
                <button data-section="${item.id}" class="nav-item w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 rounded-lg transition-all hover:bg-slate-100 mb-1">
                    <i class="fas ${item.icon} w-5 text-center"></i>
                    <span>${item.name}</span>
                </button>
            `);
            el.on('click', () => this.switchSection(item.id));
            nav.append(el);
        });
    },

    switchSection: function (id) {
        $('.nav-item').removeClass('active');
        $(`.nav-item[data-section="${id}"]`).addClass('active');

        $('#welcome-screen').addClass('hidden');
        $('#content-editor').removeClass('hidden');

        this.state.currentSection = id;
        $('#current-section-title').text($(`.nav-item[data-section="${id}"] span`).text());

        this.renderEditor();
    },

    // Main Content Rendering
    renderEditor: function () {
        const id = this.state.currentSection;
        const container = $('#content-editor');
        container.empty();

        // 1. Specialized Managers for complex tables
        if (id === 'gallery') { return this.renderGalleryManager(); }
        if (id === 'clients') { return this.renderClientsManager(); }
        if (id === 'social') { return this.renderSocialManager(); }
        if (id === 'directory') { return this.renderEmployeeDirectory(); }


        // 2. Standard Content Editor for induction_content JSON
        const data = this.state.contentData[id];
        if (!data) return container.html('<div class="p-10 text-center font-bold text-slate-400">Section schema not localized</div>');

        this.renderFieldsRecursively(id, data, container);
    },

    renderFieldsRecursively: function (path, obj, container) {
        for (const [key, value] of Object.entries(obj)) {
            const fullPath = `${path}.${key}`;

            if (typeof value === 'object' && !Array.isArray(value)) {
                const group = $(`
                    <div class="mb-10 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <div class="px-6 py-4 border-b border-slate-100 bg-slate-50">
                            <h3 class="text-xs font-black text-ikf-blue uppercase tracking-widest">${key.toUpperCase()} GROUP</h3>
                        </div>
                        <div class="p-6 space-y-6"></div>
                    </div>
                `);
                this.renderFieldsRecursively(fullPath, value, group.find('.p-6'));
                container.append(group);
            } else if (Array.isArray(value)) {
                this.renderArrayEditor(fullPath, value, container);
            } else {
                this.renderSingleField(fullPath, value, container);
            }
        }
    },

    renderSingleField: function (path, value, container) {
        const meta = this.metadata.fields[path] || { title: path.split('.').pop(), help: '', limit: 500 };
        const isLong = value.toString().length > 60;

        const field = $(`
            <div class="space-y-2">
                <div class="flex items-center justify-between">
                    <label class="text-xs font-bold text-slate-700 uppercase tracking-wide">${meta.title}</label>
                    <span class="text-[10px] font-bold text-slate-300">LIMIT: ${value.toString().length}/${meta.limit}</span>
                </div>
                ${isLong ?
                `<textarea data-path="${path}" class="admin-input min-h-[120px] resize-y">${value}</textarea>` :
                `<input type="text" data-path="${path}" class="admin-input" value="${this.escapeHtml(value)}">`
            }
                <p class="text-[10px] text-slate-400 leading-tight">${meta.help}</p>
            </div>
        `);

        field.find('.admin-input').on('input', (e) => {
            this.updateValue(path, $(e.target).val());
            this.markDirty();
        });

        container.append(field);
    },

    renderArrayEditor: function (path, array, container) {
        const card = $(`
            <div class="mb-10 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div class="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <h3 class="text-xs font-black text-ikf-blue uppercase tracking-widest">${path.split('.').pop().toUpperCase()} COLLECTION</h3>
                    <button class="text-[10px] font-black uppercase text-ikf-blue hover:text-ikf-yellow">+ Add Entry</button>
                </div>
                <div class="p-6 space-y-4"></div>
            </div>
        `);

        array.forEach((item, index) => {
            const itemPath = `${path}[${index}]`;
            if (typeof item === 'object') {
                const subContainer = $('<div class="p-4 bg-slate-50 border border-slate-100 rounded-lg space-y-4"></div>');
                this.renderFieldsRecursively(itemPath, item, subContainer);
                card.find('.p-6').append(subContainer);
            } else {
                this.renderSingleField(itemPath, item, card.find('.p-6'));
            }
        });

        container.append(card);
    },

    // Table Managers
    renderClientsManager: function () {
        const container = $('#content-editor');
        container.html(`
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h3 class="text-xl font-black text-slate-900">Partner Inventory</h3>
                    <p class="text-xs text-slate-400 font-bold uppercase tracking-widest">Manage logo display and groupings. Drag to Reorder.</p>
                </div>
                <button id="add-client-btn" class="px-5 py-2 bg-ikf-blue text-white text-xs font-bold uppercase rounded-lg hover:bg-slate-900 transition-all">+ Add New Client</button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="clients-list">
                ${this.state.clientsData.map(client => `
                    <div class="bg-white p-4 border border-slate-200 rounded-xl flex items-center gap-4 group hover:shadow-md transition-all cursor-grab active:cursor-grabbing" data-id="${client.id}">
                        <div class="text-slate-300"><i class="fas fa-grip-vertical"></i></div>
                        <img src="${client.logo_url || 'https://via.placeholder.com/100'}" class="w-16 h-16 object-contain rounded bg-slate-50 border p-2">
                        <div class="flex-1">
                            <p class="font-bold text-slate-900">${client.name}</p>
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">${client.category}</p>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="CMSApp.editClient('${client.id}')" class="p-2 text-slate-400 hover:text-ikf-blue"><i class="fas fa-edit"></i></button>
                            <button onclick="CMSApp.deleteClient('${client.id}')" class="p-2 text-slate-400 hover:text-red-500"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `);

        $('#add-client-btn').on('click', () => this.editClient(null));

        // Initialize Sortable
        const list = document.getElementById('clients-list');
        new Sortable(list, {
            animation: 150,
            handle: '.cursor-grab', // Drag handle
            ghostClass: 'bg-slate-100',
            onEnd: async (evt) => {
                // Get new order
                const itemEl = evt.item;
                const newIndex = evt.newIndex;
                const oldIndex = evt.oldIndex;

                if (newIndex === oldIndex) return;

                // Update Local State
                const movedItem = this.state.clientsData.splice(oldIndex, 1)[0];
                this.state.clientsData.splice(newIndex, 0, movedItem);

                // Re-assign display orders based on new index
                const updates = this.state.clientsData.map((client, index) => ({
                    id: client.id,
                    display_order: index
                }));

                // Optimistic UI Update (Already done by Sortable)

                // Persist to Supabase
                try {
                    this.showToast('Updating Order...', 'info');

                    // Update in batches or one-by-one? 
                    // Supabase upsert with array is efficient.
                    // But we only need id and display_order.

                    const { error } = await window.supabaseClient
                        .from('clients')
                        .upsert(updates, { onConflict: 'id' });

                    if (error) throw error;

                    this.showToast('Order Updated', 'success');
                } catch (err) {
                    console.error('Reorder error:', err);
                    this.showToast('Failed to save order', 'error');
                    // Revert state?
                }
            }
        });
    },

    escapeHtml: function (str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },

    /**
     * Generic Image Upload Handler
     */
    handleImageUpload: async function (input, targetInputId, previewId = null) {
        const file = input.files[0];
        if (!file) return;

        // Validation
        if (file.size > this.config.maxFileSize) {
            this.showToast('File too large (Max 5MB)', 'error');
            input.value = '';
            return;
        }

        try {
            this.showToast('Uploading...', 'info');

            // Generate unique path
            const fileExt = file.name.split('.').pop();
            const fileName = `clients/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

            const { data, error } = await window.supabaseClient.storage
                .from(this.config.bucketName)
                .upload(fileName, file);

            if (error) throw error;

            // Get Public URL
            const { data: { publicUrl } } = window.supabaseClient.storage
                .from(this.config.bucketName)
                .getPublicUrl(fileName);

            // Update Input
            const targetInput = document.getElementById(targetInputId);
            if (targetInput) {
                targetInput.value = publicUrl;
                // Trigger change event if needed
                targetInput.dispatchEvent(new Event('change'));
            }

            // Update Preview if ID provided
            if (previewId) {
                const preview = document.getElementById(previewId);
                if (preview) preview.src = publicUrl;
            }

            this.showToast('Upload Complete', 'success');

        } catch (err) {
            console.error('Upload error:', err);
            this.showToast('Upload Failed', 'error');
        }
    },

    editClient: async function (id) {
        const client = id ? this.state.clientsData.find(c => c.id === id) : { name: '', category: 'Development', logo_url: '', website_url: '', display_order: 10 };
        const categories = [...new Set(this.state.clientsData.map(c => c.category || 'Uncategorized'))].sort();

        const { value: formValues } = await Swal.fire({
            title: id ? 'Edit Client' : 'Add New Client',
            html: `
                <div class="text-left space-y-4 pt-4">
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase">Client Name</label>
                        <input id="swal-client-name" class="admin-input mt-1" value="${this.escapeHtml(client.name)}" placeholder="e.g. Acme Corp">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                        <input type="text" id="swal-client-category" class="admin-input mt-1 font-bold" value="${this.escapeHtml(client.category)}" placeholder="Type New or Select Below...">
                        <div class="flex flex-wrap gap-2 mt-2" id="category-tags">
                            ${categories.map(cat =>
                `<span class="px-2 py-1 bg-slate-100 border border-slate-200 rounded-md text-[10px] font-bold text-slate-500 cursor-pointer hover:bg-ikf-blue hover:text-white transition-colors" onclick="document.getElementById('swal-client-category').value = '${this.escapeHtml(cat)}'">${this.escapeHtml(cat)}</span>`
            ).join('')}
                        </div>
                        <p class="text-[9px] text-slate-400 mt-1">Click a tag to auto-fill, or type your own.</p>
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase">Logo</label>
                        <div class="flex gap-4 items-start mt-1">
                            <div class="w-20 h-20 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center p-2 relative group overflow-hidden">
                                <img id="client-logo-preview" src="${client.logo_url || 'https://via.placeholder.com/150?text=LOGO'}" class="w-full h-full object-contain">
                                <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onclick="document.getElementById('swal-client-file').click()">
                                    <i class="fas fa-camera text-white"></i>
                                </div>
                            </div>
                            <div class="flex-1 space-y-2">
                                <div class="flex gap-2">
                                    <input type="text" id="swal-client-logo" class="admin-input flex-1 text-xs" value="${this.escapeHtml(client.logo_url)}" placeholder="Image URL or Upload -->">
                                    <input type="file" id="swal-client-file" class="hidden" accept="image/*" onchange="CMSApp.handleImageUpload(this, 'swal-client-logo', 'client-logo-preview')">
                                    <button type="button" onclick="document.getElementById('swal-client-file').click()" class="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap">
                                        <i class="fas fa-upload"></i> Upload
                                    </button>
                                </div>
                                <p class="text-[9px] text-slate-400">Recommended: PNG/SVG with transparent background.</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase">Website URL</label>
                        <input id="swal-client-url" class="admin-input mt-1" value="${this.escapeHtml(client.website_url)}" placeholder="https://...">
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Save Partner',
            confirmButtonColor: '#0E0057',
            width: '32rem', // Wider modal for better layout
            preConfirm: () => {
                const name = document.getElementById('swal-client-name').value;
                const catInput = document.getElementById('swal-client-category');
                const category = catInput.value.trim(); // Explicitly trim and capture

                if (!name) Swal.showValidationMessage('Client Name is required');
                if (!category) Swal.showValidationMessage('Category is required');

                return {
                    id: id || crypto.randomUUID(),
                    name: name,
                    category: category,
                    logo_url: document.getElementById('swal-client-logo').value,
                    website_url: document.getElementById('swal-client-url').value,
                    display_order: client.display_order ?? 999
                }
            }
        });

        if (formValues) {
            try {
                this.showToast('Saving Partner...', 'info');
                // Ensure ID is passed for both Insert and Update to handle Upsert correctly
                const { error } = await window.supabaseClient
                    .from('clients')
                    .upsert(formValues, { onConflict: 'id' });

                if (error) throw error;
                await this.loadData(); // Re-fetch all data to ensure categories are reflected everywhere
                this.renderClientsManager();
                this.showToast('Partner Saved!', 'success');
            } catch (err) {
                console.error('Save Error:', err);
                Swal.fire('Save Failed', `Could not update client: ${err.message}`, 'error');
            }
        }
    },

    deleteClient: async function (id) {
        const result = await Swal.fire({
            title: 'Delete Client?',
            text: 'This action cannot be undone',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444'
        });

        if (result.isConfirmed) {
            await window.supabaseClient.from('clients').delete().eq('id', id);
            await this.loadData();
            this.renderClientsManager();
            this.showToast('Client Deleted', 'success');
        }
    },

    renderSocialManager: function () {
        const container = $('#content-editor');
        container.html(`
            <div class="mb-8">
                <h3 class="text-xl font-black text-slate-900">Social Connections</h3>
                <p class="text-xs text-slate-400 font-bold uppercase tracking-widest">Live statistics and profile links</p>
            </div>
            <div class="space-y-4">
                ${this.state.socialData.map(link => `
                    <div class="bg-white p-6 border border-slate-200 rounded-xl hover:shadow-md transition-all">
                        <div class="flex items-center gap-4 mb-6 pb-4 border-b border-slate-50">
                            <div class="w-10 h-10 rounded-lg bg-ikf-blue/10 flex items-center justify-center text-ikf-blue">
                                <i class="fab fa-${link.platform} text-xl"></i>
                            </div>
                            <div class="flex-1">
                                <input type="text" onchange="CMSApp.updateSocialField('${link.id}', 'display_name', this.value)" 
                                    class="text-sm font-black text-slate-900 bg-transparent border-none outline-none focus:ring-1 focus:ring-ikf-blue/20 rounded px-2 w-full" 
                                    value="${link.display_name}">
                                <p class="text-[10px] text-slate-400 font-bold uppercase px-2">${link.platform}</p>
                            </div>
                            <div class="flex items-center gap-4">
                                <div class="flex flex-col items-end">
                                    <span class="text-[9px] font-bold text-slate-400 uppercase">Active</span>
                                    <input type="checkbox" ${link.is_active ? 'checked' : ''} onchange="CMSApp.updateSocialField('${link.id}', 'is_active', this.checked)">
                                </div>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label class="text-[10px] font-bold text-slate-500 uppercase">Profile URL</label>
                                <input type="text" onchange="CMSApp.updateSocialField('${link.id}', 'profile_url', this.value)" class="admin-input mt-1" value="${link.profile_url}">
                            </div>
                            <div>
                                <label class="text-[10px] font-bold text-slate-500 uppercase">Followers Label</label>
                                <input type="text" onchange="CMSApp.updateSocialField('${link.id}', 'follower_count', this.value)" class="admin-input mt-1" value="${link.follower_count}">
                            </div>
                            <div>
                                <label class="text-[10px] font-bold text-slate-500 uppercase">Subtext/Desc</label>
                                <input type="text" onchange="CMSApp.updateSocialField('${link.id}', 'description', this.value)" class="admin-input mt-1" value="${link.description}">
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="mt-8 pt-8 border-t border-slate-200">
                <button onclick="CMSApp.saveSocialLinks()" class="w-full py-4 bg-ikf-blue text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg hover:bg-slate-900 transition-all">Save Social Matrix</button>
            </div>
        `);
    },

    updateSocialField: function (id, field, value) {
        const link = this.state.socialData.find(l => l.id === id);
        if (link) {
            link[field] = value;
            this.markDirty();
        }
    },

    saveSocialLinks: async function () {
        try {
            this.showToast('Syncing Social...', 'info');
            for (const link of this.state.socialData) {
                const { error } = await window.supabaseClient
                    .from('social_links')
                    .upsert(link, { onConflict: 'id' });
                if (error) throw error;
            }
            this.state.hasUnsavedChanges = false;
            $('#unsaved-indicator').addClass('hidden');
            this.showToast('Social Matrix Synchronized', 'success');
        } catch (err) {
            this.showToast('Sync Failed', 'error');
        }
    },

    renderEmployeeDirectory: function () {
        const container = $('#content-editor');
        container.html(`
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h3 class="text-xl font-black text-slate-900">Personnel Registry</h3>
                    <p class="text-xs text-slate-400 font-bold uppercase tracking-widest">Master list of all team members</p>
                </div>
                <div class="flex gap-4">
                    <input type="text" id="directory-search" placeholder="Search by name/dept..." class="admin-input w-64 h-10 border-slate-300">
                    <button id="add-employee-btn" class="px-5 py-2 bg-ikf-blue text-white text-xs font-bold uppercase rounded-lg hover:bg-slate-900 transition-all">+ Add Team Member</button>
                </div>
            </div>
            <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table class="w-full text-left">
                    <thead class="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Member</th>
                            <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</th>
                            <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                            <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Info</th>
                            <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Birthday</th>
                            <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Joining</th>
                            <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                            <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50" id="directory-table-body">
                        ${this.state.employeesData.slice(0, 50).map(emp => `
                            <tr class="hover:bg-slate-50/50 transition-colors">
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <img src="${emp.img || 'https://via.placeholder.com/40'}" class="w-10 h-10 rounded-lg object-cover bg-white shadow-sm border border-slate-100">
                                        <p class="font-bold text-slate-900 text-sm whitespace-nowrap">${emp.name}</p>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="px-2 py-1 bg-slate-100 text-[10px] font-black text-slate-500 uppercase rounded">${emp.dept}</span>
                                </td>
                                <td class="px-6 py-4 text-xs font-medium text-slate-600">${emp.role}</td>
                                <td class="px-6 py-4">
                                    <p class="text-[10px] font-bold text-slate-900">${emp.email || '-'}</p>
                                    <p class="text-[9px] text-slate-400 font-bold">${emp.mobile || '-'}</p>
                                </td>
                                <td class="px-6 py-4 text-[10px] font-bold text-slate-500">${emp.dob || '-'}</td>
                                <td class="px-6 py-4 text-[10px] font-bold text-slate-500">${emp.doj || '-'}</td>
                                <td class="px-6 py-4">
                                    ${emp.is_leader ? '<span class="text-[9px] font-bold text-ikf-yellow uppercase">Leadership</span>' : '<span class="text-[9px] font-bold text-slate-300 uppercase">Core Team</span>'}
                                </td>
                                <td class="px-6 py-4 text-right whitespace-nowrap">
                                    <button onclick="CMSApp.editEmployee('${emp.id}')" class="text-slate-400 hover:text-ikf-blue p-2"><i class="fas fa-edit"></i></button>
                                    <button onclick="CMSApp.deleteEmployee('${emp.id}')" class="text-slate-400 hover:text-red-500 p-2"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `);

        $('#directory-search').on('input', (e) => this.filterDirectory(e.target.value));
        $('#add-employee-btn').on('click', () => this.editEmployee(null));
    },

    filterDirectory: function (query) {
        const q = query.toLowerCase();
        const filtered = this.state.employeesData.filter(e =>
            e.name.toLowerCase().includes(q) || e.dept.toLowerCase().includes(q) || e.role.toLowerCase().includes(q)
        );
        this.renderTableBody(filtered.slice(0, 50));
    },

    renderTableBody: function (data) {
        const body = $('#directory-table-body');
        body.empty();
        data.forEach(emp => {
            body.append(`
                <tr class="hover:bg-slate-50/50 transition-colors">
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            <!-- Debug Log: ${console.log('Rendering Employee:', emp.name, 'Img:', emp.img)} -->
                            <img src="${(emp.img && emp.img !== 'null') ? emp.img : 'https://png.pngtree.com/png-vector/20220319/ourmid/pngtree-account-icon-profiles-and-users-vector-info-silhouette-vector-png-image_44982146.jpg'}" class="w-10 h-10 rounded-lg object-cover bg-slate-50 shadow-sm border border-slate-200 p-1">
                            <p class="font-bold text-slate-900 text-sm whitespace-nowrap">${emp.name}</p>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 bg-slate-100 text-[10px] font-black text-slate-500 uppercase rounded">${emp.dept}</span>
                    </td>
                    <td class="px-6 py-4 text-xs font-medium text-slate-600">${emp.role}</td>
                    <td class="px-6 py-4">
                        <p class="text-[10px] font-bold text-slate-900">${emp.email || '-'}</p>
                        <p class="text-[9px] text-slate-400 font-bold">${emp.mobile || '-'}</p>
                    </td>
                    <td class="px-6 py-4 text-[10px] font-bold text-slate-500">${emp.dob || '-'}</td>
                    <td class="px-6 py-4 text-[10px] font-bold text-slate-500">${emp.doj || '-'}</td>
                    <td class="px-6 py-4">
                        ${emp.is_leader ? '<span class="text-[9px] font-bold text-ikf-yellow uppercase">Leadership</span>' : '<span class="text-[9px] font-bold text-slate-300 uppercase">Core Team</span>'}
                    </td>
                    <td class="px-6 py-4 text-right whitespace-nowrap">
                        <button onclick="CMSApp.editEmployee('${emp.id}')" class="text-slate-400 hover:text-ikf-blue p-2"><i class="fas fa-edit"></i></button>
                        <button onclick="CMSApp.deleteEmployee('${emp.id}')" class="text-slate-400 hover:text-red-500 p-2"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `);
        });
    },

    editEmployee: async function (id) {
        const emp = id ? this.state.employeesData.find(e => e.id === id) : { name: '', role: '', dept: 'Development', img: '', is_leader: false };

        const { value: formValues } = await Swal.fire({
            title: id ? 'Modify Identity' : 'Recruit Member',
            html: `
                <div class="text-left space-y-4 pt-4">
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                        <input id="swal-emp-name" class="admin-input mt-1" value="${emp.name}">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-[10px] font-bold text-slate-400 uppercase">Department</label>
                            <input id="swal-emp-dept" class="admin-input mt-1" value="${emp.dept}">
                        </div>
                        <div>
                            <label class="text-[10px] font-bold text-slate-400 uppercase">Role</label>
                            <input id="swal-emp-role" class="admin-input mt-1" value="${emp.role}">
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-[10px] font-bold text-slate-400 uppercase">Birthday (DOB)</label>
                            <input type="date" id="swal-emp-dob" class="admin-input mt-1" value="${emp.dob || ''}">
                        </div>
                        <div>
                            <label class="text-[10px] font-bold text-slate-400 uppercase">Joining Date (DOJ)</label>
                            <input type="date" id="swal-emp-doj" class="admin-input mt-1" value="${emp.doj || ''}">
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
                            <input type="email" id="swal-emp-email" class="admin-input mt-1" value="${emp.email || ''}">
                        </div>
                        <div>
                            <label class="text-[10px] font-bold text-slate-400 uppercase">Mobile Number</label>
                            <input type="tel" id="swal-emp-mobile" class="admin-input mt-1" value="${emp.mobile || ''}">
                        </div>
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-400 uppercase">Image URL/Path</label>
                        <div class="flex gap-2 items-center mt-1">
                            <input type="text" id="swal-emp-img" class="admin-input flex-1" value="${emp.img}">
                            <input type="file" id="swal-emp-file" class="hidden" accept="image/*" onchange="CMSApp.handleImageUpload(this, 'swal-emp-img')">
                            <button type="button" onclick="event.preventDefault(); event.stopPropagation(); document.getElementById('swal-emp-file').click()" class="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2">
                                <i class="fas fa-upload"></i>
                                <span>Upload</span>
                            </button>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 py-2">
                        <input type="checkbox" id="swal-emp-leader" ${emp.is_leader ? 'checked' : ''}>
                        <label for="swal-emp-leader" class="text-xs font-bold text-slate-700 uppercase">Grant Leadership Status</label>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Update Personnel',
            confirmButtonColor: '#0E0057',
            preConfirm: () => {
                try {
                    console.log('--- Attempting to Save Employee Data ---');
                    const popup = Swal.getPopup();

                    const getValue = (selector) => {
                        // Try global ID first
                        let el = document.getElementById(selector);
                        // If not found, try scoped lookup within popup
                        if (!el && popup) el = popup.querySelector(`#${selector}`);

                        if (!el) {
                            console.error(`CRITICAL: Input #${selector} not found during save!`);
                            return '';
                        }
                        return el.value;
                    };

                    const getChecked = (selector) => {
                        let el = document.getElementById(selector);
                        if (!el && popup) el = popup.querySelector(`#${selector}`);
                        return el ? el.checked : false;
                    };

                    const idVal = id || `emp-${Date.now()}`;
                    const nameVal = getValue('swal-emp-name');
                    const deptVal = getValue('swal-emp-dept');
                    const roleVal = getValue('swal-emp-role');
                    const imgVal = getValue('swal-emp-img');
                    const dobVal = getValue('swal-emp-dob');
                    const dojVal = getValue('swal-emp-doj');
                    const emailVal = getValue('swal-emp-email');
                    const mobileVal = getValue('swal-emp-mobile');
                    const isLeaderVal = getChecked('swal-emp-leader');

                    console.log('Captured Values:', { idVal, nameVal, deptVal, roleVal, imgVal, emailVal, mobileVal });

                    if (!nameVal) throw new Error('Name is required');

                    return {
                        id: idVal,
                        name: nameVal,
                        dept: deptVal,
                        role: roleVal,
                        img: imgVal,
                        dob: dobVal || null,
                        doj: dojVal || null,
                        email: emailVal || null,
                        mobile: mobileVal || null,
                        is_leader: isLeaderVal,
                        skills: emp.skills || []
                    };
                } catch (err) {
                    console.error('Save Error in preConfirm:', err);
                    Swal.showValidationMessage(`Save failed: ${err.message}`);
                    return false;
                }
            }
        });

        if (formValues) {
            console.log('--- Sync Authorization Triggered ---');
            try {
                console.log('Final Data Packet:', formValues);
                this.showToast('Committing Personnel Data...', 'info');

                const { error } = await window.supabaseClient
                    .from('employees')
                    .upsert(formValues, { onConflict: 'id' });
                if (error) {
                    console.error('Supabase UPSERT Error:', error);
                    throw error;
                }

                console.log('Supabase Sync Success. Reloading local state...');
                await this.loadData();
                this.renderEmployeeDirectory();
                this.showToast('Employee Profile Authorized', 'success');
            } catch (err) {
                console.error('Personnel Sync Failed:', err);
                this.showToast(`Sync Failure: ${err.message}`, 'error');
            }
        }
    },

    deleteEmployee: async function (id) {
        const emp = this.state.employeesData.find(e => e.id === id);
        if (!emp) return;

        const result = await Swal.fire({
            title: 'Terminate Personnel?',
            text: `Are you sure you want to remove ${emp.name} from the registry?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, Delete Record'
        });

        if (result.isConfirmed) {
            try {
                this.showToast('Deleting Personnel...', 'info');
                const { error } = await window.supabaseClient.from('employees').delete().eq('id', id);
                if (error) throw error;

                await this.loadData();
                this.renderEmployeeDirectory();
                this.showToast('Personnel Record Removed', 'success');
            } catch (err) {
                console.error('Delete Failed:', err);
                this.showToast('Delete Failed', 'error');
            }
        }
    },

    handleImageUpload: async function (fileInput, targetInputId) {
        console.log('--- Handle Image Upload Event Fired ---');
        const files = fileInput.files;
        if (!files || files.length === 0) return;

        console.log(`Processing ${files.length} files...`);
        const btn = $(fileInput).next('button');
        // If the button exists (like in modal), show spinner. 
        // For main upload zone, btn might not be immediate next sibling or might be the trigger button.
        // In the main upload zone, the trigger is separate. We can try to find it or just ignore if null.
        let originalIcon = '';
        if (btn.length) {
            originalIcon = btn.html();
            btn.html('<i class="fas fa-spinner fa-spin"></i>').prop('disabled', true);
        } else {
            // Try to find the trigger button in the upload zone if this is the main input
            if (fileInput.id === 'image-upload-input') {
                const triggerBtn = $('#upload-zone button');
                if (triggerBtn.length) {
                    originalIcon = triggerBtn.html();
                    triggerBtn.html('<i class="fas fa-spinner fa-spin"></i> Processing...').prop('disabled', true);
                }
            }
        }

        let successCount = 0;
        let failCount = 0;

        // Determine Target Folder
        let targetCategory = 'Uploads';
        const folderSelect = $('#upload-folder-select').val();

        if (folderSelect === '__NEW__') {
            const newName = $('#new-folder-name').val().trim();
            if (newName) targetCategory = newName;
        } else if (folderSelect) {
            targetCategory = folderSelect;
        }

        console.log(`Target Category: ${targetCategory}`);

        try {
            // Process all files in parallel
            const uploadPromises = Array.from(files).map(async (file) => {
                try {
                    const fileExt = file.name.split('.').pop();
                    const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
                    // Add random component to avoid collisions
                    const randomStr = Math.random().toString(36).substring(2, 8);
                    const filePath = `${Date.now()}_${randomStr}_${cleanName}.${fileExt}`;

                    console.log(`Starting upload: ${file.name} -> ${filePath}`);
                    const { data, error } = await window.supabaseClient.storage.from('gallery').upload(filePath, file);

                    if (error) throw error;

                    const result = window.supabaseClient.storage.from('gallery').getPublicUrl(filePath);
                    const publicUrl = result.data ? result.data.publicUrl : result.publicUrl;

                    // Sync to gallery table
                    await window.supabaseClient.from('gallery').insert({
                        url: publicUrl,
                        title: file.name,
                        category: targetCategory
                    });

                    successCount++;
                    return publicUrl;
                } catch (err) {
                    console.error(`Failed to upload ${file.name}:`, err);
                    failCount++;
                    return null;
                }
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            const validUrls = uploadedUrls.filter(url => url !== null);

            // If targetInputId is provided (Single mode), update the specific input
            // But only if we have at least one valid URL. 
            // Usually Single mode inputs like logo/avatar don't support 'multiple', so files.length check implies intent.
            if (targetInputId && validUrls.length > 0) {
                let inputField = document.getElementById(targetInputId);
                if (!inputField) {
                    // Sibling fallback
                    inputField = fileInput.parentElement.querySelector('input:not([type="file"])');
                }

                if (inputField) {
                    // Use the first valid URL
                    inputField.value = validUrls[0];
                    inputField.dispatchEvent(new Event('input', { bubbles: true }));
                    inputField.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }

            // Sync Data & Refresh UI if any success
            if (successCount > 0) {
                await this.loadData();

                // Refresh Gallery Manager if active
                if (this.state.currentSection === 'gallery') {
                    this.renderGalleryManager();
                }

                // Refresh Media Vault Grid if open
                if (!$('#image-manager-modal').hasClass('hidden')) {
                    this.renderGalleryGrid();
                }

                this.showToast(`Successfully uploaded ${successCount} items`, 'success');
            }

            if (failCount > 0) {
                this.showToast(`Warning: ${failCount} uploads failed`, 'warning');
            }

        } catch (err) {
            console.error('UPLOAD ERROR:', err);
            this.showToast('Critical Upload Failure', 'error');
        } finally {
            // Restore button state
            if (btn.length && originalIcon) {
                btn.html(originalIcon).prop('disabled', false);
            } else if (fileInput.id === 'image-upload-input') {
                const triggerBtn = $('#upload-zone button');
                if (triggerBtn.length && originalIcon) {
                    triggerBtn.html(originalIcon).prop('disabled', false);
                } else {
                    // Fallback if originalIcon wasn't captured correctly for trigger (rare)
                    $('#upload-zone button').html('Select Media').prop('disabled', false);
                }
            }
            fileInput.value = '';
        }
    },



    renderGalleryManager: function () {
        const container = $('#content-editor');

        // Group by items
        const folders = [...new Set(this.state.galleryData.map(i => i.category))].sort();

        container.html(`
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h3 class="text-xl font-black text-slate-900">Memory Archive</h3>
                    <p class="text-xs text-slate-400 font-bold uppercase tracking-widest">Global image storage bank</p>
                </div>
                <button onclick="CMSApp.openImageManager()" class="px-5 py-2 bg-ikf-blue text-white text-xs font-bold uppercase rounded-lg shadow-md hover:bg-slate-900 transition-all">+ Inject New Media</button>
            </div>
            
            <div class="space-y-12">
                ${folders.map(folder => {
            const images = this.state.galleryData.filter(i => i.category === folder);
            return `
                    <div>
                        <div class="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                             <div class="flex items-center gap-3">
                                <i class="fas fa-folder text-ikf-yellow text-xl"></i>
                                <h4 class="text-lg font-bold text-slate-800">${folder}</h4>
                                <span class="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">${images.length} items</span>
                            </div>
                            <button onclick="CMSApp.deleteFolder('${folder}')" class="text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-widest hover:underline">Delete Folder</button>
                        </div>
                        <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
                            ${images.map(img => `
                                <div class="group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all aspect-square">
                                    <img src="${img.url}" class="w-full h-full object-cover">
                                    <div class="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                                        <button onclick="CMSApp.deleteGalleryImage('${img.id}')" class="w-10 h-10 rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-lg flex items-center justify-center">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                    <div class="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                                        <p class="text-[9px] font-bold text-white truncate text-center">${img.title || 'Untitled'}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    `;
        }).join('')}
            </div>
        `);
    },

    deleteFolder: async function (folderName) {
        const images = this.state.galleryData.filter(i => i.category === folderName);
        if (!images.length) return;

        const result = await Swal.fire({
            title: `Delete '${folderName}'?`,
            text: `This will permanently delete ALL ${images.length} images in this folder from the database and storage.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, Destroy Everything'
        });

        if (result.isConfirmed) {
            this.showToast(`Deleting ${images.length} files...`, 'info');
            // Delete all sequentially (or batch if we refined logic, but sequential is safer for now)
            for (const img of images) {
                await this.deleteFile(img.id, img.url);
            }
            this.showToast('Folder Obliterated', 'success');
        }
    },

    /**
     * Unified deletion logic for both DB and Storage
     */
    deleteFile: async function (id, url) {
        // 1. Extract file path from URL
        // Example: https://.../storage/v1/object/public/gallery/filename.jpg
        const pathPart = url.split('/').pop();
        const filePath = decodeURIComponent(pathPart).trim();

        console.log(`--- Initiating Full Deletion: ${filePath} ---`);

        const result = await Swal.fire({
            title: 'Expunge Media?',
            text: 'This image will be permanently removed from the archive and storage',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, Delete Completely'
        });

        if (result.isConfirmed) {
            try {
                this.showToast('Deleting from Storage...', 'info');

                // 2. Delete from Supabase Storage
                const { error: storageError } = await window.supabaseClient.storage
                    .from(this.config.bucketName)
                    .remove([filePath]);

                if (storageError) {
                    console.warn('Storage deletion failed or file not found:', storageError);
                    // We continue anyway to clean up the DB record
                }

                // 3. Delete from Gallery Table
                const { error: dbError } = await window.supabaseClient
                    .from('gallery')
                    .delete()
                    .eq('id', id);

                if (dbError) throw dbError;

                // 4. Update local state and UI
                await this.loadData();

                if (this.state.currentSection === 'gallery') {
                    this.renderGalleryManager();
                }

                if (!$('#image-manager-modal').hasClass('hidden')) {
                    this.renderGalleryGrid();
                }

                this.showToast('Media Expunged Successfully', 'success');
            } catch (err) {
                console.error('Unified Delete Failed:', err);
                this.showToast('Delete Failed', 'error');
            }
        }
    },

    deleteGalleryImage: async function (id) {
        const img = this.state.galleryData.find(i => i.id === id);
        if (!img) return;
        await this.deleteFile(id, img.url);
    },

    // Media Vault
    openImageManager: function () {
        $('#image-manager-modal').removeClass('hidden');
        this.state.mediaVaultFolder = 'root'; // Reset to root

        // Refresh folder list in dropdown
        const folders = [...new Set(this.state.galleryData.map(i => i.category))].sort();
        const select = $('#upload-folder-select');
        // Keep first two options (Default, New) and append others
        select.find('option:gt(1)').remove();
        folders.forEach(f => {
            if (f !== 'Uploads') select.append(`<option value="${f}">${f}</option>`);
        });

        this.renderGalleryGrid();
    },

    renderGalleryGrid: function () {
        const grid = $('#image-gallery');
        grid.empty();

        // Mode 1: Root View (Show Folders)
        if (this.state.mediaVaultFolder === 'root') {
            const folders = [...new Set(this.state.galleryData.map(i => i.category))].sort();

            // "All" pseudo-folder or just list distinct folders as large clickable cards
            folders.forEach(folder => {
                const count = this.state.galleryData.filter(i => i.category === folder).length;
                const firstImg = this.state.galleryData.find(i => i.category === folder)?.url || '';

                grid.append(`
                    <div onclick="CMSApp.state.mediaVaultFolder = '${folder}'; CMSApp.renderGalleryGrid();" 
                         class="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:shadow-lg transition-all aspect-square group">
                        <div class="relative w-16 h-16 mb-4">
                             <div class="absolute inset-0 bg-ikf-yellow/20 rounded-lg rotate-6 group-hover:rotate-12 transition-transform"></div>
                             <div class="absolute inset-0 bg-ikf-blue/10 rounded-lg -rotate-3 group-hover:-rotate-6 transition-transform"></div>
                             <div class="absolute inset-0 flex items-center justify-center text-ikf-blue">
                                <i class="fas fa-folder text-4xl"></i>
                             </div>
                        </div>
                        <h4 class="font-bold text-slate-800 text-center">${folder}</h4>
                        <p class="text-[10px] font-black text-slate-400 uppercase mt-1">${count} Items</p>
                    </div>
                `);
            });
            return;
        }

        // Mode 2: Folder View
        const images = this.state.galleryData.filter(i => i.category === this.state.mediaVaultFolder);

        // Add "Back" button
        grid.append(`
            <div onclick="CMSApp.state.mediaVaultFolder = 'root'; CMSApp.renderGalleryGrid();" 
                 class="bg-slate-100 border border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 transition-all aspect-square">
                <i class="fas fa-arrow-left text-slate-400 text-2xl mb-2"></i>
                <span class="text-[10px] font-bold text-slate-500 uppercase">Back to Folders</span>
            </div>
        `);

        images.forEach(img => {
            grid.append(`
                <div class="bg-white border border-slate-100 rounded-lg overflow-hidden group relative aspect-square shadow-sm hover:shadow-md transition-all">
                    <img src="${img.url}" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                        <button class="w-full py-1.5 bg-white text-[10px] font-black uppercase rounded hover:bg-ikf-blue hover:text-white transition-all">Select</button>
                        <button onclick="CMSApp.deleteFile('${img.id}', '${img.url}')" class="w-full py-1.5 bg-red-500 text-white text-[10px] font-black uppercase rounded hover:bg-red-600 transition-all">
                            <i class="fas fa-trash-alt mr-1"></i> Delete
                        </button>
                    </div>
                </div>
            `);
        });
    },

    closeImageManager: function () {
        $('#image-manager-modal').addClass('hidden');
    },

    // Logic Utilities
    updateValue: function (path, val) {
        const parts = path.split('.');
        const section = parts[0];
        let obj = this.state.contentData[section];

        for (let i = 1; i < parts.length - 1; i++) {
            const part = parts[i];
            if (part.includes('[')) {
                const name = part.split('[')[0];
                const index = parseInt(part.split('[')[1].replace(']', ''));
                obj = obj[name][index];
            } else {
                obj = obj[part];
            }
        }

        const last = parts[parts.length - 1];
        if (last.includes('[')) {
            const name = last.split('[')[0];
            const index = parseInt(last.split('[')[1].replace(']', ''));
            obj[name][index] = val;
        } else {
            obj[last] = val;
        }
    },

    markDirty: function () {
        this.state.hasUnsavedChanges = true;
        $('#unsaved-indicator').removeClass('hidden');
        $('#save-all-btn').attr('disabled', false);
    },

    saveData: async function () {
        if (this.state.isSyncing) return;

        const btn = $('#save-all-btn');
        const spinner = $('#save-spinner');
        const text = $('#save-text');

        try {
            this.state.isSyncing = true;
            btn.attr('disabled', true);
            spinner.removeClass('hidden');
            text.text('Syncing Cloud...');

            const { error } = await window.supabaseClient
                .from('induction_content')
                .update({
                    data: this.state.contentData,
                    updated_at: new Date().toISOString()
                })
                .eq('slug', 'main');

            if (error) {
                console.error('Supabase Upsert Error:', error);
                throw error;
            }

            this.state.hasUnsavedChanges = false;
            this.state.lastSyncedData = JSON.parse(JSON.stringify(this.state.contentData));
            $('#unsaved-indicator').addClass('hidden');
            this.showToast('Global Synchronization Complete', 'success');
        } catch (err) {
            console.error('Detailed Sync failure:', err);
            this.showToast(`Cloud Rejection: ${err.message || 'Sync Failed'}`, 'error');
        } finally {
            this.state.isSyncing = false;
            spinner.addClass('hidden');
            text.text('Synchronize Changes');
            btn.attr('disabled', false);
        }
    },

    restoreLastSync: function () {
        Swal.fire({
            title: 'Discard Changes?',
            text: 'Rollback current modifications to last cloud state?',
            icon: 'question',
            showCancelButton: true
        }).then(r => {
            if (r.isConfirmed) {
                this.state.contentData = JSON.parse(JSON.stringify(this.state.lastSyncedData));
                this.state.hasUnsavedChanges = false;
                $('#unsaved-indicator').addClass('hidden');
                if (this.state.currentSection) this.renderEditor();
                this.showToast('Local state restored', 'info');
            }
        });
    },

    escapeHtml: function (text) {
        return text ? text.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;") : "";
    },

    showToast: function (msg, type) {
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: type,
            title: msg,
            showConfirmButton: false,
            timer: 3000
        });
    },


};

// Attach to global window for external access
window.CMSApp = CMSApp;

// Initialize on Load
if (typeof document !== 'undefined') {
    $(document).ready(function () {
        if (!window.CMSAppInitialized) {
            window.CMSAppInitialized = true;
            CMSApp.init();
        }
    });
}

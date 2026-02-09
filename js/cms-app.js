/**
 * IKF Induction CMS Application
 * Handles content editing, image management, and data persistence
 */

const CMSApp = {
    // Configuration
    config: {
        defaultPassword: 'admin123',
        contentPath: 'data/content.json',
        imagesPath: 'data/images-manifest.json',
        sessionTimeout: 3600000, // 1 hour
        bucketName: 'gallery',
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedFileTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    },

    // State
    state: {
        isAuthenticated: false,
        currentSection: null,
        contentData: null,
        imagesData: null,
        hasUnsavedChanges: false,
        lastSyncedData: null
    },

    // Human-Friendly Metadata
    metadata: {
        fields: {
            'hero.badge': { title: 'Top Badge', help: 'Small text appearing above the main headline.', limit: 25 },
            'hero.title.line1': { title: 'Heading Line 1', help: 'The first line of the main welcome message.', limit: 40 },
            'hero.title.highlight1': { title: 'Highlighted Word 1', help: 'A word in the first line that will be colored yellow.', limit: 15 },
            'hero.title.line2': { title: 'Heading Line 2', help: 'The second line of the welcome message.', limit: 40 },
            'hero.title.highlight2': { title: 'Highlighted Word 2', help: 'A word in the second line that will be colored yellow.', limit: 15 },
            'hero.subtitle': { title: 'Introduction Text', help: 'The longer paragraph below the main heading.', limit: 300 },
            'hero.cta': { title: 'Button Text', help: 'What the main "Start" button should say.', limit: 20 },
            'hero.stats.years': { title: 'Years of Legacy', help: 'Displayed in the bottom stat bar.', limit: 10 },
            'hero.stats.team': { title: 'Team Size', help: 'Displayed in the bottom stat bar.', limit: 15 },

            'management.badge': { title: 'Section Badge', help: 'Small label at the very top of the page.', limit: 25 },
            'management.title': { title: 'Page Title', help: 'Main large heading for the Leadership page.', limit: 40 },
            'management.subtitle': { title: 'Page Description', help: 'Text explaining the vision of the management.', limit: 300 },
            'management.leaders': { title: 'Management Leaders', help: 'List of team leaders. You can edit their individual profiles here.' },

            'name': { title: 'Full Name', help: 'Official name of the team member.', limit: 40 },
            'role': { title: 'Professional Role', help: 'Job title or designation.', limit: 50 },
            'image': { title: 'Profile Photo Path', help: 'The folder path to their photo (e.g., images/photo.jpg).', limit: 100 },
            'skill': { title: 'Core Expertise', help: 'Single word defining their main skill (e.g., Strategy).', limit: 20 },
            'note': { title: 'Leader Message', help: 'The personalized welcome message from this leader.', limit: 400 },
            'id': { title: 'Internal ID', help: 'Used for system linking. Avoid changing this if possible.', limit: 30 },

            'culture.badge': { title: 'Section Label', help: 'Small text above the Culture title.', limit: 25 },
            'culture.title': { title: 'Culture Heading', help: 'The main title for the Culture section.', limit: 40 },
            'culture.subtitle': { title: 'Culture Description', help: 'Text describing what makes IKF special.', limit: 300 },

            'anniversary.totalExperience': { title: 'Combined Experience', help: 'Sum of years of all team members.', limit: 20 },

            'slug': { title: 'URL Identifier', help: 'Technical name used for website routing.', limit: 50 }
        },
        sections: {
            'hero': 'This controls the very first screen users see. Make it punchy and welcoming!',
            'management': 'Manage the Leadership team profiles, their messages, and specialties.',
            'culture': 'Update IKF culture stats like Happiness Index and party counts.',
            'directory': 'Manage the full list of employees across all departments.'
        }
    },

    // Initialize CMS
    init: function () {
        console.log('Initializing IKF CMS...');
        this.checkAuth();
        this.bindEvents();
    },

    // Authentication
    checkAuth: function () {
        const session = localStorage.getItem('cms_session');
        const sessionTime = localStorage.getItem('cms_session_time');

        if (session && sessionTime) {
            const elapsed = Date.now() - parseInt(sessionTime);
            if (elapsed < this.config.sessionTimeout) {
                this.state.isAuthenticated = true;
                this.showCMS();
                return;
            }
        }

        this.showLogin();
    },

    showLogin: function () {
        $('#login-screen').removeClass('hidden');
        $('#cms-interface').addClass('hidden');
    },

    showCMS: function () {
        $('#login-screen').addClass('hidden');
        $('#cms-interface').removeClass('hidden');
        $('#restore-sync-btn').on('click', () => this.restoreLastSync());

        this.loadData();
    },

    login: async function (password) {
        if (password === this.config.defaultPassword) {
            const btn = $('#login-form button');
            btn.addClass('btn-loading');

            // Artificial delay for premium feel
            await new Promise(r => setTimeout(r, 600));

            localStorage.setItem('cms_session', 'active');
            localStorage.setItem('cms_session_time', Date.now().toString());
            this.state.isAuthenticated = true;
            this.showCMS();

            Swal.fire({
                icon: 'success',
                title: 'Access Granted',
                text: 'Initializing industrial mainframes...',
                timer: 1500,
                showConfirmButton: false,
                background: '#fff',
                color: '#0E0057',
                iconColor: '#22c55e'
            });
            btn.removeClass('btn-loading');
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Access Denied',
                text: 'Invalid security clearance/password',
                confirmButtonColor: '#0E0057'
            });
        }
    },

    logout: async function () {
        if (this.state.hasUnsavedChanges) {
            const result = await Swal.fire({
                title: 'Unsaved Changes!',
                text: "Your data hasn't been synced to the cloud. Logout anyway?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#0E0057',
                confirmButtonText: 'Yes, Logout'
            });
            if (!result.isConfirmed) return;
        }

        localStorage.removeItem('cms_session');
        localStorage.removeItem('cms_session_time');
        this.state.isAuthenticated = false;
        this.showLogin();

        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'info',
            title: 'Logged out successfully',
            showConfirmButton: false,
            timer: 3000
        });
    },

    // Data Management
    loadData: async function () {
        try {
            console.log('Syncing cloud mainframes...');

            const [contentRes, imagesRes, employeesRes, galleryRes] = await Promise.all([
                window.supabaseClient.from('induction_content').select('data').eq('slug', 'main').single(),
                window.supabaseClient.from('image_manifest').select('data').eq('slug', 'main').single(),
                window.supabaseClient.from('employees').select('*'),
                window.supabaseClient.from('gallery').select('*').order('created_at', { ascending: false })
            ]);

            // Load Content
            if (contentRes.data) {
                this.state.contentData = contentRes.data.data;
            } else {
                const response = await fetch(this.config.contentPath);
                this.state.contentData = await response.json();
            }

            // Load Images
            if (imagesRes.data) {
                this.state.imagesData = imagesRes.data.data;
            } else {
                const response = await fetch(this.config.imagesPath);
                this.state.imagesData = await response.json();
            }

            // Load Gallery Data
            this.state.galleryData = galleryRes.data || [];

            // Store Employees for reference
            this.state.employees = employeesRes.data || [];

            // Backup for Restore feature
            this.state.lastSyncedData = JSON.parse(JSON.stringify(this.state.contentData));

            this.renderNavigation();

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Cloud Sync Active',
                showConfirmButton: false,
                timer: 2000,
                background: '#fff',
                color: '#0E0057'
            });
        } catch (error) {
            console.error('Sync error:', error);
            Swal.fire({
                icon: 'warning',
                title: 'Offline Mode',
                text: 'Running in local mode. Changes will be saved to browser only until cloud sync restored.',
                confirmButtonColor: '#0E0057'
            });
        }
    },

    saveData: async function () {
        const btn = $('#save-all-btn');

        // 0. Pre-save Validation
        const validation = this.validateData();
        if (!validation.valid) {
            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                text: validation.message,
                confirmButtonColor: '#0E0057'
            });
            return;
        }

        try {
            btn.addClass('btn-loading');

            Swal.fire({
                title: 'Syncing...',
                text: 'Transmitting data to IKF cloud mainframes',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // 1. Sync Content
            const { error: contentError } = await window.supabaseClient
                .from('induction_content')
                .upsert({
                    slug: 'main',
                    data: this.state.contentData,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'slug' });

            if (contentError) throw contentError;

            // 2. Sync Image Manifest
            const { error: imagesError } = await window.supabaseClient
                .from('image_manifest')
                .upsert({
                    slug: 'main',
                    data: this.state.imagesData,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'slug' });

            if (imagesError) throw imagesError;

            // 3. Sync Employees
            if (this.state.currentSection === 'management') {
                const leaders = this.state.contentData.management.leaders;
                for (const leader of leaders) {
                    await window.supabaseClient
                        .from('employees')
                        .upsert({
                            id: leader.id,
                            name: leader.name,
                            role: leader.role,
                            dept: 'Management',
                            img: leader.image,
                            skills: [leader.skill],
                            is_leader: true
                        }, { onConflict: 'id' });
                }
            }

            // Local Backups
            const contentJSON = JSON.stringify(this.state.contentData, null, 2);
            localStorage.setItem('cms_content_backup', contentJSON);

            // Update Restore Point
            this.state.lastSyncedData = JSON.parse(JSON.stringify(this.state.contentData));
            this.state.hasUnsavedChanges = false;

            Swal.fire({
                icon: 'success',
                title: 'Global Sync Successful',
                text: 'Cloud mainframes updated with 100% integrity.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Save error:', error);
            this.translateError(error);
        } finally {
            btn.removeClass('btn-loading');
        }
    },

    validateData: function () {
        // Simple check for mandatory content fields
        const content = this.state.contentData;

        if (!content.hero?.title?.line1) return { valid: false, message: 'Hero Title (Line 1) cannot be empty.' };
        if (!content.management?.title) return { valid: false, message: 'Management Page Title cannot be empty.' };

        // Check for empty leader names if in management section
        if (this.state.currentSection === 'management') {
            const emptyLeader = content.management.leaders.find(l => !l.name);
            if (emptyLeader) return { valid: false, message: 'All leaders must have a name.' };
        }

        return { valid: true };
    },

    restoreLastSync: async function () {
        if (!this.state.lastSyncedData) return;

        const result = await Swal.fire({
            title: 'Restore Last Sync?',
            text: "This will revert ALL changes to the last time you successfully saved or loaded. You cannot undo this.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0E0057',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Revert'
        });

        if (result.isConfirmed) {
            this.state.contentData = JSON.parse(JSON.stringify(this.state.lastSyncedData));
            this.state.hasUnsavedChanges = false;
            if (this.state.currentSection) {
                this.renderEditor(this.state.currentSection);
            }
            this.showToast('Reverted to last cloud sync', 'success');
        }
    },

    translateError: function (error) {
        let title = 'Sync Failed';
        let message = 'Infrastructure error: ' + error.message;

        if (error.code === 'PGRST116') {
            message = '⚠️ System Node Mismatch. Please refresh and try again.';
        } else if (error.message?.includes('network')) {
            message = '⚠️ Network Interrupted. Check your IKF mainframe connection (Internet).';
        } else if (error.code === '42501') {
            message = '⚠️ Security Permission Denied. Contact IT for cloud access clearance.';
        }

        Swal.fire({
            icon: 'error',
            title: title,
            text: message,
            confirmButtonColor: '#0E0057'
        });
    },

    downloadJSON: function (jsonString, filename) {
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    // Navigation
    renderNavigation: function () {
        const nav = $('#cms-nav');
        nav.empty();

        const sections = [
            { id: 'hero', name: 'Hero Mainframe', icon: 'fa-home' },
            { id: 'intro', name: 'Intro Node', icon: 'fa-info-circle' },
            { id: 'management', name: 'Visionary Team', icon: 'fa-user-tie' },
            { id: 'philosophy', name: 'IKF DNA', icon: 'fa-brain' },
            { id: 'mission', name: 'Strategic Compass', icon: 'fa-flag' },
            { id: 'culture', name: 'System Core', icon: 'fa-users' },
            { id: 'social', name: 'Social Hub', icon: 'fa-share-nodes' },
            { id: 'referral', name: 'Ambassador Protocol', icon: 'fa-user-plus' },
            { id: 'anniversary', name: 'Legacy Pins', icon: 'fa-award' },
            { id: 'birthdays', name: 'Solar Returns', icon: 'fa-birthday-cake' },
            { id: 'holidays', name: 'Sync Resets', icon: 'fa-calendar-alt' },
            { id: 'attendance', name: 'Network Flow', icon: 'fa-clock' },
            { id: 'policies', name: 'Legal Framework', icon: 'fa-file-contract' },
            { id: 'directory', name: 'The Collective', icon: 'fa-address-book' },
            { id: 'gallery', name: 'Memory Archive', icon: 'fa-images' }
        ];

        sections.forEach((section, index) => {
            const btn = $(`
                <button class="cms-nav-btn group w-full px-5 py-4 text-left rounded-2xl transition-all flex items-center justify-between hover:bg-ikf-blue/5 text-slate-500 hover:text-ikf-blue font-bold text-sm mb-1 animate-fade-in"
                    data-section="${section.id}" style="animation-delay: ${index * 30}ms">
                    <div class="flex items-center gap-4">
                        <i class="fas ${section.icon} w-5 text-center group-hover:scale-110 transition-transform"></i>
                        <span>${section.name}</span>
                    </div>
                    <i class="fas fa-chevron-right text-[10px] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"></i>
                </button>
            `);

            btn.on('click', () => this.loadSection(section.id));
            nav.append(btn);
        });
    },

    loadSection: function (sectionId) {
        this.state.currentSection = sectionId;

        // Update active state
        $('.cms-nav-btn').removeClass('bg-ikf-blue text-white shadow-lg shadow-ikf-blue/20 scale-[1.02]').addClass('text-slate-500');
        const activeBtn = $(`.cms-nav-btn[data-section="${sectionId}"]`);
        activeBtn.addClass('bg-ikf-blue text-white shadow-lg shadow-ikf-blue/20 scale-[1.02]').removeClass('text-slate-500');

        // Hide welcome, show editor
        $('#welcome-screen').addClass('hidden');
        $('#content-editor').removeClass('hidden').addClass('fade-in');

        this.renderEditor(sectionId);
    },

    // Content Editor
    renderEditor: function (sectionId) {
        const editor = $('#content-editor');
        editor.empty();

        if (sectionId === 'gallery') {
            this.renderGalleryManager();
            return;
        }

        const sectionData = this.state.contentData[sectionId];
        if (!sectionData) {
            editor.html('<div class="p-8 text-center bg-red-50 text-red-500 rounded-2xl font-bold">Section data not found in cloud registry.</div>');
            return;
        }

        // Section Header
        const sectionGuide = this.metadata.sections[sectionId] || 'Modify the technical nodes below to update the live system.';
        const header = $(`
            <div class="mb-10 animate-fade-in">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ikf-blue/10 border border-ikf-blue/20 text-ikf-blue text-[10px] font-black uppercase tracking-widest mb-4">
                    <span class="w-1.5 h-1.5 bg-ikf-blue rounded-full animate-pulse"></span>
                    Smart Assistant Activated
                </div>
                <h2 class="text-5xl font-black text-slate-900 tracking-tighter mb-3">${this.getSectionTitle(sectionId)}</h2>
                <div class="flex items-start gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl max-w-2xl">
                    <i class="fas fa-lightbulb text-ikf-yellow mt-1"></i>
                    <p class="text-slate-600 font-medium text-sm leading-relaxed">${sectionGuide}</p>
                </div>
            </div>
        `);
        editor.append(header);

        // Render fields based on data structure
        const container = $('<div class="space-y-8 animate-fade-in" style="animation-delay: 100ms"></div>');
        this.renderFields(sectionData, sectionId, container);
        editor.append(container);
    },

    renderFields: function (data, path, container) {
        for (const [key, value] of Object.entries(data)) {
            const fullPath = `${path}.${key}`;

            if (typeof value === 'string') {
                this.renderTextField(key, value, fullPath, container);
            } else if (typeof value === 'number') {
                this.renderNumberField(key, value, fullPath, container);
            } else if (Array.isArray(value)) {
                this.renderArrayField(key, value, fullPath, container);
            } else if (typeof value === 'object') {
                this.renderObjectField(key, value, fullPath, container);
            }
        }
    },

    renderTextField: function (label, value, path, container) {
        const isLong = value.length > 80;
        const helpText = this.getFieldHelp(label, path);
        const limit = this.getFieldLimit(label, path);
        const friendlyLabel = this.formatLabel(label, path);

        const field = $(`
            <div class="mb-8 relative group">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                        <label class="text-xs font-black text-slate-400 uppercase tracking-widest group-focus-within:text-ikf-blue transition-colors">
                            ${friendlyLabel}
                        </label>
                        ${helpText ? `<i class="fas fa-question-circle text-[10px] text-slate-300 cursor-help" title="${helpText}"></i>` : ''}
                    </div>
                    <div class="flex items-center gap-3">
                        ${limit ? `<span class="char-counter text-[10px] font-bold text-slate-300" data-path="${path}">${value.length}/${limit}</span>` : ''}
                        <span class="text-[9px] font-mono text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">TECHNICAL KEY: ${path}</span>
                    </div>
                </div>
                ${isLong ?
                `<textarea class="cms-field w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-ikf-blue/30 focus:ring-4 focus:ring-ikf-blue/5 outline-none transition-all font-semibold text-slate-700 resize-y min-h-[140px] leading-relaxed shadow-sm" data-path="${path}" ${limit ? `maxlength="${limit}"` : ''}>${value}</textarea>` :
                `<input type="text" class="cms-field w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-ikf-blue/30 focus:ring-4 focus:ring-ikf-blue/5 outline-none transition-all font-semibold text-slate-700 shadow-sm" data-path="${path}" value="${this.escapeHtml(value)}" ${limit ? `maxlength="${limit}"` : ''}>`
            }
                <div class="absolute right-4 bottom-4 pointer-events-none opacity-20 group-focus-within:opacity-100 transition-opacity">
                    <i class="fas ${isLong ? 'fa-paragraph' : 'fa-font'} text-sm text-ikf-blue"></i>
                </div>
            </div>
        `);

        field.find('.cms-field').on('input', (e) => {
            const val = $(e.target).val();
            this.state.hasUnsavedChanges = true;
            this.updateValue(path, val);

            // Update counter
            if (limit) {
                const counter = field.find('.char-counter');
                counter.text(`${val.length}/${limit}`);
                if (val.length >= limit) {
                    counter.addClass('text-red-500').removeClass('text-slate-300');
                } else if (val.length >= limit * 0.9) {
                    counter.addClass('text-orange-400').removeClass('text-slate-300 red-500 text-red-500');
                } else {
                    counter.addClass('text-slate-300').removeClass('text-red-500 text-orange-400');
                }
            }
        });

        container.append(field);
    },

    renderNumberField: function (label, value, path, container) {
        const field = $(`
            <div class="mb-6">
                <label class="block text-sm font-bold text-slate-700 mb-2">${this.formatLabel(label)}</label>
                <input type="number" class="cms-field w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-ikf-blue focus:ring-4 focus:ring-ikf-blue/10 outline-none transition-all font-medium" data-path="${path}" value="${value}">
                <p class="text-xs text-slate-400 mt-1">Path: ${path}</p>
            </div>
        `);

        field.find('.cms-field').on('input', () => {
            this.state.hasUnsavedChanges = true;
            this.updateValue(path, parseFloat(field.find('.cms-field').val()));
        });

        container.append(field);
    },

    renderArrayField: function (label, value, path, container) {
        const helpText = this.getFieldHelp(label, path);
        const friendlyLabel = this.formatLabel(label, path);

        const fieldContainer = $(`
            <div class="mb-12 editor-card p-8 animate-fade-in relative overflow-hidden">
                <div class="absolute top-0 right-0 p-4 opacity-5">
                    <i class="fas fa-layer-group text-6xl"></i>
                </div>
                <div class="flex items-center gap-4 mb-4">
                    <h3 class="text-2xl font-black text-slate-800">${friendlyLabel}</h3>
                    <div class="h-px flex-1 bg-slate-100"></div>
                    <span class="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-400">${value.length} items</span>
                </div>
                ${helpText ? `<p class="text-xs font-medium text-slate-400 mb-8 flex items-center gap-2"><i class="fas fa-info-circle text-ikf-blue/30 font-bold"></i> ${helpText}</p>` : ''}
                <div class="grid grid-cols-1 gap-6" id="array-${path.replace(/\./g, '-')}"></div>
            </div>
        `);

        const arrayContainer = fieldContainer.find(`#array-${path.replace(/\./g, '-')}`);

        value.forEach((item, index) => {
            const itemPath = `${path}[${index}]`;
            if (typeof item === 'object') {
                const itemCard = $(`
                    <div class="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-ikf-blue/20 hover:bg-white transition-all group/item">
                        <div class="flex items-center justify-between mb-6">
                            <span class="px-2 py-1 bg-white rounded text-[10px] font-black text-ikf-blue shadow-sm border border-slate-100">NODE ${index + 1}</span>
                            <div class="flex gap-2">
                                <button class="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-100 transition-all opacity-0 group-hover/item:opacity-100">
                                    <i class="fas fa-trash-alt text-xs"></i>
                                </button>
                            </div>
                        </div>
                        <div class="space-y-4"></div>
                    </div>
                `);

                this.renderFields(item, itemPath, itemCard.find('.space-y-4'));
                arrayContainer.append(itemCard);
            } else {
                this.renderTextField(`Item ${index + 1}`, item, itemPath, arrayContainer);
            }
        });

        container.append(fieldContainer);
    },

    renderObjectField: function (label, value, path, container) {
        const fieldContainer = $(`
            <div class="mb-8 p-6 bg-slate-50 rounded-2xl border-2 border-slate-200">
                <h3 class="text-xl font-bold text-ikf-blue mb-4">${this.formatLabel(label)}</h3>
                <div class="space-y-4"></div>
            </div>
        `);

        this.renderFields(value, path, fieldContainer.find('.space-y-4'));
        container.append(fieldContainer);
    },

    updateValue: function (path, value) {
        const parts = path.split('.');
        let obj = this.state.contentData;

        for (let i = 1; i < parts.length - 1; i++) {
            const part = parts[i];
            const arrayMatch = part.match(/(.+)\[(\d+)\]/);

            if (arrayMatch) {
                obj = obj[arrayMatch[1]][parseInt(arrayMatch[2])];
            } else {
                obj = obj[part];
            }
        }

        const lastPart = parts[parts.length - 1];
        const arrayMatch = lastPart.match(/(.+)\[(\d+)\]/);

        if (arrayMatch) {
            obj[arrayMatch[1]][parseInt(arrayMatch[2])] = value;
        } else {
            obj[lastPart] = value;
        }
    },

    // Image Manager
    openImageManager: function () {
        $('#image-manager-modal').removeClass('hidden').addClass('flex fade-in');
        this.renderImageGallery();
    },

    closeImageManager: function () {
        $('#image-manager-modal').addClass('hidden').removeClass('flex');
    },

    renderImageGallery: function () {
        const gallery = $('#image-gallery');
        gallery.empty();

        if (!this.state.imagesData || !this.state.imagesData.images) {
            gallery.html('<p class="col-span-4 text-center text-slate-500">No images found</p>');
            return;
        }

        // Flatten all image categories
        const allImages = [];
        for (const category in this.state.imagesData.images) {
            allImages.push(...this.state.imagesData.images[category]);
        }

        allImages.forEach(image => {
            const card = $(`
                <div class="group relative bg-white rounded-xl border-2 border-slate-100 overflow-hidden hover:border-ikf-blue transition-all cursor-pointer">
                    <div class="aspect-square bg-slate-100 flex items-center justify-center overflow-hidden">
                        <img src="${image.path}" alt="${image.alt}" class="w-full h-full object-cover group-hover:scale-110 transition-transform">
                    </div>
                    <div class="p-3">
                        <p class="text-xs font-bold text-slate-700 truncate">${image.alt}</p>
                        <p class="text-[10px] text-slate-400 truncate">${image.path}</p>
                    </div>
                    <div class="absolute inset-0 bg-ikf-blue/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button class="px-4 py-2 bg-white text-ikf-blue rounded-lg font-bold text-sm hover:bg-ikf-yellow hover:text-white transition-all">
                            <i class="fas fa-edit mr-1"></i> Replace
                        </button>
                    </div>
                </div>
            `);

            gallery.append(card);
        });
    },

    handleImageUpload: function (files) {
        // In a real implementation, this would upload to a server
        // For now, we'll show a preview and update the manifest

        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) {
                this.showToast(`${file.name} is not an image file`, 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                // Add to upload history
                const uploadEntry = {
                    id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    filename: file.name,
                    path: `uploads/${file.name}`,
                    uploadedAt: new Date().toISOString(),
                    size: file.size
                };

                this.state.imagesData.uploadHistory.push(uploadEntry);
                this.state.hasUnsavedChanges = true;

                this.showToast(`${file.name} ready for upload. Save changes to download manifest.`, 'success');
                this.renderImageGallery();
            };

            reader.readAsDataURL(file);
        });
    },

    // Utility Functions
    getSectionTitle: function (sectionId) {
        const titles = {
            hero: 'Hero Section',
            intro: 'Introduction',
            management: 'Management Team',
            philosophy: 'IKF Philosophy',
            mission: 'Mission & Vision',
            culture: 'Company Culture',
            social: 'Social Media',
            referral: 'Referral Policy',
            anniversary: 'Work Anniversaries',
            birthdays: 'Birthdays',
            holidays: 'Company Holidays',
            attendance: 'Schedule & Attendance',
            policies: 'Policies & Performance',
            directory: 'Employee Directory'
        };
        return titles[sectionId] || sectionId;
    },

    formatLabel: function (str, path) {
        // Check metadata first
        const meta = this.metadata.fields[path] || this.metadata.fields[str];
        if (meta) return meta.title;

        return str
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    },

    getFieldHelp: function (str, path) {
        const meta = this.metadata.fields[path] || this.metadata.fields[str];
        return meta ? meta.help : '';
    },

    getFieldLimit: function (str, path) {
        const meta = this.metadata.fields[path] || this.metadata.fields[str];
        return meta ? meta.limit : null;
    },

    escapeHtml: function (text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    },

    showToast: function (message, type = 'info') {
        const icons = {
            success: 'success',
            error: 'error',
            warning: 'warning',
            info: 'info'
        };

        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: icons[type] || 'info',
            title: message,
            showConfirmButton: false,
            timer: 3000,
            background: '#fff',
            color: '#0E0057',
            iconColor: type === 'success' ? '#22c55e' : undefined
        });
    },

    // Event Bindings
    bindEvents: function () {
        // Login form
        $('#login-form').on('submit', (e) => {
            e.preventDefault();
            const password = $('#cms-password').val();
            this.login(password);
        });

        // Logout
        $('#logout-btn').on('click', () => this.logout());

        // Save all changes
        $('#save-all-btn').on('click', () => this.saveData());

        // Preview
        $('#preview-btn').on('click', () => {
            window.open('index.html', '_blank');
        });

        // Image manager
        $('#image-manager-btn').on('click', () => this.openImageManager());
        $('#close-image-manager').on('click', () => this.closeImageManager());

        // Image upload
        const uploadZone = document.getElementById('upload-zone');
        const uploadInput = document.getElementById('image-upload-input');

        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });

        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            this.handleImageUpload(e.dataTransfer.files);
        });

        uploadInput.addEventListener('change', (e) => {
            this.handleImageUpload(e.target.files);
        });

        // Warn before leaving with unsaved changes
        window.addEventListener('beforeunload', (e) => {
            if (this.state.hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    },
    // Gallery Management
    renderGalleryManager: function () {
        const container = $('#content-editor');
        const galleryData = this.state.galleryData || [];
        const categories = [...new Set(galleryData.map(item => item.category))];
        if (categories.length === 0 && !categories.includes('General')) categories.push('General');

        const html = $(`
            <div class="fade-in">
                <div class="flex items-center justify-between mb-12">
                    <div>
                        <h2 class="text-3xl font-black text-ikf-blue">IKF Gallery Archive</h2>
                        <p class="text-slate-500 font-medium">Manage folder-wise event photos and celebrations.</p>
                    </div>
                    <button id="add-photo-btn" class="px-6 py-4 bg-ikf-yellow hover:bg-yellow-600 text-white font-black rounded-2xl transition-all shadow-lg flex items-center gap-3">
                        <i class="fas fa-plus-circle"></i> Add New Photo
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    ${categories.map(cat => {
            const items = galleryData.filter(i => i.category === cat);
            return `
                            <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                                <div class="flex items-center justify-between mb-6">
                                    <div class="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-ikf-blue group-hover:text-white transition-all">
                                        <i class="fas fa-folder-open text-xl"></i>
                                    </div>
                                    <span class="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-400">${items.length} Photos</span>
                                </div>
                                <h3 class="text-xl font-black text-slate-800 mb-6">${cat}</h3>
                                <div class="space-y-3">
                                    ${items.slice(0, 3).map(img => `
                                        <div class="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
                                            <img src="${img.url}" class="w-10 h-10 rounded-lg object-cover">
                                            <div class="flex-1 min-w-0">
                                                <p class="text-[10px] font-bold text-slate-800 truncate">${img.title || 'Untitled Image'}</p>
                                                <p class="text-[9px] text-slate-400 truncate">${img.url}</p>
                                            </div>
                                            <div class="flex gap-1">
                                                <button onclick="CMSApp.showEditPhotoModal('${img.id}')" class="text-slate-300 hover:text-ikf-blue p-2 transition-colors" title="Edit">
                                                    <i class="fas fa-edit text-[10px]"></i>
                                                </button>
                                                <button onclick="CMSApp.deleteGalleryImage('${img.id}')" class="text-slate-300 hover:text-red-500 p-2 transition-colors" title="Delete">
                                                    <i class="fas fa-trash-alt text-[10px]"></i>
                                                </button>
                                            </div>
                                        </div>
                                    `).join('')}
                                    ${items.length > 3 ? `<p class="text-center text-[10px] font-bold text-slate-400 mt-4">+ ${items.length - 3} more photos</p>` : ''}
                                    ${items.length === 0 ? `<p class="text-center text-[10px] font-bold text-slate-300 py-4">No photos in this folder</p>` : ''}
                                </div>
                            </div>
                        `;
        }).join('')
            }
                </div >
            </div >
    `);

        html.find('#add-photo-btn').on('click', () => this.showAddPhotoModal(categories));
        container.append(html);
    },

    showAddPhotoModal: async function (categories) {
        const { value: formValues } = await Swal.fire({
            title: 'Add Gallery Photo',
            html: `
    < div class="text-left space-y-4" >
                    <div class="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center hover:border-ikf-blue/30 transition-all cursor-pointer group" onclick="document.getElementById('swal-file-input').click()">
                        <i class="fas fa-cloud-upload-alt text-3xl text-slate-300 group-hover:text-ikf-blue mb-2 block"></i>
                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Choose File or Drop Here</span>
                        <input type="file" id="swal-file-input" class="hidden" accept="image/*">
                        <p id="file-name-preview" class="text-[10px] font-bold text-ikf-blue mt-2 truncate"></p>
                    </div>
                    <div class="relative">
                        <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-100"></div></div>
                        <div class="relative flex justify-center text-[8px] font-black uppercase text-slate-300 bg-white px-2">OR USE URL</div>
                    </div>
                    <div>
                        <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Image URL</label>
                        <input id="swal-img-url" class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-ikf-blue outline-none transition-all" placeholder="https://example.com/photo.jpg">
                    </div>
                    <div>
                        <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Category / Folder</label>
                        <select id="swal-img-cat" class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-ikf-blue outline-none transition-all">
                            ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
                            <option value="NEW_CAT">+ Create New Folder</option>
                        </select>
                    </div>
                    <div id="new-cat-container" class="hidden">
                        <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">New Folder Name</label>
                        <input id="swal-new-cat" class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-ikf-blue outline-none transition-all" placeholder="e.g. Picnic 2024">
                    </div>
                    <div>
                        <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Image Title (Optional)</label>
                        <input id="swal-img-title" class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-ikf-blue outline-none transition-all" placeholder="e.g. Group Photo">
                    </div>
                </div >
    `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Add to Archive',
            confirmButtonColor: '#0E0057',
            didOpen: () => {
                $('#swal-img-cat').on('change', function () {
                    if ($(this).val() === 'NEW_CAT') {
                        $('#new-cat-container').removeClass('hidden');
                    } else {
                        $('#new-cat-container').addClass('hidden');
                    }
                });

                $('#swal-file-input').on('change', function () {
                    const file = this.files[0];
                    if (file) {
                        $('#file-name-preview').text(`Selected: ${file.name} `);
                        $('#swal-img-url').val('').attr('disabled', true).addClass('opacity-50');
                    }
                });
            },
            preConfirm: () => {
                const file = $('#swal-file-input')[0].files[0];
                const url = $('#swal-img-url').val().trim();
                let cat = $('#swal-img-cat').val();
                const title = $('#swal-img-title').val().trim();

                if (cat === 'NEW_CAT') {
                    cat = $('#swal-new-cat').val().trim();
                    if (!cat) {
                        Swal.showValidationMessage('Please enter a folder name');
                        return false;
                    }
                }

                // Validation: File or URL required
                if (!file && !url) {
                    Swal.showValidationMessage('Please select a file or provide a URL');
                    return false;
                }

                // Validation: Category required
                if (!cat) {
                    Swal.showValidationMessage('Category is required');
                    return false;
                }

                // Validation: File size check
                if (file && file.size > CMSApp.config.maxFileSize) {
                    const sizeMB = (CMSApp.config.maxFileSize / (1024 * 1024)).toFixed(1);
                    Swal.showValidationMessage(`File size exceeds ${sizeMB}MB limit`);
                    return false;
                }

                // Validation: File type check
                if (file && !CMSApp.config.allowedFileTypes.includes(file.type)) {
                    Swal.showValidationMessage('Only image files (JPEG, PNG, GIF, WebP) are allowed');
                    return false;
                }

                // Validation: URL format check
                if (url) {
                    try {
                        new URL(url);
                        if (!url.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i)) {
                            Swal.showValidationMessage('URL must point to a valid image file');
                            return false;
                        }
                    } catch (e) {
                        Swal.showValidationMessage('Please enter a valid URL');
                        return false;
                    }
                }

                return { file, url, category: cat, title };
            }
        });

        if (formValues) {
            this.addGalleryImage(formValues);
        }
    },

    addGalleryImage: async function (data) {
        try {
            Swal.fire({ title: 'Processing Archive...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

            let finalUrl = data.url;

            // Handle File Upload
            if (data.file) {
                Swal.update({ title: 'Uploading to IKF Storage...', text: 'Transmitting visual data...' });
                try {
                    const storageUrl = await this.uploadToStorage(data.file);
                    if (!storageUrl) throw new Error('Storage transmission failed');
                    finalUrl = storageUrl;
                } catch (storageError) {
                    // Handle storage-specific errors
                    throw new Error(this.translateStorageError(storageError));
                }
            }

            // Validate URL accessibility (for external URLs)
            if (data.url && !data.file) {
                Swal.update({ title: 'Validating Image URL...', text: 'Checking accessibility...' });
                const isValid = await this.validateImageUrl(data.url);
                if (!isValid) {
                    throw new Error('Image URL is not accessible or invalid. Please check the URL and try again.');
                }
            }

            Swal.update({ title: 'Linking to Mainframe...', text: 'Syncing with cloud database...' });
            const { error } = await window.supabaseClient
                .from('gallery')
                .insert([{
                    url: finalUrl,
                    category: data.category,
                    title: data.title || null,
                    created_at: new Date().toISOString()
                }]);

            if (error) {
                throw new Error(this.translateDatabaseError(error));
            }

            // Refresh Gallery State with error handling
            Swal.update({ title: 'Refreshing Gallery...', text: 'Loading updated archive...' });
            try {
                const { data: newGallery, error: fetchError } = await window.supabaseClient
                    .from('gallery')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (fetchError) throw fetchError;
                this.state.galleryData = newGallery || [];
                this.renderGalleryManager();
            } catch (refreshError) {
                console.warn('Gallery refresh failed:', refreshError);
                // Photo was added successfully, just refresh failed
                // Force a manual reload
                await this.loadData();
            }

            Swal.fire({
                icon: 'success',
                title: 'Photo Archived',
                html: `< p class="text-sm text-slate-600" > The visual record has been successfully synced to the cloud.</p >
    <p class="text-xs text-slate-400 mt-2">Category: <strong>${data.category}</strong></p>`,
                timer: 3000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Gallery upload error:', error);

            // User-friendly error display
            const errorMessage = error.message || 'An unknown error occurred';
            const isNetworkError = errorMessage.includes('network') || errorMessage.includes('fetch');

            Swal.fire({
                icon: 'error',
                title: isNetworkError ? 'Network Error' : 'Upload Failed',
                html: `
        < p class="text-sm text-slate-700 mb-3" > ${errorMessage}</p >
            ${isNetworkError ? '<p class="text-xs text-slate-500">Please check your internet connection and try again.</p>' : ''}
`,
                confirmButtonText: 'Retry',
                showCancelButton: true,
                cancelButtonText: 'Close',
                confirmButtonColor: '#0E0057'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Retry the upload
                    this.showAddPhotoModal(this.state.galleryData ? [...new Set(this.state.galleryData.map(item => item.category))] : ['General']);
                }
            });
        }
    },

    deleteGalleryImage: async function (id) {
        // Find the image to get details
        const imageToDelete = this.state.galleryData.find(i => i.id === id);
        if (!imageToDelete) {
            Swal.fire({ icon: 'error', title: 'Image Not Found', text: 'The image record could not be located.' });
            return;
        }

        const result = await Swal.fire({
            title: 'Expunge Photo?',
            html: `
    < p class="text-sm text-slate-600 mb-2" > This will permanently remove the record from the cloud archive.</p >
        <div class="bg-slate-50 p-3 rounded-lg mt-3">
            <p class="text-xs text-slate-500"><strong>Category:</strong> ${imageToDelete.category}</p>
            ${imageToDelete.title ? `<p class="text-xs text-slate-500"><strong>Title:</strong> ${imageToDelete.title}</p>` : ''}
        </div>
`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Permanently Delete',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                Swal.fire({ title: 'Deleting...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

                // Check if it's a storage URL and attempt to delete from storage
                const isStorageUrl = imageToDelete.url.includes(this.config.bucketName);
                if (isStorageUrl) {
                    try {
                        // Extract filename from URL
                        const urlParts = imageToDelete.url.split('/');
                        const fileName = urlParts[urlParts.length - 1].split('?')[0];

                        const { error: storageError } = await window.supabaseClient.storage
                            .from(this.config.bucketName)
                            .remove([fileName]);

                        if (storageError) {
                            console.warn('Storage deletion failed:', storageError);
                            // Continue with DB deletion even if storage deletion fails
                        }
                    } catch (storageErr) {
                        console.warn('Storage cleanup error:', storageErr);
                        // Non-critical, continue
                    }
                }

                // Delete from database
                const { error } = await window.supabaseClient.from('gallery').delete().eq('id', id);
                if (error) throw new Error(this.translateDatabaseError(error));

                // Update local state
                this.state.galleryData = this.state.galleryData.filter(i => i.id !== id);
                this.renderGalleryManager();

                Swal.fire({
                    icon: 'success',
                    title: 'Photo Expunged',
                    text: 'The visual record has been permanently removed.',
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (error) {
                console.error('Deletion error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Deletion Failed',
                    html: `
    < p class="text-sm text-slate-700" > ${error.message || 'An error occurred during deletion'}</p >
        <p class="text-xs text-slate-500 mt-2">Please try again or contact support if the issue persists.</p>
`,
                    confirmButtonColor: '#0E0057'
                });
            }
        }
    },

    showEditPhotoModal: async function (imageId) {
        const image = this.state.galleryData.find(img => img.id === imageId);
        if (!image) {
            Swal.fire({ icon: 'error', title: 'Image Not Found', text: 'Could not locate the image record.' });
            return;
        }

        const categories = [...new Set(this.state.galleryData.map(item => item.category))];

        const { value: formValues } = await Swal.fire({
            title: 'Edit Gallery Photo',
            html: `
                <div class="text-left space-y-4">
                    <div class="mb-4">
                        <img src="${image.url}" class="w-full h-32 object-cover rounded-xl border-2 border-slate-100">
                    </div>
                    <div class="p-4 bg-slate-50 rounded-xl">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" id="swal-replace-img" class="rounded">
                            <span class="text-xs font-black text-slate-600 uppercase tracking-widest">Replace Image</span>
                        </label>
                    </div>
                    <div id="replace-img-container" class="hidden space-y-3">
                        <div class="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center hover:border-ikf-blue/30 transition-all cursor-pointer group" onclick="document.getElementById('swal-edit-file-input').click()">
                            <i class="fas fa-cloud-upload-alt text-3xl text-slate-300 group-hover:text-ikf-blue mb-2 block"></i>
                            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Choose New File</span>
                            <input type="file" id="swal-edit-file-input" class="hidden" accept="image/*">
                            <p id="edit-file-name-preview" class="text-[10px] font-bold text-ikf-blue mt-2 truncate"></p>
                        </div>
                        <div class="relative">
                            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-100"></div></div>
                            <div class="relative flex justify-center text-[8px] font-black uppercase text-slate-300 bg-white px-2">OR USE URL</div>
                        </div>
                        <div>
                            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">New Image URL</label>
                            <input id="swal-edit-img-url" class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-ikf-blue outline-none transition-all" placeholder="https://example.com/photo.jpg">
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Image Title</label>
                        <input id="swal-edit-img-title" class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-ikf-blue outline-none transition-all" placeholder="e.g. Group Photo" value="${image.title || ''}">
                    </div>
                    <div>
                        <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Category / Folder</label>
                        <select id="swal-edit-img-cat" class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-ikf-blue outline-none transition-all">
                            ${categories.map(c => `<option value="${c}" ${c === image.category ? 'selected' : ''}>${c}</option>`).join('')}
                            <option value="NEW_CAT">+ Create New Folder</option>
                        </select>
                    </div>
                    <div id="edit-new-cat-container" class="hidden">
                        <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">New Folder Name</label>
                        <input id="swal-edit-new-cat" class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-ikf-blue outline-none transition-all" placeholder="e.g. Picnic 2024">
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Update Photo',
            confirmButtonColor: '#0E0057',
            width: '600px',
            didOpen: () => {
                $('#swal-edit-img-cat').on('change', function () {
                    if ($(this).val() === 'NEW_CAT') {
                        $('#edit-new-cat-container').removeClass('hidden');
                    } else {
                        $('#edit-new-cat-container').addClass('hidden');
                    }
                });

                $('#swal-replace-img').on('change', function () {
                    if ($(this).is(':checked')) {
                        $('#replace-img-container').removeClass('hidden');
                    } else {
                        $('#replace-img-container').addClass('hidden');
                    }
                });

                $('#swal-edit-file-input').on('change', function () {
                    const file = this.files[0];
                    if (file) {
                        $('#edit-file-name-preview').text(`Selected: ${file.name}`);
                        $('#swal-edit-img-url').val('').attr('disabled', true).addClass('opacity-50');
                    }
                });
            },
            preConfirm: () => {
                const replaceImage = $('#swal-replace-img').is(':checked');
                const file = replaceImage ? $('#swal-edit-file-input')[0].files[0] : null;
                const url = replaceImage ? $('#swal-edit-img-url').val().trim() : null;
                let cat = $('#swal-edit-img-cat').val();
                const title = $('#swal-edit-img-title').val().trim();

                if (cat === 'NEW_CAT') {
                    cat = $('#swal-edit-new-cat').val().trim();
                    if (!cat) {
                        Swal.showValidationMessage('Please enter a folder name');
                        return false;
                    }
                }

                if (!cat) {
                    Swal.showValidationMessage('Category is required');
                    return false;
                }

                if (replaceImage && !file && !url) {
                    Swal.showValidationMessage('Please select a file or provide a URL to replace the image');
                    return false;
                }

                if (file && file.size > CMSApp.config.maxFileSize) {
                    const sizeMB = (CMSApp.config.maxFileSize / (1024 * 1024)).toFixed(1);
                    Swal.showValidationMessage(`File size exceeds ${sizeMB}MB limit`);
                    return false;
                }

                if (file && !CMSApp.config.allowedFileTypes.includes(file.type)) {
                    Swal.showValidationMessage('Only image files (JPEG, PNG, GIF, WebP) are allowed');
                    return false;
                }

                if (url) {
                    try {
                        new URL(url);
                        if (!url.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i)) {
                            Swal.showValidationMessage('URL must point to a valid image file');
                            return false;
                        }
                    } catch (e) {
                        Swal.showValidationMessage('Please enter a valid URL');
                        return false;
                    }
                }

                return {
                    id: imageId,
                    replaceImage,
                    file,
                    url,
                    category: cat,
                    title,
                    oldUrl: image.url
                };
            }
        });

        if (formValues) {
            this.updateGalleryImage(formValues);
        }
    },

    updateGalleryImage: async function (data) {
        try {
            Swal.fire({ title: 'Updating Photo...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

            let finalUrl = data.oldUrl;

            if (data.replaceImage) {
                if (data.file) {
                    Swal.update({ title: 'Uploading New Image...', text: 'Transmitting visual data...' });
                    try {
                        const storageUrl = await this.uploadToStorage(data.file);
                        if (!storageUrl) throw new Error('Storage transmission failed');
                        finalUrl = storageUrl;

                        if (data.oldUrl.includes(this.config.bucketName)) {
                            try {
                                const urlParts = data.oldUrl.split('/');
                                const oldFileName = urlParts[urlParts.length - 1].split('?')[0];
                                await window.supabaseClient.storage.from(this.config.bucketName).remove([oldFileName]);
                            } catch (cleanupErr) {
                                console.warn('Old image cleanup failed:', cleanupErr);
                            }
                        }
                    } catch (storageError) {
                        throw new Error(this.translateStorageError(storageError));
                    }
                } else if (data.url) {
                    Swal.update({ title: 'Validating New URL...', text: 'Checking accessibility...' });
                    const isValid = await this.validateImageUrl(data.url);
                    if (!isValid) {
                        throw new Error('New image URL is not accessible or invalid. Please check the URL and try again.');
                    }
                    finalUrl = data.url;
                }
            }

            Swal.update({ title: 'Updating Record...', text: 'Syncing with cloud database...' });
            const { error } = await window.supabaseClient
                .from('gallery')
                .update({
                    url: finalUrl,
                    category: data.category,
                    title: data.title || null
                })
                .eq('id', data.id);

            if (error) {
                throw new Error(this.translateDatabaseError(error));
            }

            Swal.update({ title: 'Refreshing Gallery...', text: 'Loading updated archive...' });
            try {
                const { data: newGallery, error: fetchError } = await window.supabaseClient
                    .from('gallery')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (fetchError) throw fetchError;
                this.state.galleryData = newGallery || [];
                this.renderGalleryManager();
            } catch (refreshError) {
                console.warn('Gallery refresh failed:', refreshError);
                await this.loadData();
            }

            Swal.fire({
                icon: 'success',
                title: 'Photo Updated',
                html: `<p class="text-sm text-slate-600">The visual record has been successfully updated.</p>
                       <p class="text-xs text-slate-400 mt-2">Category: <strong>${data.category}</strong></p>`,
                timer: 3000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Gallery update error:', error);

            const errorMessage = error.message || 'An unknown error occurred';
            const isNetworkError = errorMessage.includes('network') || errorMessage.includes('fetch');

            Swal.fire({
                icon: 'error',
                title: isNetworkError ? 'Network Error' : 'Update Failed',
                html: `
                    <p class="text-sm text-slate-700 mb-3">${errorMessage}</p>
                    ${isNetworkError ? '<p class="text-xs text-slate-500">Please check your internet connection and try again.</p>' : ''}
                `,
                confirmButtonText: 'Close',
                confirmButtonColor: '#0E0057'
            });
        }
    },

    uploadToStorage: async function (file) {
        try {
            // Sanitize filename
            const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
            const fileName = `${Date.now()}_${sanitizedName} `;

            // Upload with retry logic
            let uploadAttempts = 0;
            const maxAttempts = 3;
            let uploadError = null;

            while (uploadAttempts < maxAttempts) {
                try {
                    const { data, error } = await window.supabaseClient.storage
                        .from(this.config.bucketName)
                        .upload(fileName, file, {
                            cacheControl: '3600',
                            upsert: false
                        });

                    if (error) throw error;

                    // Success - get public URL
                    const { data: publicUrlData } = window.supabaseClient.storage
                        .from(this.config.bucketName)
                        .getPublicUrl(fileName);

                    if (!publicUrlData || !publicUrlData.publicUrl) {
                        throw new Error('Failed to generate public URL');
                    }

                    return publicUrlData.publicUrl;
                } catch (err) {
                    uploadError = err;
                    uploadAttempts++;

                    if (uploadAttempts < maxAttempts) {
                        // Wait before retry (exponential backoff)
                        await new Promise(resolve => setTimeout(resolve, 1000 * uploadAttempts));
                    }
                }
            }

            // All attempts failed
            throw uploadError;
        } catch (error) {
            console.error('uploadToStorage Error:', error);

            // Translate error to user-friendly message
            if (error.message.includes('bucket not found') || error.message.includes('Bucket not found')) {
                throw new Error('Storage bucket "gallery" not found. Please create it in your Supabase Dashboard.');
            } else if (error.message.includes('exceeded') || error.message.includes('quota')) {
                throw new Error('Storage quota exceeded. Please upgrade your Supabase plan or free up space.');
            } else if (error.message.includes('duplicate') || error.message.includes('already exists')) {
                throw new Error('A file with this name already exists. Please try again.');
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                throw new Error('Network error during upload. Please check your connection and try again.');
            } else if (error.message.includes('permission') || error.message.includes('policy')) {
                throw new Error('Permission denied. Please check your storage bucket policies.');
            }

            throw error;
        }
    },

    validateImageUrl: async function (url) {
        try {
            // Quick validation
            if (!url || typeof url !== 'string') return false;

            // Check if URL is accessible (HEAD request simulation)
            return new Promise((resolve) => {
                const img = new Image();
                const timeout = setTimeout(() => {
                    resolve(false);
                }, 5000); // 5 second timeout

                img.onload = () => {
                    clearTimeout(timeout);
                    resolve(true);
                };

                img.onerror = () => {
                    clearTimeout(timeout);
                    resolve(false);
                };

                img.src = url;
            });
        } catch (error) {
            console.error('URL validation error:', error);
            return false;
        }
    },

    translateStorageError: function (error) {
        const message = error.message || error.toString();

        if (message.includes('bucket not found')) {
            return 'Storage bucket not configured. Please create the "gallery" bucket in Supabase.';
        } else if (message.includes('exceeded') || message.includes('quota')) {
            return 'Storage quota exceeded. Please upgrade your plan or free up space.';
        } else if (message.includes('permission') || message.includes('policy')) {
            return 'Upload permission denied. Please check your bucket policies.';
        } else if (message.includes('network') || message.includes('fetch')) {
            return 'Network error during upload. Please check your connection.';
        }

        return message;
    },

    translateDatabaseError: function (error) {
        const message = error.message || error.toString();

        if (message.includes('violates row-level security policy')) {
            return 'Permission denied. Please check your database RLS policies.';
        } else if (message.includes('duplicate key')) {
            return 'This record already exists in the database.';
        } else if (message.includes('foreign key')) {
            return 'Database relationship error. Please contact support.';
        } else if (message.includes('network') || message.includes('fetch')) {
            return 'Network error. Please check your connection and try again.';
        }

        return message;
    },
};

// Initialize on document ready
$(document).ready(() => {
    CMSApp.init();
});

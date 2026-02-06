/**
 * IKF Induction CMS Application
 * Handles content editing, image management, and data persistence
 */

const CMSA pp = {
    // Configuration
    config: {
        defaultPassword: 'admin123',
        contentPath: 'data/content.json',
        imagesPath: 'data/images-manifest.json',
        sessionTimeout: 3600000 // 1 hour
    },

    // State
    state: {
        isAuthenticated: false,
        currentSection: null,
        contentData: null,
        imagesData: null,
        hasUnsavedChanges: false
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
        this.loadData();
    },

    login: function (password) {
        if (password === this.config.defaultPassword) {
            localStorage.setItem('cms_session', 'active');
            localStorage.setItem('cms_session_time', Date.now().toString());
            this.state.isAuthenticated = true;
            this.showCMS();
            this.showToast('Login successful!', 'success');
        } else {
            this.showToast('Invalid password', 'error');
        }
    },

    logout: function () {
        if (this.state.hasUnsavedChanges) {
            if (!confirm('You have unsaved changes. Are you sure you want to logout?')) {
                return;
            }
        }

        localStorage.removeItem('cms_session');
        localStorage.removeItem('cms_session_time');
        this.state.isAuthenticated = false;
        this.showLogin();
        this.showToast('Logged out successfully', 'info');
    },

    // Data Management
    loadData: async function () {
        try {
            // Load content data
            const contentResponse = await fetch(this.config.contentPath);
            this.state.contentData = await contentResponse.json();

            // Load images data
            const imagesResponse = await fetch(this.config.imagesPath);
            this.state.imagesData = await imagesResponse.json();

            this.renderNavigation();
            this.showToast('Content loaded successfully', 'success');
        } catch (error) {
            console.error('Error loading data:', error);
            this.showToast('Error loading content data', 'error');
        }
    },

    saveData: function () {
        try {
            // In a real implementation, this would send data to a backend
            // For now, we'll save to localStorage and provide download option

            const contentJSON = JSON.stringify(this.state.contentData, null, 2);
            const imagesJSON = JSON.stringify(this.state.imagesData, null, 2);

            localStorage.setItem('cms_content_backup', contentJSON);
            localStorage.setItem('cms_images_backup', imagesJSON);

            // Create downloadable files
            this.downloadJSON(contentJSON, 'content.json');
            this.downloadJSON(imagesJSON, 'images-manifest.json');

            this.state.hasUnsavedChanges = false;
            this.showToast('Changes saved! Download the JSON files and replace them in the data folder.', 'success');
        } catch (error) {
            console.error('Error saving data:', error);
            this.showToast('Error saving changes', 'error');
        }
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
            { id: 'hero', name: 'Hero Section', icon: 'fa-home' },
            { id: 'intro', name: 'Introduction', icon: 'fa-info-circle' },
            { id: 'management', name: 'Management Team', icon: 'fa-user-tie' },
            { id: 'philosophy', name: 'IKF Philosophy', icon: 'fa-brain' },
            { id: 'mission', name: 'Mission & Vision', icon: 'fa-flag' },
            { id: 'culture', name: 'Company Culture', icon: 'fa-users' },
            { id: 'social', name: 'Social Media', icon: 'fa-share-nodes' },
            { id: 'referral', name: 'Referral Policy', icon: 'fa-user-plus' },
            { id: 'anniversary', name: 'Work Anniversaries', icon: 'fa-award' },
            { id: 'birthdays', name: 'Birthdays', icon: 'fa-birthday-cake' },
            { id: 'holidays', name: 'Company Holidays', icon: 'fa-calendar-alt' },
            { id: 'attendance', name: 'Schedule & Attendance', icon: 'fa-clock' },
            { id: 'policies', name: 'Policies & Performance', icon: 'fa-file-contract' },
            { id: 'directory', name: 'Employee Directory', icon: 'fa-address-book' }
        ];

        sections.forEach(section => {
            const btn = $(`
                <button class="cms-nav-btn w-full px-4 py-3 text-left rounded-xl transition-all flex items-center gap-3 hover:bg-slate-50 text-slate-700 hover:text-ikf-blue font-medium"
                    data-section="${section.id}">
                    <i class="fas ${section.icon} w-5"></i>
                    <span>${section.name}</span>
                </button>
            `);

            btn.on('click', () => this.loadSection(section.id));
            nav.append(btn);
        });
    },

    loadSection: function (sectionId) {
        this.state.currentSection = sectionId;

        // Update active state
        $('.cms-nav-btn').removeClass('bg-ikf-blue text-white').addClass('text-slate-700');
        $(`.cms-nav-btn[data-section="${sectionId}"]`).addClass('bg-ikf-blue text-white').removeClass('text-slate-700');

        // Hide welcome, show editor
        $('#welcome-screen').addClass('hidden');
        $('#content-editor').removeClass('hidden').addClass('fade-in');

        this.renderEditor(sectionId);
    },

    // Content Editor
    renderEditor: function (sectionId) {
        const editor = $('#content-editor');
        editor.empty();

        const sectionData = this.state.contentData[sectionId];
        if (!sectionData) {
            editor.html('<p class="text-red-500">Section data not found</p>');
            return;
        }

        // Section Header
        const header = $(`
            <div class="mb-8 pb-6 border-b-2 border-slate-200">
                <h2 class="text-3xl font-black text-ikf-blue mb-2">${this.getSectionTitle(sectionId)}</h2>
                <p class="text-slate-500 font-medium">Edit the content below and click "Save All Changes" when done.</p>
            </div>
        `);
        editor.append(header);

        // Render fields based on data structure
        this.renderFields(sectionData, sectionId, editor);
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
        const field = $(`
            <div class="mb-6">
                <label class="block text-sm font-bold text-slate-700 mb-2">${this.formatLabel(label)}</label>
                ${value.length > 100 ?
                `<textarea class="cms-field w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-ikf-blue focus:ring-4 focus:ring-ikf-blue/10 outline-none transition-all font-medium resize-y min-h-[120px]" data-path="${path}">${value}</textarea>` :
                `<input type="text" class="cms-field w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-ikf-blue focus:ring-4 focus:ring-ikf-blue/10 outline-none transition-all font-medium" data-path="${path}" value="${this.escapeHtml(value)}">`
            }
                <p class="text-xs text-slate-400 mt-1">Path: ${path}</p>
            </div>
        `);

        field.find('.cms-field').on('input', () => {
            this.state.hasUnsavedChanges = true;
            this.updateValue(path, field.find('.cms-field').val());
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
        const fieldContainer = $(`
            <div class="mb-8 p-6 bg-white rounded-2xl border-2 border-slate-100">
                <h3 class="text-lg font-bold text-slate-800 mb-4">${this.formatLabel(label)}</h3>
                <div class="space-y-4" id="array-${path.replace(/\./g, '-')}"></div>
            </div>
        `);

        const arrayContainer = fieldContainer.find(`#array-${path.replace(/\./g, '-')}`);

        value.forEach((item, index) => {
            const itemPath = `${path}[${index}]`;
            if (typeof item === 'object') {
                const itemCard = $(`
                    <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <h4 class="text-sm font-bold text-slate-700 mb-3">Item ${index + 1}</h4>
                        <div class="space-y-3"></div>
                    </div>
                `);

                this.renderFields(item, itemPath, itemCard.find('.space-y-3'));
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

    formatLabel: function (str) {
        return str
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
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
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        const toast = $(`
            <div class="toast ${colors[type]} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
                <i class="fas ${icons[type]} text-xl"></i>
                <span class="font-medium">${message}</span>
            </div>
        `);

        $('#toast-container').append(toast);

        setTimeout(() => {
            toast.fadeOut(300, function () {
                $(this).remove();
            });
        }, 4000);
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
    }
};

// Initialize on document ready
$(document).ready(() => {
    CMSApp.init();
});

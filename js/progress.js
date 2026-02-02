/**
 * progress.js - Manages completion status and the progress bar
 */

window.AppProgress = {
    totalSections: 15, // Number of items in sidebar
    viewedSections: new Set(),

    init: function () {
        // Hydrate from storage if exists
        const state = window.AppStorage.getState();
        if (state && state.completedSections) {
            this.viewedSections = new Set(state.completedSections);
            this.updateUI();
        }
    },

    /**
     * Mark a section as viewed/read
     * @param {string} sectionId 
     */
    markViewed: function (sectionId) {
        if (!this.viewedSections.has(sectionId)) {
            this.viewedSections.add(sectionId);
            window.AppStorage.completeSection(sectionId);
            this.updateUI();
        }
    },

    /**
     * Update the progress bar and percentage in the header
     */
    updateUI: function () {
        const count = this.viewedSections.size;
        const percentage = Math.round((count / this.totalSections) * 100);

        $('#progress-percentage').text(`${percentage}%`);
        $('#progress-bar').css('width', `${percentage}%`);

        // Update sidebar checkmarks if needed
        this.viewedSections.forEach(id => {
            const $link = $(`.nav-link[data-section="${id}"]`);
            if (!$link.find('.completed-check').length) {
                $link.append('<i class="fas fa-check-circle completed-check text-xs ml-auto text-green-400"></i>');
            }
        });
    },

    /**
     * Check if entire induction is complete
     */
    isFullyComplete: function () {
        return this.viewedSections.size >= this.totalSections;
    }
};

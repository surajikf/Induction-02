/**
 * storage.js - Handles LocalStorage persistence for the Induction App
 */

const IKF_STORAGE_KEY = 'ikf_induction_state';

window.AppStorage = {
    /**
     * Save the entire state to LocalStorage
     * @param {Object} state - { currentSection, completedSections, progress, completed }
     */
    saveState: function(state) {
        try {
            localStorage.setItem(IKF_STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error('Storage Error:', e);
        }
    },

    /**
     * Retrieve the state from LocalStorage
     * @returns {Object|null}
     */
    getState: function() {
        const data = localStorage.getItem(IKF_STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    },

    /**
     * Clear all progress (for debugging or reset)
     */
    clearState: function() {
        localStorage.removeItem(IKF_STORAGE_KEY);
    },

    /**
     * Mark a specific section as completed
     * @param {string} sectionId 
     */
    completeSection: function(sectionId) {
        const state = this.getState() || { completedSections: [] };
        if (!state.completedSections.includes(sectionId)) {
            state.completedSections.push(sectionId);
            this.saveState(state);
            return true;
        }
        return false;
    }
};

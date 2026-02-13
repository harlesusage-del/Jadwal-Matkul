// Main application entry point

import { initDashboard, focusSearch } from './dashboard.js';
import { initCourseDetail, closeCourseDetail, focusNotes } from './courseDetail.js';
import { state } from './state.js';

/**
 * Initialize the application
 */
function init() {
    // Initialize modules
    initDashboard();
    initCourseDetail();
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Log initialization
    console.log('Student OS initialized');
    console.log('Keyboard shortcuts: "/" for search, "N" for notes, "Esc" to close');
}

/**
 * Setup global keyboard shortcuts
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', handleKeyboardShortcut);
}

/**
 * Handle keyboard shortcuts
 */
function handleKeyboardShortcut(event) {
    // Ignore if typing in an input or textarea (except for Esc)
    const isTyping = ['INPUT', 'TEXTAREA'].includes(event.target.tagName);
    
    // "/" - Focus search
    if (event.key === '/' && !isTyping) {
        event.preventDefault();
        focusSearch();
        return;
    }
    
    // "N" or "n" - Focus notes (only when detail view is open)
    if ((event.key === 'N' || event.key === 'n') && !isTyping) {
        const currentView = state.getState().currentView;
        if (currentView === 'detail') {
            event.preventDefault();
            focusNotes();
        }
        return;
    }
    
    // "Escape" - Close detail view
    if (event.key === 'Escape') {
        const currentView = state.getState().currentView;
        if (currentView === 'detail') {
            event.preventDefault();
            closeCourseDetail();
        }
        return;
    }
}

/**
 * Handle visibility change (save notes when tab is hidden)
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        const currentView = state.getState().currentView;
        if (currentView === 'detail') {
            // Notes are auto-saved via debounce, but this ensures final save
            console.log('Tab hidden, notes auto-saved');
        }
    }
});

/**
 * Handle before unload (warn if leaving with unsaved changes)
 * Note: Modern browsers limit what you can display in this message
 */
window.addEventListener('beforeunload', (event) => {
    // We don't need to warn since notes are auto-saved
    // But we could add this if we track unsaved state in the future
});

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export for potential external use
export { state };

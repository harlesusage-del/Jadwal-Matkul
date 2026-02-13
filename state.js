// Application state management

class AppState {
    constructor() {
        this.currentView = 'dashboard'; // 'dashboard' or 'detail'
        this.selectedCourse = null;
        this.searchQuery = '';
        this.scrollPosition = 0;
        this.listeners = new Map();
    }

    /**
     * Subscribe to state changes
     */
    subscribe(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, []);
        }
        this.listeners.get(key).push(callback);
        
        // Return unsubscribe function
        return () => {
            const callbacks = this.listeners.get(key);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        };
    }

    /**
     * Notify listeners of state changes
     */
    notify(key, value) {
        if (this.listeners.has(key)) {
            this.listeners.get(key).forEach(callback => callback(value));
        }
    }

    /**
     * Set current view
     */
    setView(view) {
        this.currentView = view;
        this.notify('view', view);
    }

    /**
     * Select a course
     */
    selectCourse(course) {
        this.selectedCourse = course;
        this.notify('selectedCourse', course);
    }

    /**
     * Set search query
     */
    setSearchQuery(query) {
        this.searchQuery = query;
        this.notify('searchQuery', query);
    }

    /**
     * Save current scroll position
     */
    saveScrollPosition() {
        this.scrollPosition = window.scrollY;
    }

    /**
     * Restore saved scroll position
     */
    restoreScrollPosition() {
        window.scrollTo({
            top: this.scrollPosition,
            behavior: 'smooth'
        });
    }

    /**
     * Get current state
     */
    getState() {
        return {
            currentView: this.currentView,
            selectedCourse: this.selectedCourse,
            searchQuery: this.searchQuery,
            scrollPosition: this.scrollPosition
        };
    }
}

// Create singleton instance
export const state = new AppState();

// Dashboard rendering and interaction logic

import { SCHEDULE_DATA, DAY_ORDER, DAY_NAMES, getCurrentDay, getTotalCredits, searchCourses } from './data.js';
import { state } from './state.js';
import { createDaySection, qs, qsa, setText, debounce } from './ui.js';

let dashboardGrid;
let searchInput;
let creditsDisplay;

/**
 * Initialize dashboard
 */
export function initDashboard() {
    dashboardGrid = qs('#dashboardGrid');
    searchInput = qs('#searchInput');
    creditsDisplay = qs('#totalCredits');
    
    if (!dashboardGrid || !searchInput || !creditsDisplay) {
        console.error('Required dashboard elements not found');
        return;
    }
    
    // Render initial dashboard
    renderDashboard();
    
    // Setup event listeners
    setupEventListeners();
    
    // Display total credits
    displayTotalCredits();
}

/**
 * Render the dashboard
 */
function renderDashboard(data = SCHEDULE_DATA) {
    if (!dashboardGrid) return;
    
    dashboardGrid.innerHTML = '';
    
    const currentDay = getCurrentDay();
    
    DAY_ORDER.forEach(day => {
        const courses = data[day] || [];
        const dayName = DAY_NAMES[day];
        const isToday = day === currentDay;
        
        const section = createDaySection(day, dayName, courses, isToday);
        dashboardGrid.appendChild(section);
    });
    
    // Add click listeners to course cards
    attachCourseCardListeners();
}

/**
 * Attach click listeners to course cards
 */
function attachCourseCardListeners() {
    const cards = qsa('.course-card');
    
    cards.forEach(card => {
        card.addEventListener('click', handleCourseCardClick);
    });
}

/**
 * Handle course card click
 */
function handleCourseCardClick(event) {
    const card = event.currentTarget;
    const courseId = card.dataset.courseId;
    
    if (courseId) {
        // Import courseDetail module dynamically to avoid circular dependencies
        import('./courseDetail.js').then(module => {
            module.openCourseDetail(courseId);
        });
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Search input with debounce
    const debouncedSearch = debounce(handleSearch, 300);
    searchInput.addEventListener('input', debouncedSearch);
    
    // Subscribe to search query changes
    state.subscribe('searchQuery', handleSearchQueryChange);
}

/**
 * Handle search input
 */
function handleSearch(event) {
    const query = event.target.value.trim();
    state.setSearchQuery(query);
}

/**
 * Handle search query change from state
 */
function handleSearchQueryChange(query) {
    const filtered = searchCourses(query);
    renderDashboard(filtered);
    
    // Show empty state if no results
    if (query && Object.keys(filtered).length === 0) {
        showNoResultsMessage(query);
    }
}

/**
 * Show no results message
 */
function showNoResultsMessage(query) {
    if (!dashboardGrid) return;
    
    dashboardGrid.innerHTML = `
        <div class="empty-state" style="padding: 4rem 2rem;">
            <div class="empty-state-icon">🔍</div>
            <div class="empty-state-text">No courses found for "${query}"</div>
            <p style="color: var(--color-text-tertiary); margin-top: 1rem; font-size: 0.875rem;">
                Try searching by course name or lecturer
            </p>
        </div>
    `;
}

/**
 * Display total credits
 */
function displayTotalCredits() {
    if (!creditsDisplay) return;
    
    const total = getTotalCredits();
    setText(creditsDisplay, total.toString());
}

/**
 * Refresh dashboard
 */
export function refreshDashboard() {
    const query = state.getState().searchQuery;
    const filtered = searchCourses(query);
    renderDashboard(filtered);
}

/**
 * Clear search
 */
export function clearSearch() {
    if (searchInput) {
        searchInput.value = '';
        state.setSearchQuery('');
    }
}

/**
 * Focus search input
 */
export function focusSearch() {
    if (searchInput) {
        searchInput.focus();
    }
}

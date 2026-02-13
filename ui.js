// UI utility functions for DOM manipulation

/**
 * Create an element with classes and attributes
 */
export function createElement(tag, className = '', attributes = {}) {
    const element = document.createElement(tag);
    
    if (className) {
        element.className = className;
    }
    
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'textContent') {
            element.textContent = value;
        } else if (key === 'innerHTML') {
            element.innerHTML = value;
        } else {
            element.setAttribute(key, value);
        }
    });
    
    return element;
}

/**
 * Create SVG icon
 */
export function createIcon(type) {
    const icons = {
        clock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>`,
        location: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
        </svg>`,
        user: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>`,
        book: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>`
    };
    
    const span = document.createElement('span');
    span.innerHTML = icons[type] || '';
    return span.firstElementChild;
}

/**
 * Create a course card element
 */
export function createCourseCard(course) {
    const card = createElement('div', 'course-card', {
        'data-course-id': course.id
    });
    
    const header = createElement('div', 'course-header');
    const name = createElement('h3', 'course-name', { textContent: course.name });
    const lecturer = createElement('p', 'course-lecturer', { textContent: course.lecturer });
    
    header.appendChild(name);
    header.appendChild(lecturer);
    
    const details = createElement('div', 'course-details');
    
    const timeItem = createElement('div', 'course-detail-item');
    timeItem.appendChild(createIcon('clock'));
    timeItem.appendChild(createElement('span', '', { textContent: course.time }));
    
    const roomItem = createElement('div', 'course-detail-item');
    roomItem.appendChild(createIcon('location'));
    roomItem.appendChild(createElement('span', '', { textContent: course.room }));
    
    details.appendChild(timeItem);
    details.appendChild(roomItem);
    
    const credits = createElement('div', 'course-credits', {
        textContent: `${course.credits} Credit${course.credits > 1 ? 's' : ''}`
    });
    
    card.appendChild(header);
    card.appendChild(details);
    card.appendChild(credits);
    
    return card;
}

/**
 * Create a day section element
 */
export function createDaySection(day, dayName, courses, isToday = false) {
    const section = createElement('div', 'day-section');
    
    if (isToday) {
        section.classList.add('today');
    }
    
    const header = createElement('div', 'day-header');
    const name = createElement('h2', 'day-name', { textContent: dayName });
    
    header.appendChild(name);
    
    if (isToday) {
        const indicator = createElement('span', 'day-indicator', { textContent: 'Today' });
        header.appendChild(indicator);
    }
    
    section.appendChild(header);
    
    if (courses.length === 0) {
        const empty = createElement('div', 'empty-state');
        empty.innerHTML = `
            <div class="empty-state-icon">📚</div>
            <div class="empty-state-text">No classes scheduled</div>
        `;
        section.appendChild(empty);
    } else {
        const grid = createElement('div', 'courses-grid');
        courses.forEach(course => {
            grid.appendChild(createCourseCard(course));
        });
        section.appendChild(grid);
    }
    
    return section;
}

/**
 * Show element with animation
 */
export function show(element) {
    element.classList.add('active');
}

/**
 * Hide element with animation
 */
export function hide(element) {
    element.classList.remove('active');
}

/**
 * Toggle element visibility
 */
export function toggle(element) {
    element.classList.toggle('active');
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function
 */
export function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Smooth scroll to element
 */
export function scrollToElement(element, offset = 0) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

/**
 * Get computed style value
 */
export function getStyleValue(element, property) {
    return window.getComputedStyle(element).getPropertyValue(property);
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Add event listener with cleanup
 */
export function addListener(element, event, handler, options = {}) {
    element.addEventListener(event, handler, options);
    return () => element.removeEventListener(event, handler, options);
}

/**
 * Query selector with error handling
 */
export function qs(selector, parent = document) {
    const element = parent.querySelector(selector);
    if (!element) {
        console.warn(`Element not found: ${selector}`);
    }
    return element;
}

/**
 * Query selector all
 */
export function qsa(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
}

/**
 * Set text content safely
 */
export function setText(element, text) {
    if (element) {
        element.textContent = text;
    }
}

/**
 * Set HTML content safely
 */
export function setHTML(element, html) {
    if (element) {
        element.innerHTML = html;
    }
}

/**
 * Add class to element
 */
export function addClass(element, className) {
    if (element) {
        element.classList.add(className);
    }
}

/**
 * Remove class from element
 */
export function removeClass(element, className) {
    if (element) {
        element.classList.remove(className);
    }
}

/**
 * Toggle class on element
 */
export function toggleClass(element, className) {
    if (element) {
        element.classList.toggle(className);
    }
}

/**
 * Check if element has class
 */
export function hasClass(element, className) {
    return element ? element.classList.contains(className) : false;
}

/**
 * Get data attribute
 */
export function getData(element, key) {
    return element ? element.dataset[key] : null;
}

/**
 * Set data attribute
 */
export function setData(element, key, value) {
    if (element) {
        element.dataset[key] = value;
    }
}

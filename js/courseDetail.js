// Course detail modal logic

import { findCourseById, DAY_NAMES } from './data.js';
import { state } from './state.js';
import { saveNotes, getNotes, getMetadata, formatTimestamp } from './persistence.js';
import { show, hide, qs, setText, debounce } from './ui.js';

let detailOverlay;
let detailModal;
let detailClose;
let detailTitle;
let detailCredits;
let detailLecturer;
let detailSchedule;
let detailRoom;
let notesEditor;
let wordCount;
let lastSaved;

let currentCourse = null;
let saveTimeout = null;

/**
 * Initialize course detail modal
 */
export function initCourseDetail() {
    detailOverlay = qs('#detailOverlay');
    detailModal = qs('#detailModal');
    detailClose = qs('#detailClose');
    detailTitle = qs('#detailTitle');
    detailCredits = qs('#detailCredits');
    detailLecturer = qs('#detailLecturer');
    detailSchedule = qs('#detailSchedule');
    detailRoom = qs('#detailRoom');
    notesEditor = qs('#notesEditor');
    wordCount = qs('#wordCount');
    lastSaved = qs('#lastSaved');
    
    if (!detailOverlay || !detailModal) {
        console.error('Required detail modal elements not found');
        return;
    }
    
    setupEventListeners();
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Close button
    if (detailClose) {
        detailClose.addEventListener('click', closeCourseDetail);
    }
    
    // Overlay click to close
    if (detailOverlay) {
        detailOverlay.addEventListener('click', (event) => {
            if (event.target === detailOverlay) {
                closeCourseDetail();
            }
        });
    }
    
    // Notes editor with debounced auto-save
    if (notesEditor) {
        const debouncedSave = debounce(handleNotesSave, 1000);
        notesEditor.addEventListener('input', handleNotesInput);
        notesEditor.addEventListener('input', debouncedSave);
    }
}

/**
 * Open course detail modal
 */
export function openCourseDetail(courseId) {
    const course = findCourseById(courseId);
    
    if (!course) {
        console.error('Course not found:', courseId);
        return;
    }
    
    currentCourse = course;
    
    // Save scroll position
    state.saveScrollPosition();
    
    // Update state
    state.setView('detail');
    state.selectCourse(course);
    
    // Populate modal
    populateModal(course);
    
    // Show modal
    show(detailOverlay);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus notes editor after animation
    setTimeout(() => {
        if (notesEditor) {
            notesEditor.focus();
        }
    }, 300);
}

/**
 * Close course detail modal
 */
export function closeCourseDetail() {
    // Save notes before closing
    if (currentCourse && notesEditor) {
        saveCurrentNotes();
    }
    
    // Hide modal
    hide(detailOverlay);
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Update state
    state.setView('dashboard');
    state.selectCourse(null);
    
    // Restore scroll position
    setTimeout(() => {
        state.restoreScrollPosition();
    }, 100);
    
    currentCourse = null;
}

/**
 * Populate modal with course data
 */
function populateModal(course) {
    // Basic info
    setText(detailTitle, course.name);
    setText(detailLecturer, course.lecturer);
    setText(detailRoom, course.room);
    
    // Schedule - find day name from course ID
    const dayKey = course.id.split('-')[0];
    const dayMap = {
        'mon': 'Monday',
        'tue': 'Tuesday',
        'wed': 'Wednesday',
        'thu': 'Thursday',
        'fri': 'Friday'
    };
    const dayName = dayMap[dayKey] || '';
    setText(detailSchedule, `${dayName}, ${course.time}`);
    
    // Credits
    if (detailCredits) {
        const creditsText = detailCredits.querySelector('span');
        if (creditsText) {
            setText(creditsText, `${course.credits} Credit${course.credits > 1 ? 's' : ''}`);
        }
    }
    
    // Load notes
    loadNotes(course.id);
}

/**
 * Load notes from storage
 */
function loadNotes(courseId) {
    if (!notesEditor) return;
    
    const notes = getNotes(courseId);
    notesEditor.value = notes;
    
    // Update word count
    updateWordCount(notes);
    
    // Update last saved timestamp
    const metadata = getMetadata(courseId);
    updateLastSaved(metadata.lastModified);
}

/**
 * Handle notes input
 */
function handleNotesInput(event) {
    const content = event.target.value;
    updateWordCount(content);
}

/**
 * Handle notes save
 */
function handleNotesSave() {
    saveCurrentNotes();
}

/**
 * Save current notes
 */
function saveCurrentNotes() {
    if (!currentCourse || !notesEditor) return;
    
    const content = notesEditor.value;
    const success = saveNotes(currentCourse.id, content);
    
    if (success) {
        const metadata = getMetadata(currentCourse.id);
        updateLastSaved(metadata.lastModified);
    }
}

/**
 * Update word count display
 */
function updateWordCount(text) {
    if (!wordCount) return;
    
    const count = text.trim() ? text.trim().split(/\s+/).filter(w => w.length > 0).length : 0;
    setText(wordCount, `${count} word${count !== 1 ? 's' : ''}`);
}

/**
 * Update last saved timestamp
 */
function updateLastSaved(timestamp) {
    if (!lastSaved) return;
    
    if (timestamp) {
        const formatted = formatTimestamp(timestamp);
        setText(lastSaved, `Saved ${formatted}`);
    } else {
        setText(lastSaved, '');
    }
}

/**
 * Focus notes editor
 */
export function focusNotes() {
    if (notesEditor && state.getState().currentView === 'detail') {
        notesEditor.focus();
    }
}

/**
 * Get current course
 */
export function getCurrentCourse() {
    return currentCourse;
}

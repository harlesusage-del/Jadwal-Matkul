// localStorage abstraction for course notes

const STORAGE_PREFIX = 'student-os:';
const NOTES_KEY = 'notes';
const METADATA_KEY = 'metadata';

/**
 * Generate storage key
 */
function getStorageKey(type, courseId = null) {
    if (courseId) {
        return `${STORAGE_PREFIX}${type}:${courseId}`;
    }
    return `${STORAGE_PREFIX}${type}`;
}

/**
 * Save notes for a course
 */
export function saveNotes(courseId, content) {
    try {
        const key = getStorageKey(NOTES_KEY, courseId);
        localStorage.setItem(key, content);
        
        // Update metadata
        saveMetadata(courseId, {
            lastModified: new Date().toISOString(),
            wordCount: countWords(content)
        });
        
        return true;
    } catch (error) {
        console.error('Failed to save notes:', error);
        return false;
    }
}

/**
 * Get notes for a course
 */
export function getNotes(courseId) {
    try {
        const key = getStorageKey(NOTES_KEY, courseId);
        return localStorage.getItem(key) || '';
    } catch (error) {
        console.error('Failed to get notes:', error);
        return '';
    }
}

/**
 * Save metadata for a course
 */
function saveMetadata(courseId, metadata) {
    try {
        const key = getStorageKey(METADATA_KEY, courseId);
        const existing = getMetadata(courseId);
        const updated = { ...existing, ...metadata };
        localStorage.setItem(key, JSON.stringify(updated));
    } catch (error) {
        console.error('Failed to save metadata:', error);
    }
}

/**
 * Get metadata for a course
 */
export function getMetadata(courseId) {
    try {
        const key = getStorageKey(METADATA_KEY, courseId);
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : {};
    } catch (error) {
        console.error('Failed to get metadata:', error);
        return {};
    }
}

/**
 * Delete notes for a course
 */
export function deleteNotes(courseId) {
    try {
        const notesKey = getStorageKey(NOTES_KEY, courseId);
        const metadataKey = getStorageKey(METADATA_KEY, courseId);
        localStorage.removeItem(notesKey);
        localStorage.removeItem(metadataKey);
        return true;
    } catch (error) {
        console.error('Failed to delete notes:', error);
        return false;
    }
}

/**
 * Get all courses with notes
 */
export function getAllNotedCourses() {
    try {
        const courses = [];
        const prefix = getStorageKey(NOTES_KEY);
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefix)) {
                const courseId = key.replace(prefix + ':', '');
                courses.push(courseId);
            }
        }
        
        return courses;
    } catch (error) {
        console.error('Failed to get noted courses:', error);
        return [];
    }
}

/**
 * Count words in text
 */
function countWords(text) {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(isoString) {
    if (!isoString) return '';
    
    try {
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    } catch (error) {
        return '';
    }
}

/**
 * Export all notes as JSON
 */
export function exportAllNotes() {
    const courses = getAllNotedCourses();
    const data = {};
    
    courses.forEach(courseId => {
        data[courseId] = {
            notes: getNotes(courseId),
            metadata: getMetadata(courseId)
        };
    });
    
    return data;
}

/**
 * Calculate total storage usage
 */
export function getStorageSize() {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
            const value = localStorage.getItem(key);
            total += key.length + (value ? value.length : 0);
        }
    }
    return total;
}

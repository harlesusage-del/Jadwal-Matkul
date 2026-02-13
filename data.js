// Course schedule data for 2025/2026 Even Semester, Class A

export const SCHEDULE_DATA = {
    monday: [
        {
            id: 'mon-sejarah-memori',
            name: 'Sejarah dan Memori',
            time: '13:00–15:30',
            room: 'FAH 4.17',
            lecturer: 'Ilyas, M.Hum',
            credits: 3
        }
    ],
    tuesday: [
        {
            id: 'tue-sejarah-gender',
            name: 'Sejarah Gender',
            time: '07:30–09:10',
            room: 'FAH 4.10',
            lecturer: 'Dr. Hj. Tati Hartimah, MA',
            credits: 2
        },
        {
            id: 'tue-sejarah-publik',
            name: 'Sejarah Publik',
            time: '10:01–12:40',
            room: 'FAH 4.16',
            lecturer: 'Prof. Drs. H. Amirul Hadi, M.A., Ph.D.',
            credits: 3
        }
    ],
    wednesday: [
        {
            id: 'wed-naskah-islam',
            name: 'Naskah-Naskah Islam Nusantara',
            time: '13:00–16:20',
            room: 'FAH 4.15',
            lecturer: 'Saiful Umam, M.A., Ph.D.',
            credits: 4
        }
    ],
    thursday: [
        {
            id: 'thu-sejarah-keseharian',
            name: 'Sejarah Keseharian',
            time: '07:30–09:10',
            room: 'FAH 4.16',
            lecturer: 'Dr. Awalia Rahma, MA',
            credits: 2
        },
        {
            id: 'thu-sejarah-digital',
            name: 'Sejarah Digital',
            time: '13:00–14:40',
            room: 'FAH 4.10',
            lecturer: 'Faizal Arifin M.Hum',
            credits: 2
        }
    ],
    friday: []
};

export const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

export const DAY_NAMES = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday'
};

/**
 * Get all courses across all days
 */
export function getAllCourses() {
    return Object.values(SCHEDULE_DATA).flat();
}

/**
 * Calculate total credits for the semester
 */
export function getTotalCredits() {
    return getAllCourses().reduce((sum, course) => sum + course.credits, 0);
}

/**
 * Get current day of week (0 = Sunday, 1 = Monday, etc.)
 */
export function getCurrentDay() {
    const day = new Date().getDay();
    const dayMap = {
        1: 'monday',
        2: 'tuesday',
        3: 'wednesday',
        4: 'thursday',
        5: 'friday'
    };
    return dayMap[day] || null;
}

/**
 * Find a course by its ID
 */
export function findCourseById(id) {
    return getAllCourses().find(course => course.id === id);
}

/**
 * Search courses by name or lecturer
 */
export function searchCourses(query) {
    if (!query) return SCHEDULE_DATA;
    
    const lowerQuery = query.toLowerCase();
    const filtered = {};
    
    DAY_ORDER.forEach(day => {
        const courses = SCHEDULE_DATA[day].filter(course => 
            course.name.toLowerCase().includes(lowerQuery) ||
            course.lecturer.toLowerCase().includes(lowerQuery)
        );
        
        if (courses.length > 0) {
            filtered[day] = courses;
        }
    });
    
    return filtered;
}

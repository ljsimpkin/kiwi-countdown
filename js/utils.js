// Utility functions

// Linear interpolation
function lerp(start, end, t) {
    return start + (end - start) * t;
}

// Easing function - ease in-out
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Easing function - ease in
function easeInQuad(t) {
    return t * t;
}

// Clamp value between min and max
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// Format date to datetime-local input format
function formatDateTimeLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Get adaptive frame rate based on time remaining
function getUpdateFrequency(timeRemaining) {
    if (timeRemaining < 60000) return 60;        // < 1 min: 60 FPS
    if (timeRemaining < 3600000) return 10;      // < 1 hour: 10 FPS
    if (timeRemaining < 86400000) return 2;      // < 1 day: 2 FPS
    return 1;                                     // > 1 day: 1 FPS
}

// Smart time formatting based on duration

class TimeFormatter {
    static format(milliseconds) {
        if (milliseconds <= 0) {
            return "Time's up!";
        }

        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        // Days remaining
        if (days > 0) {
            const remainingHours = hours % 24;
            const remainingMinutes = minutes % 60;

            if (days > 1) {
                return `${days}d ${remainingHours}h`;
            } else {
                return `${days}d ${remainingHours}h ${remainingMinutes}m`;
            }
        }

        // Hours remaining
        if (hours > 0) {
            const remainingMinutes = minutes % 60;
            const remainingSeconds = seconds % 60;

            if (hours > 1) {
                return `${hours}h ${remainingMinutes}m`;
            } else {
                return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
            }
        }

        // Minutes remaining
        if (minutes > 0) {
            const remainingSeconds = seconds % 60;
            return `${minutes}m ${remainingSeconds}s`;
        }

        // Seconds only
        return `${seconds}s`;
    }

    static formatCompact(milliseconds) {
        if (milliseconds <= 0) {
            return "00:00";
        }

        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days}d ${hours % 24}h`;
        }

        if (hours > 0) {
            const mm = String(minutes % 60).padStart(2, '0');
            return `${hours}:${mm}`;
        }

        const mm = String(minutes).padStart(2, '0');
        const ss = String(seconds % 60).padStart(2, '0');
        return `${mm}:${ss}`;
    }
}

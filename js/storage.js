// LocalStorage persistence

class Storage {
    static STORAGE_KEY = 'kiwiTimerData';

    static save(targetDate) {
        try {
            const data = {
                targetDate: targetDate.toISOString(),
                startDate: new Date().toISOString()
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    }

    static load() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (!data) return null;

            const parsed = JSON.parse(data);
            const targetDate = new Date(parsed.targetDate);

            // Check if target date is in the past
            if (targetDate <= new Date()) {
                this.clear();
                return null;
            }

            return {
                targetDate: targetDate,
                startDate: new Date(parsed.startDate)
            };
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
            return null;
        }
    }

    static clear() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
        } catch (error) {
            console.error('Failed to clear localStorage:', error);
        }
    }

    static hasActiveTimer() {
        const data = this.load();
        return data !== null;
    }
}

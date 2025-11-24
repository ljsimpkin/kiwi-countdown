// Countdown Timer with target date

class CountdownTimer {
    constructor(targetDate, startDate = null) {
        this.targetDate = new Date(targetDate);
        this.startDate = startDate ? new Date(startDate) : new Date();
        this.totalDuration = this.targetDate - this.startDate;
        this.isPaused = false;
        this.pausedAt = null;
        this.pausedDuration = 0;
    }

    getTimeRemaining() {
        if (this.isPaused && this.pausedAt) {
            return Math.max(0, this.targetDate - this.pausedAt);
        }
        return Math.max(0, this.targetDate - new Date());
    }

    getPercentageComplete() {
        if (this.totalDuration <= 0) return 1;

        let currentTime;
        if (this.isPaused && this.pausedAt) {
            currentTime = this.pausedAt;
        } else {
            currentTime = new Date();
        }

        const elapsed = currentTime - this.startDate;
        return Math.min(1, Math.max(0, elapsed / this.totalDuration));
    }

    isComplete() {
        return new Date() >= this.targetDate && !this.isPaused;
    }

    pause() {
        if (!this.isPaused) {
            this.isPaused = true;
            this.pausedAt = new Date();
        }
    }

    resume() {
        if (this.isPaused && this.pausedAt) {
            const pauseDuration = new Date() - this.pausedAt;
            this.targetDate = new Date(this.targetDate.getTime() + pauseDuration);
            this.isPaused = false;
            this.pausedAt = null;
        }
    }

    getTotalDuration() {
        return this.totalDuration;
    }

    getTargetDate() {
        return this.targetDate;
    }
}

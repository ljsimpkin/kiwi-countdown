// Main application logic

class KiwiTimerApp {
    constructor() {
        this.canvas = document.getElementById('kiwiCanvas');
        this.timeDisplay = document.getElementById('timeDisplay');
        this.targetDateTimeInput = document.getElementById('targetDateTime');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');

        this.renderer = new Renderer(this.canvas);
        this.timer = null;
        this.animationFrameId = null;
        this.isRunning = false;

        this.lastUpdateTime = 0;
        this.targetFrameRate = 60;

        this.init();
    }

    init() {
        this.setupEventListeners();

        // Check for URL parameters first, before loading saved timer
        const urlDate = this.parseURLParameters();
        if (urlDate) {
            this.targetDateTimeInput.value = formatDateTimeLocal(urlDate);
            this.startTimer();
        } else {
            this.loadSavedTimer();
        }

        this.setupQuickPresets();

        // Start render loop
        this.animate();
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startTimer());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.resetBtn.addEventListener('click', () => this.resetTimer());

        // Handle window resize
        window.addEventListener('resize', () => {
            this.renderer.resize();
        });

        // Set default datetime to 5 minutes from now
        const defaultDate = new Date();
        defaultDate.setMinutes(defaultDate.getMinutes() + 5);
        this.targetDateTimeInput.value = formatDateTimeLocal(defaultDate);
    }

    parseURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);

        // Support multiple parameter names for flexibility
        const dateParam = urlParams.get('date') || urlParams.get('target') || urlParams.get('time');

        if (!dateParam) {
            return null;
        }

        try {
            // Try parsing as ISO date first
            let targetDate = new Date(dateParam);

            // If ISO parsing fails, try custom formats
            if (isNaN(targetDate.getTime())) {
                targetDate = this.parseCustomDateFormat(dateParam);
            }

            // Validate the date
            if (isNaN(targetDate.getTime())) {
                console.error('Invalid date in URL parameter:', dateParam);
                return null;
            }

            // Check if date is in the future
            if (targetDate <= new Date()) {
                console.error('Date in URL parameter is in the past:', dateParam);
                return null;
            }

            return targetDate;
        } catch (error) {
            console.error('Error parsing date from URL:', error);
            return null;
        }
    }

    parseCustomDateFormat(dateString) {
        // Handle natural language dates
        // Examples: "6:30am 3rd december", "december 3 6:30am", "2025-12-03 06:30"

        const now = new Date();
        let year = now.getFullYear();
        let month = null;
        let day = null;
        let hours = null;
        let minutes = 0;

        // Month names mapping
        const monthNames = {
            'january': 0, 'jan': 0,
            'february': 1, 'feb': 1,
            'march': 2, 'mar': 2,
            'april': 3, 'apr': 3,
            'may': 4,
            'june': 5, 'jun': 5,
            'july': 6, 'jul': 6,
            'august': 7, 'aug': 7,
            'september': 8, 'sep': 8, 'sept': 8,
            'october': 9, 'oct': 9,
            'november': 10, 'nov': 10,
            'december': 11, 'dec': 11
        };

        // Normalize the string
        const normalized = dateString.toLowerCase().replace(/[,]/g, ' ').trim();

        // Extract month
        for (const [name, index] of Object.entries(monthNames)) {
            if (normalized.includes(name)) {
                month = index;
                break;
            }
        }

        // Extract day (look for numbers 1-31, possibly with st/nd/rd/th)
        const dayMatch = normalized.match(/\b(\d{1,2})(st|nd|rd|th)?\b/);
        if (dayMatch) {
            const dayNum = parseInt(dayMatch[1]);
            if (dayNum >= 1 && dayNum <= 31) {
                day = dayNum;
            }
        }

        // Extract time (formats: 6:30am, 06:30, 6:30, 18:30)
        const timeMatch = normalized.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/);
        if (timeMatch) {
            hours = parseInt(timeMatch[1]);
            minutes = parseInt(timeMatch[2]);

            // Handle AM/PM
            const meridiem = timeMatch[3];
            if (meridiem === 'pm' && hours < 12) {
                hours += 12;
            } else if (meridiem === 'am' && hours === 12) {
                hours = 0;
            }
        }

        // Extract year if present (4 digit number)
        const yearMatch = normalized.match(/\b(20\d{2})\b/);
        if (yearMatch) {
            year = parseInt(yearMatch[1]);
        }

        // If we have at least month or day or time, try to construct a date
        if (month !== null || day !== null || hours !== null) {
            const targetDate = new Date(now);

            if (month !== null) targetDate.setMonth(month);
            if (day !== null) targetDate.setDate(day);
            if (hours !== null) {
                targetDate.setHours(hours);
                targetDate.setMinutes(minutes);
                targetDate.setSeconds(0);
                targetDate.setMilliseconds(0);
            }
            if (yearMatch) targetDate.setFullYear(year);

            // If the constructed date is in the past, assume next year
            if (targetDate <= now && !yearMatch) {
                targetDate.setFullYear(targetDate.getFullYear() + 1);
            }

            return targetDate;
        }

        // If all else fails, return invalid date
        return new Date('invalid');
    }

    setupQuickPresets() {
        const presetButtons = document.querySelectorAll('.quick-actions .btn-small');

        presetButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const minutes = btn.dataset.minutes;
                const hours = btn.dataset.hours;
                const days = btn.dataset.days;

                const targetDate = new Date();

                if (minutes) {
                    targetDate.setMinutes(targetDate.getMinutes() + parseInt(minutes));
                } else if (hours) {
                    // "Tomorrow 9 AM"
                    targetDate.setDate(targetDate.getDate() + 1);
                    targetDate.setHours(9, 0, 0, 0);
                } else if (days) {
                    targetDate.setDate(targetDate.getDate() + parseInt(days));
                }

                this.targetDateTimeInput.value = formatDateTimeLocal(targetDate);
            });
        });
    }

    loadSavedTimer() {
        const saved = Storage.load();
        if (saved) {
            this.targetDateTimeInput.value = formatDateTimeLocal(saved.targetDate);
            this.timer = new CountdownTimer(saved.targetDate, saved.startDate);
            this.isRunning = true;
            this.pauseBtn.disabled = false;
            this.startBtn.textContent = 'Restart';
        }
    }

    startTimer() {
        const targetDateValue = this.targetDateTimeInput.value;

        if (!targetDateValue) {
            alert('Please select a target date and time');
            return;
        }

        const targetDate = new Date(targetDateValue);
        const now = new Date();

        if (targetDate <= now) {
            alert('Please select a future date and time');
            return;
        }

        // Create new timer
        this.timer = new CountdownTimer(targetDate);
        this.isRunning = true;
        this.pauseBtn.disabled = false;
        this.startBtn.textContent = 'Restart';

        // Reset renderer
        this.renderer = new Renderer(this.canvas);

        // Save to storage
        Storage.save(targetDate);
    }

    togglePause() {
        if (!this.timer) return;

        if (this.timer.isPaused) {
            this.timer.resume();
            this.pauseBtn.textContent = 'Pause';
            this.isRunning = true;

            // Update storage with new target date
            Storage.save(this.timer.getTargetDate());
        } else {
            this.timer.pause();
            this.pauseBtn.textContent = 'Resume';
            this.isRunning = false;
        }
    }

    resetTimer() {
        this.timer = null;
        this.isRunning = false;
        this.pauseBtn.disabled = true;
        this.pauseBtn.textContent = 'Pause';
        this.startBtn.textContent = 'Start Countdown';
        this.timeDisplay.textContent = '--';

        // Clear storage
        Storage.clear();

        // Reset renderer
        this.renderer = new Renderer(this.canvas);

        // Set default datetime to 5 minutes from now
        const defaultDate = new Date();
        defaultDate.setMinutes(defaultDate.getMinutes() + 5);
        this.targetDateTimeInput.value = formatDateTimeLocal(defaultDate);
    }

    animate() {
        const currentTime = performance.now();

        if (this.timer && this.isRunning) {
            // Get adaptive frame rate
            const timeRemaining = this.timer.getTimeRemaining();
            const targetFPS = getUpdateFrequency(timeRemaining);
            const frameInterval = 1000 / targetFPS;

            if (currentTime - this.lastUpdateTime >= frameInterval) {
                this.update();
                this.lastUpdateTime = currentTime;
            }
        } else if (!this.timer) {
            // Draw static scene when no timer
            this.renderer.draw(0, 0, false);
        }

        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    update() {
        if (!this.timer) return;

        const timeRemaining = this.timer.getTimeRemaining();
        const percentComplete = this.timer.getPercentageComplete();
        const isComplete = this.timer.isComplete();

        // Update time display
        this.timeDisplay.textContent = TimeFormatter.format(timeRemaining);

        // Update and draw renderer
        this.renderer.update(percentComplete, this.timer.getTotalDuration(), isComplete);
        this.renderer.draw(this.timer.getTotalDuration(), percentComplete, isComplete);

        // Handle completion
        if (isComplete && !this.renderer.isLandingComplete()) {
            // Timer is complete, but landing animation is still playing
        } else if (isComplete && this.renderer.isLandingComplete()) {
            // Everything is done
            this.isRunning = false;
            Storage.clear();
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new KiwiTimerApp();
});

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
        this.loadSavedTimer();
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
            this.renderer.draw(0);
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
        this.renderer.draw(this.timer.getTotalDuration());

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

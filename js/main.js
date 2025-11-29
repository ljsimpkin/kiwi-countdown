// Main application logic

class KiwiTimerApp {
    constructor() {
        this.canvas = document.getElementById('kiwiCanvas');
        this.timeDisplay = document.getElementById('timeDisplay');
        this.targetDateTimeInput = document.getElementById('targetDateTime');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.toggleSoundBtn = document.getElementById('toggleSoundBtn');
        this.toggleWeatherBtn = document.getElementById('toggleWeatherBtn');
        this.toggleDayNightBtn = document.getElementById('toggleDayNightBtn');

        this.renderer = new Renderer(this.canvas);
        this.timer = null;
        this.animationFrameId = null;
        this.isRunning = false;

        this.lastUpdateTime = 0;
        this.targetFrameRate = 60;

        this.dayNightEnabled = true;

        this.init();
    }

    init() {
        this.setupEventListeners();

        // Parse title from URL parameters
        this.parseAndDisplayTitle();

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

    parseAndDisplayTitle() {
        const urlParams = new URLSearchParams(window.location.search);
        const title = urlParams.get('title');

        if (title) {
            const customTitleElement = document.getElementById('custom-title');
            if (customTitleElement) {
                customTitleElement.textContent = decodeURIComponent(title);
                customTitleElement.style.display = 'block';
            }
        }
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startTimer());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.resetBtn.addEventListener('click', () => this.resetTimer());

        // Feature toggle buttons
        this.toggleSoundBtn.addEventListener('click', () => this.toggleSound());
        this.toggleWeatherBtn.addEventListener('click', () => this.cycleWeather());
        this.toggleDayNightBtn.addEventListener('click', () => this.toggleDayNight());

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
        const timezoneParam = urlParams.get('timezone') || urlParams.get('tz');

        if (!dateParam) {
            return null;
        }

        try {
            let targetDate;

            // Check if timezone parameter is provided
            if (timezoneParam) {
                // Parse the date string and apply timezone offset
                targetDate = this.parseDateWithTimezone(dateParam, timezoneParam);
            } else {
                // Check if dateParam already has timezone info (ends with Z or +/-HH:MM)
                const hasTimezone = /[+-]\d{2}:\d{2}$|Z$/.test(dateParam);

                if (hasTimezone) {
                    // Parse as ISO with timezone
                    targetDate = new Date(dateParam);
                } else {
                    // No timezone specified - treat as local time
                    targetDate = new Date(dateParam);
                }
            }

            // If ISO parsing fails, try custom formats
            if (isNaN(targetDate.getTime())) {
                targetDate = this.parseCustomDateFormat(dateParam);
            }

            // Validate the date
            if (isNaN(targetDate.getTime())) {
                console.error('Invalid date in URL parameter:', dateParam);
                return null;
            }

            // Allow past dates - they will show the completed state
            return targetDate;
        } catch (error) {
            console.error('Error parsing date from URL:', error);
            return null;
        }
    }

    parseDateWithTimezone(dateString, timezone) {
        // Parse timezone parameter (can be like "GMT+13", "+13", "13", "Pacific/Auckland")
        let offsetHours = 0;

        // Handle common timezone formats
        if (timezone.toLowerCase().includes('gmt')) {
            // GMT+13 or GMT-5
            const match = timezone.match(/gmt([+-]?\d+)/i);
            if (match) {
                offsetHours = parseInt(match[1]);
            }
        } else if (timezone.match(/^[+-]?\d+$/)) {
            // Just a number like "+13" or "13" or "-5"
            offsetHours = parseInt(timezone);
        } else {
            // IANA timezone name like "Pacific/Auckland" - not supported yet
            console.warn('IANA timezone names not supported, treating as UTC');
        }

        // Parse the date string as if it's in the specified timezone
        // Remove any existing timezone info from the string
        const cleanDateString = dateString.replace(/[+-]\d{2}:\d{2}$|Z$/, '');

        // Parse the date string - this will be interpreted as local time
        const parts = cleanDateString.match(/(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?/);

        if (!parts) {
            // Fallback to standard Date parsing
            return new Date(cleanDateString);
        }

        const year = parseInt(parts[1]);
        const month = parseInt(parts[2]) - 1; // Months are 0-indexed
        const day = parseInt(parts[3]);
        const hour = parseInt(parts[4]);
        const minute = parseInt(parts[5]);
        const second = parts[6] ? parseInt(parts[6]) : 0;

        // Create a UTC date from the components
        // This represents the time in the TARGET timezone
        const utcDate = Date.UTC(year, month, day, hour, minute, second);

        // Convert from target timezone to UTC by subtracting the offset
        // offsetHours is positive for GMT+X, so we subtract to get UTC
        const utcTime = utcDate - (offsetHours * 3600000);

        // Return as a local Date object (will display in user's local timezone)
        return new Date(utcTime);
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

            // If year was explicitly provided, use it
            if (yearMatch) {
                targetDate.setFullYear(year);
            } else {
                // No year specified - use current year first
                targetDate.setFullYear(now.getFullYear());

                // Only advance to next year if the date is already past
                if (targetDate <= now) {
                    targetDate.setFullYear(targetDate.getFullYear() + 1);
                }
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
                const seconds = btn.dataset.seconds;
                const minutes = btn.dataset.minutes;
                const hours = btn.dataset.hours;
                const days = btn.dataset.days;

                const targetDate = new Date();

                if (seconds) {
                    // For seconds-based timers, bypass the datetime input and start directly
                    targetDate.setSeconds(targetDate.getSeconds() + parseInt(seconds));
                    this.timer = new CountdownTimer(targetDate);
                    this.isRunning = true;
                    this.pauseBtn.disabled = false;
                    this.startBtn.textContent = 'Restart';

                    // Reset renderer
                    this.renderer = new Renderer(this.canvas);

                    // Save to storage
                    Storage.save(targetDate);

                    // Update input display (even though it will lose seconds precision)
                    this.targetDateTimeInput.value = formatDateTimeLocal(targetDate);
                } else if (minutes) {
                    targetDate.setMinutes(targetDate.getMinutes() + parseInt(minutes));
                    this.targetDateTimeInput.value = formatDateTimeLocal(targetDate);
                } else if (hours) {
                    // "Tomorrow 9 AM"
                    targetDate.setDate(targetDate.getDate() + 1);
                    targetDate.setHours(9, 0, 0, 0);
                    this.targetDateTimeInput.value = formatDateTimeLocal(targetDate);
                } else if (days) {
                    targetDate.setDate(targetDate.getDate() + parseInt(days));
                    this.targetDateTimeInput.value = formatDateTimeLocal(targetDate);
                }
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

        // Create new timer (even if in the past)
        this.timer = new CountdownTimer(targetDate);
        this.pauseBtn.disabled = false;
        this.startBtn.textContent = 'Restart';

        // Reset renderer
        this.renderer = new Renderer(this.canvas);

        if (targetDate <= now) {
            // Date is in the past - show completed state
            this.isRunning = false;
            this.timeDisplay.textContent = TimeFormatter.format(0);

            // Set renderer to completed state (100% complete)
            this.renderer.update(1.0, 0, true);
            this.renderer.draw(0, 1.0, true);
        } else {
            // Date is in the future - start countdown normally
            this.isRunning = true;

            // Activate kea antagonists
            this.renderer.keaManager.activate();

            // Save to storage
            Storage.save(targetDate);
        }
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

    toggleSound() {
        const isEnabled = this.renderer.soundManager.toggle();
        this.toggleSoundBtn.dataset.active = isEnabled.toString();
        this.toggleSoundBtn.textContent = isEnabled ? '🔊 Sound ON' : '🔇 Sound OFF';
    }

    cycleWeather() {
        const weatherTypes = ['clear', 'rain', 'snow'];
        const currentWeather = this.renderer.weatherManager.currentWeather;
        const currentIndex = weatherTypes.indexOf(currentWeather);
        const nextIndex = (currentIndex + 1) % weatherTypes.length;
        const nextWeather = weatherTypes[nextIndex];

        this.renderer.weatherManager.setWeather(nextWeather);

        // Update button text
        const weatherEmojis = { clear: '☀️', rain: '🌧️', snow: '❄️' };
        const weatherNames = { clear: 'Clear', rain: 'Rain', snow: 'Snow' };
        this.toggleWeatherBtn.textContent = `${weatherEmojis[nextWeather]} ${weatherNames[nextWeather]}`;
    }

    toggleDayNight() {
        this.dayNightEnabled = !this.dayNightEnabled;
        this.toggleDayNightBtn.dataset.active = this.dayNightEnabled.toString();
        this.toggleDayNightBtn.textContent = this.dayNightEnabled ? '☀️ Day/Night ON' : '🌙 Day/Night OFF';

        if (!this.dayNightEnabled) {
            // Reset to noon (daytime)
            this.renderer.background.timeOfDay = 0.5;
            this.renderer.background.cycleSpeed = 0;
        } else {
            // Re-enable cycle
            this.renderer.background.cycleSpeed = 0.00001;
        }
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
            // Update and draw scene even when no timer (for food spawning, kiwi movement, etc.)
            const frameInterval = 1000 / 60; // 60 FPS
            if (currentTime - this.lastUpdateTime >= frameInterval) {
                this.renderer.update(0, 0, false);
                this.renderer.draw(0, 0, false);
                this.lastUpdateTime = currentTime;
            }
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

    // Initialize share functionality
    const shareManager = new ShareManager();
    shareManager.init();
});

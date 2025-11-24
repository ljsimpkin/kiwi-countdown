// Sound effects manager using Web Audio API

class SoundManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.enabled = true;
        this.volume = 0.3;

        // Initialize audio context on first user interaction
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
            this.generateSounds();
        } catch (e) {
            console.warn('Web Audio API not supported', e);
            this.enabled = false;
        }
    }

    generateSounds() {
        // Generate sound effects using oscillators
        this.sounds = {
            foodCollect: this.createFoodCollectSound.bind(this),
            landing: this.createLandingSound.bind(this),
            complete: this.createCompleteSound.bind(this),
            wind: this.createWindSound.bind(this),
            tick: this.createTickSound.bind(this)
        };
    }

    createFoodCollectSound() {
        if (!this.audioContext || !this.enabled) return;

        const now = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Pleasant "ding" sound
        oscillator.frequency.setValueAtTime(800, now);
        oscillator.frequency.exponentialRampToValueAtTime(1200, now + 0.1);

        gainNode.gain.setValueAtTime(this.volume * 0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        oscillator.type = 'sine';
        oscillator.start(now);
        oscillator.stop(now + 0.2);
    }

    createLandingSound() {
        if (!this.audioContext || !this.enabled) return;

        const now = this.audioContext.currentTime;

        // Create a "thump" sound
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(150, now);
        oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.3);

        gainNode.gain.setValueAtTime(this.volume * 0.5, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        oscillator.type = 'sine';
        oscillator.start(now);
        oscillator.stop(now + 0.3);
    }

    createCompleteSound() {
        if (!this.audioContext || !this.enabled) return;

        const now = this.audioContext.currentTime;

        // Create a celebratory ascending arpeggio
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

        notes.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            const startTime = now + (index * 0.1);
            oscillator.frequency.setValueAtTime(freq, startTime);

            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

            oscillator.type = 'sine';
            oscillator.start(startTime);
            oscillator.stop(startTime + 0.3);
        });
    }

    createWindSound() {
        if (!this.audioContext || !this.enabled) return;

        const now = this.audioContext.currentTime;

        // Create subtle wind whoosh using white noise
        const bufferSize = this.audioContext.sampleRate * 0.5;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.audioContext.createBufferSource();
        const filter = this.audioContext.createBiquadFilter();
        const gainNode = this.audioContext.createGain();

        noise.buffer = buffer;
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, now);

        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, now + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.4);

        noise.start(now);
        noise.stop(now + 0.5);
    }

    createTickSound() {
        if (!this.audioContext || !this.enabled) return;

        const now = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Short tick sound
        oscillator.frequency.setValueAtTime(1000, now);

        gainNode.gain.setValueAtTime(this.volume * 0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        oscillator.type = 'square';
        oscillator.start(now);
        oscillator.stop(now + 0.05);
    }

    play(soundName) {
        if (!this.initialized) {
            this.init();
        }

        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
    }
}

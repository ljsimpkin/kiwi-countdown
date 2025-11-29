// Main renderer - orchestrates all drawing

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.setupCanvas();

        this.background = new Background(canvas);
        this.kiwi = new Kiwi(canvas);
        this.parachute = new Parachute();
        this.foodManager = new FoodManager(canvas);
        this.scoreManager = new ScoreManager();
        this.kiwiFriends = null; // Created when landing
        this.soundManager = new SoundManager();
        this.weatherManager = new WeatherManager(canvas);
        this.confettiManager = new ConfettiManager(canvas);
        this.keaManager = new KeaManager(canvas);

        this.lastFrameTime = performance.now();
        this.isLanding = false;
        this.landingMessageAlpha = 0;

        // Initialize score display
        this.scoreManager.init();
    }

    setupCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        this.ctx.scale(dpr, dpr);

        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }

    resize() {
        this.setupCanvas();
        this.background = new Background(this.canvas);
        this.kiwi = new Kiwi(this.canvas);
        this.foodManager = new FoodManager(this.canvas);
        this.weatherManager = new WeatherManager(this.canvas);
        this.confettiManager = new ConfettiManager(this.canvas);
        this.keaManager = new KeaManager(this.canvas);
    }

    clear() {
        const dpr = window.devicePixelRatio || 1;
        this.ctx.clearRect(0, 0, this.canvas.width / dpr, this.canvas.height / dpr);
    }

    update(percentComplete, totalDuration, isComplete) {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;

        // Update background with percentComplete for scrolling
        this.background.update(deltaTime, totalDuration, percentComplete);

        // Update weather
        this.weatherManager.update(deltaTime);

        // Update kiwi position
        this.kiwi.updatePosition(percentComplete, deltaTime);

        // Update parachute
        this.parachute.update(deltaTime);

        // Update food manager
        this.foodManager.update(deltaTime);

        // Update kea manager (keas try to steal food!)
        if (!isComplete) {
            this.keaManager.update(
                deltaTime,
                this.foodManager.foods,
                this.kiwi.x,
                this.kiwi.y,
                percentComplete,
                () => this.scoreManager.incrementStolen()
            );
        }

        // Check for food collisions
        const pointsEarned = this.foodManager.checkCollisions(
            this.kiwi.x,
            this.kiwi.y,
            this.kiwi.bodyRadius
        );
        if (pointsEarned > 0) {
            this.scoreManager.addPoints(pointsEarned);
            this.soundManager.play('foodCollect');
        }

        // Handle landing
        if (isComplete && !this.isLanding) {
            this.startLanding();
        }

        if (this.isLanding) {
            this.updateLanding(deltaTime);
        }

        // Update confetti
        if (this.confettiManager.active) {
            this.confettiManager.update(deltaTime, this.kiwi.x, this.kiwi.y);
        }
    }

    draw(totalDuration, percentComplete, isComplete) {
        this.clear();

        // Draw background with percentComplete and isComplete for ground positioning
        this.background.draw(this.ctx, totalDuration, percentComplete, isComplete);

        // Draw weather effects (behind everything else)
        this.weatherManager.draw(this.ctx);

        // Draw food items
        this.foodManager.draw(this.ctx);

        // Draw keas (antagonists that steal food)
        this.keaManager.draw(this.ctx);

        // Draw parachute (behind kiwi)
        const attachPoint = this.kiwi.getAttachmentPoint();
        this.parachute.draw(this.ctx, attachPoint);

        // Draw kiwi friends (behind main kiwi)
        if (this.kiwiFriends) {
            this.kiwiFriends.draw(this.ctx);
        }

        // Draw kiwi
        this.kiwi.draw(this.ctx);

        // Draw confetti (on top of everything)
        this.confettiManager.draw(this.ctx);

        // Draw landing message
        if (this.isLanding && this.landingMessageAlpha > 0) {
            this.drawLandingMessage();
        }
    }

    startLanding() {
        this.isLanding = true;
        this.kiwi.land();
        this.parachute.collapse();
        this.landingMessageAlpha = 0;

        // Play landing sound
        this.soundManager.play('landing');

        // Start confetti immediately
        this.confettiManager.activate(this.kiwi.x, this.kiwi.y);

        // Play complete sound after short delay
        setTimeout(() => {
            this.soundManager.play('complete');
        }, 300);

        // Create kiwi friends immediately!
        setTimeout(() => {
            if (!this.kiwiFriends) {
                this.kiwiFriends = new KiwiFriendsManager(
                    this.canvas,
                    this.kiwi.x,
                    this.kiwi.y
                );
                this.kiwiFriends.activate();
            }
        }, 100); // Reduced delay - friends appear faster!
    }

    updateLanding(deltaTime) {
        // Fade in landing message
        if (this.landingMessageAlpha < 1) {
            this.landingMessageAlpha += deltaTime / 1000;
        }

        // Update kiwi friends
        if (this.kiwiFriends) {
            this.kiwiFriends.update(deltaTime, this.kiwi.landingProgress);
        }
    }

    drawLandingMessage() {
        const dpr = window.devicePixelRatio || 1;
        const centerX = (this.canvas.width / dpr) / 2;
        const centerY = (this.canvas.height / dpr) / 2;

        this.ctx.save();
        this.ctx.globalAlpha = Math.min(1, this.landingMessageAlpha);

        // Pulsing animation
        const pulseScale = 1 + Math.sin(Date.now() * 0.003) * 0.05;

        // Draw background box with gradient
        const boxWidth = 420;
        const boxHeight = 180;
        const boxX = centerX - boxWidth / 2;
        const boxY = centerY - boxHeight / 2;

        // Gradient background
        const gradient = this.ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxHeight);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
        gradient.addColorStop(1, 'rgba(240, 248, 255, 0.98)');
        this.ctx.fillStyle = gradient;

        // Border with NZ colors (black and white with slight blue tint)
        this.ctx.strokeStyle = '#667eea';
        this.ctx.lineWidth = 5;

        this.ctx.beginPath();
        this.ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 20);
        this.ctx.fill();
        this.ctx.stroke();

        // Add subtle inner glow
        this.ctx.strokeStyle = 'rgba(102, 126, 234, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.roundRect(boxX + 5, boxY + 5, boxWidth - 10, boxHeight - 10, 15);
        this.ctx.stroke();

        // Draw decorative kiwi bird emojis in corners
        this.ctx.font = '24px sans-serif';
        this.ctx.fillText('🥝', boxX + 25, boxY + 25);
        this.ctx.fillText('🥝', boxX + boxWidth - 25, boxY + 25);
        this.ctx.fillText('🦜', boxX + 25, boxY + boxHeight - 25);
        this.ctx.fillText('🦜', boxX + boxWidth - 25, boxY + boxHeight - 25);

        // Main text with scaling
        this.ctx.save();
        this.ctx.translate(centerX, centerY - 35);
        this.ctx.scale(pulseScale, pulseScale);

        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        // "Time's up!" with gradient text
        this.ctx.font = 'bold 38px sans-serif';
        const textGradient = this.ctx.createLinearGradient(-100, -20, 100, 20);
        textGradient.addColorStop(0, '#FF6B6B');
        textGradient.addColorStop(0.5, '#667eea');
        textGradient.addColorStop(1, '#4ECDC4');
        this.ctx.fillStyle = textGradient;
        this.ctx.fillText("Time's up!", 0, 0);

        // Add text shadow for depth
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        this.ctx.shadowBlur = 4;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;

        this.ctx.restore();

        // "Welcome to NZ!" text
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.shadowColor = 'transparent';
        this.ctx.font = 'bold 28px sans-serif';
        const welcomeGradient = this.ctx.createLinearGradient(centerX - 100, 0, centerX + 100, 0);
        welcomeGradient.addColorStop(0, '#000000');
        welcomeGradient.addColorStop(0.5, '#1a1a1a');
        welcomeGradient.addColorStop(1, '#000000');
        this.ctx.fillStyle = welcomeGradient;
        this.ctx.fillText('Welcome to NZ!', centerX, centerY + 10);

        // Celebratory emojis line
        this.ctx.font = '26px sans-serif';
        this.ctx.fillText('🎉 🥝 🌟 ✨ 🎊', centerX, centerY + 50);

        this.ctx.restore();
    }

    getKiwi() {
        return this.kiwi;
    }

    getParachute() {
        return this.parachute;
    }

    isLandingComplete() {
        return this.isLanding;
    }
}

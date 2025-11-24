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

        // Update kiwi position
        this.kiwi.updatePosition(percentComplete, deltaTime);

        // Update parachute
        this.parachute.update(deltaTime);

        // Update food manager
        this.foodManager.update(deltaTime);

        // Check for food collisions
        const pointsEarned = this.foodManager.checkCollisions(
            this.kiwi.x,
            this.kiwi.y,
            this.kiwi.bodyRadius
        );
        if (pointsEarned > 0) {
            this.scoreManager.addPoints(pointsEarned);
        }

        // Handle landing
        if (isComplete && !this.isLanding) {
            this.startLanding();
        }

        if (this.isLanding) {
            this.updateLanding(deltaTime);
        }
    }

    draw(totalDuration, percentComplete, isComplete) {
        this.clear();

        // Draw background with percentComplete and isComplete for ground positioning
        this.background.draw(this.ctx, totalDuration, percentComplete, isComplete);

        // Draw food items
        this.foodManager.draw(this.ctx);

        // Draw parachute (behind kiwi)
        const attachPoint = this.kiwi.getAttachmentPoint();
        this.parachute.draw(this.ctx, attachPoint);

        // Draw kiwi
        this.kiwi.draw(this.ctx);

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
    }

    updateLanding(deltaTime) {
        // Fade in landing message
        if (this.landingMessageAlpha < 1) {
            this.landingMessageAlpha += deltaTime / 1000;
        }
    }

    drawLandingMessage() {
        const dpr = window.devicePixelRatio || 1;
        const centerX = (this.canvas.width / dpr) / 2;
        const centerY = (this.canvas.height / dpr) / 2;

        this.ctx.save();
        this.ctx.globalAlpha = Math.min(1, this.landingMessageAlpha);

        // Draw background box
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        this.ctx.strokeStyle = '#667eea';
        this.ctx.lineWidth = 4;
        const boxWidth = 300;
        const boxHeight = 120;
        const boxX = centerX - boxWidth / 2;
        const boxY = centerY - boxHeight / 2;

        this.ctx.beginPath();
        this.ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 15);
        this.ctx.fill();
        this.ctx.stroke();

        // Draw text
        this.ctx.fillStyle = '#333';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        this.ctx.font = 'bold 32px sans-serif';
        this.ctx.fillText("Time's Up!", centerX, centerY - 15);

        this.ctx.font = '20px sans-serif';
        this.ctx.fillText('🎉 The kiwi has landed! 🎉', centerX, centerY + 20);

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

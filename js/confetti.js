// Confetti particle system for celebration

class ConfettiParticle {
    constructor(x, y, canvasWidth, canvasHeight) {
        this.x = x;
        this.y = y;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        // Random velocity
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = -Math.random() * 10 - 5; // Shoot upward

        // Gravity
        this.gravity = 0.3;

        // Random size
        this.size = Math.random() * 8 + 4;

        // Random shape (square, circle, rectangle)
        this.shape = Math.floor(Math.random() * 3);

        // Random color
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
            '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
            '#F8B739', '#52B788', '#E63946', '#A8DADC'
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];

        // Rotation
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;

        // Opacity
        this.opacity = 1;
        this.fadeStart = 2000; // Start fading after 2 seconds
        this.lifetime = 0;
    }

    update(deltaTime) {
        // Apply physics
        this.vx *= 0.99; // Air resistance
        this.vy += this.gravity;

        this.x += this.vx;
        this.y += this.vy;

        // Rotation
        this.rotation += this.rotationSpeed;

        // Lifetime and fading
        this.lifetime += deltaTime;
        if (this.lifetime > this.fadeStart) {
            this.opacity = Math.max(0, 1 - (this.lifetime - this.fadeStart) / 1000);
        }

        // Bounce off sides
        if (this.x < 0 || this.x > this.canvasWidth) {
            this.vx *= -0.5;
            this.x = Math.max(0, Math.min(this.canvasWidth, this.x));
        }
    }

    draw(ctx) {
        if (this.opacity <= 0) return;

        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;

        if (this.shape === 0) {
            // Square
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        } else if (this.shape === 1) {
            // Circle
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Rectangle
            ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
        }

        ctx.restore();
    }

    isAlive() {
        // Particle dies when it's faded out or off screen (below bottom)
        return this.opacity > 0 && this.y < this.canvasHeight + 100;
    }
}

class ConfettiManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.particles = [];
        this.active = false;
        this.burstTimer = 0;
        this.burstInterval = 150; // Burst every 150ms (faster!)
        this.burstCount = 0;
        this.maxBursts = 40; // 40 bursts total (6 seconds of confetti!)
    }

    activate(kiwiX, kiwiY) {
        this.active = true;
        this.burstTimer = 0;
        this.burstCount = 0;
        this.particles = [];

        const rect = this.canvas.getBoundingClientRect();
        this.burstLocations = [];

        // Pre-generate random burst locations - including outside canvas!
        const margin = 200; // Allow spawning 200px outside canvas
        for (let i = 0; i < this.maxBursts; i++) {
            this.burstLocations.push({
                x: -margin + Math.random() * (rect.width + margin * 2),
                y: -margin + Math.random() * (rect.height + margin * 2)
            });
        }

        // Initial burst at kiwi position
        this.burst(kiwiX, kiwiY);
    }

    burst(x, y) {
        const rect = this.canvas.getBoundingClientRect();

        // Create 40-60 particles per burst (massive explosion!)
        const particleCount = 40 + Math.floor(Math.random() * 21);

        for (let i = 0; i < particleCount; i++) {
            const particle = new ConfettiParticle(
                x + (Math.random() - 0.5) * 150, // Wider spread
                y,
                rect.width,
                rect.height
            );
            this.particles.push(particle);
        }
    }

    update(deltaTime, kiwiX, kiwiY) {
        if (!this.active) return;

        // Create periodic bursts at random locations
        if (this.burstCount < this.maxBursts) {
            this.burstTimer += deltaTime;
            if (this.burstTimer >= this.burstInterval) {
                // Use pre-generated random location
                const location = this.burstLocations[this.burstCount];
                this.burst(location.x, location.y);
                this.burstTimer = 0;
                this.burstCount++;
            }
        }

        // Update all particles
        this.particles.forEach(particle => particle.update(deltaTime));

        // Remove dead particles
        this.particles = this.particles.filter(particle => particle.isAlive());

        // Deactivate when all bursts done and particles gone
        if (this.burstCount >= this.maxBursts && this.particles.length === 0) {
            this.active = false;
        }
    }

    draw(ctx) {
        if (!this.active) return;

        this.particles.forEach(particle => particle.draw(ctx));
    }

    reset() {
        this.active = false;
        this.particles = [];
        this.burstTimer = 0;
        this.burstCount = 0;
    }
}

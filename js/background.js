// Background with sky, clouds, and ground - Vertical scrolling

class Cloud {
    constructor(x, y, scale, speed) {
        this.x = x;
        this.initialY = y; // Store initial Y position
        this.y = y;
        this.scale = scale;
        this.speed = speed;
        this.baseSpeed = speed;
    }

    update(deltaTime, canvasWidth, canvasHeight, totalDuration, scrollOffset) {
        // Clouds drift horizontally slowly (no speed multiplier - always same speed)
        this.x += (this.speed * deltaTime) / 3000;

        // Wrap around horizontally
        if (this.x > canvasWidth + 100) {
            this.x = -100;
        } else if (this.x < -100) {
            this.x = canvasWidth + 100;
        }

        // Update vertical position based on scroll offset
        // Different layers scroll at different speeds (parallax)
        // NEGATIVE to make clouds scroll UP (bottom to top) as kiwi falls
        const parallaxFactor = this.speed / 15; // Clouds with higher speed scroll faster
        this.y = this.initialY - (scrollOffset * parallaxFactor);
    }

    draw(ctx, canvasHeight) {
        // Only draw if cloud is visible
        if (this.y > -100 && this.y < canvasHeight + 100) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.scale(this.scale, this.scale);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

            // Draw cloud as overlapping circles
            ctx.beginPath();
            ctx.arc(-20, 0, 15, 0, Math.PI * 2);
            ctx.arc(0, -5, 20, 0, Math.PI * 2);
            ctx.arc(20, 0, 15, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }
}

class Background {
    constructor(canvas) {
        this.canvas = canvas;
        this.clouds = [];
        this.scrollOffset = 0; // Vertical scroll position (accumulated over time)
        this.scrollSpeed = 0.05; // Pixels per millisecond - constant speed!
        this.maxScroll = 20000; // Maximum scroll for ground positioning
        this.initClouds();
    }

    initClouds() {
        // Create MANY more clouds distributed vertically for longer timers
        // Start with clouds BELOW the viewport so they scroll UP into view
        const cloudData = [
            // Initial visible clouds (near start)
            { x: 250, y: 100, scale: 0.9, speed: 15 },
            { x: 550, y: 150, scale: 1.0, speed: 22 },
            { x: 100, y: 200, scale: 0.85, speed: 18 },

            // Layer 1 (far - slow) - distributed throughout journey
            { x: 100, y: 500, scale: 0.7, speed: 10 },
            { x: 300, y: 800, scale: 0.8, speed: 12 },
            { x: 500, y: 1200, scale: 0.75, speed: 11 },
            { x: 200, y: 1600, scale: 0.7, speed: 10 },
            { x: 400, y: 2000, scale: 0.8, speed: 12 },
            { x: 600, y: 2400, scale: 0.75, speed: 11 },
            { x: 150, y: 2800, scale: 0.7, speed: 10 },
            { x: 350, y: 3200, scale: 0.8, speed: 12 },

            // Layer 2 (medium) - more clouds for longer timers
            { x: 150, y: 600, scale: 1.0, speed: 20 },
            { x: 400, y: 900, scale: 0.9, speed: 18 },
            { x: 600, y: 1100, scale: 0.95, speed: 19 },
            { x: 250, y: 1400, scale: 1.0, speed: 20 },
            { x: 450, y: 1800, scale: 0.9, speed: 18 },
            { x: 650, y: 2200, scale: 0.95, speed: 19 },
            { x: 200, y: 2600, scale: 1.0, speed: 20 },
            { x: 500, y: 3000, scale: 0.9, speed: 18 },
            { x: 700, y: 3400, scale: 0.95, speed: 19 },

            // Layer 3 (near - fast) - most visible and dynamic
            { x: 200, y: 700, scale: 1.2, speed: 30 },
            { x: 450, y: 1000, scale: 1.1, speed: 28 },
            { x: 650, y: 1300, scale: 1.15, speed: 29 },
            { x: 300, y: 1500, scale: 1.2, speed: 30 },
            { x: 550, y: 1900, scale: 1.1, speed: 28 },
            { x: 100, y: 2300, scale: 1.15, speed: 29 },
            { x: 400, y: 2700, scale: 1.2, speed: 30 },
            { x: 600, y: 3100, scale: 1.1, speed: 28 },
            { x: 250, y: 3500, scale: 1.15, speed: 29 },

            // Extra clouds for very long timers
            { x: 180, y: 3800, scale: 0.8, speed: 15 },
            { x: 380, y: 4200, scale: 1.0, speed: 22 },
            { x: 580, y: 4600, scale: 0.9, speed: 18 },
            { x: 120, y: 5000, scale: 1.1, speed: 25 },
            { x: 420, y: 5400, scale: 0.85, speed: 20 },
        ];

        cloudData.forEach((data) => {
            // Wrap X position if it's out of bounds
            let x = data.x % this.canvas.width;
            this.clouds.push(new Cloud(x, data.y, data.scale, data.speed));
        });
    }

    reset() {
        // Reset scroll offset when starting a new timer
        this.scrollOffset = 0;
    }

    update(deltaTime, totalDuration, percentComplete) {
        // Accumulate scroll at constant speed (not based on percentComplete!)
        // This makes clouds scroll smoothly regardless of timer duration
        this.scrollOffset += this.scrollSpeed * deltaTime;

        // Cap at maxScroll so we don't scroll forever
        this.scrollOffset = Math.min(this.scrollOffset, this.maxScroll);

        this.clouds.forEach(cloud => {
            cloud.update(deltaTime, this.canvas.width, this.canvas.height, totalDuration, this.scrollOffset);
        });
    }

    drawSky(ctx) {
        // Sky gradient - light blue at top to lighter at bottom
        const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.5, '#B0D4E8');
        gradient.addColorStop(1, '#E0F2F7');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawClouds(ctx) {
        // Sort clouds by their vertical position and speed (further = slower)
        const sortedClouds = [...this.clouds].sort((a, b) => a.speed - b.speed);
        sortedClouds.forEach(cloud => cloud.draw(ctx, this.canvas.height));
    }

    drawGround(ctx, percentComplete, isComplete) {
        // Ground scrolls in from bottom and eventually fills the screen
        const groundStartY = this.canvas.height; // Start off screen
        const groundEndY = 0; // End at top (fully visible when landed)

        // Ground Y position based on progress
        let groundY = groundStartY - (percentComplete * (groundStartY - groundEndY));

        // When complete, ground is at bottom of kiwi (center-ish)
        if (isComplete) {
            groundY = this.canvas.height / 2 + 50; // Just below center
        }

        // Only draw if ground is visible
        if (groundY < this.canvas.height) {
            const groundHeight = this.canvas.height - groundY + 100; // Extend below viewport

            // Ground - grass
            ctx.fillStyle = '#7CB342';
            ctx.fillRect(0, groundY, this.canvas.width, groundHeight);

            // Ground details - darker grass patches
            ctx.fillStyle = '#689F38';
            ctx.beginPath();
            for (let x = 0; x < this.canvas.width; x += 40) {
                ctx.ellipse(x, groundY + 10, 20, 8, 0, 0, Math.PI * 2);
            }
            ctx.fill();

            // Ground line
            ctx.strokeStyle = '#558B2F';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, groundY);
            ctx.lineTo(this.canvas.width, groundY);
            ctx.stroke();

            // Simple hills in background
            ctx.fillStyle = '#8BC34A';
            ctx.beginPath();
            ctx.moveTo(0, groundY);
            ctx.quadraticCurveTo(this.canvas.width / 4, groundY - 40, this.canvas.width / 2, groundY);
            ctx.quadraticCurveTo(3 * this.canvas.width / 4, groundY + 20, this.canvas.width, groundY - 20);
            ctx.lineTo(this.canvas.width, this.canvas.height + 100);
            ctx.lineTo(0, this.canvas.height + 100);
            ctx.closePath();
            ctx.fill();
        }
    }

    draw(ctx, totalDuration, percentComplete, isComplete) {
        this.drawSky(ctx);
        this.drawClouds(ctx);
        this.drawGround(ctx, percentComplete, isComplete);
    }
}

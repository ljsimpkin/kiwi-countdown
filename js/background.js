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
        // Scale cloud speed based on timer duration
        let speedMultiplier = 1;
        if (totalDuration > 86400000) {
            speedMultiplier = 0.3; // Very slow for multi-day timers
        } else if (totalDuration > 3600000) {
            speedMultiplier = 0.6; // Slower for hour+ timers
        }

        // Clouds drift horizontally slowly
        this.x += (this.speed * speedMultiplier * deltaTime) / 3000; // Slower horizontal drift

        // Wrap around horizontally
        if (this.x > canvasWidth + 100) {
            this.x = -100;
        } else if (this.x < -100) {
            this.x = canvasWidth + 100;
        }

        // Update vertical position based on scroll offset
        // Different layers scroll at different speeds (parallax)
        // NEGATIVE to make clouds scroll UP (bottom to top) as kiwi falls
        const parallaxFactor = this.speed / 25; // Clouds with higher speed scroll faster
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
        this.scrollOffset = 0; // Vertical scroll position
        this.maxScroll = 10000; // Maximum scroll distance
        this.initClouds();
    }

    initClouds() {
        // Create multiple clouds distributed vertically
        // Start with clouds BELOW the viewport so they scroll UP into view
        const cloudData = [
            // Layer 1 (far - slow) - start far below
            { x: 100, y: 500, scale: 0.7, speed: 10 },
            { x: 300, y: 800, scale: 0.8, speed: 12 },
            { x: 500, y: 1200, scale: 0.75, speed: 11 },

            // Layer 2 (medium)
            { x: 150, y: 600, scale: 1.0, speed: 20 },
            { x: 400, y: 900, scale: 0.9, speed: 18 },
            { x: 600, y: 1100, scale: 0.95, speed: 19 },

            // Layer 3 (near - fast)
            { x: 200, y: 700, scale: 1.2, speed: 30 },
            { x: 450, y: 1000, scale: 1.1, speed: 28 },
            { x: 650, y: 1300, scale: 1.15, speed: 29 },

            // Initial visible clouds (near start)
            { x: 250, y: 100, scale: 0.9, speed: 15 },
            { x: 550, y: 150, scale: 1.0, speed: 22 },
        ];

        cloudData.forEach((data) => {
            // Wrap X position if it's out of bounds
            let x = data.x % this.canvas.width;
            this.clouds.push(new Cloud(x, data.y, data.scale, data.speed));
        });
    }

    update(deltaTime, totalDuration, percentComplete) {
        // Update scroll offset based on progress
        this.scrollOffset = percentComplete * this.maxScroll;

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

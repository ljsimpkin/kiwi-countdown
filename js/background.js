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
        this.landedGroundY = null; // Store ground position when landing

        // Day/night cycle
        this.timeOfDay = 0.5; // 0 = midnight, 0.5 = noon, 1 = midnight
        this.cycleSpeed = 0.00001; // Very slow cycle

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
        // Reset scroll offset and ground position when starting a new timer
        this.scrollOffset = 0;
        this.landedGroundY = null;
        this.timeOfDay = 0.5; // Reset to noon
    }

    update(deltaTime, totalDuration, percentComplete) {
        // Accumulate scroll at constant speed (not based on percentComplete!)
        // This makes clouds scroll smoothly regardless of timer duration
        this.scrollOffset += this.scrollSpeed * deltaTime;

        // Cap at maxScroll so we don't scroll forever
        this.scrollOffset = Math.min(this.scrollOffset, this.maxScroll);

        // Update day/night cycle
        this.timeOfDay += this.cycleSpeed * deltaTime;
        this.timeOfDay = this.timeOfDay % 1; // Keep between 0 and 1

        this.clouds.forEach(cloud => {
            cloud.update(deltaTime, this.canvas.width, this.canvas.height, totalDuration, this.scrollOffset);
        });
    }

    drawSky(ctx) {
        // Day/night cycle with smooth color transitions
        // timeOfDay: 0 = midnight, 0.25 = dawn, 0.5 = noon, 0.75 = dusk, 1 = midnight

        let topColor, midColor, bottomColor;

        if (this.timeOfDay < 0.25) {
            // Night to dawn (0 to 0.25)
            const t = this.timeOfDay / 0.25;
            topColor = this.lerpColor('#0B1929', '#FF6B35', t);
            midColor = this.lerpColor('#1B2A3D', '#FFA07A', t);
            bottomColor = this.lerpColor('#2B3E50', '#FFD6A5', t);
        } else if (this.timeOfDay < 0.5) {
            // Dawn to noon (0.25 to 0.5)
            const t = (this.timeOfDay - 0.25) / 0.25;
            topColor = this.lerpColor('#FF6B35', '#87CEEB', t);
            midColor = this.lerpColor('#FFA07A', '#B0D4E8', t);
            bottomColor = this.lerpColor('#FFD6A5', '#E0F2F7', t);
        } else if (this.timeOfDay < 0.75) {
            // Noon to dusk (0.5 to 0.75)
            const t = (this.timeOfDay - 0.5) / 0.25;
            topColor = this.lerpColor('#87CEEB', '#FF6B6B', t);
            midColor = this.lerpColor('#B0D4E8', '#FF8C42', t);
            bottomColor = this.lerpColor('#E0F2F7', '#FFB84D', t);
        } else {
            // Dusk to night (0.75 to 1)
            const t = (this.timeOfDay - 0.75) / 0.25;
            topColor = this.lerpColor('#FF6B6B', '#0B1929', t);
            midColor = this.lerpColor('#FF8C42', '#1B2A3D', t);
            bottomColor = this.lerpColor('#FFB84D', '#2B3E50', t);
        }

        const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, topColor);
        gradient.addColorStop(0.5, midColor);
        gradient.addColorStop(1, bottomColor);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Add stars at night (timeOfDay < 0.2 or > 0.8)
        if (this.timeOfDay < 0.2 || this.timeOfDay > 0.8) {
            const starOpacity = this.timeOfDay < 0.2
                ? (0.2 - this.timeOfDay) / 0.2
                : (this.timeOfDay - 0.8) / 0.2;
            this.drawStars(ctx, starOpacity);
        }
    }

    lerpColor(color1, color2, t) {
        // Linear interpolation between two hex colors
        const r1 = parseInt(color1.substr(1, 2), 16);
        const g1 = parseInt(color1.substr(3, 2), 16);
        const b1 = parseInt(color1.substr(5, 2), 16);

        const r2 = parseInt(color2.substr(1, 2), 16);
        const g2 = parseInt(color2.substr(3, 2), 16);
        const b2 = parseInt(color2.substr(5, 2), 16);

        const r = Math.round(r1 + (r2 - r1) * t);
        const g = Math.round(g1 + (g2 - g1) * t);
        const b = Math.round(b1 + (b2 - b1) * t);

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    drawStars(ctx, opacity) {
        // Draw simple stars (fixed positions based on canvas dimensions)
        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;

        const starPositions = [
            { x: 50, y: 30 }, { x: 120, y: 60 }, { x: 200, y: 40 },
            { x: 280, y: 70 }, { x: 350, y: 50 }, { x: 450, y: 80 },
            { x: 550, y: 35 }, { x: 620, y: 65 }, { x: 700, y: 45 },
            { x: 100, y: 120 }, { x: 300, y: 110 }, { x: 500, y: 130 },
            { x: 650, y: 100 }, { x: 150, y: 150 }, { x: 400, y: 160 }
        ];

        starPositions.forEach(star => {
            // Draw star as small circle
            ctx.beginPath();
            ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
            ctx.fill();

            // Add twinkle effect
            if (Math.random() > 0.7) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(star.x - 4, star.y);
                ctx.lineTo(star.x + 4, star.y);
                ctx.moveTo(star.x, star.y - 4);
                ctx.lineTo(star.x, star.y + 4);
                ctx.stroke();
            }
        });

        ctx.restore();
    }

    drawClouds(ctx) {
        // Sort clouds by their vertical position and speed (further = slower)
        const sortedClouds = [...this.clouds].sort((a, b) => a.speed - b.speed);
        sortedClouds.forEach(cloud => cloud.draw(ctx, this.canvas.height));
    }

    drawGround(ctx, percentComplete, isComplete) {
        // Use display dimensions (not scaled canvas dimensions)
        const rect = this.canvas.getBoundingClientRect();
        const canvasHeight = rect.height;
        const canvasWidth = rect.width;

        // Ground scrolls in from bottom and eventually fills the screen
        const groundStartY = canvasHeight; // Start off screen
        const groundEndY = 0; // End at top (fully visible when landed)

        // Ground Y position based on progress
        let groundY = groundStartY - (percentComplete * (groundStartY - groundEndY));

        // When landing, store the ground position and keep it there
        if (isComplete) {
            if (this.landedGroundY === null) {
                // First time landing - store current position
                this.landedGroundY = groundY;
            }
            // Use stored position to keep ground stable
            groundY = this.landedGroundY;
        }

        // Only draw if ground is visible
        if (groundY < canvasHeight) {
            const groundHeight = canvasHeight - groundY + 100; // Extend below viewport

            // Ground - grass
            ctx.fillStyle = '#7CB342';
            ctx.fillRect(0, groundY, canvasWidth, groundHeight);

            // Ground details - darker grass patches
            ctx.fillStyle = '#689F38';
            ctx.beginPath();
            for (let x = 0; x < canvasWidth; x += 40) {
                ctx.ellipse(x, groundY + 10, 20, 8, 0, 0, Math.PI * 2);
            }
            ctx.fill();

            // Ground line
            ctx.strokeStyle = '#558B2F';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, groundY);
            ctx.lineTo(canvasWidth, groundY);
            ctx.stroke();

            // Simple hills in background
            ctx.fillStyle = '#8BC34A';
            ctx.beginPath();
            ctx.moveTo(0, groundY);
            ctx.quadraticCurveTo(canvasWidth / 4, groundY - 40, canvasWidth / 2, groundY);
            ctx.quadraticCurveTo(3 * canvasWidth / 4, groundY + 20, canvasWidth, groundY - 20);
            ctx.lineTo(canvasWidth, canvasHeight + 100);
            ctx.lineTo(0, canvasHeight + 100);
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

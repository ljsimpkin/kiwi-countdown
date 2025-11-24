// Background with sky, clouds, and ground

class Cloud {
    constructor(x, y, scale, speed) {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.speed = speed;
        this.baseSpeed = speed;
    }

    update(deltaTime, canvasWidth, totalDuration) {
        // Scale cloud speed based on timer duration
        let speedMultiplier = 1;
        if (totalDuration > 86400000) {
            speedMultiplier = 0.3; // Very slow for multi-day timers
        } else if (totalDuration > 3600000) {
            speedMultiplier = 0.6; // Slower for hour+ timers
        }

        this.x += (this.speed * speedMultiplier * deltaTime) / 1000;

        // Wrap around
        if (this.x > canvasWidth + 100) {
            this.x = -100;
        }
    }

    draw(ctx) {
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

class Background {
    constructor(canvas) {
        this.canvas = canvas;
        this.clouds = [];
        this.initClouds();
    }

    initClouds() {
        // Create 5 clouds at different positions and layers
        const cloudData = [
            { y: 100, scale: 0.8, speed: 15 },
            { y: 150, scale: 1.2, speed: 25 },
            { y: 200, scale: 0.9, speed: 20 },
            { y: 120, scale: 1.0, speed: 30 },
            { y: 180, scale: 1.1, speed: 18 }
        ];

        cloudData.forEach((data, index) => {
            const x = (this.canvas.width / cloudData.length) * index + Math.random() * 100;
            this.clouds.push(new Cloud(x, data.y, data.scale, data.speed));
        });
    }

    update(deltaTime, totalDuration) {
        this.clouds.forEach(cloud => {
            cloud.update(deltaTime, this.canvas.width, totalDuration);
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
        // Sort clouds by speed (slower = further back)
        const sortedClouds = [...this.clouds].sort((a, b) => a.speed - b.speed);
        sortedClouds.forEach(cloud => cloud.draw(ctx));
    }

    drawGround(ctx) {
        const groundY = this.canvas.height - 80;

        // Ground - grass
        ctx.fillStyle = '#7CB342';
        ctx.fillRect(0, groundY, this.canvas.width, 80);

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
        ctx.lineTo(this.canvas.width, this.canvas.height);
        ctx.lineTo(0, this.canvas.height);
        ctx.closePath();
        ctx.fill();
    }

    draw(ctx, totalDuration) {
        this.drawSky(ctx);
        this.drawClouds(ctx);
        this.drawGround(ctx);
    }
}

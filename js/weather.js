// Weather system with transitions (rain, snow, clear)

class Raindrop {
    constructor(x, y, canvasHeight) {
        this.x = x;
        this.y = y;
        this.canvasHeight = canvasHeight;
        this.speed = 8 + Math.random() * 4;
        this.length = 10 + Math.random() * 10;
        this.opacity = 0.3 + Math.random() * 0.3;
    }

    update(deltaTime) {
        this.y += this.speed * (deltaTime / 16);

        // Wrap around
        if (this.y > this.canvasHeight) {
            this.y = -this.length;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.strokeStyle = `rgba(174, 194, 224, ${this.opacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.length);
        ctx.stroke();
        ctx.restore();
    }
}

class Snowflake {
    constructor(x, y, canvasHeight) {
        this.x = x;
        this.y = y;
        this.canvasHeight = canvasHeight;
        this.speed = 1 + Math.random() * 2;
        this.radius = 2 + Math.random() * 3;
        this.opacity = 0.5 + Math.random() * 0.5;
        this.drift = Math.random() * 0.5 - 0.25;
        this.wobble = Math.random() * Math.PI * 2;
    }

    update(deltaTime) {
        this.y += this.speed * (deltaTime / 16);
        this.wobble += 0.05;
        this.x += Math.sin(this.wobble) * this.drift;

        // Wrap around
        if (this.y > this.canvasHeight) {
            this.y = -this.radius;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Add sparkle effect
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity * 0.5})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x - this.radius - 2, this.y);
        ctx.lineTo(this.x + this.radius + 2, this.y);
        ctx.moveTo(this.x, this.y - this.radius - 2);
        ctx.lineTo(this.x, this.y + this.radius + 2);
        ctx.stroke();

        ctx.restore();
    }
}

class WeatherManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.currentWeather = 'clear'; // 'clear', 'rain', 'snow'
        this.particles = [];
        this.transitionProgress = 1; // 0 = transitioning, 1 = complete
        this.nextWeather = null;

        // Weather change timing
        this.changeTimer = 0;
        this.changeInterval = 30000; // Change weather every 30 seconds
    }

    setWeather(weather) {
        if (weather !== this.currentWeather && this.transitionProgress >= 1) {
            this.nextWeather = weather;
            this.transitionProgress = 0;
        }
    }

    update(deltaTime) {
        const rect = this.canvas.getBoundingClientRect();

        // Handle transition
        if (this.transitionProgress < 1) {
            this.transitionProgress += deltaTime / 2000; // 2 second transition
            if (this.transitionProgress >= 1) {
                this.transitionProgress = 1;
                this.currentWeather = this.nextWeather;
                this.nextWeather = null;
                this.initParticles();
            }
        }

        // Auto weather changes (optional - can be disabled)
        this.changeTimer += deltaTime;
        if (this.changeTimer >= this.changeInterval) {
            this.changeTimer = 0;
            // Randomly pick new weather
            const weathers = ['clear', 'rain', 'snow'];
            const newWeather = weathers[Math.floor(Math.random() * weathers.length)];
            this.setWeather(newWeather);
        }

        // Update particles
        this.particles.forEach(particle => particle.update(deltaTime));

        // Spawn new particles based on weather
        if (this.currentWeather === 'rain' && this.particles.length < 100) {
            if (Math.random() < 0.3) {
                this.particles.push(new Raindrop(
                    Math.random() * rect.width,
                    -20,
                    rect.height
                ));
            }
        } else if (this.currentWeather === 'snow' && this.particles.length < 80) {
            if (Math.random() < 0.2) {
                this.particles.push(new Snowflake(
                    Math.random() * rect.width,
                    -10,
                    rect.height
                ));
            }
        }

        // Remove off-screen particles
        this.particles = this.particles.filter(p => p.y < rect.height + 50);
    }

    initParticles() {
        this.particles = [];
        const rect = this.canvas.getBoundingClientRect();

        if (this.currentWeather === 'rain') {
            // Create initial raindrops
            for (let i = 0; i < 50; i++) {
                this.particles.push(new Raindrop(
                    Math.random() * rect.width,
                    Math.random() * rect.height,
                    rect.height
                ));
            }
        } else if (this.currentWeather === 'snow') {
            // Create initial snowflakes
            for (let i = 0; i < 40; i++) {
                this.particles.push(new Snowflake(
                    Math.random() * rect.width,
                    Math.random() * rect.height,
                    rect.height
                ));
            }
        }
    }

    draw(ctx) {
        // Apply fade during transition
        let opacity = 1;
        if (this.transitionProgress < 1) {
            opacity = this.transitionProgress;
        }

        ctx.save();
        ctx.globalAlpha = opacity;
        this.particles.forEach(particle => particle.draw(ctx));
        ctx.restore();
    }

    reset() {
        this.currentWeather = 'clear';
        this.particles = [];
        this.transitionProgress = 1;
        this.nextWeather = null;
        this.changeTimer = 0;
    }
}

// Food items for the kiwi to collect

class Food {
    constructor(x, y, type = 'berry') {
        this.x = x;
        this.initialY = y; // Store initial Y position for scrolling
        this.y = y;
        this.type = type;
        this.collected = false;
        this.radius = 12;

        // Animation properties
        this.bobOffset = Math.random() * Math.PI * 2;
        this.bobSpeed = 0.003;
        this.bobAmplitude = 3;

        // Visual properties based on type
        this.setTypeProperties();
    }

    setTypeProperties() {
        switch (this.type) {
            case 'berry':
                this.color = '#FF1744';
                this.points = 10;
                this.emoji = '🍓';
                break;
            case 'worm':
                this.color = '#FF6F00';
                this.points = 25;
                this.emoji = '🪱';
                break;
            case 'apple':
                this.color = '#76FF03';
                this.points = 50;
                this.emoji = '🍎';
                break;
            default:
                this.color = '#FF1744';
                this.points = 10;
                this.emoji = '🍓';
        }
    }

    update(deltaTime, scrollOffset) {
        if (this.collected) return;

        // Bobbing animation
        this.bobOffset += this.bobSpeed * deltaTime;

        // Update Y position based on scroll offset (scroll upward like clouds)
        // Use same scrolling as clouds to move with the world
        this.y = this.initialY - scrollOffset;
    }

    draw(ctx) {
        if (this.collected) return;

        const bobY = Math.sin(this.bobOffset) * this.bobAmplitude;

        ctx.save();
        ctx.translate(this.x, this.y + bobY);

        // Draw glow effect
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius + 5);
        gradient.addColorStop(0, this.color + '80');
        gradient.addColorStop(1, this.color + '00');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius + 5, 0, Math.PI * 2);
        ctx.fill();

        // Draw food circle
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(-3, -3, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    checkCollision(kiwiX, kiwiY, kiwiRadius) {
        if (this.collected) return false;

        const dx = this.x - kiwiX;
        const dy = this.y - kiwiY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < (this.radius + kiwiRadius);
    }

    collect() {
        this.collected = true;
    }
}

class FoodManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.foods = [];
        this.spawnTimer = 0;
        this.spawnInterval = 3000; // Spawn food every 3 seconds
        this.maxFoods = 8; // Maximum food items on screen
    }

    update(deltaTime, scrollOffset) {
        // Update spawn timer
        this.spawnTimer += deltaTime;

        // Spawn new food if needed
        if (this.spawnTimer >= this.spawnInterval && this.foods.length < this.maxFoods) {
            this.spawnFood(scrollOffset);
            this.spawnTimer = 0;
        }

        // Update all foods with scroll offset
        this.foods.forEach(food => food.update(deltaTime, scrollOffset));

        // Remove collected foods
        this.foods = this.foods.filter(food => !food.collected);

        // Remove foods that are off screen (scrolled past)
        const rect = this.canvas.getBoundingClientRect();
        this.foods = this.foods.filter(food => {
            // Keep food if it's within reasonable bounds
            return food.y > -100 && food.y < rect.height + 100;
        });
    }

    spawnFood(scrollOffset) {
        const rect = this.canvas.getBoundingClientRect();

        // Random X position with some padding from edges
        const x = 50 + Math.random() * (rect.width - 100);

        // Spawn food ahead of the current scroll position
        // Add scrollOffset to the Y position so it spawns in "world space"
        // This way it will scroll into view from below as the world scrolls up
        const spawnDistance = rect.height + 100 + Math.random() * 300;
        const y = scrollOffset + spawnDistance;

        // Random food type (weighted distribution)
        const rand = Math.random();
        let type;
        if (rand < 0.6) {
            type = 'berry'; // 60% chance
        } else if (rand < 0.9) {
            type = 'worm'; // 30% chance
        } else {
            type = 'apple'; // 10% chance
        }

        this.foods.push(new Food(x, y, type));
    }

    draw(ctx) {
        this.foods.forEach(food => food.draw(ctx));
    }

    checkCollisions(kiwiX, kiwiY, kiwiRadius) {
        let totalPoints = 0;

        this.foods.forEach(food => {
            if (food.checkCollision(kiwiX, kiwiY, kiwiRadius)) {
                food.collect();
                totalPoints += food.points;
            }
        });

        return totalPoints;
    }

    reset() {
        this.foods = [];
        this.spawnTimer = 0;
    }
}

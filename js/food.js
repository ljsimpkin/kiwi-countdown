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

    update(deltaTime) {
        if (this.collected) return;

        // Bobbing animation
        this.bobOffset += this.bobSpeed * deltaTime;

        // Food floats upward faster toward the kiwi (from bottom to top)
        this.y -= 0.08 * deltaTime; // Faster upward movement
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
        this.spawnInterval = 1500; // Spawn food every 1.5 seconds (faster!)
        this.maxFoods = 15; // More food on screen at once

        // Spawn initial food
        this.spawnInitialFood();
    }

    spawnInitialFood() {
        // Spawn many foods at visible positions across the screen
        const rect = this.canvas.getBoundingClientRect();

        // Spawn 8 foods distributed across the screen
        for (let i = 0; i < 8; i++) {
            const x = 80 + (rect.width - 160) * (i / 7); // Spread across width
            const y = 100 + (rect.height - 200) * Math.random(); // Random height

            // Cycle through food types
            const types = ['berry', 'worm', 'apple'];
            const type = types[i % 3];

            const food = new Food(x, y, type);
            this.foods.push(food);
        }
    }

    update(deltaTime) {
        // Update spawn timer
        this.spawnTimer += deltaTime;

        // Spawn new food if needed
        if (this.spawnTimer >= this.spawnInterval && this.foods.length < this.maxFoods) {
            this.spawnFood();
            this.spawnTimer = 0;
        }

        // Update all foods
        this.foods.forEach(food => food.update(deltaTime));

        // Remove collected foods
        this.foods = this.foods.filter(food => !food.collected);

        // Remove foods that are off screen
        const rect = this.canvas.getBoundingClientRect();
        this.foods = this.foods.filter(food => {
            // Keep food if it's within reasonable bounds
            return food.y > -100 && food.y < rect.height + 100;
        });
    }

    spawnFood() {
        const rect = this.canvas.getBoundingClientRect();

        // Random X position with some padding from edges
        const x = 50 + Math.random() * (rect.width - 100);

        // Spawn below viewport (off-screen)
        const y = rect.height + 50 + Math.random() * 100; // Below bottom edge

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

        const food = new Food(x, y, type);
        this.foods.push(food);
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

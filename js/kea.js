// Kea antagonist - mischievous bird that steals food

class Kea {
    constructor(canvas) {
        this.canvas = canvas;
        const rect = canvas.getBoundingClientRect();

        // Spawn from random side
        this.spawnFromLeft = Math.random() < 0.5;
        this.x = this.spawnFromLeft ? -100 : rect.width + 100;
        this.y = 100 + Math.random() * (rect.height - 300);

        // Target food (will be set by manager)
        this.targetFood = null;

        // Movement
        this.speed = 0.15; // Slightly faster than kiwi's horizontal movement
        this.state = 'flying'; // 'flying', 'stealing', 'escaping'

        // Animation
        this.flapTime = 0;
        this.flapSpeed = 0.008;

        // Size - larger than kiwi
        this.bodyRadius = 28;
        this.wingSpan = 50;

        // Stolen food tracking
        this.stolenFood = null;
        this.stealTimer = 0;
        this.stealDuration = 800; // ms to complete steal animation
    }

    update(deltaTime, foods, kiwiX, kiwiY, onStealFood) {
        const rect = this.canvas.getBoundingClientRect();
        this.flapTime += deltaTime;

        if (this.state === 'flying') {
            // Look for nearest food
            if (!this.targetFood || this.targetFood.collected) {
                this.findNearestFood(foods);
            }

            if (this.targetFood && !this.targetFood.collected) {
                // Fly towards target food
                const dx = this.targetFood.x - this.x;
                const dy = this.targetFood.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 30) {
                    // Close enough to steal
                    this.state = 'stealing';
                    this.stealTimer = 0;
                    this.stolenFood = this.targetFood;
                } else {
                    // Move towards food
                    this.x += (dx / distance) * this.speed * deltaTime;
                    this.y += (dy / distance) * this.speed * deltaTime;
                }
            } else {
                // No food available, fly across screen and leave
                if (this.spawnFromLeft) {
                    this.x += this.speed * deltaTime;
                    if (this.x > rect.width + 100) {
                        return 'remove'; // Signal to remove this kea
                    }
                } else {
                    this.x -= this.speed * deltaTime;
                    if (this.x < -100) {
                        return 'remove';
                    }
                }
            }
        } else if (this.state === 'stealing') {
            // Steal animation - hover and grab
            this.stealTimer += deltaTime;

            // Hover in place with bobbing motion
            const bobAmount = Math.sin(this.stealTimer * 0.01) * 5;
            this.y = this.targetFood.y - 20 + bobAmount;
            this.x = this.targetFood.x;

            if (this.stealTimer >= this.stealDuration) {
                // Steal complete!
                this.targetFood.collected = true;
                this.state = 'escaping';

                // Notify callback
                if (onStealFood) {
                    onStealFood();
                }

                return 'stole_food'; // Signal that food was stolen
            }
        } else if (this.state === 'escaping') {
            // Fly off screen with stolen food
            if (this.spawnFromLeft) {
                this.x += this.speed * deltaTime * 1.5; // Escape faster
                this.y -= this.speed * deltaTime * 0.3; // Fly upward
                if (this.x > rect.width + 100) {
                    return 'remove';
                }
            } else {
                this.x -= this.speed * deltaTime * 1.5;
                this.y -= this.speed * deltaTime * 0.3;
                if (this.x < -100) {
                    return 'remove';
                }
            }
        }

        return null; // No special event
    }

    findNearestFood(foods) {
        if (foods.length === 0) {
            this.targetFood = null;
            return;
        }

        let nearest = null;
        let minDistance = Infinity;

        foods.forEach(food => {
            if (!food.collected) {
                const dx = food.x - this.x;
                const dy = food.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < minDistance) {
                    minDistance = distance;
                    nearest = food;
                }
            }
        });

        this.targetFood = nearest;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Flip based on direction of travel
        const facingLeft = this.state === 'flying'
            ? (this.targetFood && this.targetFood.x < this.x)
            : !this.spawnFromLeft;

        if (facingLeft) {
            ctx.scale(-1, 1);
        }

        // Wing flap animation
        const flapAngle = Math.sin(this.flapTime * this.flapSpeed) * 0.6;

        // Draw wings (behind body)
        ctx.fillStyle = '#2E7D32'; // Olive green
        ctx.strokeStyle = '#1B5E20';
        ctx.lineWidth = 2;

        // Left wing
        ctx.save();
        ctx.rotate(-flapAngle);
        ctx.beginPath();
        ctx.ellipse(-15, 0, this.wingSpan / 2, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Right wing
        ctx.save();
        ctx.rotate(flapAngle);
        ctx.beginPath();
        ctx.ellipse(15, 0, this.wingSpan / 2, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Draw body (olive green ellipse)
        ctx.fillStyle = '#558B2F';
        ctx.strokeStyle = '#33691E';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.bodyRadius, this.bodyRadius * 1.3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw head (olive green circle)
        ctx.fillStyle = '#558B2F';
        ctx.beginPath();
        ctx.arc(this.bodyRadius - 5, -this.bodyRadius + 5, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw curved beak (hooked - kea characteristic)
        ctx.fillStyle = '#FF6F00'; // Orange-brown
        ctx.strokeStyle = '#E65100';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(this.bodyRadius + 8, -this.bodyRadius + 5);
        ctx.quadraticCurveTo(
            this.bodyRadius + 20, -this.bodyRadius - 5,
            this.bodyRadius + 15, -this.bodyRadius + 10
        );
        ctx.lineTo(this.bodyRadius + 8, -this.bodyRadius + 5);
        ctx.fill();
        ctx.stroke();

        // Draw eye (mischievous look)
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.bodyRadius + 2, -this.bodyRadius + 3, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.bodyRadius + 3, -this.bodyRadius + 3, 2, 0, Math.PI * 2);
        ctx.fill();

        // Add eyebrow for mischievous expression
        ctx.strokeStyle = '#33691E';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.bodyRadius - 2, -this.bodyRadius);
        ctx.lineTo(this.bodyRadius + 6, -this.bodyRadius - 2);
        ctx.stroke();

        // Draw tail feathers
        ctx.fillStyle = '#2E7D32';
        ctx.strokeStyle = '#1B5E20';
        ctx.lineWidth = 1.5;
        for (let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.moveTo(-this.bodyRadius, i * 8);
            ctx.lineTo(-this.bodyRadius - 20, i * 12);
            ctx.lineTo(-this.bodyRadius, i * 8);
            ctx.fill();
            ctx.stroke();
        }

        // Draw stolen food if carrying
        if (this.state === 'escaping' && this.stolenFood) {
            ctx.translate(0, this.bodyRadius + 10);
            ctx.scale(0.7, 0.7);

            // Draw simplified food item
            if (this.stolenFood.type === 'berry') {
                ctx.fillStyle = '#E53935';
                ctx.beginPath();
                ctx.arc(0, 0, 8, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.stolenFood.type === 'worm') {
                ctx.fillStyle = '#F4A460';
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(-8, 0);
                ctx.quadraticCurveTo(-4, -6, 0, 0);
                ctx.quadraticCurveTo(4, 6, 8, 0);
                ctx.stroke();
            } else if (this.stolenFood.type === 'apple') {
                ctx.fillStyle = '#C62828';
                ctx.strokeStyle = '#8B0000';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(0, 0, 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
        }

        ctx.restore();
    }

    isOffScreen() {
        const rect = this.canvas.getBoundingClientRect();
        return this.x < -150 || this.x > rect.width + 150 || this.y < -150 || this.y > rect.height + 150;
    }
}

class KeaManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.keas = [];
        this.spawnTimer = 0;
        this.baseSpawnInterval = 15000; // Base: spawn kea every 15 seconds
        this.spawnInterval = this.baseSpawnInterval;
        this.foodsStolenCount = 0;
        this.active = false; // Only spawn keas when timer is running
    }

    activate() {
        this.active = true;
    }

    deactivate() {
        this.active = false;
        this.keas = []; // Clear all keas
    }

    update(deltaTime, foods, kiwiX, kiwiY, percentComplete, onStealFood) {
        if (!this.active) return;

        // Increase spawn frequency as timer progresses (gets harder!)
        // At 0%: 15s interval, at 100%: 8s interval
        this.spawnInterval = this.baseSpawnInterval - (percentComplete * 7000);
        this.spawnInterval = Math.max(8000, this.spawnInterval);

        // Spawn new keas
        this.spawnTimer += deltaTime;
        if (this.spawnTimer >= this.spawnInterval && this.keas.length < 3) {
            // Max 3 keas at once
            this.spawnTimer = 0;
            this.spawnKea();
        }

        // Update existing keas
        this.keas = this.keas.filter(kea => {
            const result = kea.update(deltaTime, foods, kiwiX, kiwiY, onStealFood);

            if (result === 'stole_food') {
                this.foodsStolenCount++;
            }

            return result !== 'remove';
        });
    }

    spawnKea() {
        const kea = new Kea(this.canvas);
        this.keas.push(kea);
    }

    draw(ctx) {
        this.keas.forEach(kea => kea.draw(ctx));
    }

    reset() {
        this.keas = [];
        this.spawnTimer = 0;
        this.foodsStolenCount = 0;
        this.active = false;
    }

    getFoodsStolenCount() {
        return this.foodsStolenCount;
    }
}

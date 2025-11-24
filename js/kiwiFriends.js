// Dancing kiwi friends that appear when the timer completes

class KiwiFriend {
    constructor(x, y, delay, direction) {
        this.targetX = x;
        this.targetY = y;
        this.x = x;
        this.y = y + 200; // Start below
        this.delay = delay;
        this.direction = direction; // 1 for right-facing, -1 for left-facing
        this.visible = false;
        this.entryProgress = 0;
        this.danceTime = 0;

        // Size - slightly smaller than main kiwi
        this.bodyRadius = 22;
        this.headRadius = 16;

        // Color variations - more distinct colors
        const colors = ['#A0522D', '#8B6914', '#CD853F', '#D2691E'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update(deltaTime, landingProgress) {
        // Wait for delay before appearing
        if (landingProgress < this.delay) {
            return;
        }

        this.visible = true;

        // Entry animation - pop up from below with BIG bounce
        if (this.entryProgress < 1) {
            this.entryProgress += deltaTime / 400; // 400ms entry (faster)
            this.entryProgress = Math.min(1, this.entryProgress);

            // Ease out bounce with overshoot
            const t = this.entryProgress;
            const bounceT = 1 - Math.pow(1 - t, 3);
            this.y = this.targetY + (200 * (1 - bounceT));
        } else {
            // Dance! BIGGER bounces and wiggles
            this.danceTime += deltaTime;

            // BIGGER bounce up and down (offset from main kiwi for variety)
            const danceOffset = Math.sin(this.danceTime * 0.014 + this.delay * 3) * 12;
            this.y = this.targetY + danceOffset;
        }
    }

    draw(ctx) {
        if (!this.visible) return;

        ctx.save();
        ctx.translate(this.x, this.y);

        // BIGGER Dance rotation - wiggle more!
        const rotation = Math.sin(this.danceTime * 0.016 + this.delay * 2) * 0.2;
        ctx.rotate(rotation);

        // Flip horizontally based on direction
        ctx.scale(this.direction, 1);

        // Draw body (brown ellipse)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.bodyRadius, this.bodyRadius * 1.2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw head (brown circle)
        ctx.beginPath();
        ctx.arc(-5, -this.bodyRadius, this.headRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw beak (orange triangle)
        ctx.fillStyle = '#FF8C00';
        ctx.beginPath();
        ctx.moveTo(-5 - this.headRadius, -this.bodyRadius);
        ctx.lineTo(-5 - this.headRadius - 12, -this.bodyRadius - 2);
        ctx.lineTo(-5 - this.headRadius - 12, -this.bodyRadius + 2);
        ctx.closePath();
        ctx.fill();

        // Draw eye (white with black pupil)
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(-5 - 5, -this.bodyRadius - 2, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(-5 - 5, -this.bodyRadius - 2, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Draw feet
        ctx.fillStyle = '#FF8C00';
        // Left foot
        ctx.beginPath();
        ctx.moveTo(-8, this.bodyRadius * 1.2);
        ctx.lineTo(-12, this.bodyRadius * 1.2 + 8);
        ctx.lineTo(-4, this.bodyRadius * 1.2 + 8);
        ctx.closePath();
        ctx.fill();
        // Right foot
        ctx.beginPath();
        ctx.moveTo(8, this.bodyRadius * 1.2);
        ctx.lineTo(4, this.bodyRadius * 1.2 + 8);
        ctx.lineTo(12, this.bodyRadius * 1.2 + 8);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}

class KiwiFriendsManager {
    constructor(canvas, kiwiX, kiwiY) {
        this.canvas = canvas;
        this.friends = [];
        this.active = false;

        // Create 6 friends at different positions around the main kiwi - make them spread out more!
        const spacing = 100; // Increased spacing for better visibility

        // Left side friends (facing right toward center)
        this.friends.push(new KiwiFriend(kiwiX - spacing * 2.5, kiwiY, 0.35, 1)); // Far left
        this.friends.push(new KiwiFriend(kiwiX - spacing * 1.5, kiwiY, 0.4, 1)); // Mid left
        this.friends.push(new KiwiFriend(kiwiX - spacing * 0.7, kiwiY, 0.45, 1)); // Close left

        // Right side friends (facing left toward center)
        this.friends.push(new KiwiFriend(kiwiX + spacing * 0.7, kiwiY, 0.45, -1)); // Close right
        this.friends.push(new KiwiFriend(kiwiX + spacing * 1.5, kiwiY, 0.5, -1)); // Mid right
        this.friends.push(new KiwiFriend(kiwiX + spacing * 2.5, kiwiY, 0.55, -1)); // Far right
    }

    activate() {
        this.active = true;
    }

    update(deltaTime, landingProgress) {
        if (!this.active) return;

        this.friends.forEach(friend => {
            friend.update(deltaTime, landingProgress);
        });
    }

    draw(ctx) {
        if (!this.active) return;

        this.friends.forEach(friend => {
            friend.draw(ctx);
        });
    }
}

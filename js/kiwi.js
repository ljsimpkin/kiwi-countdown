// Kiwi bird entity

class Kiwi {
    constructor(canvas) {
        this.canvas = canvas;

        // Kiwi stays centered vertically and horizontally
        this.centerY = canvas.height / 2;
        this.x = canvas.width / 2;
        this.y = this.centerY;

        // Animation properties
        this.swayOffset = 0;
        this.swaySpeed = 0.002;
        this.swayAmplitude = 15;
        this.rotation = 0;

        // Size
        this.bodyRadius = 25;
        this.headRadius = 18;

        // Landing state
        this.isLanded = false;
        this.landingBounce = 0;
        this.landingProgress = 0;
    }

    updatePosition(percentComplete, deltaTime = 16) {
        if (this.isLanded) {
            this.updateLanding(deltaTime);
            return;
        }

        // Kiwi stays centered vertically - no Y position change
        this.y = this.centerY;

        // Update sway animation (horizontal movement)
        this.swayOffset += this.swaySpeed * deltaTime;
        const swayX = Math.sin(this.swayOffset) * this.swayAmplitude;
        this.x = (this.canvas.width / 2) + swayX;

        // Slight rotation based on sway
        this.rotation = Math.sin(this.swayOffset) * 0.05;
    }

    land() {
        this.isLanded = true;
        this.landingProgress = 0;
        // Kiwi stays centered even when landed
        this.y = this.centerY;
    }

    updateLanding(deltaTime) {
        if (this.landingProgress < 1) {
            this.landingProgress += deltaTime / 1000;

            // Bounce effect - small bounce in place
            if (this.landingProgress < 0.3) {
                const bounceT = this.landingProgress / 0.3;
                this.landingBounce = Math.sin(bounceT * Math.PI) * -10;
            } else {
                this.landingBounce = 0;
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y + this.landingBounce);
        ctx.rotate(this.rotation);

        // Draw body (brown ellipse)
        ctx.fillStyle = '#8B4513';
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
        ctx.lineTo(-5 - this.headRadius - 15, -this.bodyRadius - 3);
        ctx.lineTo(-5 - this.headRadius - 15, -this.bodyRadius + 3);
        ctx.closePath();
        ctx.fill();

        // Draw eye (white with black pupil)
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(-5 - 6, -this.bodyRadius - 3, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(-5 - 6, -this.bodyRadius - 3, 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw feet (only when landed)
        if (this.isLanded && this.landingBounce === 0) {
            ctx.fillStyle = '#FF8C00';
            // Left foot
            ctx.beginPath();
            ctx.moveTo(-10, this.bodyRadius * 1.2);
            ctx.lineTo(-15, this.bodyRadius * 1.2 + 10);
            ctx.lineTo(-5, this.bodyRadius * 1.2 + 10);
            ctx.closePath();
            ctx.fill();
            // Right foot
            ctx.beginPath();
            ctx.moveTo(10, this.bodyRadius * 1.2);
            ctx.lineTo(5, this.bodyRadius * 1.2 + 10);
            ctx.lineTo(15, this.bodyRadius * 1.2 + 10);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    }

    getAttachmentPoint() {
        return {
            x: this.x,
            y: this.y - this.bodyRadius * 1.2 - 10 + this.landingBounce
        };
    }
}

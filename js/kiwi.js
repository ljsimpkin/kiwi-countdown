// Kiwi bird entity

class Kiwi {
    constructor(canvas) {
        this.canvas = canvas;

        // Get the actual display dimensions (not scaled by DPR)
        const rect = canvas.getBoundingClientRect();

        // Kiwi stays centered vertically and horizontally
        this.centerY = rect.height / 2;
        this.centerX = rect.width / 2;
        this.x = this.centerX;
        this.y = this.centerY;

        // User-controlled horizontal offset
        this.userOffsetX = 0;
        this.moveSpeed = 0.3; // Pixels per millisecond

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

        // Keyboard state
        this.keys = {
            left: false,
            right: false
        };

        // Setup keyboard and touch listeners
        this.setupKeyboardControls();
        this.setupTouchControls();
    }

    setupKeyboardControls() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.keys.left = true;
                e.preventDefault();
            } else if (e.key === 'ArrowRight') {
                this.keys.right = true;
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft') {
                this.keys.left = false;
                e.preventDefault();
            } else if (e.key === 'ArrowRight') {
                this.keys.right = false;
                e.preventDefault();
            }
        });
    }

    setupTouchControls() {
        // Handle both mouse and touch events
        const handleStart = (e) => {
            e.preventDefault();

            // Get canvas bounding rect
            const rect = this.canvas.getBoundingClientRect();

            // Get touch/click position
            let clientX;
            if (e.type === 'touchstart') {
                clientX = e.touches[0].clientX;
            } else {
                clientX = e.clientX;
            }

            // Calculate position relative to canvas
            const x = clientX - rect.left;
            const centerX = rect.width / 2;

            // Left half = move left, right half = move right
            if (x < centerX) {
                this.keys.left = true;
                this.keys.right = false;
            } else {
                this.keys.right = true;
                this.keys.left = false;
            }
        };

        const handleEnd = (e) => {
            e.preventDefault();
            this.keys.left = false;
            this.keys.right = false;
        };

        // Mouse events
        this.canvas.addEventListener('mousedown', handleStart);
        this.canvas.addEventListener('mouseup', handleEnd);
        this.canvas.addEventListener('mouseleave', handleEnd);

        // Touch events
        this.canvas.addEventListener('touchstart', handleStart, { passive: false });
        this.canvas.addEventListener('touchend', handleEnd, { passive: false });
        this.canvas.addEventListener('touchcancel', handleEnd, { passive: false });
    }

    updatePosition(percentComplete, deltaTime = 16) {
        if (this.isLanded) {
            this.updateLanding(deltaTime);
            return;
        }

        // Get current display dimensions
        const rect = this.canvas.getBoundingClientRect();

        // Kiwi stays centered vertically - no Y position change
        this.y = this.centerY;

        // Handle keyboard input for horizontal movement
        if (this.keys.left) {
            this.userOffsetX -= this.moveSpeed * deltaTime;
        }
        if (this.keys.right) {
            this.userOffsetX += this.moveSpeed * deltaTime;
        }

        // Clamp user offset to keep kiwi on screen
        const maxOffset = rect.width / 2 - 50; // 50px padding from edges
        this.userOffsetX = Math.max(-maxOffset, Math.min(maxOffset, this.userOffsetX));

        // Update sway animation (horizontal movement)
        this.swayOffset += this.swaySpeed * deltaTime;
        const swayX = Math.sin(this.swayOffset) * this.swayAmplitude;

        // Combine center position, user offset, and sway
        this.x = this.centerX + this.userOffsetX + swayX;

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

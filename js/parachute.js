// Parachute rendering

class Parachute {
    constructor() {
        this.chuteWidth = 80;
        this.chuteHeight = 50;
        this.ropeLength = 40;

        // Billowing animation
        this.billowOffset = 0;
        this.billowSpeed = 0.003;
        this.billowAmplitude = 5;

        // Collapsed state
        this.isCollapsed = false;
        this.collapseProgress = 0;
    }

    update(deltaTime = 16) {
        this.billowOffset += this.billowSpeed * deltaTime;

        if (this.isCollapsed && this.collapseProgress < 1) {
            this.collapseProgress += deltaTime / 1000;
        }
    }

    collapse() {
        this.isCollapsed = true;
        this.collapseProgress = 0;
    }

    draw(ctx, kiwiAttachPoint) {
        if (this.collapseProgress >= 1) return;

        const { x: kiwiX, y: kiwiY } = kiwiAttachPoint;

        // Calculate parachute position
        const chuteX = kiwiX;
        const chuteY = kiwiY - this.ropeLength;

        // Billowing effect
        const billow = Math.sin(this.billowOffset) * this.billowAmplitude;

        // Collapse effect
        const collapseScale = 1 - (this.collapseProgress * 0.8);
        const collapseY = this.collapseProgress * 30;

        ctx.save();
        ctx.translate(chuteX, chuteY + collapseY);
        ctx.scale(collapseScale, collapseScale);

        // Draw parachute ropes
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;

        const ropePoints = [
            { x: -this.chuteWidth / 2, y: this.chuteHeight / 2 },
            { x: -this.chuteWidth / 4, y: this.chuteHeight / 2 },
            { x: this.chuteWidth / 4, y: this.chuteHeight / 2 },
            { x: this.chuteWidth / 2, y: this.chuteHeight / 2 }
        ];

        ropePoints.forEach(point => {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(0, this.ropeLength);
            ctx.stroke();
        });

        // Draw parachute canopy
        ctx.fillStyle = '#FF6B6B';
        ctx.strokeStyle = '#CC5555';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(-this.chuteWidth / 2, this.chuteHeight / 2);

        // Create curved top with billowing
        const segments = 8;
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const x = lerp(-this.chuteWidth / 2, this.chuteWidth / 2, t);
            const baseY = -this.chuteHeight / 2;

            // Parabolic curve for canopy
            const curveY = baseY + Math.pow((t - 0.5) * 2, 2) * (this.chuteHeight * 0.8);

            // Add billowing
            const billowY = Math.sin(t * Math.PI * 2 + this.billowOffset) * billow;

            ctx.lineTo(x, curveY + billowY);
        }

        ctx.lineTo(this.chuteWidth / 2, this.chuteHeight / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }
}

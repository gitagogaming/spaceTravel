import { isGameOver, canvas, ctx, bullets, getShipRect, activePowerUps } from './gameState.js';

class BulletManager {
    constructor() {
        this.bullets = bullets;
        this.bulletSpeed = 8;
        this.bulletSize = 5;
        this.bulletColor = '#FF9500';
        this.canvas = canvas;
        this.ctx = ctx;
        this.mousePosition = { x: 0, y: 0 };
        this.maxFiringAngle = 60; // 60 degrees on each side = 120 degrees total
    }

    updateMousePosition(x, y) {
        this.mousePosition = { x, y };
    }

    createBullet() {
        if (isGameOver) return;

        const shipRect = getShipRect();
        const shipCenterX = shipRect.left + (shipRect.right - shipRect.left) / 2;
        const shipCenterY = shipRect.top;

        let velocityX = 0;
        let velocityY = -this.bulletSpeed; // Default is straight up
        let angle = -Math.PI / 2; // Straight up

        // If angle shooting powerup is active, calculate direction based on mouse position
        if (activePowerUps.angleShooting) {
            // Calculate angle between ship and mouse
            let angleToMouse = Math.atan2(this.mousePosition.y - shipCenterY, this.mousePosition.x - shipCenterX);
            
            // Convert to degrees for easier calculation
            let angleDegrees = angleToMouse * (180 / Math.PI);
            
            // Restrict the angle to a 120-degree arc (from -30 to -150 degrees)
            if (angleDegrees > -30) angleDegrees = -30;
            if (angleDegrees < -150) angleDegrees = -150;
            
            // Convert back to radians
            angle = angleDegrees * (Math.PI / 180);
            
            // Calculate velocity components based on angle
            velocityX = Math.cos(angle) * this.bulletSpeed;
            velocityY = Math.sin(angle) * this.bulletSpeed;
        }

        this.bullets.push({
            x: shipCenterX,
            y: shipCenterY,
            size: this.bulletSize,
            velocityX: velocityX,
            velocityY: velocityY,
            speed: this.bulletSpeed,
            color: this.bulletColor,
            angle: angle
        });
    }

    updateBullets() {
        for (let i = 0; i < this.bullets.length; i++) {
            const bullet = this.bullets[i];
            
            // Move bullet in the direction of its velocity
            bullet.x += bullet.velocityX;
            bullet.y += bullet.velocityY;

            // Remove bullets that have moved off screen
            if (bullet.y < 0 || bullet.x < 0 || bullet.x > this.canvas.width || bullet.y > this.canvas.height) {
                this.bullets.splice(i, 1);
                i--;
            }
        }
    }

    drawBullets() {
        this.ctx.save();
        for (let bullet of this.bullets) {
            // Create a radial gradient for glow effect
            const gradient = this.ctx.createRadialGradient(
                bullet.x, bullet.y, 0,
                bullet.x, bullet.y, bullet.size * 2
            );
            gradient.addColorStop(0, bullet.color);
            gradient.addColorStop(1, 'rgba(255, 149, 0, 0)');
            
            // Draw glow
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(bullet.x, bullet.y, bullet.size * 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw bullet
            this.ctx.fillStyle = 'white';
            this.ctx.beginPath();
            this.ctx.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.restore();
    }

    checkBulletAsteroidCollision(asteroids, onCollision) {
        for (let i = 0; i < this.bullets.length; i++) {
            const bullet = this.bullets[i];
            
            for (let j = 0; j < asteroids.length; j++) {
                const asteroid = asteroids[j];
                
                // Improved collision detection using distance calculation
                const asteroidCenterX = asteroid.x + asteroid.width / 2;
                const asteroidCenterY = asteroid.y + asteroid.height / 2;
                
                // Calculate distance between bullet and asteroid center
                const distX = bullet.x - asteroidCenterX;
                const distY = bullet.y - asteroidCenterY;
                const distance = Math.sqrt(distX * distX + distY * distY);
                
                // Consider collision if the distance is less than bullet size + average asteroid radius
                const asteroidRadius = (asteroid.width + asteroid.height) / 4;
                if (distance < bullet.size + asteroidRadius) {
                    // Call the callback function with the indexes
                    onCollision(i, j);
                    return; // Exit after finding first collision
                }
            }
        }
    }
}

export default BulletManager;

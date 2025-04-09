import { isGameOver, canvas, ctx, bullets, getShipRect } from './gameState.js';

class BulletManager {
    constructor() {
        this.bullets = bullets;
        this.bulletSpeed = 8;
        this.bulletSize = 5;
        this.bulletColor = '#FF9500';
        this.canvas = canvas;
        this.ctx = ctx;
    }

    createBullet() {
        if (isGameOver) return;

        const shipRect = getShipRect();
        const bulletX = shipRect.left + (shipRect.right - shipRect.left) / 2;
        const bulletY = shipRect.top;

        this.bullets.push({
            x: bulletX,
            y: bulletY,
            size: this.bulletSize,
            speed: this.bulletSpeed,
            color: this.bulletColor
        });
    }

    updateBullets() {
        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].y -= this.bullets[i].speed;

            // Remove bullets that have moved off screen
            if (this.bullets[i].y < 0) {
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

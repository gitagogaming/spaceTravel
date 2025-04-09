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
            this.ctx.fillStyle = bullet.color;
            this.ctx.beginPath();
            this.ctx.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Add a glow effect
            this.ctx.shadowColor = bullet.color;
            this.ctx.shadowBlur = 10;
            this.ctx.fill();
        }
        this.ctx.restore();
    }

    checkBulletAsteroidCollision(asteroids, onCollision) {
        for (let i = 0; i < this.bullets.length; i++) {
            const bullet = this.bullets[i];
            
            for (let j = 0; j < asteroids.length; j++) {
                const asteroid = asteroids[j];
                
                // Simple collision detection between bullet and asteroid
                const bulletRect = {
                    left: bullet.x - bullet.size,
                    right: bullet.x + bullet.size,
                    top: bullet.y - bullet.size,
                    bottom: bullet.y + bullet.size
                };
                
                const asteroidRect = {
                    left: asteroid.x,
                    right: asteroid.x + asteroid.width,
                    top: asteroid.y,
                    bottom: asteroid.y + asteroid.height
                };
                
                if (!(bulletRect.right < asteroidRect.left ||
                    bulletRect.left > asteroidRect.right ||
                    bulletRect.bottom < asteroidRect.top ||
                    bulletRect.top > asteroidRect.bottom)) {
                    
                    // Call the callback function with the indexes
                    onCollision(i, j);
                    return; // Exit after finding first collision
                }
            }
        }
    }
}

export default BulletManager;

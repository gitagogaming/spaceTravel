import { isGameOver, gameIsOver, canvas, ctx, getShipRect,
         defaultAsteroidFallSpeed, asteroids, asteroidSpawnRate
       } from './gameState.js';

class Asteroids {
    constructor() {
        this.asteroids = asteroids;
        this.asteroidFallSpeed = defaultAsteroidFallSpeed;
        this.asteroidSpawnRate = asteroidSpawnRate;
        this.canvas = canvas;
        this.ctx = ctx;
    }
    
    updateFallSpeed(newSpeed) {
        this.asteroidFallSpeed = newSpeed;
    }

    createAsteroid() {
        if (isGameOver) return;

        setInterval(() => {
            let randomRockHeight = Math.random() * 5 + 30;
            let randomRockWidth = Math.random() * 5 + 30;
            let randomRockRadius1 = Math.floor(Math.random() * 3) + 6;
            let randomRockRadius2 = Math.floor(Math.random() * 6) + 3;
            let x = Math.random() * this.canvas.width;
            let y = -randomRockHeight;
            let randomSpeed = Math.random() * this.asteroidFallSpeed + 1;
            let randomRotationSpeed = (Math.random() - 0.5) * 0.02;

            this.asteroids.push({
                x: x,
                y: y,
                width: randomRockWidth,
                height: randomRockHeight,
                radius1: randomRockRadius1,
                radius2: randomRockRadius2,
                speed: randomSpeed,
                rotation: 0,
                rotationSpeed: randomRotationSpeed
            });
        }, this.asteroidSpawnRate);
    }

    drawAsteroid = (asteroid) => {
        this.ctx.save();
        this.ctx.translate(asteroid.x + asteroid.width / 2, asteroid.y + asteroid.height / 2);
        this.ctx.rotate(asteroid.rotation);

        const gradient = this.ctx.createLinearGradient(-asteroid.width / 2, -asteroid.height / 2, asteroid.width / 2, asteroid.height / 2);
        gradient.addColorStop(0, '#555');
        gradient.addColorStop(1, '#333');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.moveTo(-asteroid.width / 2 + asteroid.radius1, -asteroid.height / 2);
        this.ctx.lineTo(asteroid.width / 2 - asteroid.radius1, -asteroid.height / 2);
        this.ctx.quadraticCurveTo(asteroid.width / 2, -asteroid.height / 2, asteroid.width / 2, -asteroid.height / 2 + asteroid.radius1);
        this.ctx.lineTo(asteroid.width / 2, asteroid.height / 2 - asteroid.radius2);
        this.ctx.quadraticCurveTo(asteroid.width / 2, asteroid.height / 2, asteroid.width / 2 - asteroid.radius2, asteroid.height / 2);
        this.ctx.lineTo(-asteroid.width / 2 + asteroid.radius2, asteroid.height / 2);
        this.ctx.quadraticCurveTo(-asteroid.width / 2, asteroid.height / 2, -asteroid.width / 2, asteroid.height / 2 - asteroid.radius2);
        this.ctx.lineTo(-asteroid.width / 2, -asteroid.height / 2 + asteroid.radius1);
        this.ctx.quadraticCurveTo(-asteroid.width / 2, -asteroid.height / 2, -asteroid.width / 2 + asteroid.radius1, -asteroid.height / 2);

        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }

    updateAsteroids() {
        this.asteroids.forEach((asteroid, index) => {
            asteroid.y += asteroid.speed; // Adjusting speed of asteroid based upon itself
            asteroid.rotation += asteroid.rotationSpeed;
            
            if (this.hasCollided(asteroid)) {
                gameIsOver();
                return;
            }

            if (asteroid.y > this.canvas.height) {
                this.asteroids.splice(index, 1);
            }
        });
    }

    createAsteroidExplosion(x, y) {
        // Optional enhancement: Add explosion effect when an asteroid is destroyed
        const particleCount = 15;
        for (let i = 0; i < particleCount; i++) {
            const size = Math.random() * 3 + 1;
            const speed = Math.random() * 2 + 1;
            const angle = Math.random() * Math.PI * 2;
            const dx = Math.cos(angle) * speed;
            const dy = Math.sin(angle) * speed;
            
            const particle = {
                x, y,
                size,
                dx, dy,
                color: '#FFA500',
                life: 30
            };
            
            // Add particle to a particles array and animate them in the game loop
        }
    }

    hasCollided(asteroid) {
        const shipRect = getShipRect();
        const asteroidRect = {
            left: asteroid.x,
            top: asteroid.y,
            right: asteroid.x + asteroid.width,
            bottom: asteroid.y + asteroid.height
        };

        return !(
            shipRect.right < asteroidRect.left ||
            shipRect.left > asteroidRect.right ||
            shipRect.bottom < asteroidRect.top ||
            shipRect.top > asteroidRect.bottom
        );
    }
}

export default Asteroids;
import * as GameState from '../game/GameState.js';

class AsteroidManager {
    constructor() {
        this.asteroids = GameState.asteroids;
        this.asteroidFallSpeed = GameState.defaultAsteroidFallSpeed;
        this.asteroidSpawnRate = GameState.asteroidSpawnRate;
        this.canvas = GameState.canvas;
        this.ctx = GameState.ctx;

        this.asteroidImage = new Image();
        this.asteroidImage.src = "/asteroid.svg"; 
    }
    
    updateFallSpeed(newSpeed) {
        this.asteroidFallSpeed = newSpeed;
    }

    createAsteroid() {
        if (GameState.isGameOver) return;

        setInterval(() => {
            let randomRockHeight = Math.random() * 5 + 50;
            let randomRockWidth = Math.random() * 5 + 50;
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
        if (GameState.isGameOver) return;
        // Save the current canvas state
        this.ctx.save();
        
        // Debug visualization before any transformations
        if (GameState.debugMode) {
            // Draw bounding box in original position
            this.ctx.strokeStyle = 'yellow';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(
                asteroid.x,
                asteroid.y,
                asteroid.width,
                asteroid.height
            );
            
            // Draw center point
            this.ctx.fillStyle = 'yellow';
            this.ctx.beginPath();
            this.ctx.arc(
                asteroid.x + asteroid.width/2, 
                asteroid.y + asteroid.height/2, 
                3, 0, Math.PI * 2
            );
            this.ctx.fill();
            
            // Show collision radius
            this.ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
            this.ctx.beginPath();
            this.ctx.arc(
                asteroid.x + asteroid.width/2,
                asteroid.y + asteroid.height/2,
                (asteroid.width + asteroid.height)/4, // Average radius used in collision detection
                0, Math.PI * 2
            );
            this.ctx.stroke();
        }
        
        // Translate to the asteroid's center position
        this.ctx.translate(asteroid.x + asteroid.width / 2, asteroid.y + asteroid.height / 2);
        
        // Apply rotation
        this.ctx.rotate(asteroid.rotation);
        

        
        // Draw the image centered at the asteroid's position
        // The -asteroid.width/2 and -asteroid.height/2 ensure it's centered
        this.ctx.drawImage(
            this.asteroidImage,
            -asteroid.width / 2,
            -asteroid.height / 2,
            asteroid.width,
            asteroid.height
        );
        
        if (GameState.debugMode) {
            // Draw rotated bounding box
            this.ctx.strokeStyle = 'red';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(
                -asteroid.width / 2,
                -asteroid.height / 2,
                asteroid.width,
                asteroid.height
            );
            
            // Draw center point in rotated space
            this.ctx.fillStyle = 'red';
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 5, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Restore the canvas state
        this.ctx.restore();
    }

    updateAsteroids() {
        this.asteroids.forEach((asteroid, index) => {
            asteroid.y += asteroid.speed; // Adjusting speed of asteroid based upon itself
            asteroid.rotation += asteroid.rotationSpeed;
            
            if (this.hasCollided(asteroid)) {
                GameState.gameIsOver();
                return;
            }

            if (asteroid.y > this.canvas.height) {
                this.asteroids.splice(index, 1);
            }
        });
    }

    hasCollided(asteroid) {
        const shipRect = GameState.getShipRect();
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

export default AsteroidManager;

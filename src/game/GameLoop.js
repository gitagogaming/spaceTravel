import * as GameState from './GameState.js';
import { drawStars } from '../utils/CreateStars.js';

export function gameLoop() {
    const { ctx, canvas } = GameState;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    GameState.shipRectUpdate();
    drawStars();
    
    // Update bullet cooldown
    GameState.updateBulletCooldown();
    
    // Update and draw power-ups
    GameState.updatePowerUps();
    GameState.drawPowerUps();
    GameState.drawPowerUpIndicator();
    
    // Update and draw bullets
    GameState.bulletManager.updateBullets();
    GameState.bulletManager.drawBullets();
    
    // Draw aiming line
    GameState.drawAimingLine();
    
    // Check for bullet-asteroid collisions
    GameState.bulletManager.checkBulletAsteroidCollision(
        GameState.asteroids, 
        GameState.handleBulletAsteroidCollision
    );
    
    // Update and draw explosions
    GameState.updateParticles();
    
    GameState.asteroidManager.updateAsteroids();
    GameState.asteroids.forEach(GameState.asteroidManager.drawAsteroid);
    GameState.antiMatterManager.drawAntiMatter();
    
    // Draw particles on top of everything else
    GameState.drawParticles();
    
    requestAnimationFrame(gameLoop);
}

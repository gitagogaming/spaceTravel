import AntiMatterManager from '../entities/AntiMatter.js';
import AsteroidManager from '../entities/Asteroid.js';
import BulletManager from '../entities/Bullet.js';

// Keeping all of the main game data in one place so other classes/files can access easily
const score = document.getElementById("distance");
const scoreDetail = document.getElementById("scoreDetail");
const finalScoreDetail = document.getElementById("finalScoreDetail");
const highScoreDetail = document.getElementById("highScoreDetail");
const anitMatterScore = document.getElementById("antiMatterValue");
const matterDetail = document.getElementById("matterDetail");
const gameOver = document.getElementById("gameOver");
const restartBtn = document.getElementById("restart");

export const canvas = document.getElementById('game-canvas');
export const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

export let shipRect = spaceShip.getBoundingClientRect(); 

export let isGameOver = false; 
export let distanceValue = 0.0;
export let distanceInterval;
export let matterValue = 0;
export let fuelInterval;

// Settings that can be changed based on total antimatter collected or distance travelled... 
// Can do some sort of powerup to speed up ship as well or slowdown asteroids while speeding up ship etc..
export let antiMatterElements = [];   // Array to store all the antimatter elements
export let defaultAntiMatterFallSpeed = 0.6; // Adjusted dynamically based on user input using the "W" and "S" keys
export let antiMatterSpawnRate = 3000; // Adjust this value to control the spawn rate - LOWER = FASTER SPAWN
export let shipMovementSpeed = 2;    // Adjusted dynamically based on user input using the "W" and "S" keys

export let asteroids = [];           // Array to store all the asteroids
export let defaultAsteroidFallSpeed = 0.6;  // Current Adjusted dynamically based on user input with keys, could be based on total antimatter collected or distance travelled
export let asteroidSpawnRate = 400;  // Adjust this value to control the spawn rate - LOWER = FASTER SPAWN

export let bullets = [];             // Array to store all bullets
export let bulletCooldown = 0;       // Cooldown timer for shooting
export const maxBulletCooldown = 20; // Maximum cooldown time between shots

// Explosion particles
export let particles = [];           // Array to store explosion particles

// PowerUp system
export let activePowerUps = {
    angleShooting: false,
    multiShot: false
};
export let powerUpTimer = 0;
export const POWERUP_DURATION = 600; // 10 seconds at 60fps
export let powerUps = [];  // Array to store all power-ups
export let powerUpSpawnRate = 7000; // Spawn rate for power-ups in milliseconds

// Managers for the game entities
export const antiMatterManager = new AntiMatterManager();
export const asteroidManager = new AsteroidManager();
export const bulletManager = new BulletManager();

// Debug state
export let debugMode = false;
export function toggleDebugMode() {
    debugMode = !debugMode;
    console.log(`Global debug mode: ${debugMode ? 'ON' : 'OFF'}`);
    return debugMode;
}

export function shipRectUpdate(){
    shipRect = spaceShip.getBoundingClientRect();
}

export function getShipRect(){
    return shipRect;
}

/**
 * This method dispalys the distance travelled by spaceShip,
 * it uses setInterval method which  incremnet the display value by 0.1 and set the score innerHtml to the distance value evey 2 second
 */
export function startDistanceScore() {
    distanceInterval = setInterval(() => {
        if (isGameOver) {
            clearInterval(distanceInterval);
            return;
        }
        distanceValue += 0.1 * shipMovementSpeed / 15; // Multiply by ship speed to make score match distance travelled
        score.innerHTML = " " + distanceValue.toFixed(1) + " LY";
    }, 1000);
}

/**
 * Updates the score by setting innerHTML of antiMatterScore to matterValue
 */
export function updateMatterScore(){
    if (isGameOver) {
        return;
    }
    matterValue+=1;
    anitMatterScore.innerHTML = matterValue;
}

export function gameIsOver(){
    isGameOver = true;
    gameOver.style.display = "block";
    scoreDetail.innerHTML = " Distance Travelled " + distanceValue.toFixed(1) + " LY";
    matterDetail.innerHTML = " AntiMatters Collected: " + matterValue

    // Calculate the final score
    let finalScore = (distanceValue * 10) + (matterValue * 100);

    // Retrieve the current high score from local storage
    let highScore = localStorage.getItem('highScore');
    if (highScore === null || finalScore > parseFloat(highScore)) {
        // Update the high score if the current score is higher
        localStorage.setItem('highScore', finalScore.toFixed(1));
        localStorage.setItem('highScoreDistance', distanceValue.toFixed(1));
        localStorage.setItem('highScoreMatter', matterValue);
        highScore = finalScore.toFixed(1);
        finalScoreDetail.innerHTML = "🏆NEW HIGH SCORE: " + highScore;
    }
    else {
        finalScoreDetail.innerHTML = " Final Score: " + finalScore.toFixed(1);
    }

    restartBtn.addEventListener("click", restartGame);
    stopIntervals();
}

/**
 * This method stops the interval for distance and fuel
 */
function stopIntervals(){
    clearInterval(distanceInterval);
    clearInterval(fuelInterval)
}

/**
 * This method restarts the game set the isGameOver to false and uses location.reload() method to restart the whole game
 */
function restartGame(){
    isGameOver = false;
    location.reload(); //reload the whole page 
}

const MAX_SPEED = 6.5;
const MIN_SPEED = 1.0;
const SPEED_INCREMENT = 0.15; // More gradual increment

export function increaseShipSpeed(){
    if (shipMovementSpeed + SPEED_INCREMENT <= MAX_SPEED) {
        shipMovementSpeed += SPEED_INCREMENT;
    } else {
        shipMovementSpeed = MAX_SPEED;
    }
    antiMatterManager.updateFallSpeed(defaultAntiMatterFallSpeed);

    // shipSpeedValue
    document.getElementById("shipSpeedValue").innerText = `${shipMovementSpeed.toFixed(2)}`;
}

export function decreaseShipSpeed(){
    if (shipMovementSpeed - SPEED_INCREMENT >= MIN_SPEED) {
        shipMovementSpeed -= SPEED_INCREMENT;
    } else {
        shipMovementSpeed = MIN_SPEED;
    }

    document.getElementById("shipSpeedValue").innerText = `${shipMovementSpeed.toFixed(2)}`;
}

export function increaseGameSpeed(){
    if (defaultAntiMatterFallSpeed + SPEED_INCREMENT <= MAX_SPEED) {
        defaultAntiMatterFallSpeed += SPEED_INCREMENT;
    } else {
        defaultAntiMatterFallSpeed = MAX_SPEED;
    }

    if (defaultAsteroidFallSpeed + SPEED_INCREMENT <= MAX_SPEED) {
        defaultAsteroidFallSpeed += SPEED_INCREMENT;
    } else {
        defaultAsteroidFallSpeed = MAX_SPEED;
    }

    asteroidManager.updateFallSpeed(defaultAsteroidFallSpeed);
    antiMatterManager.updateFallSpeed(defaultAntiMatterFallSpeed);
}

export function decreaseGameSpeed(){
    if (defaultAntiMatterFallSpeed - SPEED_INCREMENT >= MIN_SPEED) {
        defaultAntiMatterFallSpeed -= SPEED_INCREMENT;
    } else {
        defaultAntiMatterFallSpeed = MIN_SPEED;
    }

    if (defaultAsteroidFallSpeed - SPEED_INCREMENT >= MIN_SPEED) {
        defaultAsteroidFallSpeed -= SPEED_INCREMENT;
    } else {
        defaultAsteroidFallSpeed = MIN_SPEED;
    }

    asteroidManager.updateFallSpeed(defaultAsteroidFallSpeed);
    antiMatterManager.updateFallSpeed(defaultAntiMatterFallSpeed);
}

// Handle bullet-asteroid collision
export function handleBulletAsteroidCollision(bulletIndex, asteroidIndex) {
    // Get the position of the asteroid before removing it
    const asteroid = asteroids[asteroidIndex];
    const explosionX = asteroid.x + asteroid.width / 2;
    const explosionY = asteroid.y + asteroid.height / 2;
    
    // Create explosion effect at the asteroid's position
    createExplosion(explosionX, explosionY);
    
    // Remove the bullet and asteroid that collided
    bullets.splice(bulletIndex, 1);
    asteroids.splice(asteroidIndex, 1);
    
    // Add points for destroying an asteroid
    matterValue += 5;
    anitMatterScore.innerHTML = matterValue;
}

// Create explosion particles at the given position
export function createExplosion(x, y) {
    const particleCount = 20;
    const colors = ['#FFA500', '#FF4500', '#FF8C00', '#FFD700', '#FFFF00'];
    
    for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 4 + 1;
        const speed = Math.random() * 3 + 1;
        const angle = Math.random() * Math.PI * 2;
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed;
        
        particles.push({
            x: x,
            y: y,
            size: size,
            velocityX: velocityX,
            velocityY: velocityY,
            color: colors[Math.floor(Math.random() * colors.length)],
            lifespan: 30 + Math.random() * 20
        });
    }
}

// Update all particles (decrease lifespan, move position)
export function updateParticles() {
    for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        
        // Update position
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        
        // Decrease lifespan
        particle.lifespan--;
        
        // Remove dead particles
        if (particle.lifespan <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }
}

// Draw all particles
export function drawParticles() {
    ctx.save();
    for (const particle of particles) {
        // Calculate opacity based on remaining lifespan
        const opacity = particle.lifespan / 50;
        
        // Set fill style with opacity
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = opacity;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 10;
        ctx.fill();
    }
    ctx.restore();
}

// Decrease bullet cooldown timer
export function updateBulletCooldown() {
    if (bulletCooldown > 0) {
        bulletCooldown--;
    }
}

// Create a new powerup
export function createPowerUp() {
    if (isGameOver) return;
    
    // Create a power-up at a random position
    const powerUpX = Math.random() * (canvas.width - 30) + 15;
    const powerUpY = -30; // Start above the screen
    
    // Define power-up types with weights (higher number = more common)
    const powerUpTypes = [
        { type: 'multiShot', weight: 70 },       // 70% chance
        { type: 'angleShooting', weight: 30 }    // 30% chance
    ];
    
    // Calculate total weight
    const totalWeight = powerUpTypes.reduce((sum, powerUp) => sum + powerUp.weight, 0);
    
    // Pick a random number between 0 and total weight
    let random = Math.random() * totalWeight;
    
    // Find the power-up based on weight distribution
    let selectedType = powerUpTypes[0].type;
    for (const powerUp of powerUpTypes) {
        if (random < powerUp.weight) {
            selectedType = powerUp.type;
            break;
        }
        random -= powerUp.weight;
    }
    
    powerUps.push({
        x: powerUpX,
        y: powerUpY,
        width: 30,
        height: 30,
        speed: defaultAsteroidFallSpeed * 0.8, // Slightly slower than asteroids
        type: selectedType,
    });
}

// Update all powerups
export function updatePowerUps() {
    // Update existing power-ups
    for (let i = 0; i < powerUps.length; i++) {
        const powerUp = powerUps[i];
        
        // Adjusting fall speed based on ship speed
        const baseSpeed = powerUp.speed;
        const speedVariance = Math.random() * 0.4 - 0.2; // Random variance between -0.2 and 0.2
        const adjustedSpeed = baseSpeed * (1 + speedVariance) * (shipMovementSpeed / 2);
        
        // Update position with the adjusted speed
        powerUp.y += adjustedSpeed;
        
        // Add slight horizontal movement for more interesting effect
        // powerUp.x += Math.cos(powerUp.y * 0.05) * (shipMovementSpeed * 0.15);
        
        // Remove power-ups that have moved off screen
        if (powerUp.y > canvas.height) {
            powerUps.splice(i, 1);
            i--;
            continue;
        }
        
        // Check for collision with ship
        const shipRect = getShipRect();
        const powerUpRect = {
            left: powerUp.x,
            top: powerUp.y,
            right: powerUp.x + powerUp.width,
            bottom: powerUp.y + powerUp.height
        };
        
        if (!(shipRect.right < powerUpRect.left ||
            shipRect.left > powerUpRect.right ||
            shipRect.bottom < powerUpRect.top ||
            shipRect.top > powerUpRect.bottom)) {
            
            // Activate the power-up
            activePowerUps[powerUp.type] = true;
            powerUpTimer = POWERUP_DURATION;
            
            // Remove the power-up
            powerUps.splice(i, 1);
            i--;
            
            // Add a visual effect
            createPowerUpEffect(shipRect.left + (shipRect.right - shipRect.left) / 2, shipRect.top);
        }
    }
    
    // Update power-up timer
    if (powerUpTimer > 0) {
        powerUpTimer--;
        
        // Deactivate power-ups when timer expires
        if (powerUpTimer === 0) {
            Object.keys(activePowerUps).forEach(key => {
                activePowerUps[key] = false;
            });
        }
    }
}

// Draw all powerups
export function drawPowerUps() {
    ctx.save();
    for (const powerUp of powerUps) {
        // Draw power-up icon
        const centerX = powerUp.x + powerUp.width / 2;
        const centerY = powerUp.y + powerUp.height / 2;
        const radius = powerUp.width / 2;

        if (powerUp.type === 'angleShooting') {
            // Draw angle shooting power-up
            // Draw circle background
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fillStyle = '#007BFF';
            ctx.fill();
            
            // Draw angle indicator
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + radius * 0.8 * Math.cos(-Math.PI/4), centerY + radius * 0.8 * Math.sin(-Math.PI/4));
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + radius * 0.8 * Math.cos(-3*Math.PI/4), centerY + radius * 0.8 * Math.sin(-3*Math.PI/4));
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'white';
            ctx.stroke();
        } 
        else if (powerUp.type === 'multiShot') {
            // Draw multi-shot power-up
            // Draw circle background
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fillStyle = '#FF5722'; // Orange color
            ctx.fill();
            
            // Draw three bullet indicators
            const bulletSpacing = radius * 0.5;
            
            // Left bullet
            ctx.beginPath();
            ctx.arc(centerX - bulletSpacing, centerY - radius * 0.4, radius * 0.25, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
            
            // Center bullet
            ctx.beginPath();
            ctx.arc(centerX, centerY - radius * 0.6, radius * 0.25, 0, Math.PI * 2);
            ctx.fill();
            
            // Right bullet
            ctx.beginPath();
            ctx.arc(centerX + bulletSpacing, centerY - radius * 0.4, radius * 0.25, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    ctx.restore();
}

// Create a visual effect when power-up is collected
export function createPowerUpEffect(x, y) {
    const particleCount = 30;
    const colors = ['#3498db', '#2980b9', '#1abc9c', '#16a085'];
    
    for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 5 + 2;
        const speed = Math.random() * 4 + 1;
        const angle = Math.random() * Math.PI * 2;
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed;
        
        particles.push({
            x: x,
            y: y,
            size: size,
            velocityX: velocityX,
            velocityY: velocityY,
            color: colors[Math.floor(Math.random() * colors.length)],
            lifespan: 40 + Math.random() * 20
        });
    }
}

// Draw a power-up indicator
export function drawPowerUpIndicator() {
    if (powerUpTimer > 0) {
        const remainingTime = Math.ceil(powerUpTimer / 60); // Convert frames to seconds
        ctx.save();
        
        let yPos = 30;
        
        // Draw text for each active powerup
        if (activePowerUps.angleShooting) {
            ctx.font = '16px Arial';
            ctx.fillStyle = '#007BFF';
            ctx.textAlign = 'center';
            ctx.fillText(`Angle Shooting: ${remainingTime}s`, canvas.width / 2, yPos);
            yPos += 25;
        }
        
        if (activePowerUps.multiShot) {
            ctx.font = '16px Arial';
            ctx.fillStyle = '#FF5722';
            ctx.textAlign = 'center';
            ctx.fillText(`Multi-Shot: ${remainingTime}s`, canvas.width / 2, yPos);
        }
        
        ctx.restore();
    }
}

// Draw aiming line to show where bullets will fire
export function drawAimingLine() {
    if (isGameOver || !activePowerUps.angleShooting) return;
    
    const shipRect = getShipRect();
    const shipCenterX = shipRect.left + (shipRect.right - shipRect.left) / 2;
    const shipCenterY = shipRect.top;
    
    const mousePos = bulletManager.mousePosition;
    
    // Calculate angle between ship and mouse
    let angleToMouse = Math.atan2(mousePos.y - shipCenterY, mousePos.x - shipCenterX);
    
    // Convert to degrees for easier calculation
    let angleDegrees = angleToMouse * (180 / Math.PI);
    
    // Restrict the angle to a 120-degree arc (from -30 to -150 degrees)
    if (angleDegrees > -30) angleDegrees = -30;
    if (angleDegrees < -150) angleDegrees = -150;
    
    // Convert back to radians
    angleToMouse = angleDegrees * (Math.PI / 180);
    
    // Calculate end point for line
    const lineLength = 40;
    const endX = shipCenterX + Math.cos(angleToMouse) * lineLength;
    const endY = shipCenterY + Math.sin(angleToMouse) * lineLength;
    
    // Draw the aiming line
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(shipCenterX, shipCenterY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = 'rgba(255, 149, 0, 0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw a small circle at the end of the line
    ctx.beginPath();
    ctx.arc(endX, endY, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#FF9500';
    ctx.fill();
    ctx.restore();
}


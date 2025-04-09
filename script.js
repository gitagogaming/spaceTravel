/* @Author: Nirajan Shrestha
   July 27,2024 
*/
import { startDistanceScore, asteroids, shipRectUpdate, canvas, ctx, antiMatterManager, 
         asteroidManager, bulletManager, bulletCooldown, maxBulletCooldown, 
         updateBulletCooldown, handleBulletAsteroidCollision, updateParticles, 
         drawParticles, drawAimingLine, powerUps, updatePowerUps, drawPowerUps, 
         createPowerUp, drawPowerUpIndicator } from './gameState.js';
import { addStar, drawStars } from './createStars.js';
import { mobileControls } from './mobileControls.js';
import { desktopControls } from './desktopControls.js';

// try and follow guide and create a single 'game class' where eevryhing is initiated at... 
// https://www.youtube.com/watch?v=7BHs1BzA4fs&t=1141s
/////
// make asteroid speed and antimatter change based on time travelled... and also * multipler mabye for antimater collected?

/* Required HTML elemnts */
const container = document.getElementById("game-space");
const infoScreen = document.getElementById("gameInfo");
const distanceValueContainer = document.getElementById("travel");
const antiMatterElement = document.getElementById("antiMatter");
const shipSpeedElement = document.getElementById("shipSpeed");

function crosshairCursor(){
    document.body.style.cursor = 'crosshair';
}

//Calls startGame method when page is loaded
window.addEventListener("DOMContentLoaded", startGame)

/**
 * Starts the game when startButton is clicked, hides thestartScreen ,displays the info screen by setting display styles to none and block
 */
function startGame(){
    document.querySelector(".startButton").addEventListener('click', ()=>{
        console.log("clicked")
        document.getElementById("startScreen").style.display="none";  
        infoScreen.style.display="flex"
        playGame();
    })
}

function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|webOS|Windows Phone/i.test(navigator.userAgent);
}

/**
 * This method starts the game when playButton is clicked, sets the game-space display  to block to display the game screen
 * and dispalys the the value, spaceship, and antimatteer, hides the info screen and 
 * calls all required methods.
 */
function playGame(){
    document.querySelector(".playButton").addEventListener('click', ()=>{
        container.style.display="block";
        distanceValueContainer.style.display="block";
        antiMatterElement.style.display="flex";
        shipSpeedElement.style.display="flex";
        infoScreen.style.display="none"
        
        crosshairCursor();
        addStar(100);
        asteroidManager.createAsteroid();
        antiMatterManager.createAntiMatterElement();
        startDistanceScore();
        
        // Track mouse movement for aiming
        canvas.addEventListener('mousemove', handleMouseMove);
        
        // Add event listener for shooting
        canvas.addEventListener('click', handleShoot);
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                handleShoot();
            }
        });
        
        // Set up power-up spawn interval
        setInterval(createPowerUp, 7000);
        
        gameLoop();
   
        if (isMobileDevice()) {
            console.log("Mobile Controls Enabled");
            mobileControls();
        } else {
            console.log("Desktop Controls Enabled");
            desktopControls();
        }
    })  
}

function handleMouseMove(event) {
    // Get the position of the mouse relative to the canvas
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // Update the bullet manager with the current mouse position
    bulletManager.updateMousePosition(mouseX, mouseY);
}

function handleShoot() {
    if (bulletCooldown <= 0) {
        bulletManager.createBullet();
        bulletCooldown = maxBulletCooldown;
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shipRectUpdate();
    drawStars();
    
    // Update bullet cooldown
    updateBulletCooldown();
    
    // Update and draw power-ups
    updatePowerUps();
    drawPowerUps();
    drawPowerUpIndicator();
    
    // Update and draw bullets
    bulletManager.updateBullets();
    bulletManager.drawBullets();
    
    // Draw aiming line
    drawAimingLine();
    
    // Check for bullet-asteroid collisions
    bulletManager.checkBulletAsteroidCollision(asteroids, handleBulletAsteroidCollision);
    
    // Update and draw explosions
    updateParticles();
    
    asteroidManager.updateAsteroids();
    asteroids.forEach(asteroidManager.drawAsteroid);
    antiMatterManager.drawAntiMatter();
    
    // Draw particles on top of everything else
    drawParticles();
    
    requestAnimationFrame(gameLoop);
}

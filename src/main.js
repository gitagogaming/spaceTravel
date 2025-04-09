/* @Author: Nirajan Shrestha
   July 27,2024 
*/
import * as GameState from './game/GameState.js';
import { gameLoop } from './game/GameLoop.js';
import { addStar } from './utils/CreateStars.js';
import { mobileControls } from './controllers/MobileControls.js';
import { desktopControls } from './controllers/DesktopControls.js';

/* Required HTML elements */
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
 * Starts the game when startButton is clicked
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
 * This method starts the game when playButton is clicked
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
        GameState.asteroidManager.createAsteroid();
        GameState.antiMatterManager.createAntiMatterElement();
        GameState.startDistanceScore();
        
        // Track mouse movement for aiming
        GameState.canvas.addEventListener('mousemove', handleMouseMove);
        
        // Add event listener for shooting
        GameState.canvas.addEventListener('click', handleShoot);
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                handleShoot();
            }
        });
        
        // Set up power-up spawn interval
        setInterval(GameState.createPowerUp, 7000);
        
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
    const rect = GameState.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // Update the bullet manager with the current mouse position
    GameState.bulletManager.updateMousePosition(mouseX, mouseY);
}

function handleShoot() {
    if (GameState.bulletCooldown <= 0) {
        GameState.bulletManager.createBullet();


        // We could add in an ammo system... 

        // stopping spammming of bullets
        GameState.setBulletCooldown(GameState.maxBulletCooldown / 2);

    }
}

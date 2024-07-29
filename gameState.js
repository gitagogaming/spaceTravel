import AntiMatterManager from './antimatter.js';
import AsteroidManager from './asteroids.js';


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
export let antiMatterSpawnRate = 500; // Adjust this value to control the spawn rate - LOWER = FASTER SPAWN
export let shipMovementSpeed = 2;    // Adjusted dynamically based on user input using the "W" and "S" keys

export let asteroids = [];           // Array to store all the asteroids
export let defaultAsteroidFallSpeed = 0.6;  // Current Adjusted dynamically based on user input with keys, could be based on total antimatter collected or distance travelled
export let asteroidSpawnRate = 100;  // Adjust this value to control the spawn rate - LOWER = FASTER SPAWN



// Managers for the antimatter and asteroids
export const antiMatterManager = new AntiMatterManager();
export const asteroidManager = new AsteroidManager();


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
        // // Display the high score
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
    isGameOver =false;
     location.reload(); //reload the whole page 
}


const MAX_SPEED = 6.5;
const MIN_SPEED = 1.0;
const SPEED_INCREMENT = 0.01; // More gradual increment

export function increaseShipSpeed(){
    if (shipMovementSpeed + SPEED_INCREMENT <= MAX_SPEED) {
        shipMovementSpeed += SPEED_INCREMENT;
    } else {
        shipMovementSpeed = MAX_SPEED;
    }
    antiMatterManager.updateFallSpeed(defaultAntiMatterFallSpeed);
}

export function decreaseShipSpeed(){
    if (shipMovementSpeed - SPEED_INCREMENT >= MIN_SPEED) {
        shipMovementSpeed -= SPEED_INCREMENT;
    } else {
        shipMovementSpeed = MIN_SPEED;
    }
    
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
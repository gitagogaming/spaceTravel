
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
        this.asteroids.forEach((asteroid) => {
            asteroid.y += this.asteroidFallSpeed;
            asteroid.rotation += asteroid.rotationSpeed;

            if (this.hasCollided(asteroid)) {
                gameIsOver();
                return;
            }

            if (asteroid.y > this.canvas.height) {
                this.asteroids.splice(this.asteroids.indexOf(asteroid), 1);
            }
        });
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

// const spaceShip = document.getElementById("spaceShip");


// /**
//  * This function creates new asteroids at random intervals and adds them to the asteroids array.
//  * Each asteroid has random properties such as size, position, speed, and rotation speed.
//  * The function stops creating asteroids if the game is over.
//  */
// export function createAsteroid() {
//     // If the game is over, do not create new asteroids
//     if (isGameOver) return;

//     // Set an interval to create new asteroids at the specified spawn rate
//     setInterval(() => {
//         // Generate random properties for the new asteroid
//         let randomRockHeight = Math.random() * 5 + 30; // Random height between 30 and 35
//         let randomRockWidth = Math.random() * 5 + 30; // Random width between 30 and 35
//         let randomRockRadius1 = Math.floor(Math.random() * 3) + 6; // Random radius1 between 6 and 8
//         let randomRockRadius2 = Math.floor(Math.random() * 6) + 3; // Random radius2 between 3 and 8
//         let x = Math.random() * canvas.width; // Random x position within the canvas width
//         let y = -randomRockHeight; // Start the asteroid above the canvas
//         let randomSpeed = Math.random() * asteroidFallSpeed + 1; // Random speed between 1 and asteroidFallSpeed
//         let randomRotationSpeed = (Math.random() - 0.5) * 0.02; // Random rotation speed between -0.01 and 0.01

//         // Add the new asteroid to the asteroids array
//         asteroids.push({
//             x: x,
//             y: y,
//             width: randomRockWidth,
//             height: randomRockHeight,
//             radius1: randomRockRadius1,
//             radius2: randomRockRadius2,
//             speed: randomSpeed, // Assign random speed
//             rotation: 0, // Initial rotation angle
//             rotationSpeed: randomRotationSpeed // Assign random rotation speed
//         });
//     }, asteroidSpawnRate);
// }

// /**
//  * This function draws an asteroid on the canvas.
//  * It uses the asteroid's properties to determine its position, size, rotation, and appearance.
//  * The function also creates a gradient fill for the asteroid to give it a more realistic look.
//  * 
//  * @param {Object} asteroid The asteroid object containing its position, size, rotation, and radius properties.
//  */
// export function drawAsteroid(asteroid) {
//     ctx.save(); // Save the current state of the canvas

//     // Move the canvas origin to the center of the asteroid
//     ctx.translate(asteroid.x + asteroid.width / 2, asteroid.y + asteroid.height / 2);

//     // Rotate the canvas to the asteroid's rotation angle
//     ctx.rotate(asteroid.rotation);

//     // Create a linear gradient for the asteroid's fill
//     const gradient = ctx.createLinearGradient(-asteroid.width / 2, -asteroid.height / 2, asteroid.width / 2, asteroid.height / 2);
//     gradient.addColorStop(0, '#555'); // Darker gray at the start
//     gradient.addColorStop(1, '#333'); // Darkest gray at the end

//     ctx.fillStyle = gradient; // Set the fill style to the gradient
//     ctx.beginPath(); // Begin a new path

//     // Draw the asteroid shape using lines and quadratic curves
//     ctx.moveTo(-asteroid.width / 2 + asteroid.radius1, -asteroid.height / 2);
//     ctx.lineTo(asteroid.width / 2 - asteroid.radius1, -asteroid.height / 2);
//     ctx.quadraticCurveTo(asteroid.width / 2, -asteroid.height / 2, asteroid.width / 2, -asteroid.height / 2 + asteroid.radius1);
//     ctx.lineTo(asteroid.width / 2, asteroid.height / 2 - asteroid.radius2);
//     ctx.quadraticCurveTo(asteroid.width / 2, asteroid.height / 2, asteroid.width / 2 - asteroid.radius2, asteroid.height / 2);
//     ctx.lineTo(-asteroid.width / 2 + asteroid.radius2, asteroid.height / 2);
//     ctx.quadraticCurveTo(-asteroid.width / 2, asteroid.height / 2, -asteroid.width / 2, asteroid.height / 2 - asteroid.radius2);
//     ctx.lineTo(-asteroid.width / 2, -asteroid.height / 2 + asteroid.radius1);
//     ctx.quadraticCurveTo(-asteroid.width / 2, -asteroid.height / 2, -asteroid.width / 2 + asteroid.radius1, -asteroid.height / 2);

//     ctx.closePath(); // Close the path
//     ctx.fill(); // Fill the path with the gradient

//     ctx.restore(); // Restore the previous state of the canvas
// }
// /**
//  * This function updates the positions and rotations of all asteroids in the game.
//  * It also checks for collisions between the asteroids and the spaceship.
//  * If a collision is detected, the game is marked as over.
//  * Asteroids that move off the bottom of the canvas are removed from the array.
//  */
// export function updateAsteroids() {
//     for (let i = 0; i < asteroids.length; i++) {
//         // Update the vertical position of the asteroid by adding the fall speed
//         asteroids[i].y += asteroidFallSpeed;

//         // Update the rotation angle of the asteroid by adding its rotation speed
//         asteroids[i].rotation += asteroids[i].rotationSpeed;

//         // Check for collision with the spaceship
//         if (hasCollided(asteroids[i])) {
//             // If a collision is detected, end the game
//             gameIsOver();
//             return; // Exit the function if the game is over
//         }

//         // If the asteroid has moved off the bottom of the canvas
//         if (asteroids[i].y > canvas.height) {
//             // Remove the asteroid from the array
//             asteroids.splice(i, 1);
//             // Adjust the index to account for the removed asteroid
//             i--;
//         }
//     }
// }


// /**
//  * This method checks if the asteroid and spaceShip have collided meanin thier positions overlap each other.
//  * getBoundingClientRect() is used, it is a javascript method which returens positions(left, right,buttom, and top) and size
//  * of an element.
//  * there are two parameter spaceShip and asteroid thier positions are extracted using getBoundingClientRect() and a 
//  * boolean variable is craeated, if any of the condition meets the value becomes false since !() is used, which means there was no collison,
//  * if no condition meets then it means there is a collison the value beacons true.
//  * ANd finally the method returns the collison condition
//  * @param {*} spaceShip  the spaceShip
//  * @param {*} asteroid  the asteroid
//  * @returns boolean
//  */
// function hasCollided(asteroid) {
//     // Define the bounding boxes for the spaceship and asteroid
//     const shipRect = getShipRect();
//     const asteroidRect = {
//         left: asteroid.x,
//         top: asteroid.y,
//         right: asteroid.x + asteroid.width,
//         bottom: asteroid.y + asteroid.height
//     };

//     // Check for collision
//     return !(
//         shipRect.right < asteroidRect.left ||
//         shipRect.left > asteroidRect.right ||
//         shipRect.bottom < asteroidRect.top ||
//         shipRect.top > asteroidRect.bottom
//     );
// }
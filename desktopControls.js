import { shipMovementSpeed, increaseShipSpeed, decreaseShipSpeed, increaseGameSpeed, decreaseGameSpeed } from "./gameState.js";

const shipSpeedValue = document.getElementById("shipSpeedValue"); // For Updating the ship speed value on the screen

/**
 * This method moves the spaceship to right or left, it uses "keydown" eventlistner which is a listner for when user presses a key,
 * an arrow function used to determined what happens when a key is pressed by user.
 * 
 * the method gets the initial position of ship, widthth of the sipt, width of the screen and checks the condition that
 * if the key is ArrowRight change the position of space ship accordings and if it is ArrowLeft change the position accordingly
 */
export function desktopControls(){
    
    let keys = {}; // Object to keep track of pressed keys
    // Keeping track of keys pressed by the user, doing it like this allows us to move the spaceship smoothly
    document.addEventListener("keydown", (e) => {
        console.log("Pressed: " + e.key);
        keys[e.key] = true;
    });
    document.addEventListener("keyup", (e) => {
        keys[e.key] = false;
    });


    function keyPressed(key) {
        return !!keys[key];
    }

    function updatePosition() {
        let shipLeftPosition = spaceShip.offsetLeft;     // Gets the initial left position of spaceShip
        let shipWidth = spaceShip.offsetWidth;          // Width of the ship
        let screenWidth = window.innerWidth;           // Gets the width value of the whole screen

        if ((keyPressed("ArrowLeft") || keyPressed("a")) && shipLeftPosition > 0) { // Ensures that the spaceship does not go off screen
            spaceShip.style.left = `${shipLeftPosition - shipMovementSpeed}px`; // Shifts the spaceship to the left
        }
        if ((keyPressed("ArrowRight") || keyPressed("d")) && shipLeftPosition + shipWidth < screenWidth) { // Ensures that the spaceship does not go off screen
            spaceShip.style.left = `${shipLeftPosition + shipMovementSpeed}px`; // Shifts the spaceship to the right
        }
        if (keyPressed("w") || keyPressed("ArrowUp")) { 
            increaseGameSpeed();
            increaseShipSpeed();
            shipSpeedValue.innerHTML = shipMovementSpeed.toFixed(1);
        }
        if (keyPressed("s") || keyPressed("ArrowDown")) { 
            decreaseGameSpeed();
            decreaseShipSpeed();
            shipSpeedValue.innerHTML = shipMovementSpeed.toFixed(1);
        }
        requestAnimationFrame(updatePosition); // Call the function again on the next frame
    }

    // Start the animation loop
    requestAnimationFrame(updatePosition);
}

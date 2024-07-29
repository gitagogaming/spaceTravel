const leftArrow = document.getElementById("leftArrow");
const rightArrow = document.getElementById("rightArrow");
import { shipMovementSpeed } from './gameState.js';

export function mobileControls() {
    let shipWidth = spaceShip.offsetWidth; // width of the ship
    let screenWidth = window.innerWidth; // gets the width value of the whole screen

    let moveLeft = false;
    let moveRight = false;

    function moveShip() {
        let shipLeftPosition = spaceShip.offsetLeft; // gets the initial left position of spaceShip

        if (moveLeft && shipLeftPosition > 0) {
            spaceShip.style.left = `${shipLeftPosition - shipMovementSpeed}px`;
        }

        if (moveRight && shipLeftPosition + shipWidth < screenWidth) {
            spaceShip.style.left = `${shipLeftPosition + shipMovementSpeed}px`;
        }

        requestAnimationFrame(moveShip);
    }

    // Start the animation loop
    requestAnimationFrame(moveShip);

    leftArrow.addEventListener("mousedown", () => {
        moveLeft = true;
    });

    leftArrow.addEventListener("mouseup", () => {
        moveLeft = false;
    });

    leftArrow.addEventListener("mouseleave", () => {
        moveLeft = false;
    });

    rightArrow.addEventListener("mousedown", () => {
        moveRight = true;
    });

    rightArrow.addEventListener("mouseup", () => {
        moveRight = false;
    });

    rightArrow.addEventListener("mouseleave", () => {
        moveRight = false;
    });

    // Add touch event listeners for mobile controls
    leftArrow.addEventListener("touchstart", () => {
        moveLeft = true;
    });

    leftArrow.addEventListener("touchend", () => {
        moveLeft = false;
    });

    leftArrow.addEventListener("contextmenu", (e) => {
        e.preventDefault(); // prevent the context menu from appearing
    });

    rightArrow.addEventListener("touchstart", () => {
        moveRight = true;
    });

    rightArrow.addEventListener("touchend", () => {
        moveRight = false;
    });

    rightArrow.addEventListener("contextmenu", (e) => {
        e.preventDefault(); // prevent the context menu from appearing
    });
}

// import { shipMovementSpeed } from './gameState.js';

// const leftArrow = document.getElementById("leftArrow");
// const rightArrow = document.getElementById("rightArrow");

// export function mobileControls() {
//     const shipWidth = spaceShip.offsetWidth; // width of the ship
//     const screenWidth = window.innerWidth; // gets the width value of the whole screen


//     let moveLeft = false;
//     let moveRight = false;
//     let shipLeftPosition = spaceShip.offsetLeft; // gets the initial left position of spaceShip

//     function moveShip() {
//         if (moveLeft && shipLeftPosition > 0) {
//             shipLeftPosition -= shipMovementSpeed;
//         }

//         if (moveRight && shipLeftPosition + shipWidth < screenWidth) {
//             shipLeftPosition += shipMovementSpeed;
//         }

//         spaceShip.style.transform = `translateX(${shipLeftPosition}px)`;

//         if (moveLeft || moveRight) {
//             requestAnimationFrame(moveShip);
//         }
//     }

//     function startMovingLeft() {
//         if (!moveLeft) {
//             moveLeft = true;
//             requestAnimationFrame(moveShip);
//         }
//     }

//     function stopMovingLeft() {
//         moveLeft = false;
//     }

//     function startMovingRight() {
//         if (!moveRight) {
//             moveRight = true;
//             requestAnimationFrame(moveShip);
//         }
//     }

//     function stopMovingRight() {
//         moveRight = false;
//     }

//     leftArrow.addEventListener("mousedown", startMovingLeft);
//     leftArrow.addEventListener("mouseup", stopMovingLeft);
//     leftArrow.addEventListener("mouseleave", stopMovingLeft);

//     rightArrow.addEventListener("mousedown", startMovingRight);
//     rightArrow.addEventListener("mouseup", stopMovingRight);
//     rightArrow.addEventListener("mouseleave", stopMovingRight);

//     // Add touch event listeners for mobile controls
//     leftArrow.addEventListener("touchstart", startMovingLeft);
//     leftArrow.addEventListener("touchend", stopMovingLeft);
//     leftArrow.addEventListener("contextmenu", (e) => {
//         e.preventDefault(); // prevent the context menu from appearing
//     });

//     rightArrow.addEventListener("touchstart", startMovingRight);
//     rightArrow.addEventListener("touchend", stopMovingRight);
//     rightArrow.addEventListener("contextmenu", (e) => {
//         e.preventDefault(); // prevent the context menu from appearing
//     });
// }
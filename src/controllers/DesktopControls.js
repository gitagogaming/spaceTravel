import { increaseShipSpeed, decreaseShipSpeed, increaseGameSpeed, decreaseGameSpeed } from '../game/GameState.js';

export function desktopControls() {
    const spaceShip = document.getElementById("spaceShip");
    const shipSpeedValue = document.getElementById("shipSpeedValue");
    const mobileControls = document.getElementById("mobileControls");
    
    // Hide mobile controls
    mobileControls.style.display = "none";
    
    let isLeftKeyPressed = false;
    let isRightKeyPressed = false;
    let shipLeft = 0;
    const shipMovementAmount = 5;
    
    // Set initial position
    shipLeft = (window.innerWidth / 2) - 25; // Center horizontally
    spaceShip.style.left = shipLeft + "px";
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'a') {
            isLeftKeyPressed = true;
        } else if (e.key === 'ArrowRight' || e.key === 'd') {
            isRightKeyPressed = true;
        } else if (e.key === 'w') {
            increaseGameSpeed();
        } else if (e.key === 's') {
            decreaseGameSpeed();
        }
    });
    
    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'a') {
            isLeftKeyPressed = false;
        } else if (e.key === 'ArrowRight' || e.key === 'd') {
            isRightKeyPressed = false;
        }
    });
    
    // Set up animation frame for smooth movement
    function updateShipPosition() {
        if (isLeftKeyPressed) {
            shipLeft -= shipMovementAmount;
            if (shipLeft < 0) shipLeft = 0; // Prevent going off left edge
            spaceShip.style.left = shipLeft + "px";
        }
        
        if (isRightKeyPressed) {
            shipLeft += shipMovementAmount;
            if (shipLeft > window.innerWidth - 50) shipLeft = window.innerWidth - 50; // Prevent going off right edge
            spaceShip.style.left = shipLeft + "px";
        }
        
        requestAnimationFrame(updateShipPosition);
    }
    
    updateShipPosition();
}

export default desktopControls;

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


    // need to add an 'options' menu to enable this.. 
    // or maybe some wacky powerup?
    
    // mouse listener for movement
    document.addEventListener('mousemove', (e) => {
        const rect = spaceShip.getBoundingClientRect();
        const mouseX = e.clientX - rect.width / 2; // Center the ship on the mouse
        shipLeft = Math.max(0, Math.min(mouseX, window.innerWidth - rect.width)); // Prevent going off screen
        spaceShip.style.left = shipLeft + "px";
    });


    // document.addEventListener('mousemove', (e) => {
    //     const rect = spaceShip.getBoundingClientRect();
        
    //     // Center the ship on the mouse horizontally
    //     const mouseX = e.clientX - rect.width / 2;
    //     // Center the ship on the mouse vertically
    //     const mouseY = e.clientY - rect.height / 2;
        
    //     // Prevent going off screen horizontally
    //     shipLeft = Math.max(0, Math.min(mouseX, window.innerWidth - rect.width));
    //     // Prevent going off screen vertically
    //     const shipTop = Math.max(0, Math.min(mouseY, window.innerHeight - rect.height));
        
    //     // Update ship position
    //     spaceShip.style.left = shipLeft + "px";
    //     spaceShip.style.top = shipTop + "px";
    // });
    
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

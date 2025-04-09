import { increaseShipSpeed, decreaseShipSpeed } from '../game/GameState.js';

export function mobileControls() {
    const spaceShip = document.getElementById("spaceShip");
    const leftArrow = document.getElementById("leftArrow");
    const rightArrow = document.getElementById("rightArrow");
    const mobileControls = document.getElementById("mobileControls");
    
    // Show mobile controls
    mobileControls.style.display = "flex";
    
    // Handle left arrow button press
    leftArrow.addEventListener('touchstart', () => {
        moveLeft();
    });
    
    // Handle right arrow button press
    rightArrow.addEventListener('touchstart', () => {
        moveRight();
    });
    
    function moveLeft() {
        const currentLeft = parseInt(window.getComputedStyle(spaceShip).left) || 0;
        spaceShip.style.left = (currentLeft - 20) + "px";
    }
    
    function moveRight() {
        const currentLeft = parseInt(window.getComputedStyle(spaceShip).left) || 0;
        spaceShip.style.left = (currentLeft + 20) + "px";
    }
}

export default mobileControls;

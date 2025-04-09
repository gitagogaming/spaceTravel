import { canvas, ctx, shipMovementSpeed } from '../game/GameState.js';

// Array to store star data
const stars = [];

/**
 * Add stars to the stars array
 * @param {number} count - Number of stars to create
 */
export function addStar(count) {
    for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 2;
        const speed = Math.random() * 0.5 + 0.1;
        
        stars.push({ x, y, size, speed });
    }
}

/**
 * Draw and update all stars
 */
export function drawStars() {
    ctx.save();
    ctx.fillStyle = 'white';
    
    stars.forEach(star => {
        // Update position
        star.y += star.speed * (shipMovementSpeed/1.5);
        
        // If star reaches bottom, reset to top
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
        
        // Draw the star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
    
    ctx.restore();
}

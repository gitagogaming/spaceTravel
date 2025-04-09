import * as GameState from '../game/GameState.js';

class AntiMatterManager {
    constructor() {
        this.antiMatterElements = GameState.antiMatterElements;
        this.fallSpeed = GameState.defaultAntiMatterFallSpeed;
        this.spawnRate = GameState.antiMatterSpawnRate;
        this.canvas = GameState.canvas;
        this.ctx = GameState.ctx;
    }

    updateFallSpeed(newSpeed) {
        this.fallSpeed = newSpeed;
    }

    createAntiMatterElement() {
        if (GameState.isGameOver) return;

        setInterval(() => {
            const x = Math.random() * (this.canvas.width - 20);
            const y = -20;
            
            this.antiMatterElements.push({
                x,
                y,
                width: 60,
                height: 60,
                collected: false
            });
        }, this.spawnRate);
        
        // Handle clicking on antimatter
        this.canvas.addEventListener('click', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;
            
            for (let i = 0; i < this.antiMatterElements.length; i++) {
                const element = this.antiMatterElements[i];
                
                // Check if click is within antimatter bounds
                if (
                    clickX >= element.x && 
                    clickX <= element.x + element.width && 
                    clickY >= element.y && 
                    clickY <= element.y + element.height
                ) {
                    element.collected = true;
                    GameState.updateMatterScore();
                }
            }
        });
    }

    drawAntiMatter() {
        this.ctx.save();
        
        // Create antimatter image object if it doesn't exist yet
        if (!this.antiMatterImage) {
            this.antiMatterImage = new Image();
            this.antiMatterImage.src = "antimatter.svg";
        }
        
        // Update position and remove collected antimatter
        for (let i = 0; i < this.antiMatterElements.length; i++) {
            const element = this.antiMatterElements[i];
            
            // Move antimatter down
            element.y += this.fallSpeed;
            
            // If antimatter is collected or off screen, remove it
            if (element.collected || element.y > this.canvas.height) {
                this.antiMatterElements.splice(i, 1);
                i--;
                continue;
            }
            
            // Draw antimatter SVG
            this.ctx.drawImage(
                this.antiMatterImage,
                element.x,
                element.y,
                element.width,
                element.height
            );
            
        }
        
        this.ctx.restore();
    }
}

export default AntiMatterManager;

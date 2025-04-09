
import { updateMatterScore, defaultAntiMatterFallSpeed, canvas, ctx, antiMatterSpawnRate, getShipRect } from './gameState.js';


class AntiMatterManager {
  constructor() {
      this.antiMatterElements = [];
      this.antiMatterFallSpeed = defaultAntiMatterFallSpeed;
      this.antiMatterSpawnRate = antiMatterSpawnRate;

      canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
  }

  updateFallSpeed(newSpeed) {
      this.antiMatterFallSpeed = newSpeed;
  }
  createAntiMatterElement() {
      setInterval(() => {
          let baseSize = 25; // Base size of the antimatter
          let sizeVariation = 15; // Maximum size variation
          let size = baseSize + Math.random() * sizeVariation; // Random size between 25 and 40

          let x = Math.random() * canvas.width;
          let y = -100;
          let randomSpeed = Math.random() * this.antiMatterFallSpeed + 1; // Assign a random speed


          this.antiMatterElements.push({ x, y, size, speed:randomSpeed });

      }, this.antiMatterSpawnRate); // How often to spawn anti-matter
  }

  drawAntiMatter() {
      this.antiMatterElements.forEach((element, index) => {
          ctx.beginPath();
          ctx.moveTo(element.x, element.y); // Move to the center of the circle
          ctx.arc(element.x, element.y, element.size, 0, Math.PI / 2); // Draw the bottom-right quarter
          ctx.lineTo(element.x, element.y); // Close the path to form a quarter circle
          ctx.fillStyle = "green";
          ctx.fill();
          ctx.closePath();

          // element.y += this.antiMatterFallSpeed;
          element.y += element.speed; // Use individual element speed

          

          // Check for collision with the spaceship
          if (this.hasCollided(element)) {
              // If a collision is detected, end the game
              this.collectAntiMatter(index);
          }

          if (element.y > canvas.height) {
              this.antiMatterElements.splice(index, 1);
          }
      });
  }

  hasCollided(antiMatterElement) {
      // Define the bounding boxes for the spaceship and anti-matter element
      const shipRect = getShipRect();
      const antiMatterRect = {
          left: antiMatterElement.x,
          top: antiMatterElement.y,
          right: antiMatterElement.x + antiMatterElement.size,
          bottom: antiMatterElement.y + antiMatterElement.size
      };

      // Check for collision
      return !(
          shipRect.right < antiMatterRect.left ||
          shipRect.left > antiMatterRect.right ||
          shipRect.bottom < antiMatterRect.top ||
          shipRect.top > antiMatterRect.bottom
      );
  }

  collectAntiMatter(index) {
      // Update the matter score
      updateMatterScore();
      // Remove the anti-matter element from the array
      this.antiMatterElements.splice(index, 1);
  }

  handleCanvasClick(e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      this.antiMatterElements.forEach((element, index) => {
          const distance = Math.sqrt((x - element.x) ** 2 + (y - element.y) ** 2);
          if (distance < 25) {
              updateMatterScore();
              this.antiMatterElements.splice(index, 1);
          }
      });
  }
}

export default AntiMatterManager;


// /**
//  * Creates anti-matter elements at regular intervals and adds them to the antiMatterElements array.
//  * Each anti-matter element has a random size and is positioned at a random x-coordinate at the top of the canvas.
//  * The elements fall down the canvas at a constant speed.
//  */
// export function createAntiMatterElement() {
//   setInterval(() => {
//       let baseSize = 25; // Base size of the antimatter
//       let sizeVariation = 15; // Maximum size variation
//       let size = baseSize + Math.random() * sizeVariation; // Random size between 25 and 40

//       let x = Math.random() * canvas.width;
//       let y = -100;

//       antiMatterElements.push({ x, y, size });

//   }, antiMatterSpawnRate); // How often to spawn anti-matter
// }


// /**
//  * Draws all anti-matter elements on the canvas.
//  * Each element is drawn as a quarter circle and falls down the canvas at a constant speed.
//  * Elements are removed from the array once they move off the bottom of the canvas.
//  * If an anti-matter element collides with the spaceship, the game is over.
//  */
// export function drawAntiMatter() {
//   antiMatterElements.forEach((element, index) => {
//       ctx.beginPath();
//       ctx.moveTo(element.x, element.y); // Move to the center of the circle
//       ctx.arc(element.x, element.y, element.size, 0, Math.PI / 2); // Draw the bottom-right quarter
//       ctx.lineTo(element.x, element.y); // Close the path to form a quarter circle
//       ctx.fillStyle = "green";
//       ctx.fill();
//       ctx.closePath();

//       element.y += antiMatterFallSpeed;

//       // Check for collision with the spaceship
//       if (hasCollided(element)) {
//           // If a collision is detected, end the game
//           collectAntiMatter(index);
//       }

//       if (element.y > canvas.height) {
//           antiMatterElements.splice(index, 1);
//       }
//   });
// }


// function hasCollided(antiMatterElement) {
//   // Define the bounding boxes for the spaceship and anti-matter element
//   const shipRect = getShipRect();
//   const antiMatterRect = {
//       left: antiMatterElement.x,
//       top: antiMatterElement.y,
//       right: antiMatterElement.x + antiMatterElement.size,
//       bottom: antiMatterElement.y + antiMatterElement.size
//   };

//   // Check for collision
//   return !(
//       shipRect.right < antiMatterRect.left ||
//       shipRect.left > antiMatterRect.right ||
//       shipRect.bottom < antiMatterRect.top ||
//       shipRect.top > antiMatterRect.bottom
//   );
// }


// // Function to collect anti-matter elements
// function collectAntiMatter(index) {
//   // Update the matter score
//   updateMatterScore();
//   // Remove the anti-matter element from the array
//   antiMatterElements.splice(index, 1);
// }

// canvas.addEventListener('click', (e) => {
//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     antiMatterElements.forEach((element, index) => {
//         const distance = Math.sqrt((x - element.x) ** 2 + (y - element.y) ** 2);
//         if (distance < 25) {
//             updateMatterScore();
//             antiMatterElements.splice(index, 1);
//         }
//     });
// });

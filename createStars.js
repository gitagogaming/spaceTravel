const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];



export function addStar(numberOfStar) {
    for (let i = 0; i < numberOfStar; i++) {
        stars.push(createStar());
    }
}

function createStar() {
    return {
        width: Math.random() * 3 + 1,
        height: Math.random() * 3 + 1,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        opacity: Math.random(), // Initial opacity
        twinkleDuration: Math.random() * 4 + 1,
        twinklePhase: Math.random() * Math.PI * 2 // Initial phase for sine wave
    };
}

/**
 * This method draws all the stars on the canvas.
 */
export function drawStars() {
    const time = Date.now() / 1000; // Current time in seconds
    stars.forEach(star => {
        star.opacity = 0.5 + 0.5 * Math.sin(time * star.twinkleDuration + star.twinklePhase); // Sine wave for opacity
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fillRect(star.x, star.y, star.width, star.height);
    });
}
// const container = document.getElementById("game-space");

// /**
//  * This method create number of start based on the parameter number of star,
//  * it select the container first and uses for loop which runs numberOfSTart time and for each iteration
//  * the container appends the child element hich isthe star, called from createStar() method
//  * @param {} numberOfStar numbers of star
//  */
// export function addStar(numberOfStar){
//     for(let i=0;i<numberOfStar;i++){  
//         container.appendChild(createStar());
//     }
// }

// /**
//  * This method creates a div element add star class to it and random height width and position to create a star.
//  * String literals is used when setting the style properties
//  * @returns div element star
//  * 
//  */
// function createStar(){
//     const star = document.createElement("div"); //creates a div element
//     star.classList.add("star"); //adds star class to the div element

//     //Random height bewteen 1 and 4 for the star
//     star.style.width = `${Math.random()*3 +1}px`;
//     star.style.height = `${Math.random()*3 +1}px`;

//     star.style.backgroundColor = "white";

//     //Used string literals since top takes string but not integer, use Math.random() to generate random number between 1 and 100 for the start positon
//     star.style.top = `${Math.random()*100}vh`;
//     star.style.left = `${Math.random()*100}vw`;
//     star.style.animation = `twinkle ${Math.random()*4+1}s infinite ease-in-out`

//     return star;
// }



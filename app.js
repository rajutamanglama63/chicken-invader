document.addEventListener("DOMContentLoaded", () => {
  const instructionContainer = document.querySelector(".instruction-container");
  const startButton = document.querySelector(".start-button");
  const mainContainer = document.querySelector(".main-container");
  const gameContainer = document.querySelector(".game-container");
  const mainPlayer = document.querySelector(".main-player-bird");
  const scorePlaceHolder = document.createElement("div");
  const ammoSound = new Audio("./sounds/ammoFire.wav");
  const enemyHit = new Audio("./sounds/enemyHit.mp3");

  let playerPositionX = 500;
  const chickeHeight = 40;
  const chickenGap = 20;
  const ammoSpeed = 10;
  const ammoWidth = 10;
  const ammoHeight = 10;
  let currentScore = 0;
  let highestScore = localStorage.getItem("highestScore") || 0;
  

  function startGame() {
    instructionContainer.style.display = "none";
    mainContainer.style.display = "block";
    showMainPlayer();
    setupKeyboardControls();
    setInterval(generateChickenGroup(), 500);
    createBox()
    createObstacle()
 
  }
  
  function showMainPlayer() {
    mainPlayer.style.display = "block";
  }
 
  function setupKeyboardControls() {
    document.addEventListener("keydown", handleKeyPress);
  }

  function handleKeyPress(event) {
    const key = event.key;
    if (key === "ArrowLeft") {
      // Move player to the left
      playerPositionX -= 10; // Adjust the value according to your desired movement speed
      if (playerPositionX < 0) playerPositionX = 0;
    } else if (key === "ArrowRight") {
      // Move player to the right
      playerPositionX += 10; // Adjust the value according to your desired movement speed

      if (playerPositionX > 960) playerPositionX = 960;
    } else if (key === " ") {
      fireAmmo();
    }
    // Update the player's position
    mainPlayer.style.left = playerPositionX + "px";
  }


function createBox() {
  const box = document.createElement("div");
  box.classList.add("box");
  mainContainer.appendChild(box);

  // Calculate the screen height and width
  const screenHeight = window.innerHeight;
  const screenWidth = window.innerWidth;

  // Generate random horizontal and vertical offsets
  const randomOffsetX = Math.floor(Math.random() * (screenWidth - 50));
  const randomOffsetY = Math.floor(Math.random() * (screenHeight - 50));

  // Set the initial position
  box.style.transform = `translate(-50px, ${randomOffsetY}px)`;

  // Animate the box
  setTimeout(() => {
    box.style.transform = `translate(${randomOffsetX}px, ${screenHeight}px)`;
  }, 1000);
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

setInterval(createBox, 600); // Generate box every 1 minute

// ...


function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

for (let i = 0; i < 5; i++) {
  setTimeout(createBox, getRandomNumber(0, 5000)); // Random delay between 0 to 5 seconds
}


    

// function createObstacle() {
//   const obstacle = document.createElement("div");
//   obstacle.classList.add("obstacle");
//   mainContainer.appendChild(obstacle);

//   // Calculate the screen width
//   const screenWidth = window.innerWidth;

//   // Generate random horizontal position for the obstacle
//   const randomOffsetX = Math.floor(Math.random() * (screenWidth - 50));

//   // Set the initial position at the top of the screen
//   obstacle.style.transform = `translate(${randomOffsetX}px, -50px)`;

//   // Animate the obstacle
//   const animationDuration = getRandomNumber(2000, 4000);
//   const distanceToFall = screenHeight + 50; // Distance from top to bottom of the screen

//   obstacle.animate(
//     [
//       { transform: `translate(${randomOffsetX}px, -50px)` },
//       { transform: `translate(${randomOffsetX}px, ${distanceToFall}px)` }
//     ],
//     {
//       duration: animationDuration,
//       easing: 'linear',
//       fill: 'forwards'
//     }
//   );

//   // Check for collision on each frame
//   const collisionIntervalId = setInterval(() => {
//     const obstacleRect = obstacle.getBoundingClientRect();
//     const playerRect = player.getBoundingClientRect();

//     if (isColliding(obstacleRect, playerRect)) {
//       // Collision detected
//       clearInterval(collisionIntervalId);
//       mainContainer.removeChild(obstacle);
//       gameOver();
//     }
//   }, 100);

//   setTimeout(() => {
//     clearInterval(collisionIntervalId);
//     mainContainer.removeChild(obstacle);
//   }, animationDuration + 1000);
// }













  

  function generateChickenGroup() {
    const enemyGroup = document.createElement("div");
    enemyGroup.classList.add("enemy-group");

    const numRows = 4; // Number of rows of enemy chickens
    const numChickensPerRow = [8, 6, 4, 2]; // Number of enemy chickens in each row

    for (let j = 0; j < numRows; j++) {
      const chickenRow = document.createElement("div");
      chickenRow.classList.add("enemy-row");

      for (let i = 0; i < numChickensPerRow[j]; i++) {
        const enemyChicken = document.createElement("img");
        enemyChicken.src = "hen.gif"; // Replace "hen.gif" with the path to your chicken image
        enemyChicken.classList.add("enemy-chicken");

        chickenRow.appendChild(enemyChicken);
      }

      enemyGroup.appendChild(chickenRow);
    }

    let direction = 1;

    const startingLeft = -(numRows * (chickeHeight + chickenGap) - chickenGap);

   

    enemyGroup.style.left = `-600px`;

    const containerWidth = 400;

    const intervalId = setInterval(() => {
      let left = parseInt(enemyGroup.offsetLeft);
      let top = parseInt(enemyGroup.offsetTop);

      left += 5 * direction;

      top += 50;

      enemyGroup.style.left = `${left}px`;

      if (left >= containerWidth && direction === 1) {
        direction = -1; // Reverse direction when reaching the container edges

        enemyGroup.style.top = `${top}px`;
      }

      if (left <= startingLeft && direction === -1) {
        direction = 1; // Reverse direction when reaching the container edges
        enemyGroup.style.top = `${top}px`;
      }
    }, 30);

    gameContainer.appendChild(enemyGroup);
  }
  

  function fireAmmo() {
    const ammo = document.createElement("div");
    ammo.classList.add("ammo");
    gameContainer.appendChild(ammo);

    const playerPositionY = mainPlayer.offsetTop;
    const ammoPositionX =
      playerPositionX + (mainPlayer.offsetWidth - ammoWidth) / 2;
    ammo.style.left = ammoPositionX + "px";
    ammo.style.top = playerPositionY - ammoHeight + "px";
    gameContainer.appendChild(ammo);

    const ammoInterval = setInterval(() => {
      let currentTop = parseInt(ammo.style.top);
      let newTop = currentTop - ammoSpeed;
      ammo.style.top = newTop + "px";
      checkCollision(ammo, ammoInterval);
    }, 50);
    ammoSound.play();
  }

  function checkCollision(ammo, intervalId) {
    const ammoRect = ammo.getBoundingClientRect();
    const enemyChickens = document.querySelectorAll(".enemy-chicken");

    for (let i = 0; i < enemyChickens.length; i++) {
      const enemyChicken = enemyChickens[i];
      const enemyRect = enemyChicken.getBoundingClientRect();
      enemyHit.play();

      if (isColliding(ammoRect, enemyRect)) {
        gameContainer.removeChild(ammo);
        enemyChicken.parentNode.removeChild(enemyChicken);

        clearInterval(intervalId);
        increaseScore();

        break;
      }
    }
     if (enemyChickens.length === 0) {
    clearInterval(intervalId);
    generateChickenGroup();
  }
  }

  function isColliding(rect1, rect2) {
    return (
      rect1.left < rect2.right &&
      rect1.right > rect2.left &&
      rect1.top < rect2.bottom &&
      rect1.bottom > rect2.top
    );
  }
  function increaseScore() {
    currentScore++;
    if (currentScore > highestScore) {
      highestScore = currentScore;
      localStorage.setItem("highestScore", highestScore);
    }
    scorePlaceHolder.textContent =
      "Score: " + currentScore + " (Highest: " + highestScore + ")";
  }

  startButton.addEventListener("click", startGame);
  scorePlaceHolder.classList.add("score-placeholder");
  scorePlaceHolder.textContent = "Score: 0 (Highest: " + highestScore + ")";
  mainContainer.appendChild(scorePlaceHolder);
});

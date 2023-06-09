document.addEventListener("DOMContentLoaded", () => {
  const instructionContainer = document.querySelector(".instruction-container");
  const startButton = document.querySelector(".start-button");
  const mainContainer = document.querySelector(".main-container");
  const gameContainer = document.querySelector(".game-container");
  const mainPlayer = document.querySelector(".main-player-bird");
  const indicator = document.querySelector(".indicator");
  const obstacle = document.getElementById("#boxId");
  // console.log("obstacle: ", obstacle);
  const scorePlaceHolder = document.createElement("div");
  const ammoSound = new Audio("./sounds/ammoFire.wav");
  const enemyHit = new Audio("./sounds/enemyHit.mp3");

  let playerPositionX = 500;
  const chickeHeight = 50;
  const chickenGap = 30;
  const ammoSpeed = 10;
  const ammoWidth = 10;
  const ammoHeight = 10;
  let currentScore = 0;
  let highestScore = localStorage.getItem("highestScore") || 0;

  let hitByEnemyBullet = 0;
  let isGameOver = false;
  let totalKill = 0;

  let mainBossIntervalId; // Variable to store the interval ID for main boss movement
  let mainBossBulletIntervalId; // Variable to store the interval ID for main boss bullet firing

  function startGame() {
    instructionContainer.style.display = "none";
    mainContainer.style.display = "block";
    showMainPlayer();
    setupKeyboardControls();
    setInterval(generateChickenGroup(), 500);
    createBox();
    appendLifeIndicator();
  }

  function restartGame() {
    console.log("clicked from game over component");
    location.reload();
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
      event.preventDefault();
      fireAmmo();
    }
    // Update the player's position
    mainPlayer.style.left = playerPositionX + "px";
  }

  function createBox() {
    const box = document.createElement("div");
    box.classList.add("box");

    gameContainer.appendChild(box);

    const boxDiv = document.getElementsByClassName("box");
    console.log("boxDiv: ", boxDiv);

    boxDiv.id = "boxId";

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

  setInterval(createBox, 4000); // Generate box every 1 minute

  // ...

  for (let i = 0; i < 5; i++) {
    setTimeout(createBox, getRandomNumber(0, 5000)); // Random delay between 0 to 5 seconds
  }

  function clearingInterval(interval) {
    clearInterval(interval);
  }

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
        enemyChicken.src = "./hen.gif"; // Replace "hen.gif" with the path to your chicken image
        enemyChicken.classList.add("enemy-chicken");

        chickenRow.appendChild(enemyChicken);
      }

      enemyGroup.appendChild(chickenRow);
    }

    let direction = 1;

    const startingLeft = -(numRows * (chickeHeight + chickenGap) - chickenGap);

    enemyGroup.style.left = `-100px`;

    const containerWidth = 300;

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

      checkEnemyGroupAndPlayerCollision(enemyGroup, intervalId);
    }, 30);

    gameContainer.appendChild(enemyGroup);
    setInterval(() => enemyFireBullet(enemyGroup), 1000);
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
    // ammoSound.play();
  }

  function enemyFireBullet(enemyGroup) {
    const ammo = document.createElement("div");
    ammo.classList.add("ammo");

    const ammoPositionX = (enemyGroup.offsetWidth - ammoWidth) / 2;
    // console.log("ammoX: ", ammoPositionX);
    const ammoPositionY = enemyGroup.offsetTop + enemyGroup.offsetHeight - 200;
    // console.log("ammoY: ", ammoPositionY);

    ammo.style.left = ammoPositionX + "px";
    ammo.style.top = ammoPositionY + "px";

    enemyGroup.appendChild(ammo); // Append the bullet to the enemyGroup's parent element

    const ammoInterval = setInterval(() => {
      let currentTop = parseInt(ammo.style.top);
      let newTop = currentTop + ammoSpeed;
      ammo.style.top = newTop + "px";
      checkEnemyBulletAndPlayerCollision(ammo, ammoInterval);
    }, 50);
  }

  function checkCollision(ammo, intervalId) {
    const ammoRect = ammo.getBoundingClientRect();
    const enemyChickens = document.querySelectorAll(".enemy-chicken");

    for (let i = 0; i < enemyChickens.length; i++) {
      const enemyChicken = enemyChickens[i];
      const enemyRect = enemyChicken.getBoundingClientRect();
      enemyHit.play();

      if (isColliding(ammoRect, enemyRect)) {
        totalKill++;
        console.log("totalKill: ", totalKill);
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
    } else if (totalKill === 25) {
      generateMainBoss();
    }
  }

  function checkEnemyGroupAndPlayerCollision(enemyGroup, intervalId) {
    // const enemyGroupRect = enemyGroup.getBoundingClientRect();

    const enemyChickens = document.querySelectorAll(".enemy-chicken");
    const mainPlayerRect = mainPlayer.getBoundingClientRect();

    for (let i = 0; i < enemyChickens.length; i++) {
      const enemyChicken = enemyChickens[i];
      const enemyRect = enemyChicken.getBoundingClientRect();

      if (isColliding(mainPlayerRect, enemyRect) && !isGameOver) {
        clearInterval(intervalId);

        showGameOverAlert();

        isGameOver = true;
      }

      if (isGameOver) {
        clearingInterval(intervalId);
      }
    }
  }

  function checkEnemyBulletAndPlayerCollision(enemyBullet, intervalId) {
    const bullectRect = enemyBullet.getBoundingClientRect();
    const playerRect = mainPlayer.getBoundingClientRect();

    // console.log("player got hit: ", hitByEnemyBullet);

    if (isColliding(playerRect, bullectRect)) {
      // console.log("hey it's true");
      hitByEnemyBullet++;
      updateLifeIndicator();
    }

    if (hitByEnemyBullet === 4 && !isGameOver) {
      clearInterval(intervalId);
      showGameOverAlert();
      isGameOver = true;
    }

    if (isGameOver) {
      clearingInterval(intervalId);
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

  function showGameOverAlert() {
    const modalOverlay = document.createElement("div");
    modalOverlay.classList.add("modal-overlay");

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    const gameOverText = document.createElement("p");
    gameOverText.textContent = "Game Over";

    const restartButton = document.createElement("button");
    restartButton.textContent = "Restart";
    restartButton.addEventListener("click", restartGame);

    modalContent.appendChild(gameOverText);
    modalContent.appendChild(restartButton);
    modalOverlay.appendChild(modalContent);
    gameContainer.appendChild(modalOverlay);
  }

  function appendLifeIndicator() {
    const lifeIndicatorContainer = document.createElement("div");
    lifeIndicatorContainer.classList.add("life-indicator-container");

    for (let i = 0; i < 4; i++) {
      const lifeIndicator = document.createElement("div");
      lifeIndicator.classList.add("life-indicator");

      if (i >= hitByEnemyBullet) {
        lifeIndicator.classList.add("empty");
      }

      lifeIndicatorContainer.appendChild(lifeIndicator);
    }

    indicator.appendChild(lifeIndicatorContainer);
  }

  function updateLifeIndicator() {
    const lifeIndicators = document.querySelectorAll(".life-indicator");

    for (let i = 0; i < lifeIndicators.length; i++) {
      if (i < hitByEnemyBullet) {
        lifeIndicators[i].classList.remove("empty");
      } else {
        lifeIndicators[i].classList.add("empty");
      }
    }
  }

  function generateMainBoss() {
    const mainBoss = document.createElement("img");
    mainBoss.src = "./hen.gif";
    mainBoss.classList.add("main-boss");

    gameContainer.appendChild(mainBoss);

    let mainBossPositionX = 0; // Initial position of main boss

    mainBoss.style.left = mainBossPositionX + "px";

    mainBossIntervalId = setInterval(() => {
      mainBossPositionX += 5; // Adjust the value according to your desired movement speed

      if (
        mainBossPositionX >
        gameContainer.offsetWidth - mainBoss.offsetWidth
      ) {
        clearInterval(mainBossIntervalId);

        // Start firing bullets
        mainBossBulletIntervalId = setInterval(() => {
          fireMainBossBullet(mainBossPositionX);
        }, 3000); // Adjust the firing rate as needed
      } else {
        mainBoss.style.left = mainBossPositionX + "px";
      }
    }, 30);
  }

  function fireMainBossBullet(mainBossPositionX) {
    const bullet = document.createElement("div");
    bullet.classList.add("ammo");

    const mainBoss = document.querySelector(".main-boss");

    const bulletPositionX =
      mainBossPositionX + (mainBoss.offsetWidth - ammoWidth) / 2;
    const bulletPositionY = gameContainer.offsetHeight - 200;

    bullet.style.left = bulletPositionX + "px";
    bullet.style.top = bulletPositionY + "px";

    gameContainer.appendChild(bullet);

    const bulletInterval = setInterval(() => {
      let currentTop = parseInt(bullet.style.top);
      let newTop = currentTop + ammoSpeed;
      bullet.style.top = newTop + "px";

      // Check collision with the player
      const playerRect = mainPlayer.getBoundingClientRect();
      const bulletRect = bullet.getBoundingClientRect();

      if (isColliding(playerRect, bulletRect) && !isGameOver) {
        clearInterval(bulletInterval);
        hitByEnemyBullet++;
        updateLifeIndicator();

        if (hitByEnemyBullet === 4) {
          clearInterval(mainBossBulletIntervalId);
          showGameOverAlert();
          isGameOver = true;
        }
      }

      if (parseInt(bullet.style.top) > gameContainer.offsetHeight) {
        clearInterval(bulletInterval);
        gameContainer.removeChild(bullet);
      }
    }, 50);
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

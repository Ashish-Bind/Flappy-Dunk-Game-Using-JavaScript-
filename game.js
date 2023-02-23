const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
//* To make the bg Blurry
const gameContainer = document.getElementById("game-container");

const flappyImage = new Image();
flappyImage.src = "assets/flappy_dunk.png";

//* Game Constants
const FLAP_SPEED = -5;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

//* Bird Variables
let birdX = 50;
let birdY = 50;
let birdVelocity = 0;
let birdAcceleration = 0.1;

//* Pipe Variables
let pipeX = 400;
let pipeY = canvas.height - 200;

//* Score and Highscore Variable
let scoreDiv = document.getElementById("score-display");
let score = 0;
let highScore = 0;

//* Adding a Bool to check the bird passes we increase value 
let scored = false;

document.body.onkeyup = (e) => {
  if (e.code == "Space") {
    birdVelocity = FLAP_SPEED;
  }
};

//* Let us restart the game
document.getElementById('restart-button').addEventListener('click', function () {
  console.log("Clicked");
  hideEndMenu();
  resetGame();
  loop();
})

function increaseScore() {
  //* Increase the score when passing the Pipes
  if (birdX > pipeX + PIPE_WIDTH && (birdY < pipeY + PIPE_GAP || birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) && !scored) {
    score++;
    scoreDiv.innerHTML = score;
    scored = true;
  }

  //* Resetting the flag if bird passes the pipe 
  if (birdX < pipeX + PIPE_WIDTH) {
    scored = false;
  }
}

function collisionCheck() {
  //* Creating Bounding Box for Bird and Pipes
  const birdBox = {
    x: birdX,
    y: birdY,
    width: BIRD_WIDTH,
    height: BIRD_HEIGHT
  }

  const topPipeBox = {
    x: pipeX,
    y: pipeY - PIPE_GAP + BIRD_HEIGHT,
    width: PIPE_WIDTH,
    height: pipeY
  }

  const bottomPipeBox = {
    x: pipeX,
    y: pipeY + PIPE_GAP + BIRD_HEIGHT,
    width: PIPE_WIDTH,
    height: canvas.height - pipeY - PIPE_GAP
  }

  //* Checking for collision with Upper pipe box
  if (birdBox.x + birdBox.width > topPipeBox.x && birdBox.x < topPipeBox.x + topPipeBox.width && birdBox.y < topPipeBox.y) {
    return true;
  }

  //* Checking for collision with Lower pipe box
  if (birdBox.x + birdBox.width > bottomPipeBox.x && birdBox.x < bottomPipeBox.x + bottomPipeBox.width && birdBox.y + birdBox.height > bottomPipeBox.y) {
    return true;
  }

  //* Checking if bird hit Boundaries
  if (birdY < 0 || birdY + BIRD_HEIGHT > canvas.height) {
    return true;
  }

  return false;
}

function hideEndMenu() {
  document.getElementById("end-menu").style.display = "none";
  gameContainer.classList.remove("backdrop-blur");
}

function showEndMenu() {
  document.getElementById("end-menu").style.display = "block";
  gameContainer.classList.add("backdrop-blur");
  document.getElementById("end-score").innerHTML = score;
  if (highScore < score) {
    highScore = score
  }
  document.querySelector('#best-score').innerHTML = highScore;
}

//* Resetting the values 
function resetGame() {
  birdX = 50;
  birdY = 50;
  birdVelocity = 0;
  birdAcceleration = 0.1;
  pipeX = 400;
  pipeY = canvas.height - 200;

  score = 0;
}

function endGame() {
  showEndMenu();
}

function loop() {
  //* Reset the ctx after every loop iteration
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //* Draw Flappy Bird
  ctx.drawImage(flappyImage, birdX, birdY);

  //* Draw Pipes
  ctx.fillStyle = "#333";
  ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
  ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

  //* Now we to add collision so we can display end-menu
  //* And end the Game
  //* If collison happen it will return true 
  //* otherwise false
  if (collisionCheck()) {
    endGame();
    return
  }

  //* Moving Pipes
  pipeX -= 1.5;
  //* If the pipes moves out of the frame we need to reset the pipe
  if (pipeX < -50) {
    pipeX = 400;
    pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
  }

  //* Applying Gravity to the bird
  birdVelocity += birdAcceleration;
  birdY += birdVelocity;

  increaseScore();
  requestAnimationFrame(loop);
}

loop();
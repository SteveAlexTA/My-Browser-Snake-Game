let snake;
let food;
let score = 0;
let highScore = 0;
let gameOver = false;
let p5Instance = null;

const HEADER_HEIGHT = 58;

function startGame() {
  document.getElementById('home-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');

  if (p5Instance) {
    p5Instance.remove();
    p5Instance = null;
  }

  p5Instance = new p5(function(p) {

    p.setup = function() {
      let size = calcCanvasSize();
      let canvas = p.createCanvas(size, size);
      canvas.parent('canvas-container');
      newGame(p);
    };

    p.draw = function() {
      p.background(7, 26, 13); // #071a0d — matches dark game bg

      if (gameOver) {
        drawGameOver(p);
        return;
      }

      if (!snake.isDead) {
        drawSnake(p);
      } else {
        gameOver = true;
        if (score > highScore) {
          highScore = score;
          document.getElementById('high-score-value').textContent = highScore;
        }
      }
    };

    p.keyPressed = function() {
      if (gameOver) {
        if (p.keyCode === p.ENTER || p.keyCode === 32) {
          newGame(p);
        }
        return;
      }
      if (p.keyCode === p.UP_ARROW && snake.vel.y !== 1) {
        snake.vel.y = -1; snake.vel.x = 0;
      } else if (p.keyCode === p.DOWN_ARROW && snake.vel.y !== -1) {
        snake.vel.y = 1;  snake.vel.x = 0;
      } else if (p.keyCode === p.LEFT_ARROW && snake.vel.x !== 1) {
        snake.vel.y = 0;  snake.vel.x = -1;
      } else if (p.keyCode === p.RIGHT_ARROW && snake.vel.x !== -1) {
        snake.vel.y = 0;  snake.vel.x = 1;
      }
    };

    p.windowResized = function() {
      let size = calcCanvasSize();
      p.resizeCanvas(size, size);
    };

  });
}

function calcCanvasSize() {
  let availableW = window.innerWidth;
  let availableH = window.innerHeight - HEADER_HEIGHT;
  let side = Math.min(availableW, availableH);
  return Math.floor(side / GRID_SIZE) * GRID_SIZE;
}

function drawSnake(p) {
  if (p.frameCount % SPEED === 0) {
    snake.update(p);
  }
  snake.show(p);
  food.show(p);
  if (snake.head.x === food.x && snake.head.y === food.y) {
    eatFood(p);
  }
}

function drawGameOver(p) {
  // Overlay
  p.fill(0, 0, 0, 190);
  p.noStroke();
  p.rect(0, 0, p.width, p.height);

  p.textAlign(p.CENTER, p.CENTER);
  p.noStroke();

  // GAME OVER
  p.fill(255, 70, 70);
  p.textSize(Math.min(p.width * 0.1, 52));
  p.textStyle(p.BOLD);
  p.text('GAME OVER', p.width / 2, p.height / 2 - 60);

  // Score
  p.fill(0, 230, 118);
  p.textSize(Math.min(p.width * 0.06, 28));
  p.textStyle(p.NORMAL);
  p.text('Score: ' + score, p.width / 2, p.height / 2 - 10);

  // High Score
  p.fill(255, 215, 64);
  p.textSize(Math.min(p.width * 0.045, 20));
  p.text('Best: ' + highScore, p.width / 2, p.height / 2 + 28);

  // Restart hint
  p.fill(74, 175, 100);
  p.textSize(Math.min(p.width * 0.036, 16));
  p.text('Press SPACE or ENTER to restart', p.width / 2, p.height / 2 + 68);
}

function eatFood(p) {
  snake.length++;
  score++;
  document.getElementById('score').textContent = score;
  food.newFood(p);
}

function newGame(p) {
  snake = new Snake(p);
  food = new Food(p);
  score = 0;
  gameOver = false;
  document.getElementById('score').textContent = '0';
}

function goHome() {
  if (p5Instance) {
    p5Instance.remove();
    p5Instance = null;
  }
  document.getElementById('game-screen').classList.add('hidden');
  document.getElementById('home-screen').classList.remove('hidden');
}
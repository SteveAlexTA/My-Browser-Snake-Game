let snake;
let food;
let score = 0;
let gameOver = false;

const HEADER_HEIGHT = 58; // must match CSS #game-header height

function setup() {
    let size = calcCanvasSize();
    let canvas = createCanvas(size, size);
    canvas.parent('canvas-container');
    newGame();
}

function calcCanvasSize() {
    let availableW = windowWidth;
    let availableH = windowHeight - HEADER_HEIGHT;
    let side = min(availableW, availableH);
    return floor(side / GRID_SIZE) * GRID_SIZE;
}

function draw() {
    background(17);

    if (gameOver) {
        drawGameOver();
        return;
    }

    if (!snake.isDead) {
        drawSnake();
    } else {
        gameOver = true;
    }
}

function drawSnake() {
    if (frameCount % SPEED == 0) {
        snake.update();
    }
    snake.show();
    food.show();
    if (snake.head.x == food.x && snake.head.y == food.y) {
        eatFood();
    }
}

function drawGameOver() {
    // Dark overlay
    fill(0, 0, 0, 200);
    noStroke();
    rect(0, 0, width, height);

    textAlign(CENTER, CENTER);
    noStroke();

    // GAME OVER
    fill(255, 70, 70);
    textSize(min(width * 0.1, 52));
    textStyle(BOLD);
    text('GAME OVER', width / 2, height / 2 - 55);

    // Score
    fill(255);
    textSize(min(width * 0.055, 26));
    textStyle(NORMAL);
    text('Score: ' + score, width / 2, height / 2);

    // Restart hint
    fill(74, 222, 128);
    textSize(min(width * 0.038, 18));
    text('Press SPACE or ENTER to restart', width / 2, height / 2 + 50);
}

function eatFood() {
    snake.length++;
    score++;
    document.getElementById('score').textContent = score;
    food.newFood();
}

function newGame() {
    snake = new Snake();
    food = new Food();
    score = 0;
    gameOver = false;
    document.getElementById('score').textContent = '0';
}

function windowResized() {
    let size = calcCanvasSize();
    resizeCanvas(size, size);
}

function keyPressed() {
    if (gameOver) {
        if (keyCode === ENTER || keyCode === 32) {
            newGame();
        }
        return;
    }

    if (keyCode === UP_ARROW && snake.vel.y != 1) {
        snake.vel.y = -1;
        snake.vel.x = 0;
    } else if (keyCode === DOWN_ARROW && snake.vel.y != -1) {
        snake.vel.y = 1;
        snake.vel.x = 0;
    } else if (keyCode === LEFT_ARROW && snake.vel.x != 1) {
        snake.vel.y = 0;
        snake.vel.x = -1;
    } else if (keyCode === RIGHT_ARROW && snake.vel.x != -1) {
        snake.vel.y = 0;
        snake.vel.x = 1;
    }
}
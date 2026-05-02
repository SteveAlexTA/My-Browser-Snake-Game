let snake;
let food;
let score = 0;
let highScore = 0;
let gameOver = false;
let paused = false;
let p5Instance = null;
let soundEnabled = true;

const HEADER_HEIGHT = 58;

function loadSettings() {
  let storedDifficulty = localStorage.getItem('snake_difficulty');
  if (storedDifficulty) {
    SPEED = parseInt(storedDifficulty);
  }
  let storedSound = localStorage.getItem('snake_sound');
  if (storedSound !== null) {
    soundEnabled = storedSound === 'true';
  }
  
  let scores = JSON.parse(localStorage.getItem('snake_scores') || '[]');
  if (scores.length > 0) {
    highScore = scores[0].score;
    let hsEl = document.getElementById('high-score-value');
    if (hsEl) hsEl.textContent = highScore;
  }
}
loadSettings();

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
      p.background(7, 26, 13);

      if (gameOver) {
        drawGameOver(p);
        return;
      }

      // Always render current game state so it's visible while paused
      snake.show(p);
      food.show(p);

      if (paused) {
        drawPauseOverlay(p);
        return;
      }

      // Game is active — update
      if (p.frameCount % SPEED === 0) {
        snake.update(p);
      }
      if (snake.head.x === food.x && snake.head.y === food.y) {
        eatFood(p);
      }
      if (snake.isDead) {
        gameOver = true;
        saveScoreToLeaderboard(score);
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
      if (paused) return; // Block movement while paused
      if ((p.keyCode === p.UP_ARROW || p.key === 'w' || p.key === 'W') && snake.vel.y !== 1) {
        snake.vel.y = -1; snake.vel.x = 0;
      } else if ((p.keyCode === p.DOWN_ARROW || p.key === 's' || p.key === 'S') && snake.vel.y !== -1) {
        snake.vel.y = 1;  snake.vel.x = 0;
      } else if ((p.keyCode === p.LEFT_ARROW || p.key === 'a' || p.key === 'A') && snake.vel.x !== 1) {
        snake.vel.y = 0;  snake.vel.x = -1;
      } else if ((p.keyCode === p.RIGHT_ARROW || p.key === 'd' || p.key === 'D') && snake.vel.x !== -1) {
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

// drawPauseOverlay — FR-001 Alternative Path: suspends game loop
function drawPauseOverlay(p) {
  p.fill(0, 0, 0, 170);
  p.noStroke();
  p.rect(0, 0, p.width, p.height);

  p.textAlign(p.CENTER, p.CENTER);

  p.fill(0, 230, 118);
  p.textSize(Math.min(p.width * 0.1, 52));
  p.textStyle(p.BOLD);
  p.text('PAUSED', p.width / 2, p.height / 2 - 20);

  p.fill(74, 175, 100);
  p.textSize(Math.min(p.width * 0.036, 16));
  p.textStyle(p.NORMAL);
  p.text('Click ▶ to Resume', p.width / 2, p.height / 2 + 30);
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
  paused = false;
  document.getElementById('score').textContent = '0';
  _updatePauseBtn();
}

// FR-001 Alternative Path: toggle pause/resume
function togglePause() {
  paused = !paused;
  _updatePauseBtn();
}

function _updatePauseBtn() {
  const btn = document.getElementById('pause-btn');
  if (!btn) return;
  btn.textContent = paused ? '▶' : '⏸';
  btn.title = paused ? 'Resume' : 'Pause';
}

function goHome() {
  paused = false;
  if (p5Instance) {
    p5Instance.remove();
    p5Instance = null;
  }
  document.getElementById('game-screen').classList.add('hidden');
  document.getElementById('home-screen').classList.remove('hidden');
}

function openSettings() {
  document.getElementById('difficulty').value = SPEED.toString();
  document.getElementById('sound').checked = soundEnabled;
  document.getElementById('home-screen').classList.add('hidden');
  document.getElementById('settings-screen').classList.remove('hidden');
}

function closeSettings(save) {
  if (save) {
    SPEED = parseInt(document.getElementById('difficulty').value);
    soundEnabled = document.getElementById('sound').checked;
    localStorage.setItem('snake_difficulty', SPEED.toString());
    localStorage.setItem('snake_sound', soundEnabled.toString());
  }
  document.getElementById('settings-screen').classList.add('hidden');
  document.getElementById('home-screen').classList.remove('hidden');
}

// FR-003: View Leaderboard
function saveScoreToLeaderboard(finalScore) {
  if (finalScore <= 0) return; // Don't save 0 scores
  let scores = JSON.parse(localStorage.getItem('snake_scores') || '[]');
  scores.push({
    score: finalScore,
    date: new Date().toLocaleDateString()
  });
  // Sort descending
  scores.sort((a, b) => b.score - a.score);
  // Keep only top 10
  scores = scores.slice(0, 10);
  localStorage.setItem('snake_scores', JSON.stringify(scores));
}

function openLeaderboard() {
  populateLeaderboardTable();
  document.getElementById('home-screen').classList.add('hidden');
  document.getElementById('leaderboard-screen').classList.remove('hidden');
}

function closeLeaderboard() {
  document.getElementById('leaderboard-screen').classList.add('hidden');
  document.getElementById('home-screen').classList.remove('hidden');
}

function populateLeaderboardTable() {
  let scores = JSON.parse(localStorage.getItem('snake_scores') || '[]');
  let tbody = document.getElementById('leaderboard-body');
  let table = document.getElementById('leaderboard-table');
  let emptyMsg = document.getElementById('empty-leaderboard');
  
  tbody.innerHTML = '';
  
  if (scores.length === 0) {
    table.classList.add('hidden');
    emptyMsg.classList.remove('hidden');
  } else {
    table.classList.remove('hidden');
    emptyMsg.classList.add('hidden');
    
    scores.forEach((entry, index) => {
      let tr = document.createElement('tr');
      let rankTd = document.createElement('td');
      rankTd.textContent = index + 1;
      let scoreTd = document.createElement('td');
      scoreTd.textContent = entry.score;
      let dateTd = document.createElement('td');
      dateTd.textContent = entry.date;
      
      tr.appendChild(rankTd);
      tr.appendChild(scoreTd);
      tr.appendChild(dateTd);
      tbody.appendChild(tr);
    });
  }
}
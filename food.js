class Food {
  constructor(p) {
    this.p = p;
    this.x = 0;
    this.y = 0;
    this.newFood(p);
  }

  newFood(p) {
    p = p || this.p;
    this.x = Math.floor(p.random(p.width  / GRID_SIZE)) * GRID_SIZE;
    this.y = Math.floor(p.random(p.height / GRID_SIZE)) * GRID_SIZE;
  }

  show(p) {
    p = p || this.p;
    p.noStroke();
    // Glowing red food
    p.fill(255, 60, 60);
    p.rect(this.x + 1, this.y + 1, GRID_SIZE - 3, GRID_SIZE - 3, 4);
  }
}

class BigFood {
  constructor(p) {
    this.p = p;
    this.x = 0;
    this.y = 0;
    this.active = false;
    this.timer = 0;
  }

  spawn(p) {
    p = p || this.p;
    this.x = Math.floor(p.random(p.width  / GRID_SIZE)) * GRID_SIZE;
    this.y = Math.floor(p.random(p.height / GRID_SIZE)) * GRID_SIZE;
    this.active = true;
    this.timer = 300; // ~60fps * 5 seconds
  }

  updateTimer() {
    if (this.active) {
      this.timer--;
      if (this.timer <= 0) {
        this.active = false;
      }
    }
  }

  show(p) {
    if (!this.active) return;
    p = p || this.p;
    p.noStroke();
    
    // Pulse effect
    let pulse = p.sin(p.frameCount * 0.15) * 4;
    
    // Glowing gold
    p.fill(255, 215, 0);
    p.rect(this.x - pulse/2, this.y - pulse/2, GRID_SIZE + pulse, GRID_SIZE + pulse, 6);
    
    // Flash white when about to expire (last 1 second = 60 frames)
    if (this.timer < 60 && this.timer % 10 < 5) {
      p.fill(255, 255, 255, 200);
      p.rect(this.x - pulse/2, this.y - pulse/2, GRID_SIZE + pulse, GRID_SIZE + pulse, 6);
    }
  }
}
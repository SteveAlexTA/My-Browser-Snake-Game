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
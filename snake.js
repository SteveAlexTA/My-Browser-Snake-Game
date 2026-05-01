class Snake {
  constructor(p) {
    this.p = p;
    this.head = p.createVector(0, 0);
    this.vel = p.createVector(1, 0);
    this.body = [];
    this.length = 0;
    this.isDead = false;
  }

  show(p) {
    p = p || this.p;
    p.noStroke();

    // Body segments
    p.fill(0, 180, 80);
    for (let v of this.body) {
      p.rect(v.x, v.y, GRID_SIZE - 1, GRID_SIZE - 1, 3);
    }

    // Head (brighter)
    p.fill(0, 230, 118);
    p.rect(this.head.x, this.head.y, GRID_SIZE - 1, GRID_SIZE - 1, 4);
  }

  update(p) {
    p = p || this.p;
    this.body.push(p.createVector(this.head.x, this.head.y));
    this.head.x += this.vel.x * GRID_SIZE;
    this.head.y += this.vel.y * GRID_SIZE;
    this.head.x = (this.head.x + p.width) % p.width;
    this.head.y = (this.head.y + p.height) % p.height;
    if (this.length < this.body.length) {
      this.body.shift();
    }
    for (let v of this.body) {
      if (v.x === this.head.x && v.y === this.head.y) {
        this.isDead = true;
      }
    }
  }
}
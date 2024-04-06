class Wall {
  constructor({ x, y, color, h, w }) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.h = h;
    this.w = w;
  }

  draw() {
    let hsl = `hsl(${this.color} , 100%,50%)`;
    c.save();
    c.shadowColor = `hsl(${this.color} , 100%,30%)`;
    c.shadowBlur = 5;
    c.beginPath();
    c.rect(this.x - 5, this.y - 5, this.h, this.w);
    c.fillStyle = hsl;
    c.fill();
    c.restore();
  }
}

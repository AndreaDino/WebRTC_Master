class Player {
  constructor({ x, y, radius, color, index, score, username }) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.index = index;
    this.score = score;
    this.username = username;
  }

  draw() {
    let hsl = `hsl(${this.color} , 100%,50%)`;
    c.save();
    c.shadowColor = `hsl(${this.color} , 100%,30%)`;
    c.shadowBlur = 5;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = hsl;
    c.fill();
    c.restore();
  }
}

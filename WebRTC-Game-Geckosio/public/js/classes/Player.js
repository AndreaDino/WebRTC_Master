export class Player {
  constructor({ x, y, radius, color, index, score, username }) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.index = index;
    this.score = score;
    this.username = username;
  }

  draw( canvas ) {
    let hsl = `hsl(${this.color} , 100%,50%)`;
    canvas.save();
    canvas.shadowColor = `hsl(${this.color} , 100%,30%)`;
    canvas.shadowBlur = 5;
    canvas.beginPath();
    canvas.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    canvas.fillStyle = hsl;
    canvas.fill();
    canvas.restore();
  }
}

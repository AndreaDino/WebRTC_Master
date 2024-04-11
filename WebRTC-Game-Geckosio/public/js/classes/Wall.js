export class Wall {
  constructor({ x, y, color, h, w }) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.h = h;
    this.w = w;
  }

  draw( canvas ) {
    let hsl = `hsl(${this.color} , 100%,50%)`;
    canvas.save();
    canvas.shadowColor = `hsl(${this.color} , 100%,30%)`;
    canvas.shadowBlur = 5;
    canvas.beginPath();
    canvas.rect(this.x - 5, this.y - 5, this.h, this.w);
    canvas.fillStyle = hsl;
    canvas.fill();
    canvas.restore();
  }
}

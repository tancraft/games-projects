export default class Bullet {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 3;
    this.okDelete = false;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.draw();
    //collision

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

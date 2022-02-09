export default class Game {
  constructor(canvas) {
    this.gamescreen = document.getElementById(canvas);
    this.ctx = canvas.getContext("2d");
    this.gamewidth = canvas.width;
    this.gameHeight = canvas.height;
    this.game = {
      over: false,
    };
    this.lastTime = 0;
  }

  deltaTimeCalc(timeStamp) {
    return timeStamp - this.lastTime;
  }

  preload() {}

  draw() {
    this.ctx.fillStyle = "blue";
    this.ctx.fillRect(100, 100, 400, 100);
  }

}

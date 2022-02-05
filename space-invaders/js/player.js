import  Bullet  from "./bullet.js";
import { ctx } from "./app";

export default class Player {
  constructor(gameWidth, gameHeight, context) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.context = context;
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.opacity = 1;
    this.image = document.querySelector("#player");
    this.width = 32;
    this.height = 44;
    this.position = {
      x: this.gameWidth / 2 - this.width / 2,
      y: this.gameHeight - this.height - 50,
    };
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 1;
    this.fps = 30;
    this.frameTimer = 0;
    this.frameInterval = 1000 / this.fps;
  }

  restart() {
    this.position = {
      x: this.gameWidth / 2 - this.width / 2,
      y: this.gameHeight - this.height - 50,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.opacity = 1;
    this.frameX = 0;
    this.frameY = 0;
  }
  shoot(bullets) {
    bullets.push(
      new Bullet({
        position: {
          x: player.position.x + player.width / 2,
          y: player.position.y,
        },
        velocity: {
          x: 0,
          y: -10,
        },
      })
    );
  }

  draw() {
    this.context.save();
    this.context.globalAlpha = this.opacity;
    ctx.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    this.context.restore();
  }

  update(input, deltaTime) {
    this.draw();

    if (input.keys.indexOf("q") > -1 || input.keys.indexOf("swipe left") > -1) {
      this.velocity.x = -7;
      this.frameY = 1;
    } else if (
      input.keys.indexOf("d") > -1 ||
      input.keys.indexOf("swipe right") > -1
    ) {
      this.velocity.x = 7;
      this.frameY = 2;
    } else {
      this.velocity.x = 0;
      this.frameY = 0;
    }
    if (this.frameTimer > this.frameInterval) {
      if (this.frameX >= this.maxFrame) this.frameX = 0;
      else this.frameX++;
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }
    if (this.position.x <= 0) {
      this.position.x = 0;
      this.velocity.x = 7;
      this.frameY = 0;
      this.frameX = 0;
    } else if (this.position.x >= this.gameWidth - this.width) {
      this.position.x = this.gameWidth - this.width;
      this.velocity.x = -7;
      this.frameY = 0;
      this.frameX = 0;
    }
    this.position.x += this.velocity.x;
  }
}

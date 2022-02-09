import {
  StandingLeft,
  StandingRight,
  SittingLeft,
  SittingRight,
  RunningLeft,
  RunningRight,
  JumpingLeft,
  JumpingRight,
  FallingLeft,
  FallingRight,
} from "./state.js";

export default class Player {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.states = [
      new StandingLeft(this),
      new StandingRight(this),
      new SittingLeft(this),
      new SittingRight(this),
      new RunningLeft(this),
      new RunningRight(this),
      new JumpingLeft(this),
      new JumpingRight(this),
      new FallingLeft(this),
      new FallingRight(this),
    ];
    this.currentState = this.states[1];
    this.image = document.querySelector("#dogimage");
    this.width = 200;
    this.height = 181.83;
    this.fps = 30;
    this.frameTimer = 0;
    this.frameInterval = 1000 / this.fps;
    this.weight = 1;
    this.position = {
      x: (this.gameWidth - this.width) / 2,
      y: this.gameHeight - this.height,
    };
    this.frame = {
      x: 0,
      y: 0,
      maxFrame: 6,
    };
    this.velocity = {
      x: 0,
      y: 0,
      maxSpeed: 10,
    };
  }
  draw(context, deltaTime) {
    if (this.frameTimer > this.frameInterval) {
      if (this.frame.x < this.frame.maxFrame) {
        this.frame.x++;
      } else {
        this.frame.x = 0;
      }
      this.frameTimer = 0;
    }else{
        this.frameTimer += deltaTime;
    }
    context.drawImage(
      this.image,
      this.width * this.frame.x,
      this.height * this.frame.y,
      this.width,
      this.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
  update(input) {
    this.currentState.handleInput(input);
    this.position.x += this.velocity.x;
    if (this.position.x <= 0) {
      this.position.x = 0;
    } else if (this.position.x >= this.gameWidth - this.width) {
      this.position.x = this.gameWidth - this.width;
    }
    this.position.y += this.velocity.y;
    if (!this.onGround()) {
      this.velocity.y += this.weight;
    } else {
      this.velocity.y = 0;
    }
    if (this.position.y > this.gameHeight - this.height) {
      this.position.y = this.gameHeight - this.height;
    }
  }
  setState(state) {
    this.currentState = this.states[state];
    this.currentState.enter();
  }
  onGround() {
    return this.position.y >= this.gameHeight - this.height;
  }
}

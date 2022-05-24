class Game {
  constructor() {
    this.canvas = document.getElementById("breakout");
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.ctx = this.canvas.getContext("2d");
    this.score = 0;
    this.gameOver = false;
    this.player = new Player(this);
    this.ball = new Ball(this);
  }

  restart() {}

  init() {
    const map = [
      ["-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", "-", "-", " ", " ", "-", "-", "-"],
      ["-", "-", " ", " ", " ", " ", "-", "-"],
    ];

    const bundaries = [];

    map.forEach((row,i) => {
      map.forEach((symbol,j) => {
        switch (symbol) {
          case "-":
            bundaries.push(new Brick({ game: this, posX: 40 * j, posY: 20 * i }));
            break;
        }
      });
    });
    bundaries.foreach((bundary) => {
      bundary.draw();
    })
    const step = () => {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(0, 0, this.width, this.height);

      this.player.update();
      this.ball.update();
      requestAnimationFrame(step);
    };
    step();
  }
}

class InputHandler {
  constructor(player) {
    this.player = player;
    this.keys = [];

    window.addEventListener("keydown", (e) => {
      if ((e.key === "q" || e.key === "d") && this.keys.indexOf(e.key) === -1) {
        this.keys.push(e.key);
      } else if (e.key === "Enter" && this.player.game.over) {
        restartGame();
      }
    });
    window.addEventListener("keyup", (e) => {
      if (e.key === "q" || e.key === "d") {
        this.keys.splice(this.keys.indexOf(e.key), 1);
      }
    });
  }
}

class Player {
  constructor(game) {
    this.game = game;
    this.width = 100;
    this.height = 15;
    this.color = "white";
    this.posX = (this.game.width - this.width) / 2;
    this.posY = this.game.height - this.height;
    this.speed = 7;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.handler = new InputHandler(this);
  }
  draw() {
    this.game.ctx.fillStyle = this.color = this.color;
    this.game.ctx.fillRect(this.posX, this.posY, this.width, this.height);
  }

  collision() {
    if (this.posX <= 0) {
      this.posX = 0;
    } else if (this.posX >= this.game.width - this.width) {
      this.posX = this.game.width - this.width;
    }
  }

  update() {
    this.collision();
    this.posX += this.velocity.x;
    if (this.handler.keys.indexOf("q") > -1) {
      this.velocity.x = -this.speed;
    } else if (this.handler.keys.indexOf("d") > -1) {
      this.velocity.x = this.speed;
    } else {
      this.velocity.x = 0;
    }
    this.draw();
  }
}

class Ball {
  constructor(game) {
    this.game = game;
    this.posX = 20;
    this.posY = 20;
    this.color = "yellow";
    this.speed = 3;
    this.radius = 10;
    this.velocity = {
      x: this.speed,
      y: this.speed,
    };
  }
  draw() {
    this.game.ctx.beginPath();
    this.game.ctx.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
    this.game.ctx.fillStyle = this.color;
    this.game.ctx.fill();
    this.game.ctx.closePath();
  }

  collision() {
    if (
      this.posX + this.velocity.x > this.game.width - this.radius ||
      this.posX + this.velocity.x < this.radius
    ) {
      this.velocity.x = -this.velocity.x;
    }
    if (this.posY + this.velocity.y < this.radius) {
      this.velocity.y = -this.velocity.y;
    } else if (
      this.posY + this.velocity.y >
      this.game.height - this.radius - this.game.player.height * 2
    ) {
      if (
        this.posY > this.game.player.posY &&
        this.posX < this.game.player.posX + this.game.player.width
      ) {
        this.velocity.y = -this.velocity.y;
      }
    }
  }

  update() {
    this.collision();
    this.posX += this.velocity.x;
    this.posY += this.velocity.y;
    this.draw();
  }
}

const map = [
  ["-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", " ", " ", "-", "-", "-"],
  ["-", "-", " ", " ", " ", " ", "-", "-"],
];

const bundaries = [];

map.forEach((row)=>{
  map.forEach((symbol) => {
    switch (symbol){
      case "-":
        bundaries.push(new Brick({game: this.game, posX: 0, posY: 0}));
        break;
    }
  });
})

class Brick {
  constructor(config) {
    this.game = config.game;
    this.width = 40;
    this.height = 20;
    this.posX = config.posX;
    this.posY = config.posY;
  }
  draw() {
    this.game.ctx.fillStyle = this.color;
    this.game.ctx.fillRect(this.posX, this.posY, this.width, this.height);
  }
}

class GridBrick {
  constructor() {
    this.rows = 5;
    this.colum = 3;

    this.bricks = [];

    const columns = Math.floor(Math.random() * 10 + 5);
    const rows = Math.floor(Math.random() * 5 + 2);

    this.width = columns * 40;
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        this.bricks.push(
          new Brick({
            position: {
              x: x * 20,
              y: y * 20,
            },
          })
        );
      }
    }
  }

  draw() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status == 1) {
          let brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
          let brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
        }
      }
    }
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.y = 0;

    if (this.position.x + this.width > canvas.width || this.position.x < 0) {
      this.velocity.x = -this.velocity.x;
      this.velocity.y = 40;
    }
  }
}

const game = new Game();

game.init();

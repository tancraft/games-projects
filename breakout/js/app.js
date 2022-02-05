const canvas = document.querySelector("#breakout");
const ctx = canvas.getContext("2d");

canvas.width = 1200;
canvas.height = 800;

class Player {
  constructor() {
    this.width = 100;
    this.height = 15;
    this.position = {
      x: (canvas.width - this.width) / 2,
      y: canvas.height - this.height,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
  }
  draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
  }
}

class Ball {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 10;
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
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Brick {
  constructor() {
    this.width = 20;
    this.height = 10;
    this.position = {
      x: 0,
      y: 0,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
  }
  draw() {
    ctx.fillStyle = "green";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
  }
}

class GridBrick {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };

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

const player = new Player();
const ball = new Ball({ position: { x: 20, y: 20 }, velocity: { x: 5, y: 5 } });
const brick = new Brick();

const keys = {
  left: {
    pressed: false,
  },
  right: {
    pressed: false,
  },
};

function animate() {
  requestAnimationFrame(animate);

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  player.update();
  ball.update();
  brick.update()

  //collision balle
  if (
    ball.position.x + ball.velocity.x > canvas.width - ball.radius ||
    ball.position.x + ball.velocity.x < ball.radius
  ) {
    ball.velocity.x = -ball.velocity.x;
  }
  if (ball.position.y + ball.velocity.y < ball.radius) {
    ball.velocity.y = -ball.velocity.y;
  } else if (ball.position.y + ball.velocity.y > canvas.height - ball.radius) {
    if (
      ball.position.x > player.position.x &&
      ball.position.x < player.position.x + player.width
    ) {
      ball.velocity.y = -ball.velocity.y;
    } else {
      console.log("lose");
    }
  }

  //collision joueur
  if (keys.left.pressed && player.position.x > 0) {
    player.velocity.x = -7;
  } else if (
    keys.right.pressed &&
    player.position.x + player.width < canvas.width
  ) {
    player.velocity.x = 7;
  } else {
    player.velocity.x = 0;
  }
}

animate();

addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "q":
      keys.left.pressed = true;
      break;
    case "d":
      keys.right.pressed = true;
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "q":
      keys.left.pressed = false;
      break;
    case "d":
      keys.right.pressed = false;
      break;
  }
});

const canvas = document.querySelector("#space-invader");
const ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 720;
const loader = document.querySelector(".loader");
const fullscreen = document.querySelector("#toggleScreen");

let grids = [];
let bullets = [];
let bulletsInvaders = [];
let particles = [];
let score = 0;
let game = {
  over: false,
  active: true,
};

class InputHandler {
  constructor(player) {
    this.player = player;
    this.keys = [];
    this.touchX = "";
    this.touchY = "";
    this.touchTreshold = 50;
    this.touchPadTresh = 10;

    window.addEventListener("keydown", (e) => {
      if ((e.key === "q" || e.key === "d") && this.keys.indexOf(e.key) === -1) {
        this.keys.push(e.key);
      } else if (e.key === " ") {
        this.player.shoot(bullets);
      } else if (e.key === "Enter" && game.over) {
        restartGame();
      }
    });
    window.addEventListener("keyup", (e) => {
      if (e.key === "q" || e.key === "d") {
        this.keys.splice(this.keys.indexOf(e.key), 1);
      }
    });
    //controles mobiles
    window.addEventListener("touchstart", (e) => {
      this.player.shoot(bullets);
      if (e.touches.length <= 1) {
        this.touchX = e.changedTouches[0].pageX;
      }
    });
    window.addEventListener("touchmove", (e) => {
      const swipeDistanceX = e.changedTouches[0].pageX - this.touchX;
      if (
        swipeDistanceX < -this.touchPadTresh &&
        this.keys.indexOf("swipe left") === -1
      ) {
        this.keys.splice(this.keys.indexOf("swipe right"), 1);
        this.keys.push("swipe left");
      } else if (
        swipeDistanceX > this.touchPadTresh &&
        this.keys.indexOf("swipe right") === -1
      ) {
        this.keys.splice(this.keys.indexOf("swipe left"), 1);
        this.keys.push("swipe right");
        if (game.over) restartGame();
      }
      // console.log(this.keys);
    });
    window.addEventListener("touchend", (e) => {
      this.keys.splice(this.keys.indexOf("swipe right"), 1);
      this.keys.splice(this.keys.indexOf("swipe left"), 1);
    });
  }
}

class Player {
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

class Invader {
  constructor(gameWidth, gameHeight, context, position) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.context = context;
    this.okDelete = false;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.image = document.querySelector("#enemy");
    this.width = 32;
    this.height = 30;
    this.position = {
      x: position.x,
      y: position.y,
    };
    this.maxFrame = 5;
    this.frameX = Math.floor(Math.random() * this.maxFrame);
    this.fps = 30;
    this.frameTimer = 0;
    this.frameInterval = 1000 / this.fps;
  }
  draw() {
    this.context.drawImage(
      this.image,
      this.frameX * this.width,
      0 * this.height,
      this.width,
      this.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update(deltaTime, { velocity }) {
    if (this.image) {
      this.draw();
      this.position.x += velocity.x;
      this.position.y += velocity.y;
    }
    if (this.frameTimer > this.frameInterval) {
      if (this.frameX >= this.maxFrame) this.frameX = 0;
      else this.frameX++;
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }
  }

  shoot(BulletsInvaders) {
    BulletsInvaders.push(
      new BulletInvader({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height,
        },
        velocity: {
          x: 0,
          y: 4,
        },
      })
    );
  }
}

class Bullet {
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

class Particle {
  constructor({ position, velocity, radius, color, fade }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.color = color;
    this.opacity = 1;
    this.fade = fade;
    this.okDelete = false;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y - this.radius > canvas.height) {
      this.position.x = Math.random() * canvas.width;
      this.position.y = -this.radius;
    }

    if (this.fade) {
      this.opacity -= 0.01;
    }
  }
}

class BulletInvader {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 3;
    this.height = 10;
    this.okDelete = false;
  }
  draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update(player, index) {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (
      this.position.y + this.height > player.position.y &&
      this.position.x + this.width > player.position.x &&
      this.position.x < player.position.x + player.width
    ) {
      setTimeout(() => {
        bulletsInvaders.splice(index, 1);
        player.opacity = 0;
        game.over = true;
      }, 0);
      setTimeout(() => {
        game.active = false;
      }, 2000);
      createParticles(player, "red", true);
    }
  }
}

class GridInvaders {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };
    this.velocity = {
      x: 3,
      y: 0,
    };

    this.invaders = [];
    this.okDelete = false;

    const columns = Math.floor(Math.random() * 5 + 4);
    const rows = Math.floor(Math.random() * 3 + 2);

    this.width = columns * 40;
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        this.invaders.push(
          new Invader(canvas.width, canvas.height, ctx, {
            x: x * 40,
            y: y * 40,
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

function handleEnnemies(deltaTime) {
  if (enemyTimer > enemyInterval + randomEnemyInterval) {
    grids.push(new GridInvaders());
    enemyTimer = 0;
  } else {
    enemyTimer += deltaTime;
  }

  grids.forEach((grid) => {
    grid.update();

    grid.invaders.forEach((invader) => {
      invader.update(deltaTime, { velocity: grid.velocity });
      // collision missiles avec ennemis
      bullets.forEach((bullet) => {
        if (
          bullet.position.y - bullet.radius <=
            invader.position.y + invader.height &&
          bullet.position.x + bullet.radius >= invader.position.x &&
          bullet.position.x - bullet.radius <=
            invader.position.x + invader.width &&
          bullet.position.y + bullet.radius >= invader.position.y
        ) {
          createParticles(invader, "green", true);
          bullet.okDelete = true;
          invader.okDelete = true;
          score += 100;
          setTimeout(() => {
            if (invader.okDelete && bullet.okDelete) {
              if (grid.invaders.length > 0) {
                const firstInvader = grid.invaders[0];
                const lastInvader = grid.invaders[grid.invaders.length - 1];
                grid.width =
                  lastInvader.position.x -
                  firstInvader.position.x +
                  lastInvader.width;
                grid.position.x = firstInvader.position.x;
              } else {
                score += 300;
                grid.okDelete = true;
              }
            }
          }, 0);
        }
      });
      grid.invaders = grid.invaders.filter((invader) => !invader.okDelete);
    });
  });

  bullets.forEach((bullet, index) => {
    if (bullet.position.y + bullet.radius < 0) {
      setTimeout(() => {
        bullets.splice(index, 1);
      }, 0);
    } else {
      bullet.update();
    }
  });
  grids = grids.filter((gridDel) => !gridDel.okDelete);
  bullets = bullets.filter((bullet) => !bullet.okDelete);
}

function handleMissiles(deltaTime) {
  grids.forEach((ennemyGrid) => {
    if (
      missileTimer > missileInterval + randomEnemyInterval &&
      ennemyGrid.invaders.length > 0
    ) {
      ennemyGrid.invaders[
        Math.floor(Math.random() * ennemyGrid.invaders.length)
      ].shoot(bulletsInvaders);
      missileTimer = 0;
    } else {
      missileTimer += deltaTime;
    }
  });
  bulletsInvaders.forEach((bulletInvader, index) => {
    if (bulletInvader.position.y + bulletInvader.height > canvas.height) {
      setTimeout(() => {
        bulletsInvaders.splice(index, 1);
      }, 0);
    } else {
      bulletInvader.update(player);
    }
  });
}

function createParticles(objet, color, fade) {
  for (let i = 0; i < 15; i++) {
    particles.push(
      new Particle({
        position: {
          x: objet.position.x + objet.width / 2,
          y: objet.position.y + objet.height / 2,
        },
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
        },
        radius: Math.random() * 3,
        color: color,
        fade: fade,
      })
    );
  }
}

function displayStatusText(context) {
  if (game.over) {
    context.textAlign = "center";
    context.fillStyle = "black";
    context.font = "40px Arial";
    context.fillText(
      "GAME OVER! Press Enter to Restart",
      canvas.width / 2,
      300
    );
    context.fillStyle = "white";
    context.font = "40px Arial";
    context.fillText(
      "GAME OVER! Press Enter to Restart",
      canvas.width / 2 + 2,
      302
    );
  } else {
    context.textAlign = "left";
    context.fillStyle = "black";
    context.font = "25px Arial";
    context.fillText("Score: " + score, 20, canvas.height - 20);
    context.fillStyle = "white";
    context.font = "25px Arial";
    context.fillText("Score: " + score, 22, canvas.height - 20 + 2);
  }
}

function animate(timeStamp) {
  const deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.update(input, deltaTime);

  handleEnnemies(deltaTime);
  handleMissiles(deltaTime);
  particles.forEach((particle, i) => {
    if (particle.opacity <= 0) {
      setTimeout(() => {
        particles.splice(i, 1);
      }, 0);
    } else {
      particle.update();
    }
  });
  displayStatusText(ctx);
  if (!game.over) {
    requestAnimationFrame(animate);
  }
}

function restartGame() {
  player.restart();
  grids = [];
  bullets = [];
  bulletsInvaders = [];
  score = 0;
  game = {
    over: false,
    active: true,
  };
  animate(0);
}

function toggleFullscreen() {
  console.log(document.fullscreenElement);
  if (!document.fullscreenElement) {
    canvas
      .requestFullscreen()
      .then()
      .catch((err) =>
        console.log(`erreur, le plein ecran n est pas activer: ${err.message}`)
      );
  } else {
    document.exitFullscreen();
  }
}

const player = new Player(canvas.width, canvas.height, ctx);
const input = new InputHandler(player);
let lastTime = 0;
let enemyTimer = 0;
let missileTimer = 0;
let missileInterval = 1000;
let enemyInterval = 2000;
let randomEnemyInterval = Math.random() * 1000 + 500;

for (let i = 0; i < 100; i++) {
  particles.push(
    new Particle({
      position: {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
      },
      velocity: {
        x: 0,
        y: 0.3,
      },
      radius: Math.random() * 2,
      color: "white",
    })
  );
}

fullscreen.addEventListener("click", toggleFullscreen);

window.addEventListener("load", function () {
  loader.style.display = "none";
  animate(0);
});

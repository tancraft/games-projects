const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = 1280;
canvas.height = 720;
let enemies = [];
let score = 0;
let gameOver = false;
const toggleScreen = document.getElementById("togglefullscreen");

class InputHandler {
  constructor(player) {
    this.player = player;
    this.keys = [];
    this.touchY = "";
    this.touchTreshold = 100;

    window.addEventListener("keydown", (e) => {
      if (
        (e.key === "q" || e.key === "d" || e.key === "z") &&
        this.keys.indexOf(e.key) === -1
      ) {
        this.keys.push(e.key);
      } else if (e.key === "Enter" && gameOver) {
        restartGame();
      }
    });
    window.addEventListener("keyup", (e) => {
      if (e.key === "q" || e.key === "d" || e.key === "z") {
        this.keys.splice(this.keys.indexOf(e.key), 1);
      }
    });
    window.addEventListener("touchstart", (e) => {
      this.touchY = e.changedTouches[0].pageY;
    });
    window.addEventListener("touchmove", (e) => {
      const swipeDistance = e.changedTouches[0].pageY - this.touchY;
      if (
        swipeDistance < -this.touchTreshold &&
        this.keys.indexOf("swipe up") === -1
      ) {
        this.keys.push("swipe up");
      } else if (
        swipeDistance > this.touchTreshold &&
        this.keys.indexOf("swipe down") === -1
      ) {
        this.keys.push("swipe down");
        if (gameOver) restartGame();
      }
    });
    window.addEventListener("touchend", (e) => {
      this.keys.splice(this.keys.indexOf("swipe up"), 1);
      this.keys.splice(this.keys.indexOf("swipe down"), 1);
    });
  }
}

class Player {
  constructor(gameWidth, gameHeight, context) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.context = context;
    this.width = 200;
    this.height = 200;
    this.x = 100;
    this.y = this.gameHeight - this.height;
    this.image = document.getElementById("player");
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 8;
    this.fps = 20;
    this.frameTimer = 0;
    this.frameInterval = 1000 / this.fps;
    this.speed = 0;
    this.vy = 0;
    this.weight = 1;
  }
  restart() {
    this.x = 100;
    this.y = this.gameHeight - this.height;
    this.maxFrame = 8;
    this.frameY = 0;
  }
  draw() {
    // this.context.lineWidth = 5;
    // this.context.strokeStyle = "white";
    // this.context.beginPath();
    // this.context.arc(
    //   this.x + this.width / 2,
    //   this.y + this.height / 2 + 20,
    //   this.width / 3,
    //   0,
    //   Math.PI * 2
    // );
    // this.context.stroke();
    this.context.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  update(input, deltaTime, enemies) {
    this.draw();
    //collision detection
    enemies.forEach((enemy) => {
      const dx = enemy.x + enemy.width / 2 - 20 - (this.x + this.width / 2);
      const dy = enemy.y + enemy.height / 2 - (this.y + this.height / 2 + 20);
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < enemy.width / 3 + this.width / 3) {
        gameOver = true;
      }
    });
    //sprite animation
    if (this.frameTimer > this.frameInterval) {
      if (this.frameX >= this.maxFrame) this.frameX = 0;
      else this.frameX++;
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }
    if (input.keys.indexOf("q") > -1) {
      this.speed = -5;
    } else if (input.keys.indexOf("d") > -1) {
      this.speed = 5;
    } else if (
      input.keys.indexOf("z") > -1 ||
      (input.keys.indexOf("swipe up") > -1 && this.onGround())
    ) {
      this.vy = -20;
    } else {
      this.speed = 0;
    }
    //mouvement horizontal
    this.x += this.speed;
    if (this.x < 0) this.x = 0;
    else if (this.x > this.gameWidth - this.width)
      this.x = this.gameWidth - this.width;
    //mouvement vertical
    this.y += this.vy;
    if (!this.onGround()) {
      this.vy += this.weight;
      this.maxFrame = 5;
      this.frameY = 1;
    } else {
      this.vy = 0;
      this.maxFrame = 8;
      this.frameY = 0;
    }
    if (this.y > this.gameHeight - this.height)
      this.y = this.gameHeight - this.height;
  }
  onGround() {
    return this.y >= this.gameHeight - this.height;
  }
}

class Background {
  constructor(gameWidth, gameHeight, context) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.context = context;
    this.width = 2400;
    this.height = 720;
    this.x = 0;
    this.y = 0;
    this.image = document.getElementById("bcg");
    this.speed = 4;
  }
  restart() {
    this.x = 0;
  }
  draw() {
    this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
    this.context.drawImage(
      this.image,
      this.x + this.width - this.speed,
      this.y,
      this.width,
      this.height
    );
  }
  update() {
    this.draw();
    this.x -= this.speed;
    if (this.x < 0 - this.width) this.x = 0;
  }
}

class Enemy {
  constructor(gameWidth, gameHeight, context) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.context = context;
    this.width = 160;
    this.height = 119;
    this.x = this.gameWidth;
    this.y = this.gameHeight - this.height;
    this.image = document.getElementById("enemy");
    this.frameX = 0;
    this.maxFrame = 5;
    this.fps = 20;
    this.frameTimer = 0;
    this.frameInterval = 1000 / this.fps;
    this.speed = 8;
    this.okDelete = false;
  }
  draw() {
    // this.context.lineWidth = 5;
    // this.context.strokeStyle = "white";
    // this.context.beginPath();
    // this.context.arc(
    //   this.x + this.width / 2 - 20,
    //   this.y + this.height / 2,
    //   this.width / 3,
    //   0,
    //   Math.PI * 2
    // );
    // this.context.stroke();
    this.context.drawImage(
      this.image,
      this.frameX * this.width,
      0 * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  update(deltaTime) {
    this.draw();
    if (this.frameTimer > this.frameInterval) {
      if (this.frameX >= this.maxFrame) this.frameX = 0;
      else this.frameX++;
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }
    this.x -= this.speed;
    if (this.x < 0 - this.width) this.okDelete = true;
    score++;
  }
}

function handleEnemies(deltaTime) {
  if (enemyTimer > enemyInterval + randomEnemyInterval) {
    enemies.push(new Enemy(canvas.width, canvas.height, ctx));
    enemyTimer = 0;
  } else {
    enemyTimer += deltaTime;
  }
  enemies.forEach((enemy) => {
    enemy.update(deltaTime);
  });
  enemies = enemies.filter((enemy) => !enemy.okDelete);
}
function displayStatusText(context) {
  context.fillStyle = "black";
  context.font = "40px Arial";
  context.fillText("Score: " + score, canvas.width / 12, 50);
  context.fillStyle = "white";
  context.font = "40px Arial";
  context.fillText("Score: " + score, canvas.width/12 + 2, 52);
  if (gameOver) {
    context.textAlign = "center";
    context.fillStyle = "black";
    context.font = "40px Arial";
    context.fillText(
      "GAME OVER! Appuyer sur Enter pour rejouer",
      canvas.width / 2,
      200
    );
    context.fillText("ou glisser vers le bas", canvas.width / 2, 300);
    context.fillStyle = "white";
    context.font = "40px Arial";
    context.fillText(
      "GAME OVER! Appuyer sur Enter pour rejouer",
      canvas.width / 2 + 2,
      202
    );
    context.fillText("ou glisser vers le bas", canvas.width / 2 + 2, 302);
  }
}

function restartGame() {
  player.restart();
  background.restart();
  enemies = [];
  score = 0;
  gameOver = false;
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
toggleScreen.addEventListener("click", toggleFullscreen);

function animate(timeStamp) {
  const deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  background.update();
  player.update(input, deltaTime, enemies);
  handleEnemies(deltaTime);
  displayStatusText(ctx);
  if (!gameOver) {
    requestAnimationFrame(animate);
  }
}

const player = new Player(canvas.width, canvas.height, ctx);
const input = new InputHandler(player);
const background = new Background(canvas.width, canvas.height, ctx);
let lastTime = 0;
let enemyTimer = 0;
let enemyInterval = 1000;
let randomEnemyInterval = Math.random() * 1000 + 500;

window.addEventListener("load", function () {
  animate(0);
});

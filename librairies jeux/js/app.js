import Game from "./game.js";

const canvas = document.getElementById("canvas-1");
canvas.width = 1280;
canvas.height = 720;
const game = new Game(canvas);

function gameLoop(timeStamp) {
  const deltaTime = timeStamp - game.lastTime;
  game.lastTime = timeStamp;
  game.ctx.fillStyle = "black";
  game.ctx.fillRect(0, 0, game.gamewidth, game.gameHeight);
  console.log(deltaTime);
  game.draw();

  if (!game.over) {
    requestAnimationFrame(gameLoop);
  }
}

window.addEventListener("load", () => {
  gameLoop(0);
});

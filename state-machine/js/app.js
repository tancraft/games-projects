import Player from './Player.js';
import InputHandler from "./InputHandler.js";
import { drawStateText } from "./utils.js";

window.addEventListener('load',function(){
  const loader = document.getElementById('loading');
  loader.style.display = "none";

  const canvas = document.getElementById("game");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  const player = new Player(canvas.width, canvas.height);
  const inputHandler = new InputHandler();

  let lastTime = 0;
  function gameLoop(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    player.update(inputHandler.lastKey);
    player.draw(ctx, deltaTime);
    drawStateText(ctx, inputHandler,player);
    requestAnimationFrame(gameLoop);
  }
  gameLoop(0);
})

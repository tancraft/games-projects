const canvas = document.getElementById("canvas-1");
const ctx = canvas.getContext("2d");
canvas.width = 1280;
canvas.height = 720;
let lastTime = 0;
let gameOver = false;

function draw() {
  ctx.fillStyle = "blue";
  ctx.fillRect(100, 100, 400, 100);
}

function deltaTimeCalc(timeStamp) {
  const deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
}

function animate(timeStamp) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  deltaTimeCalc(timeStamp);
  draw();
  if (!gameOver) {
    requestAnimationFrame(animate);
  }
}

window.addEventListener("load", function () {
  animate(0);
});

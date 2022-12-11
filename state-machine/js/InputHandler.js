export default class InputHandler {
  constructor() {
    this.lastKey = "";
    addEventListener("keydown", (e) => {
      switch (e.key) {
        case "q":
          this.lastKey = "PRESS left";
          break;
        case "d":
          this.lastKey = "PRESS right";
          break;
        case "s":
          this.lastKey = "PRESS down";
          break;
        case "z":
          this.lastKey = "PRESS up";
          break;
      }
    });
    addEventListener("keyup", (e) => {
      switch (e.key) {
        case "q":
          this.lastKey = "RELEASE left";
          break;
        case "d":
          this.lastKey = "RELEASE right";
          break;
        case "s":
          this.lastKey = "RELEASE down";
          break;
        case "z":
          this.lastKey = "RELEASE up";
          break;
      }
    });
  }
}

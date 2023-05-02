class InputHandler {
    constructor(car) {
      this.car = car;
      this.pressedKeys = {};
  
      // Bind the event handlers to the instance
      this.onKeyDown = this.onKeyDown.bind(this);
      this.onKeyUp = this.onKeyUp.bind(this);
  
      // Add event listeners for key presses and releases
      window.addEventListener('keydown', this.onKeyDown);
      window.addEventListener('keyup', this.onKeyUp);
    }
  
    onKeyDown(event) {
      this.pressedKeys[event.code] = true;
    }
  
    onKeyUp(event) {
      delete this.pressedKeys[event.code];
    }
  
    update() {
      if (this.pressedKeys['ArrowUp']) {
        this.car.accelerate();
      }
      if (this.pressedKeys['ArrowDown']) {
        this.car.brake();
      }
      if (this.pressedKeys['ArrowLeft']) {
        this.car.turn(1);
      }
      if (this.pressedKeys['ArrowRight']) {
        this.car.turn(-1);
      }
      if (this.pressedKeys['Space']) {
        this.car.handbrake();
      }
    }
  }
  
  export default InputHandler;
  
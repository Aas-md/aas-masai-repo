// Base State
class State {
  turnOn(light) {
    console.log("Action not allowed.");
  }

  turnOff(light) {
    console.log("Action not allowed.");
  }

  detectMotion(light, isNight) {
    console.log("Action not allowed.");
  }

  adjustBrightness(light, isNight) {
    console.log("Action not allowed.");
  }
}

// ================= STATES =================

// OFF STATE
class OffState extends State {
  turnOn(light) {
    console.log("Light turned ON manually.");
    light.setState(new OnState());
  }

  detectMotion(light, isNight) {
    console.log("Motion detected! Turning light ON automatically.");
    light.setState(new MotionDetectionState(isNight));
    light.adjustBrightness(isNight);
  }
}

// ON STATE
class OnState extends State {
  turnOff(light) {
    console.log("Light turned OFF.");
    light.setState(new OffState());
  }

  adjustBrightness(light, isNight) {
    light.setState(new BrightnessAdjustmentState(isNight));
    light.adjustBrightness(isNight);
  }
}

// MOTION DETECTION STATE
class MotionDetectionState extends State {
  constructor(isNight) {
    super();
    this.isNight = isNight;
  }

  adjustBrightness(light, isNight) {
    light.setState(new BrightnessAdjustmentState(isNight));
    light.adjustBrightness(isNight);
  }
}

// BRIGHTNESS ADJUSTMENT STATE
class BrightnessAdjustmentState extends State {
  constructor(isNight) {
    super();
    this.isNight = isNight;
  }

  adjustBrightness(light) {
    if (this.isNight) {
      console.log("Night time: Increasing brightness.");
      light.brightness = 100;
    } else {
      console.log("Day time: Reducing brightness.");
      light.brightness = 40;
    }

    console.log(`Brightness set to ${light.brightness}%`);
  }

  turnOff(light) {
    console.log("Turning light OFF.");
    light.setState(new OffState());
  }
}

// ================= CONTEXT =================

class SmartLight {
  constructor() {
    this.state = new OffState();
    this.brightness = 0;
  }

  setState(state) {
    this.state = state;
  }

  turnOn() {
    this.state.turnOn(this);
  }

  turnOff() {
    this.state.turnOff(this);
  }

  detectMotion(isNight) {
    this.state.detectMotion(this, isNight);
  }

  adjustBrightness(isNight) {
    this.state.adjustBrightness(this, isNight);
  }
}

module.exports = SmartLight;

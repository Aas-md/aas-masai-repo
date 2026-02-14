// State Interface
class State {
  next(light) {}
  getColor() {}
}

// Red State
class RedState extends State {
  next(light) {
    console.log("Red → Green");
    light.setState(light.greenState);
  }

  getColor() {
    return "Red - Stop";
  }
}

// Green State
class GreenState extends State {
  next(light) {
    console.log("Green → Yellow");
    light.setState(light.yellowState);
  }

  getColor() {
    return "Green - Go";
  }
}

// Yellow State
class YellowState extends State {
  next(light) {
    console.log("Yellow → Red");
    light.setState(light.redState);
  }

  getColor() {
    return "Yellow - Slow Down";
  }
}

// Context
class TrafficLight {
  constructor() {
    this.redState = new RedState();
    this.greenState = new GreenState();
    this.yellowState = new YellowState();

    this.state = this.redState; // Initial State
  }

  setState(state) {
    this.state = state;
  }

  change() {
    console.log("Current:", this.state.getColor());
    this.state.next(this);
  }
}

module.exports = { TrafficLight };

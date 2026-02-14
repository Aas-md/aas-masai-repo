const { TrafficLight } = require("./TrafficLight");

const light = new TrafficLight();

// Test Transitions
light.change(); // Red → Green
light.change(); // Green → Yellow
light.change(); // Yellow → Red
light.change(); // Red → Green (loop continues)

const SmartLight = require("./SmartLight");

const light = new SmartLight();

console.log("=== Test Case 1: Manual ON ===");
light.turnOn();
light.adjustBrightness(false); // daytime
light.turnOff();

console.log("\n=== Test Case 2: Motion at Night ===");
light.detectMotion(true); // night
light.turnOff();

console.log("\n=== Test Case 3: Motion at Day ===");
light.detectMotion(false); // day
light.turnOff();

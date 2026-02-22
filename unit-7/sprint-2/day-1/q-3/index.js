const CarBuilder = require("./CarBuilder");

// Creating Tesla Model S
const car = new CarBuilder()
  .setBrand("Tesla Model S")
  .setEngine("Electric")
  .setColor("Black")
  .addSunroof()
  .setAutomaticTransmission()
  .build();

console.log(car.getDetails());
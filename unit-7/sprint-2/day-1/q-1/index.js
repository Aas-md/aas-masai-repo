const PizzaBuilder = require("./PizzaBuilder");

// Creating a large pizza with cheese and mushrooms
const pizza = new PizzaBuilder()
  .setSize("large")
  .addCheese()
  .addMushrooms()
  .build();

console.log(pizza.getDetails());
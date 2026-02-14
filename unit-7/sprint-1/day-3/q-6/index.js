const {
  Espresso,
  LemonTea,
  Sugar,
  Honey,
  WhippedCream
} = require("./Beverage");

// Order 1
const order1 = new Honey(new WhippedCream(new Espresso()));

// Order 2
const order2 = new Sugar(new Sugar(new LemonTea()));

console.log("Order 1:", order1.getDescription());
console.log("Cost 1: ₹", order1.getCost());

console.log("Order 2:", order2.getDescription());
console.log("Cost 2: ₹", order2.getCost());

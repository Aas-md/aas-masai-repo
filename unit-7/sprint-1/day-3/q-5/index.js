const { Coffee, Sugar, Honey, WhippedCream } = require("./Beverage");

// Coffee + Sugar + Honey + WhippedCream
const myDrink = new WhippedCream(
  new Honey(
    new Sugar(
      new Coffee()
    )
  )
);

console.log(myDrink.getDescription()); 
// Coffee + Sugar + Honey + WhippedCream

console.log(myDrink.getCost());        
// 95

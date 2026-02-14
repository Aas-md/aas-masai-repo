const { GreenTea, Sugar, Honey } = require("./Beverage");

// Honey + Sugar Combo
const tea = new Honey(new Sugar(new GreenTea()));

console.log(tea.getDescription()); // Green Tea + Sugar + Honey
console.log(tea.getCost());        // 70

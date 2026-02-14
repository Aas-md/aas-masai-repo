const { GreenTea, Sugar } = require("./Beverage");

// Double Sugar Stack
const tea = new Sugar(new Sugar(new GreenTea()));

console.log(tea.getDescription()); // Green Tea + Sugar + Sugar
console.log(tea.getCost());        // 60

const { GreenTea, Sugar } = require("./Beverage");

// Test Case
const tea = new Sugar(new GreenTea());

console.log(tea.getDescription()); // Green Tea + Sugar
console.log(tea.getCost());        // 50

const { VendingMachine } = require("./VendingMachine");

const machine = new VendingMachine();

// Test Flow
machine.insertCoin();   // Idle → Processing
machine.selectItem();   // Processing → Dispensing
machine.dispense();     // Dispensing → Idle

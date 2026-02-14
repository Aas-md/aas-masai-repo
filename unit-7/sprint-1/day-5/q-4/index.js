const ATM = require("./ATM");

const atm = new ATM(5000, 1234);

// Test Case 1 - Correct Flow
console.log("=== Test Case 1: Correct Transaction ===");
atm.insertCard();
atm.enterPin(1234);
atm.withdrawCash(1000);

// Test Case 2 - Wrong PIN
console.log("\n=== Test Case 2: Wrong PIN ===");
atm.insertCard();
atm.enterPin(9999);

// Test Case 3 - Insufficient Balance
console.log("\n=== Test Case 3: Insufficient Balance ===");
atm.insertCard();
atm.enterPin(1234);
atm.withdrawCash(10000);

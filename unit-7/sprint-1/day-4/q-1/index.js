const { ElevatorSystem } = require("./ElevatorSystem");

// Create system (10 floors, 2 elevators)
const system = new ElevatorSystem(10, 2);

// Test Case 1
system.requestElevator(3, 7, 2, 150);

// Test Case 2
system.requestElevator(5, 1, 3, 200);

// Test Case 3 (Over capacity)
system.requestElevator(2, 9, 10, 700);

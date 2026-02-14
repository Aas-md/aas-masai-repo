const { ParkingLot, Vehicle } = require("./ParkingLot");

// Create Parking Lot (2 floors, 3 slots each)
const lot = new ParkingLot(2, 3);

// Test Case 1
const v1 = new Vehicle("DL01", "Car");
console.log(lot.park(v1));

// Test Case 2
const v2 = new Vehicle("DL02", "EV");
console.log(lot.park(v2));

// Test Case 3
setTimeout(() => {
  console.log(lot.unpark("DL01"));
}, 2000);

// Test Case 4
setTimeout(() => {
  console.log(lot.unpark("DL02"));
}, 3000);

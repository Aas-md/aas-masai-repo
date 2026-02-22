const GameCharacter = require("./GameCharacter");

// Original Character
const warrior = new GameCharacter("Warrior", 10, "Sword");

// Cloning
const warriorClone = warrior.clone();
warriorClone.name = "Warrior Clone";

// Printing Both
console.log("=== Original Character ===");
console.log(warrior.getDetails());

console.log("=== Cloned Character ===");
console.log(warriorClone.getDetails());

// Checking if they are separate instances
console.log("Are both objects different?", warrior !== warriorClone);
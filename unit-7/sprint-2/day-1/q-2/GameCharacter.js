// Prototype Class
class GameCharacter {
  constructor(name, level, weapon) {
    this.name = name;
    this.level = level;
    this.weapon = weapon;
  }

  // Clone Method
  clone() {
    return new GameCharacter(this.name, this.level, this.weapon);
  }

  getDetails() {
    return `
Character Details:
Name: ${this.name}
Level: ${this.level}
Weapon: ${this.weapon}
`;
  }
}

module.exports = GameCharacter;
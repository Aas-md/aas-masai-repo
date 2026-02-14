// Abstract Beverage
class Beverage {
  getDescription() {
    throw new Error("Must implement getDescription()");
  }

  getCost() {
    throw new Error("Must implement getCost()");
  }
}

// Base Beverages
class Espresso extends Beverage {
  getDescription() {
    return "Espresso";
  }

  getCost() {
    return 80;
  }
}

class LemonTea extends Beverage {
  getDescription() {
    return "LemonTea";
  }

  getCost() {
    return 40;
  }
}

// Sugar Decorator
class Sugar extends Beverage {
  constructor(beverage) {
    super();
    this.beverage = beverage;
  }

  getDescription() {
    return this.beverage.getDescription() + " + Sugar";
  }

  getCost() {
    return this.beverage.getCost() + 10;
  }
}

// Honey Decorator
class Honey extends Beverage {
  constructor(beverage) {
    super();
    this.beverage = beverage;
  }

  getDescription() {
    return this.beverage.getDescription() + " + Honey";
  }

  getCost() {
    return this.beverage.getCost() + 20;
  }
}

// WhippedCream Decorator
class WhippedCream extends Beverage {
  constructor(beverage) {
    super();
    this.beverage = beverage;
  }

  getDescription() {
    return this.beverage.getDescription() + " + WhippedCream";
  }

  getCost() {
    return this.beverage.getCost() + 15;
  }
}

module.exports = {
  Espresso,
  LemonTea,
  Sugar,
  Honey,
  WhippedCream
};

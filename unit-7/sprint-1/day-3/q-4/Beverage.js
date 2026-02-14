// Abstract Beverage Class
class Beverage {
  getDescription() {
    throw new Error("Must implement getDescription()");
  }

  getCost() {
    throw new Error("Must implement getCost()");
  }
}

// GreenTea
class GreenTea extends Beverage {
  getDescription() {
    return "Green Tea";
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

module.exports = { GreenTea, Sugar, Honey };

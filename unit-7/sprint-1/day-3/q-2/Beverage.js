// Abstract Beverage Class
class Beverage {
  getDescription() {
    throw new Error("Method getDescription() must be implemented");
  }

  getCost() {
    throw new Error("Method getCost() must be implemented");
  }
}

// GreenTea Class
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

module.exports = { GreenTea, Sugar };

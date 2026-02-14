// Abstract Class
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

module.exports = { GreenTea };

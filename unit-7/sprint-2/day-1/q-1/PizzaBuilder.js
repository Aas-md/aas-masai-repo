// Product Class
class Pizza {
  constructor(size, cheese, pepperoni, mushrooms) {
    this.size = size;
    this.cheese = cheese;
    this.pepperoni = pepperoni;
    this.mushrooms = mushrooms;
  }

  getDetails() {
    return `
Pizza Details:
Size: ${this.size}
Cheese: ${this.cheese ? "Yes" : "No"}
Pepperoni: ${this.pepperoni ? "Yes" : "No"}
Mushrooms: ${this.mushrooms ? "Yes" : "No"}
`;
  }
}

// Builder Class
class PizzaBuilder {
  constructor() {
    this.size = "small";
    this.cheese = false;
    this.pepperoni = false;
    this.mushrooms = false;
  }

  setSize(size) {
    this.size = size;
    return this;
  }

  addCheese() {
    this.cheese = true;
    return this;
  }

  addPepperoni() {
    this.pepperoni = true;
    return this;
  }

  addMushrooms() {
    this.mushrooms = true;
    return this;
  }

  build() {
    return new Pizza(
      this.size,
      this.cheese,
      this.pepperoni,
      this.mushrooms
    );
  }
}

module.exports = PizzaBuilder;
// Product Class
class Car {
  constructor(brand, engine, color, sunroof, automaticTransmission) {
    this.brand = brand;
    this.engine = engine;
    this.color = color;
    this.sunroof = sunroof;
    this.automaticTransmission = automaticTransmission;
  }

  getDetails() {
    return `
Car Details:
Brand: ${this.brand}
Engine: ${this.engine}
Color: ${this.color}
Sunroof: ${this.sunroof ? "Yes" : "No"}
Automatic Transmission: ${this.automaticTransmission ? "Yes" : "No"}
`;
  }
}

// Builder Class
class CarBuilder {
  constructor() {
    this.brand = "";
    this.engine = "";
    this.color = "";
    this.sunroof = false;
    this.automaticTransmission = false;
  }

  setBrand(brand) {
    this.brand = brand;
    return this;
  }

  setEngine(engine) {
    this.engine = engine;
    return this;
  }

  setColor(color) {
    this.color = color;
    return this;
  }

  addSunroof() {
    this.sunroof = true;
    return this;
  }

  setAutomaticTransmission() {
    this.automaticTransmission = true;
    return this;
  }

  build() {
    return new Car(
      this.brand,
      this.engine,
      this.color,
      this.sunroof,
      this.automaticTransmission
    );
  }
}

module.exports = CarBuilder;
const car = {
  brand: "Toyota",
  getBrand() { return this.brand; }
}

const getCarBrand = car.getBrand.bind(car)

console.log(getCarBrand())

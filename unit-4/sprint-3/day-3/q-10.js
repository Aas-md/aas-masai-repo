function Car(make, model, year, isAvailable) {
    this, make = make
    this, model = model
    this.year = year
    this.isAvailable = isAvailable
}

function Customer(name, rentedCars) {

    this.name = name
    this.rentedCars = rentedCars
}

Customer.prototype.carAvailablity = function (car) {

    if (car.isAvailable) {
        car.isAvailable = false
        this.rentedCars.push(car)
    } else {
        console.log("The card is already rented")
    }

}

function PremiumCustomer(name, rentedCars, discountRate) {
    Customer.call(this, name, rentedCars);
    this.discount = discountRate;
}

Object.setPrototypeOf(PremiumCustomer.prototype, Customer.prototype)

Customer.prototype.carAvailability = function (car) {
    if (car.isAvailable) {
        car.isAvailable = false;
        this.rentedCars.push(car);
    } else {
        console.log("The car is already rented");
    }
}

// PremiumCustomer instance
let premium = new PremiumCustomer("Aas", [], 10);
premium.carAvailability({ name: "SUV", isAvailable: true }); // works fine

Customer.prototype.returnCar = function (car) {
    setTimeout(() => {
        car.isAvailable = true
        let index = this.rentedCars.indexOf(car)
        if (index > -1) this.rentedCars.splice(index, 1)
    }, 2000)
}

function Maintenance(car, delay) {
    setTimeout(() => {
        car.isAvailable = true
    }, delay)
}

let car1 = new Car("Toyota", "Rav4", 2020, true)
let car2 = new Car("Honda", "Civic", 2019, true)
let car3 = new Car("Ford", "Escape", 2021, true)

let customer1 = new Customer("Ali", [])
let premium1 = new PremiumCustomer("Aas", [], 15)

customer1.carAvailability(car1)
premium1.carAvailability(car2)

console.log(customer1.rentedCars)
console.log(premium1.rentedCars)

customer1.returnCar(car1)
premium1.returnCar(car2)

Maintenance(car3, 3000)

let rentCar = customer1.carAvailability.bind(customer1)
rentCar(car3)

let premiumRent = customer1.carAvailability.call(premium1, car3)
let premiumRentApply = customer1.carAvailability.apply(premium1, [car3])





function createCar(make,model,year){
    let car = {}
    car.make = make
    car.model = model
    car.year = year

    car.describeCar = function(){
        console.log(`This car is a ${car.year} ${car.make} ${car.model}.`)
    }

    return car
}

const car = createCar("Toyota", "Camry", 2022);
car.describeCar();
// Output: This car is a 2022 Toyota Camry.



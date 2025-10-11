function Animal(){
    this.type = "Animal"
}

Animal.prototype.sound = function(){
    console.log("Animal sound")
}

function Dog(){

}
Object.setPrototypeOf(Dog.prototype,Animal.prototype)

Dog.prototype.sound = function() {
  console.log("Bark");
};



let myDog = new Dog()
myDog.sound()
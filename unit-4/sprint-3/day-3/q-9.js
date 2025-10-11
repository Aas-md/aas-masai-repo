function Person(name,age){
    this.name = name
    this.age = age
}

Person.prototype.introduce = function(){
    console.log(`Hi, my name is ${this.name} and I am ${this.age} years old.`)
}

function Employee(name,age,role){
      Person.call(this, name, age)
    this.jobTitle  = role
}

Employee.prototype.work = function(){
    console.log(`${this.name} is working as a ${this.jobTitle}.`)
}

Object.setPrototypeOf(Employee.prototype,Person.prototype)

let person = new Person("Aas Mohammad",25)
let employee = new Employee("Ankit", 24,"Software Developer")
person.introduce()
employee.introduce()
employee.work()

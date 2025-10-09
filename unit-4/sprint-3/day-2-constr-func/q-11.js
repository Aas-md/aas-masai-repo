function createEmployee(name,role,salary){

    let emp = {}
    emp.name = name;
    emp.role  = role;
    emp.salary = salary

    emp.introduce = function(){
        console.log(`Hello, I am ${this.name}, working as a ${this.role}.`)
    }

    return emp;
    
}

const employee1 = createEmployee("Alice", "Developer", 60000);
employee1.introduce();
// Output: Hello, I am Alice, working as a Developer.

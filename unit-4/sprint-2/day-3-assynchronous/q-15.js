function taskOne(){
    console.log("Task 1 completed")
}

function taskTwo(func){
    console.log("Task 2 completed")
    func()
}

taskTwo(taskOne)
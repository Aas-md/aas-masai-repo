let addBtn = document.querySelector(".add-btn");
let clearBtn = document.querySelector(".clear-btn");
let input = document.querySelector(".input");
let ul = document.querySelector("ul");

renderTasks();

function addTask() {
  let value = input.value;
    if (value === "") {
        alert("Please enter a task");  
        return;
    }
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(value);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    input.value = "";
    renderTasks();

}

function renderTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    ul.innerHTML = ""; 
    tasks.forEach(function(task) {
        let li = document.createElement("li");
        li.textContent = task;
        ul.appendChild(li);
    });
}

function clearTasks() {
    localStorage.removeItem("tasks");
    renderTasks();
}   

addBtn.addEventListener("click", addTask);
clearBtn.addEventListener("click", clearTasks);
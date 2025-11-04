let clearBtn = document.getElementById("clearBtn");
let addBtn = document.getElementById("addBtn");
let input = document.querySelector("input");
let ul = document.querySelector("ul");

renderTasks();

function addTask() {

  let value = input.value;
  if (value === "") {
    alert("Please enter a task");
    return;
  }
  let tasks = localStorage.getItem("tasks");
  tasks = JSON.parse(tasks) || [];
  tasks.push(value);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  input.value = "";
  renderTasks();
}

addBtn.addEventListener("click", addTask);

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

clearBtn.addEventListener("click", clearTasks);
localStorage.setItem("isLoggedIn", "true");
console.log(typeof localStorage.getItem("isLoggedIn"));

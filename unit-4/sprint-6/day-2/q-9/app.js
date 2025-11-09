const todoList = document.getElementById("todoList");
const pagination = document.getElementById("pagination");

const todosPerPage = 10; // items per page
let currentPage = 1;
let totalTodos = 0;

// Fetch todos from API
async function fetchTodos(page = 1) {
    const start = (page - 1) * todosPerPage;
    const res = await fetch(`https://jsonplaceholder.typicode.com/todos?_start=${start}&_limit=${todosPerPage}`);
    const data = await res.json();
    return data;
}

// Render todos in DOM
function renderTodos(todos) {
    todoList.innerHTML = "";
    todos.forEach(todo => {
        const li = document.createElement("li");
        li.textContent = `${todo.id}. ${todo.title} ${todo.completed ? "✅" : ""}`;
        todoList.appendChild(li);
    });
}

// Render pagination buttons
function renderPagination(totalPages) {
    pagination.innerHTML = "";
    for(let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        if(i === currentPage) btn.style.fontWeight = "bold";
        btn.onclick = () => {
            currentPage = i;
            loadTodos();
        };
        pagination.appendChild(btn);
    }
}

// Load todos and setup pagination
async function loadTodos() {
    const todos = await fetchTodos(currentPage);
    renderTodos(todos);
    totalTodos = 200; // jsonplaceholder has 200 todos
    const totalPages = Math.ceil(totalTodos / todosPerPage);
    renderPagination(totalPages);
}

// Initial load
loadTodos();

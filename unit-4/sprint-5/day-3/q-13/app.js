let addBtn = document.querySelector("#addBtn");
let input = document.querySelector("#taskInput");
let search = document.querySelector("#search");
let ul = document.querySelector("ul");

function addTask(e) {
    if (e && e.preventDefault) e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    const task = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        text,
        completed: false
    };

    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    input.value = '';
    renderTasks();
}

addBtn.addEventListener("click", addTask);

function renderTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    ul.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');

        // create a span for the task text so we don't overwrite buttons/children
        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;
        li.appendChild(span);

    });

        // create a visible Done/Undo button
function attachIdsAndStyles() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const lis = ul.querySelectorAll('li');
    lis.forEach((li, i) => {
        const task = tasks[i];
        if (!task) return;
        li.dataset.id = task.id;

        // apply completed style to the task text span (if present) so buttons stay visible
        const span = li.querySelector('.task-text') || li;
        span.style.textDecoration = task.completed ? 'line-through' : 'none';

        li.style.cursor = 'pointer';
        li.title = task.completed ? 'Click to mark as not completed' : 'Click to mark as completed';

        // update button label if present
        const btn = li.querySelector('.doneBtn');
        if (btn) btn.textContent = task.completed ? 'Undo' : 'Done';
    });
}

function attachIdsAndStyles() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const lis = ul.querySelectorAll('li');
    lis.forEach((li, i) => {
        const task = tasks[i];
        if (!task) return;
        li.dataset.id = task.id;
        li.style.textDecoration = task.completed ? 'line-through' : 'none';
        li.style.cursor = 'pointer';
        li.title = task.completed ? 'Click to mark as not completed' : 'Click to mark as completed';
    });
}

renderTasks = function() {
    _renderTasks();
    attachIdsAndStyles();
};

function toggleCompleted(id) {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return;
    tasks[idx].completed = !tasks[idx].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

ul.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    const id = li.dataset.id;
    if (!id) return;
    toggleCompleted(id);
});

// initial render
renderTasks();
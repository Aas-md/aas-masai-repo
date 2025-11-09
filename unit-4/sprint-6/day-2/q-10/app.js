const usersContainer = document.getElementById("usersContainer");
const pagination = document.getElementById("pagination");

const usersPerPage = 6;
let currentPage = 1;
let totalUsers = 10; // JSONPlaceholder has 10 users

// Fetch users for a page
async function fetchUsers(page = 1) {
    try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=${usersPerPage}`);
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        return data;
    } catch (err) {
        usersContainer.innerHTML = `<p style="color:red">${err.message}</p>`;
        return [];
    }
}

// Render users in DOM
function renderUsers(users) {
    usersContainer.innerHTML = "";
    users.forEach(u => {
        const div = document.createElement("div");
        div.className = "user-card";
        div.innerHTML = `
            <h3>${u.name}</h3>
            <p>Username: ${u.username}</p>
            <p>Email: ${u.email}</p>
            <p>City: ${u.address.city}</p>
        `;
        usersContainer.appendChild(div);
    });
}

// Render pagination buttons
function renderPaginationButtons() {
    pagination.innerHTML = "";
    const totalPages = Math.ceil(totalUsers / usersPerPage);
    for(let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        if(i === currentPage) btn.classList.add("active");
        btn.onclick = () => {
            currentPage = i;
            loadUsers();
        };
        pagination.appendChild(btn);
    }
}

// Load users and buttons
async function loadUsers() {
    const users = await fetchUsers(currentPage);
    renderUsers(users);
    renderPaginationButtons();
}

// Initial load
loadUsers();

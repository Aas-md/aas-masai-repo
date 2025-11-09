import { db } from "./firebase.js";
import {
  ref, push, set, get, update, remove
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

/* STATE */
function saveState(obj) {
  localStorage.setItem("state_books", JSON.stringify(obj));
}
function loadState() {
  return JSON.parse(localStorage.getItem("state_books") || "{}");
}
let state = loadState();
state.page = state.page || 1;

/* ELEMENTS */
const body = document.getElementById("bookBody");
const search = document.getElementById("search");
const sort = document.getElementById("sort");
const pageText = document.getElementById("page");

search.value = state.search || "";
sort.value = state.sort || "title";

/* ADD BOOK */
document.getElementById("addBook").onclick = () => {
  const title = document.getElementById("b_title").value;
  const author = document.getElementById("b_author").value;
  const year = Number(document.getElementById("b_year").value);

  const id = push(ref(db, "books")).key;

  set(ref(db, "books/" + id), { id, title, author, year });
  loadData();
};

/* LOAD DATA */
async function loadData() {
  const snap = await get(ref(db, "books"));
  let data = snap.exists() ? Object.values(snap.val()) : [];

  // search
  if (state.search) {
    data = data.filter(b =>
      b.title.toLowerCase().includes(state.search.toLowerCase()) ||
      b.author.toLowerCase().includes(state.search.toLowerCase())
    );
  }

  // sort
  if (state.sort === "title") data.sort((a, b) => a.title.localeCompare(b.title));
  if (state.sort === "title_desc") data.sort((a, b) => b.title.localeCompare(a.title));
  if (state.sort === "year") data.sort((a, b) => a.year - b.year);
  if (state.sort === "year_desc") data.sort((a, b) => b.year - a.year);

  // pagination
  const per = 5;
  const start = (state.page - 1) * per;
  const pageData = data.slice(start, start + per);

  body.innerHTML = "";
  pageData.forEach(b => {
    body.innerHTML += `
      <tr>
        <td>${b.title}</td>
        <td>${b.author}</td>
        <td>${b.year}</td>
        <td><button onclick="del('${b.id}')">Delete</button></td>
      </tr>
    `;
  });

  pageText.innerText = "Page: " + state.page;
  saveState(state);
}

window.del = (id) => {
  remove(ref(db, "books/" + id));
  loadData();
};

/* Filters */
document.getElementById("apply").onclick = () => {
  state.search = search.value;
  state.sort = sort.value;
  state.page = 1;
  loadData();
};

/* Pagination */
document.getElementById("next").onclick = () => {
  state.page++;
  loadData();
};
document.getElementById("prev").onclick = () => {
  if (state.page > 1) state.page--;
  loadData();
};

loadData();

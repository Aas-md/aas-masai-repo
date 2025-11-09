import { db } from "./firebase.js";
import {
  ref, push, set, get, remove
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const body = document.getElementById("mBody");
const search = document.getElementById("search");

/* ADD MEMBER */
document.getElementById("addMember").onclick = () => {
  const name = document.getElementById("m_name").value;
  const email = document.getElementById("m_email").value;

  const id = push(ref(db, "members")).key;

  set(ref(db, "members/" + id), { id, name, email });

  loadData();
};

/* LOAD MEMBERS */
async function loadData() {
  const snap = await get(ref(db, "members"));
  let data = snap.exists() ? Object.values(snap.val()) : [];

  if (search.value.trim()) {
    data = data.filter(m =>
      m.name.toLowerCase().includes(search.value.toLowerCase()) ||
      m.email.toLowerCase().includes(search.value.toLowerCase())
    );
  }

  body.innerHTML = "";
  data.forEach(m => {
    body.innerHTML += `
      <tr>
        <td>${m.name}</td>
        <td>${m.email}</td>
        <td><button onclick="delM('${m.id}')">Delete</button></td>
      </tr>
    `;
  });
}

window.delM = (id) => {
  remove(ref(db, "members/" + id));
  loadData();
};

document.getElementById("apply").onclick = loadData;

loadData();

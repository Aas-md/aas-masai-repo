import {
    collection,
    query,
    where,
    orderBy,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const tbody = document.getElementById("tbody");
const search = document.getElementById("search");
const yearMin = document.getElementById("yearMin");
const yearMax = document.getElementById("yearMax");
const sortPrice = document.getElementById("sortPrice");
const apply = document.getElementById("apply");

async function loadNovels() {
    let colRef = collection(db, "novels");

    let conditions = [];

    // ✅ SEARCH by keywords
    if (search.value.trim() !== "") {
        const text = search.value.toLowerCase();
        conditions.push(where("keywords", "array-contains", text));
    }

    // ✅ Filter by release year
    if (yearMin.value) conditions.push(where("release_year", ">=", Number(yearMin.value)));
    if (yearMax.value) conditions.push(where("release_year", "<=", Number(yearMax.value)));

    // ✅ Build base query
    let q = conditions.length > 0 ? query(colRef, ...conditions) : query(colRef);

    // ✅ ADD sorting (DON'T overwrite)
    if (sortPrice.value === "asc") {
        q = query(q, orderBy("price", "asc"));
    }
    if (sortPrice.value === "desc") {
        q = query(q, orderBy("price", "desc"));
    }

    const snap = await getDocs(q);

    tbody.innerHTML = "";
    snap.forEach(doc => {
        const n = doc.data();
        tbody.innerHTML += `
        <tr>
            <td>${n.title}</td>
            <td>${n.author}</td>
            <td>${n.price}</td>
            <td>${n.release_year}</td>
            <td>${n.genre}</td>
        </tr>`;
    });
}

apply.onclick = loadNovels;
search.oninput = loadNovels;

// ✅ INITIAL LOAD
loadNovels();

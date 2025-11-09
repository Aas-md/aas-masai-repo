import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// ✅ Novel Sample Data
const novels = [
    {
        title: "The Great Adventure",
        author: "John Doe",
        price: 19.99,
        release_year: 2020,
        genre: "Adventure"
    },
    {
        title: "Mystery of the Lost World",
        author: "Jane Smith",
        price: 15.99,
        release_year: 2021,
        genre: "Mystery"
    },
    {
        title: "The Journey Begins",
        author: "Mark Johnson",
        price: 25.0,
        release_year: 2022,
        genre: "Fantasy"
    },
    {
        title: "The Last Escape",
        author: "Emily White",
        price: 18.5,
        release_year: 2019,
        genre: "Thriller"
    }
];

// ✅ Function to generate keywords for search
function generateKeywords(novel) {
    const t = novel.title.toLowerCase().split(" ");
    const a = novel.author.toLowerCase().split(" ");
    return [...t, ...a];
}

// ✅ INSERT DATA
async function insertData() {
    const colRef = collection(db, "novels");

    for (let n of novels) {
        const keywords = generateKeywords(n);

        await addDoc(colRef, {
            ...n,
            keywords
        });

        console.log("✅ Added:", n.title);
    }

    alert("✅ All sample novels inserted successfully!");
}

insertData();

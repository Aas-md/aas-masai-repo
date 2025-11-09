// script.js
const gallery = document.getElementById("gallery");
let page = 1;
const limit = 10;
let loading = false;

// Fetch photos from API
async function loadPhotos() {
  if (loading) return;
  loading = true;

  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=${limit}`);
    const data = await res.json();

    data.forEach(p => {
      const div = document.createElement("div");
      div.classList.add("photo-card");

      // ✅ Using picsum.photos to avoid placeholder errors
      div.innerHTML = `
        <img src="https://picsum.photos/150/150?random=${p.id}" alt="${p.title}" />
        <p>${p.title}</p>
      `;
      gallery.appendChild(div);
    });

    page++;
    loading = false;
  } catch (err) {
    console.error("Error fetching photos:", err);
    loading = false;
  }
}

// Infinite scroll
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    loadPhotos();
  }
});

// Initial load
loadPhotos();

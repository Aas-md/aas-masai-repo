const url = "https://fakestoreapi.com/products";
const container = document.getElementById("product-container");
const search = document.getElementById("search");
const categoryFilter = document.getElementById("categoryFilter");
const sort = document.getElementById("sort");

let allProducts = [];

async function fetchProducts() {
  container.innerHTML = "<p>Loading...</p>";
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network error");

    allProducts = await res.json();
    renderProducts(allProducts);
    populateCategories(allProducts);
  } catch (err) {
    container.innerHTML = `<p class="error">Failed to fetch products. Please try again later.</p>`;
  }
}

function renderProducts(products) {
  if (!products.length) {
    container.innerHTML = "<p>No products found.</p>";
    return;
  }
  container.innerHTML = products
    .map(
      (p) => `
    <div class="card">
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>$${p.price}</p>
      <button>View Details</button>
    </div>`
    )
    .join("");
}

function populateCategories(products) {
  const categories = [...new Set(products.map((p) => p.category))];
  categoryFilter.innerHTML += categories
    .map((cat) => `<option value="${cat}">${cat}</option>`)
    .join("");
}

function applyFilters() {
  let filtered = [...allProducts];
  const searchTerm = search.value.toLowerCase();
  const selectedCat = categoryFilter.value;
  const sortOrder = sort.value;

  if (searchTerm)
    filtered = filtered.filter((p) =>
      p.title.toLowerCase().includes(searchTerm)
    );

  if (selectedCat)
    filtered = filtered.filter((p) => p.category === selectedCat);

  if (sortOrder === "asc")
    filtered.sort((a, b) => a.price - b.price);
  else if (sortOrder === "desc")
    filtered.sort((a, b) => b.price - a.price);

  renderProducts(filtered);
}

// event listeners
search.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);
sort.addEventListener("change", applyFilters);

fetchProducts();

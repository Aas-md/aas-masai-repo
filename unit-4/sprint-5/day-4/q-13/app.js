async function fetchProducts() {
  const url = "https://fakestoreapi.com/products";
  const container = document.getElementById("product-container");
  container.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network error");

    const data = await res.json();

    container.innerHTML = data.map(p => `
      <div class="card">
        <img src="${p.image}" alt="${p.title}">
        <h3>${p.title}</h3>
        <p>$${p.price}</p>
        <button>View Details</button>
      </div>
    `).join("");
  } 
  catch (err) {
    container.innerHTML = `<p class="error">Failed to fetch products. Please try again later.</p>`;
  }
}

fetchProducts();

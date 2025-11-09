const productsContainer = document.getElementById("productsContainer");
const sortBy = document.getElementById("sortBy");

async function fetchProducts(sortParam = "name") {
    try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/users?_sort=${sortParam}`);
        if(!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        return data;
    } catch(err) {
        productsContainer.innerHTML = `<p style="color:red">${err.message}</p>`;
        return [];
    }
}

function renderProducts(products) {
    productsContainer.innerHTML = "";
    products.forEach(p => {
        const div = document.createElement("div");
        div.className = "product-card";
        div.innerHTML = `
            <h3>${p.name}</h3>
            <p>Username: ${p.username}</p>
            <p>Email: ${p.email}</p>
            <p>City: ${p.address.city}</p>
        `;
        productsContainer.appendChild(div);
    });
}

async function loadProducts() {
    const sortedProducts = await fetchProducts(sortBy.value);
    renderProducts(sortedProducts);
}

// Event listener for sorting
sortBy.onchange = loadProducts;

// Initial load
loadProducts();

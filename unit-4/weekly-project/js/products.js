// js/products.js
import { db } from "./firebase.js";
import { $, $all, getUid, getRole, formatINR, toast } from "./utils.js";
import {
  collection, addDoc, getDocs, doc, updateDoc, deleteDoc,
  query, where, orderBy
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// Create product (vendor)
export async function createProduct(p) {
  const col = collection(db, "products");
  const payload = {
    name: p.name,
    price: Number(p.price) || 0,
    category: p.category || "General",
    image: p.image || "https://picsum.photos/seed/p/400/300",
    description: p.description || "",
    vendorId: getUid(),
    createdAt: new Date(),
    rating: 0,
    ratingsCount: 0,
    available: true
  };
  await addDoc(col, payload);
  toast("Product added");
}

// Load products (storefront with filters)
export async function loadProducts({ mount = "#product-list", search = "", category = "all", min = 0, max = 999999 } = {}) {
  const wrap = $(mount);
  wrap.innerHTML = "Loading...";

  // we'll filter client-side (simple MVP)
  const snap = await getDocs(collection(db, "products"));
  let items = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  const s = search.toLowerCase();
  items = items.filter(x =>
    (x.name || "").toLowerCase().includes(s) ||
    (x.category || "").toLowerCase().includes(s)
  );
  if (category !== "all") items = items.filter(x => (x.category || "").toLowerCase() === category.toLowerCase());
  items = items.filter(x => (x.price >= (Number(min) || 0)) && (x.price <= (Number(max) || 999999)));

  wrap.innerHTML = items.length ? "" : "<p>No products found.</p>";

  for (const p of items) {
    const card = document.createElement("div");
    card.className = "card";
    card.style = "border:1px solid #ddd;padding:10px;border-radius:10px;margin:8px;max-width:280px";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" style="width:100%;height:160px;object-fit:cover;border-radius:8px"/>
      <h3 style="margin:6px 0">${p.name}</h3>
      <div>${formatINR(p.price)} • <small>${p.category}</small></div>
      <p style="font-size:13px;color:#555">${p.description || ""}</p>
      <button data-id="${p.id}" class="add-to-cart">Add to Cart</button>
    `;
    wrap.appendChild(card);
  }

  // bind add-to-cart
  $all(".add-to-cart").forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-id");
      const prod = items.find(x => x.id === id);
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const idx = cart.findIndex(c => c.id === id);
      if (idx >= 0) cart[idx].qty += 1;
      else cart.push({ id, name: prod.name, price: prod.price, image: prod.image, qty: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
      toast("Added to cart");
    };
  });
}

// Load vendor products (for dashboard)
export async function loadVendorProducts(mount = "#vendor-products") {
  const wrap = $(mount);
  wrap.innerHTML = "Loading...";
  const q = query(collection(db, "products"), where("vendorId", "==", getUid()));
  const snap = await getDocs(q);
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  wrap.innerHTML = items.length ? "" : "<p>No products yet.</p>";

  for (const p of items) {
    const row = document.createElement("div");
    row.style = "display:flex;gap:10px;align-items:center;border:1px solid #eee;padding:8px;border-radius:8px;margin:6px 0";
    row.innerHTML = `
      <img src="${p.image}" style="width:60px;height:60px;object-fit:cover;border-radius:6px"/>
      <div style="flex:1">
        <div><strong>${p.name}</strong> — ${formatINR(p.price)}</div>
        <small>${p.category}</small>
      </div>
      <button data-id="${p.id}" class="edit">Edit</button>
      <button data-id="${p.id}" class="del">Delete</button>
    `;
    wrap.appendChild(row);
  }

  // edit
  $all(".edit").forEach(b => b.onclick = async () => {
    const id = b.getAttribute("data-id");
    const name = prompt("New name?");
    const price = prompt("New price?");
    const image = prompt("New image URL?");
    const category = prompt("New category?");
    const description = prompt("New description?");
    await updateDoc(doc(db, "products", id), {
      ...(name ? { name } : {}),
      ...(price ? { price: Number(price) } : {}),
      ...(image ? { image } : {}),
      ...(category ? { category } : {}),
      ...(description ? { description } : {})
    });
    toast("Updated");
    loadVendorProducts(mount);
  });

  // delete
  $all(".del").forEach(b => b.onclick = async () => {
    const id = b.getAttribute("data-id");
    if (!confirm("Delete this product?")) return;
    await deleteDoc(doc(db, "products", id));
    toast("Deleted");
    loadVendorProducts(mount);
  });
}

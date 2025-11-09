// js/cart.js
import { $, $all, formatINR, toast } from "./utils.js";
import { db } from "./firebase.js";
import {
  collection, addDoc, doc, getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}
function saveCart(c) {
  localStorage.setItem("cart", JSON.stringify(c));
}

export function renderCart(mount = "#cart") {
  const wrap = $(mount);
  const cart = getCart();
  if (!cart.length) {
    wrap.innerHTML = "<p>Your cart is empty.</p>";
    $("#cart-total").textContent = formatINR(0);
    return;
  }
  wrap.innerHTML = "";
  let total = 0;

  cart.forEach((item, idx) => {
    total += item.price * item.qty;
    const row = document.createElement("div");
    row.style = "display:flex;gap:10px;align-items:center;border:1px solid #eee;padding:8px;border-radius:8px;margin:6px 0";
    row.innerHTML = `
      <img src="${item.image}" style="width:60px;height:60px;object-fit:cover;border-radius:6px"/>
      <div style="flex:1">
        <strong>${item.name}</strong> — ${formatINR(item.price)} x 
        <input type="number" min="1" value="${item.qty}" style="width:64px" data-idx="${idx}" class="qty">
      </div>
      <button data-idx="${idx}" class="rm">Remove</button>
    `;
    wrap.appendChild(row);
  });

  $("#cart-total").textContent = formatINR(total);

  // qty change
  $all(".qty").forEach(inp => {
    inp.onchange = () => {
      const i = Number(inp.getAttribute("data-idx"));
      const c = getCart();
      c[i].qty = Math.max(1, Number(inp.value) || 1);
      saveCart(c);
      renderCart(mount);
    };
  });

  // remove
  $all(".rm").forEach(b => {
    b.onclick = () => {
      const i = Number(b.getAttribute("data-idx"));
      const c = getCart();
      c.splice(i, 1);
      saveCart(c);
      renderCart(mount);
    };
  });
}

// Dummy checkout -> creates order doc, empties cart
export async function checkout() {
  const cart = getCart();
  if (!cart.length) return toast("Cart empty");

  const total = cart.reduce((s, x) => s + x.price * x.qty, 0);

  await addDoc(collection(db, "orders"), {
    userId: localStorage.getItem("uid") || "guest",
    items: cart,
    total,
    status: "pending",
    createdAt: new Date()
  });

  saveCart([]);
  toast("Order placed (dummy checkout).");
  window.location.href = "./customer-orders.html";
}

window.checkout = checkout;

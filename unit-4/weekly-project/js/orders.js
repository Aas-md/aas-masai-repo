// js/orders.js
import { db } from "./firebase.js";
import { $, getUid, getRole, formatINR, toast } from "./utils.js";
import {
  collection, getDocs, query, where, updateDoc, doc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// Customer orders
export async function loadMyOrders(mount = "#orders") {
  const wrap = $(mount);
  wrap.innerHTML = "Loading...";
  const q = query(collection(db, "orders"), where("userId", "==", getUid()));
  const snap = await getDocs(q);
  const orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  wrap.innerHTML = orders.length ? "" : "<p>No orders yet.</p>";
  for (const o of orders) {
    const div = document.createElement("div");
    div.style = "border:1px solid #eee;padding:10px;border-radius:8px;margin:8px 0";
    const lines = o.items.map(it => `${it.name} x ${it.qty} = ${formatINR(it.qty * it.price)}`).join("<br>");
    div.innerHTML = `
      <div><strong>Order #${o.id}</strong> — Status: <b>${o.status}</b></div>
      <div style="margin:6px 0">${lines}</div>
      <div><strong>Total: ${formatINR(o.total)}</strong></div>
    `;
    wrap.appendChild(div);
  }
}

// Vendor incoming orders (simple: show all orders that include any product from this vendor – MVP skip join; show all)
export async function loadVendorOrders(mount = "#vendor-orders") {
  const wrap = $(mount);
  wrap.innerHTML = "Loading...";

  // MVP: show all orders (no join filter). In phase-2 we will filter by vendor items.
  const snap = await getDocs(collection(db, "orders"));
  const orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  wrap.innerHTML = orders.length ? "" : "<p>No orders.</p>";
  for (const o of orders) {
    const div = document.createElement("div");
    div.style = "border:1px solid #eee;padding:10px;border-radius:8px;margin:8px 0";
    const lines = o.items.map(it => `${it.name} x ${it.qty}`).join(", ");
    div.innerHTML = `
      <div><strong>Order #${o.id}</strong> — <small>User: ${o.userId}</small></div>
      <div>Items: ${lines}</div>
      <div>Total: ${formatINR(o.total)}</div>
      <div>Status: <b>${o.status}</b></div>
      <button data-id="${o.id}" data-status="shipped">Mark Shipped</button>
      <button data-id="${o.id}" data-status="delivered">Mark Delivered</button>
    `;
    wrap.appendChild(div);
  }

  wrap.querySelectorAll("button").forEach(btn => {
    btn.onclick = async () => {
      const id = btn.getAttribute("data-id");
      const status = btn.getAttribute("data-status");
      await updateDoc(doc(db, "orders", id), { status });
      toast("Status updated");
      loadVendorOrders(mount);
    };
  });
}

// js/utils.js

export function $(sel) {
  return document.querySelector(sel);
}
export function $all(sel) {
  return [...document.querySelectorAll(sel)];
}

export function toast(msg) {
  alert(msg);
}

// Simple guard: redirect based on auth + role
export function requireAuth({ redirect = "./login.html" } = {}) {
  const uid = localStorage.getItem("uid");
  if (!uid) window.location.href = redirect;
}




export function setUserLocal(user, profileDoc) {
  localStorage.setItem("uid", user.uid);
  localStorage.setItem("email", user.email);
  localStorage.setItem("name", profileDoc?.name || user.displayName || "");
  localStorage.setItem("role", profileDoc?.role || "customer");
}

export function clearUserLocal() {
  localStorage.removeItem("uid");
  localStorage.removeItem("email");
  localStorage.removeItem("name");
  localStorage.removeItem("role");
}

export function getRole() {
  return localStorage.getItem("role") || "customer";
}
export function getUid() {
  return localStorage.getItem("uid");
}

// currency
export const formatINR = (n) => `₹${(Number(n) || 0).toLocaleString("en-IN")}`;

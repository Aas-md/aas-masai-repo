// js/auth.js
import { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "./firebase.js";
import { $, toast, setUserLocal, clearUserLocal } from "./utils.js";
import {
  doc, setDoc, getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// SIGNUP
export async function handleSignup(e) {
  e?.preventDefault?.();
  const name = $("#su-name").value.trim();
  const email = $("#su-email").value.trim();
  const pass = $("#su-pass").value.trim();
  const role = $("#su-role").value; // "customer" | "vendor"

  if (!name || !email || !pass) return toast("Fill all fields");
  if (pass.length < 6) return toast("Password must be at least 6 characters");


  const { user } = await createUserWithEmailAndPassword(auth, email, pass);
  // profile doc
  await setDoc(doc(db, "users", user.uid), {
    name, email, role, createdAt: new Date()
  });

  // store locally
  setUserLocal(user, { name, role });
  toast("Signup successful!");
  window.location.href = role === "vendor" ? "./vendor-dashboard.html" : "./index.html";
}

// LOGIN
export async function handleLogin(e) {
  e?.preventDefault?.();
  const email = $("#li-email").value.trim();
  const pass = $("#li-pass").value.trim();
  if (!email || !pass) return toast("Enter email & password");

  const { user } = await signInWithEmailAndPassword(auth, email, pass);
  const profSnap = await getDoc(doc(db, "users", user.uid));
  const profile = profSnap.exists() ? profSnap.data() : { role: "customer", name: "" };
  setUserLocal(user, profile);

  toast("Login successful");
  window.location.href = profile.role === "vendor" ? "./vendor-dashboard.html" : "./index.html";
}

// LOGOUT
export async function handleLogout() {
  await signOut(auth);
  clearUserLocal();
  window.location.href = "./login.html";
}

// expose for buttons
window.handleSignup = handleSignup;
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;

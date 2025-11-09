// js/firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
  databaseURL: "https://lib-mng-stm-default-rtdb.firebaseio.com"
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

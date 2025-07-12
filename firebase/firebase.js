
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBgbizuirtNwZvOuflvLd66tw-lzLZ1Hmo",
  authDomain: "polaroid-ar-memory.firebaseapp.com",
  projectId: "polaroid-ar-memory",
  storageBucket: "polaroid-ar-memory.appspot.com", // ✅ Corrected
  messagingSenderId: "285625088296",
  appId: "1:285625088296:web:0fc4f69380879df2c2b81d",
  measurementId: "G-5STLG9BYYJ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

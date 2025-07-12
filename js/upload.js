import { db } from '../firebase/firebase.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function uploadMemory() {
  const file = document.getElementById("fileInput").files[0];
  const caption = document.getElementById("caption").value;

  if (!file || !caption) {
    alert("Please upload a file and write a caption.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ml_default");

  try {
    const res = await fetch("https://api.cloudinary.com/v1_1/dv9vum0vn/image/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (!data.secure_url) {
      throw new Error("Cloudinary upload failed.");
    }

    const imageURL = data.secure_url;

    const docRef = await addDoc(collection(db, "memories"), {
      url: imageURL,
      caption: caption,
      createdAt: new Date()
    });

    console.log("Uploaded memory with ID:", docRef.id);
    window.location.href = `view.html?id=${docRef.id}`;

  } catch (error) {
    console.error("Upload failed:", error);
    alert("Upload failed. Check your internet or Cloudinary setup.");
  }
}

// Bind the function after DOM loads
document.getElementById("uploadBtn").addEventListener("click", uploadMemory);

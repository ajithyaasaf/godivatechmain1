import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc, collection, addDoc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import path from "path";
import fs from "fs";

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// 2. Configure Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "godiva-tech.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "godiva-tech",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "godiva-tech.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "801444351245",
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-KHE7CZP6EZ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function uploadRotaryWebsite() {
  console.log("🚀 Starting Rotary Club of Madurai Website Upload...\n");

  const imagePath = path.resolve(process.cwd(), "client/src/assets/projects/websites/Rotary Club of Madurai.png");

  if (!fs.existsSync(imagePath)) {
    console.error("❌ File not found:", imagePath);
    process.exit(1);
  }

  // 1. Ensure folder exists in Cloudinary
  try {
    await cloudinary.api.create_folder("godivatech/portfolio/websites");
    console.log("📁 Folder verified: godivatech/portfolio/websites");
  } catch (e) {}

  // 2. Upload image to Cloudinary
  console.log(`📤 Uploading "${imagePath}" to Cloudinary under folder "godivatech/portfolio/websites"...`);
  const uploadRes = await cloudinary.uploader.upload(imagePath, {
    public_id: "rotary-club-of-madurai",
    folder: "godivatech/portfolio/websites",
    asset_folder: "godivatech/portfolio/websites",
    overwrite: true,
    resource_type: "image"
  });

  // Ensure asset_folder is set in Media Library UI
  try {
    await cloudinary.api.update(uploadRes.public_id, {
      asset_folder: "godivatech/portfolio/websites"
    });
  } catch (e) {}

  console.log("✅ Cloudinary Upload Successful!");
  console.log("   Public ID:", uploadRes.public_id);
  console.log("   Secure URL:", uploadRes.secure_url);

  // 3. Add or Update in Firestore
  console.log("\n💾 Syncing with Firebase Firestore 'projects' collection...");
  const projectsCollection = collection(db, "projects");
  const querySnapshot = await getDocs(projectsCollection);

  let existingDoc = null;
  querySnapshot.forEach(docSnap => {
    const data = docSnap.data();
    if (
      data.title &&
      (data.title.toLowerCase().includes("rotary") || data.link === "https://rotary-website-iota.vercel.app/")
    ) {
      existingDoc = docSnap;
    }
  });

  const projectPayload = {
    title: "Rotary Club of Madurai",
    category: "Web Development",
    description: "Modern, responsive official website designed and built for Rotary Club of Madurai, showcasing social impact initiatives, youth leadership, membership, and club community projects.",
    link: "https://rotary-website-iota.vercel.app/",
    image: uploadRes.secure_url,
    gallery: [uploadRes.secure_url],
    technologies: ["Next.js", "React", "Tailwind CSS", "TypeScript", "Vercel"],
    clientName: "Rotary Club of Madurai",
    featured: true,
    order: 1, // First in order!
    updatedAt: serverTimestamp()
  };

  if (existingDoc) {
    console.log(`🔄 Updating existing Firestore project document ID: ${existingDoc.id}...`);
    await updateDoc(doc(db, "projects", existingDoc.id), projectPayload);
    console.log(`✅ Updated existing project document: ${existingDoc.id}`);
  } else {
    console.log("➕ Creating new Firestore project document...");
    const newDocRef = await addDoc(projectsCollection, {
      ...projectPayload,
      createdAt: serverTimestamp()
    });
    console.log(`✅ Created new project document with ID: ${newDocRef.id}`);
  }

  console.log("\n🎉 All Done Successfully!");
}

uploadRotaryWebsite().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});

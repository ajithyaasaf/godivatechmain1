import "dotenv/config";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";

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

const websiteFeatureTags = ["Mobile Responsive", "SEO Friendly", "Fast Loading", "Modern UI/UX"];

async function updateWebsiteTags() {
  console.log("Checking Firestore projects...");
  const querySnapshot = await getDocs(collection(db, "projects"));
  console.log(`Found ${querySnapshot.size} projects in Firestore`);

  for (const docSnap of querySnapshot.docs) {
    const data = docSnap.data();
    const isWebsite = 
      data.category === "Web Development" || 
      data.category === "Corporate Website" || 
      data.category === "Solar Solutions Website" ||
      data.category === "E-commerce Development" ||
      (data.link && data.link.startsWith("http"));

    console.log(`- Project "${data.title}" (Category: ${data.category}, Link: ${data.link}) -> Is Website: ${isWebsite}`);

    if (isWebsite) {
      console.log(`  Updating technologies to:`, websiteFeatureTags);
      await updateDoc(doc(db, "projects", docSnap.id), {
        category: "Web Development",
        technologies: websiteFeatureTags
      });
      console.log(`  ✅ Updated doc: ${docSnap.id}`);
    }
  }
  console.log("🎉 Completed updating website feature tags!");
}

updateWebsiteTags().catch(console.error);

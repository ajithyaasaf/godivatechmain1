import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc, collection, getDocs } from "firebase/firestore";

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
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

// Helper to extract Cloudinary public ID from URL
function getPublicIdFromUrl(url) {
  if (!url || !url.includes('cloudinary.com')) return null;
  const matches = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.[a-zA-Z0-9]+$/);
  return matches ? matches[1] : null;
}

async function moveWebsiteImages() {
  console.log('🚀 Starting Cloudinary & Firestore Website Migration...\n');

  // Fetch all projects from Firestore
  const projectsSnapshot = await getDocs(collection(db, 'projects'));
  const projects = [];
  projectsSnapshot.forEach(docSnap => {
    projects.push({ id: docSnap.id, ...docSnap.data() });
  });

  console.log(`Found ${projects.length} total projects in Firestore.`);

  // Targeted website projects
  const websiteProjects = projects.filter(p => {
    const cat = (p.category || '').toLowerCase();
    const title = (p.title || '').toLowerCase();
    return cat.includes('web') || 
           cat.includes('site') || 
           cat.includes('e-commerce') || 
           cat.includes('software') || 
           cat.includes('solar') ||
           cat.includes('corporate') ||
           title.includes('landing page') ||
           title.includes('finserv') ||
           title.includes('smart group') ||
           title.includes('smart shine');
  });

  console.log(`Identified ${websiteProjects.length} website/software projects to organize into 'godivatech/portfolio/websites/'.\n`);

  for (const project of websiteProjects) {
    const oldPublicId = getPublicIdFromUrl(project.image);
    if (!oldPublicId) {
      console.log(`⚠️ Skipping "${project.title}" (no valid Cloudinary URL): ${project.image}`);
      continue;
    }

    // If already in websites folder, skip
    if (oldPublicId.startsWith('godivatech/portfolio/websites/')) {
      console.log(`✓ "${project.title}" is already in 'websites' subfolder.`);
      continue;
    }

    const filename = oldPublicId.split('/').pop();
    const newPublicId = `godivatech/portfolio/websites/${filename}`;

    console.log(`📦 Moving "${project.title}"...`);
    console.log(`   Old Public ID: ${oldPublicId}`);
    console.log(`   New Public ID: ${newPublicId}`);

    try {
      // 1. Rename / Move in Cloudinary
      const result = await cloudinary.uploader.rename(oldPublicId, newPublicId, {
        overwrite: true
      });

      const newImageUrl = result.secure_url;
      console.log(`   ✅ Cloudinary move success: ${newImageUrl}`);

      // 2. Handle Gallery URLs if present
      let updatedGallery = project.gallery;
      if (Array.isArray(project.gallery) && project.gallery.length > 0) {
        updatedGallery = project.gallery.map(url => {
          if (url === project.image) return newImageUrl;
          return url;
        });
      }

      // 3. Update Firestore Project document
      const projectRef = doc(db, 'projects', project.id);
      await updateDoc(projectRef, {
        image: newImageUrl,
        gallery: updatedGallery || null
      });

      console.log(`   ✅ Firestore document updated successfully!\n`);
    } catch (error) {
      console.error(`   ❌ Failed to move "${project.title}":`, error.message, '\n');
    }
  }

  console.log('🎉 Migration completed successfully!');
  process.exit(0);
}

moveWebsiteImages().catch(err => {
  console.error('Fatal Error:', err);
  process.exit(1);
});

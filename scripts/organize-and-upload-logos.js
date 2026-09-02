import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc, collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import path from 'path';
import fs from 'fs';

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

// 3 New logos to upload
const newLogos = [
  {
    localFile: 'Bright Life.jpeg',
    title: 'Bright Life Logo',
    category: 'Logo',
    description: 'Distinctive and modern healthcare brand logo designed for Bright Life, conveying trust, vital energy, and wellness.',
    technologies: ['Adobe Illustrator', 'Branding', 'Vector Art', 'Typography'],
    clientName: 'Bright Life Healthcare'
  },
  {
    localFile: 'Healthy home loans.jpeg',
    title: 'Healthy Home Loans Logo',
    category: 'Logo',
    description: 'Professional financial identity logo created for Healthy Home Loans, communicating security, financial growth, and home ownership.',
    technologies: ['Adobe Illustrator', 'Brand Identity', 'Vector Design'],
    clientName: 'Healthy Home Loans'
  },
  {
    localFile: 'Om vinayaga associates.png',
    title: 'OM Vinayaga Associates Logo',
    category: 'Logo',
    description: 'Traditional and authoritative corporate logo designed for OM Vinayaga Associates, emphasizing stability and business excellence.',
    technologies: ['Adobe Illustrator', 'Branding', 'Corporate Identity'],
    clientName: 'OM Vinayaga Associates'
  }
];

async function organizeAndUploadLogos() {
  console.log('🎨 Starting Cloudinary & Firestore Logo Organization...\n');

  // Step 1: Ensure folder exists in Cloudinary
  try {
    await cloudinary.api.create_folder('godivatech/portfolio/logos');
    console.log('📁 Created/verified folder: godivatech/portfolio/logos');
  } catch (err) {
    // Folder might already exist, continue
  }

  // Step 2: Upload the 3 new logos
  const baseDir = path.resolve(process.cwd(), 'client', 'src', 'assets', 'projects', 'logos');
  console.log('\n--- STEP 1: Uploading New Logos ---');

  for (const item of newLogos) {
    const filePath = path.join(baseDir, item.localFile);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Local file not found: ${filePath}`);
      continue;
    }

    console.log(`📤 Uploading "${item.title}" (${item.localFile}) to "godivatech/portfolio/logos"...`);

    const uploadRes = await cloudinary.uploader.upload(filePath, {
      folder: 'godivatech/portfolio/logos',
      asset_folder: 'godivatech/portfolio/logos',
      use_filename: true,
      unique_filename: true,
      overwrite: true
    });

    // Update asset_folder metadata for Cloudinary UI
    await cloudinary.api.update(uploadRes.public_id, {
      asset_folder: 'godivatech/portfolio/logos'
    });

    console.log(`   ✅ Uploaded: ${uploadRes.secure_url}`);

    // Add to Firestore
    console.log(`   💾 Adding "${item.title}" to Firestore projects collection...`);
    const docData = {
      title: item.title,
      category: item.category,
      description: item.description,
      image: uploadRes.secure_url,
      gallery: [uploadRes.secure_url],
      technologies: item.technologies,
      clientName: item.clientName,
      featured: false,
      order: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'projects'), docData);
    console.log(`   ✅ Firestore Document Created! ID: ${docRef.id}\n`);
  }

  // Step 3: Move all existing logos to godivatech/portfolio/logos/
  console.log('\n--- STEP 2: Moving Existing Logos to godivatech/portfolio/logos ---');
  const projectsSnapshot = await getDocs(collection(db, 'projects'));
  const projects = [];
  projectsSnapshot.forEach(docSnap => {
    projects.push({ id: docSnap.id, ...docSnap.data() });
  });

  const existingLogos = projects.filter(p => 
    p.category === 'Logo' && 
    p.image && 
    !p.image.includes('/portfolio/logos/')
  );

  console.log(`Found ${existingLogos.length} existing logo projects to move into 'godivatech/portfolio/logos/'.\n`);

  for (const project of existingLogos) {
    const oldPublicId = getPublicIdFromUrl(project.image);
    if (!oldPublicId) {
      console.log(`⚠️ Skipping "${project.title}" (no valid Cloudinary URL)`);
      continue;
    }

    const filename = oldPublicId.split('/').pop();
    const newPublicId = `godivatech/portfolio/logos/${filename}`;

    console.log(`📦 Moving "${project.title}"...`);
    console.log(`   Old Public ID: ${oldPublicId}`);
    console.log(`   New Public ID: ${newPublicId}`);

    try {
      // Rename in Cloudinary
      const renameRes = await cloudinary.uploader.rename(oldPublicId, newPublicId, {
        overwrite: true
      });

      // Update asset_folder in Cloudinary UI
      await cloudinary.api.update(newPublicId, {
        asset_folder: 'godivatech/portfolio/logos'
      });

      const newImageUrl = renameRes.secure_url;
      console.log(`   ✅ Cloudinary move success: ${newImageUrl}`);

      // Handle Gallery URLs
      let updatedGallery = project.gallery;
      if (Array.isArray(project.gallery) && project.gallery.length > 0) {
        updatedGallery = project.gallery.map(url => {
          if (url === project.image) return newImageUrl;
          return url;
        });
      }

      // Update Firestore document
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

  console.log('🎉 All logo projects organized into "godivatech/portfolio/logos" successfully!');
  process.exit(0);
}

organizeAndUploadLogos().catch(err => {
  console.error('Fatal Error:', err);
  process.exit(1);
});

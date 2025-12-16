import { v2 as cloudinary } from 'cloudinary';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'doeodacsg',
  api_key: '269267633995791',
  api_secret: 'wUw9Seu6drQEIbQ1tAvYeVyqHdU',
  secure: true,
});

// Initialize Firebase (client SDK)
const firebaseConfig = {
  apiKey: "AIzaSyDzIqWI6AApvWSE22y1Ug7h-8MysAo2fNw",
  authDomain: "godiva-tech.firebaseapp.com",
  projectId: "godiva-tech",
  storageBucket: "godiva-tech.firebasestorage.app",
  messagingSenderId: "801444351245",
  appId: "1:801444351245:web:f030b472d6fb7be3d4f444",
  measurementId: "G-KHE7CZP6EZ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to convert local file to base64
function fileToBase64(filePath) {
  const file = fs.readFileSync(filePath);
  const base64 = file.toString('base64');
  const ext = path.extname(filePath).slice(1);
  const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
  return `data:${mimeType};base64,${base64}`;
}

// Function to upload image to Cloudinary
async function uploadToCloudinary(localPath, projectTitle) {
  try {
    const fullPath = path.resolve(process.cwd(), localPath.replace(/^\//, ''));
    
    if (!fs.existsSync(fullPath)) {
      console.log(`File not found: ${fullPath}`);
      return null;
    }

    const base64Image = fileToBase64(fullPath);
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'godivatech/logos',
      resource_type: 'auto',
    });

    console.log(`✅ Uploaded ${projectTitle}: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Error uploading ${projectTitle}:`, error.message);
    return null;
  }
}

// Main function
async function main() {
  console.log('Starting logo image upload to Cloudinary...\n');

  // Get all projects from Firestore
  const projectsRef = collection(db, 'projects');
  const snapshot = await getDocs(projectsRef);

  let uploadedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const docSnapshot of snapshot.docs) {
    const project = docSnapshot.data();
    const projectId = docSnapshot.id;

    // Check if image starts with /attached_assets/ (local file)
    if (project.image && project.image.startsWith('/attached_assets/')) {
      console.log(`\nProcessing: ${project.title}`);
      console.log(`Current image: ${project.image}`);

      // Upload to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(project.image, project.title);

      if (cloudinaryUrl) {
        // Update Firestore with new Cloudinary URL
        const projectDocRef = doc(db, 'projects', projectId);
        await updateDoc(projectDocRef, {
          image: cloudinaryUrl,
          updatedAt: new Date()
        });
        console.log(`Updated Firestore record for: ${project.title}`);
        uploadedCount++;
      } else {
        errorCount++;
      }
    } else if (project.image && project.image.includes('cloudinary.com')) {
      console.log(`⏭️  Skipping ${project.title} - already on Cloudinary`);
      skippedCount++;
    } else {
      console.log(`⚠️  Skipping ${project.title} - unknown image format: ${project.image}`);
      skippedCount++;
    }
  }

  console.log('\n=================================');
  console.log('Upload Summary:');
  console.log(`✅ Uploaded: ${uploadedCount}`);
  console.log(`⏭️  Skipped: ${skippedCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log('=================================\n');
}

main()
  .then(() => {
    console.log('Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });

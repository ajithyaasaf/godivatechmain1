import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import path from 'path';
import fs from 'fs';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Firebase
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

const newProjects = [
  {
    localFile: 'Bright Life.png',
    title: 'Bright Life',
    category: 'Web Development',
    link: 'https://www.brightlife.in/',
    description: 'A modern, responsive healthcare and wellness platform designed to showcase quality healthcare services with intuitive user navigation.',
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'Responsive Design'],
    clientName: 'Bright Life Healthcare',
    featured: true
  },
  {
    localFile: 'Healthy Home Loans.png',
    title: 'Healthy Home Loans Website',
    category: 'Web Development',
    link: 'https://www.healthyhomeloans.in/',
    description: 'Comprehensive financial and mortgage services web portal allowing customers to explore loan products, calculate repayments, and apply online seamlessly.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'FinTech UI'],
    clientName: 'Healthy Home Loans',
    featured: true
  },
  {
    localFile: 'Imex.png',
    title: 'IMEX Network',
    category: 'Web Development',
    link: 'https://www.imex.network/',
    description: 'A global logistics, import-export, and international trade platform engineered with sleek corporate branding and product showcase catalogs.',
    technologies: ['React', 'Next.js', 'Node.js', 'Tailwind CSS'],
    clientName: 'IMEX Global Network',
    featured: true
  }
];

async function uploadAndCreateProjects() {
  console.log('🚀 Starting Upload for New Website Projects...\n');
  const baseDir = path.resolve(process.cwd(), 'client', 'src', 'assets', 'projects', 'websites');

  for (const item of newProjects) {
    const filePath = path.join(baseDir, item.localFile);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      continue;
    }

    console.log(`📤 Uploading "${item.title}" (${item.localFile}) to Cloudinary folder "godivatech/portfolio/websites"...`);

    const uploadRes = await cloudinary.uploader.upload(filePath, {
      folder: 'godivatech/portfolio/websites',
      asset_folder: 'godivatech/portfolio/websites',
      use_filename: true,
      unique_filename: true,
      overwrite: true
    });

    // Explicitly update asset_folder to guarantee it appears in the Cloudinary UI Media Library folder
    await cloudinary.api.update(uploadRes.public_id, {
      asset_folder: 'godivatech/portfolio/websites'
    });

    console.log(`   ✅ Uploaded: ${uploadRes.secure_url}`);
    console.log(`   ✅ Cloudinary Asset Folder: godivatech/portfolio/websites`);

    // Insert into Firestore
    console.log(`💾 Adding "${item.title}" to Firestore projects collection...`);
    const docData = {
      title: item.title,
      category: item.category,
      description: item.description,
      image: uploadRes.secure_url,
      gallery: [uploadRes.secure_url],
      link: item.link,
      technologies: item.technologies,
      clientName: item.clientName,
      featured: item.featured,
      order: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'projects'), docData);
    console.log(`   ✅ Firestore Document Created! ID: ${docRef.id}\n`);
  }

  console.log('🎉 All 3 projects uploaded to Cloudinary & added to Firestore successfully!');
  process.exit(0);
}

uploadAndCreateProjects().catch(err => {
  console.error('Fatal Error:', err);
  process.exit(1);
});

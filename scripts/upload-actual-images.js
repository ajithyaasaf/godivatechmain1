#!/usr/bin/env node

/**
 * Upload Actual Project Images Script
 * Uploads the exact images specified by the user and updates project records
 */

import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { doc, updateDoc, getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { Jimp } from 'jimp';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzIqWI6AApvWSE22y1Ug7h-8MysAo2fNw",
  authDomain: "godiva-tech.firebaseapp.com",
  projectId: "godiva-tech",
  storageBucket: "godiva-tech.firebasestorage.app",
  messagingSenderId: "801444351245",
  appId: "1:801444351245:web:f030b472d6fb7be3d4f444",
  measurementId: "G-KHE7CZP6EZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Configure Cloudinary with the exact credentials from server
cloudinary.config({
  cloud_name: 'doeodacsg',
  api_key: '269267633995791',
  api_secret: 'wUw9Seu6drQEIbQ1tAvYeVyqHdU',
});

// Helper function to compress large images locally
async function compressImageIfNeeded(imagePath) {
  const stats = fs.statSync(imagePath);
  const fileSizeInMB = stats.size / (1024 * 1024);
  console.log(`📊 Original file size: ${fileSizeInMB.toFixed(2)} MB`);
  
  // If file is larger than 9MB, compress it locally
  if (fileSizeInMB > 9) {
    console.log(`🗜️  Compressing large file locally...`);
    
    const tempPath = imagePath.replace('.jpg', '_compressed.jpg');
    
    try {
      const image = await Jimp.read(imagePath);
      await image
        .resize(1200, Jimp.AUTO) // Resize width to 1200px, height auto
        .quality(80) // Set quality to 80%
        .writeAsync(tempPath);
      
      const compressedStats = fs.statSync(tempPath);
      const compressedSizeInMB = compressedStats.size / (1024 * 1024);
      console.log(`✅ Compressed file size: ${compressedSizeInMB.toFixed(2)} MB`);
      
      return tempPath;
    } catch (error) {
      console.error(`❌ Error compressing image:`, error);
      return imagePath; // Return original if compression fails
    }
  }
  
  return imagePath; // Return original path if no compression needed
}

// Helper function to upload image to Cloudinary
async function uploadImageToCloudinary(imagePath, folder = 'godivatech/portfolio') {
  try {
    console.log(`📤 Uploading ${imagePath} to Cloudinary...`);
    
    // Compress image locally if needed
    const uploadPath = await compressImageIfNeeded(imagePath);
    
    const uploadOptions = {
      folder: folder,
      resource_type: 'image',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    };
    
    const result = await cloudinary.uploader.upload(uploadPath, uploadOptions);
    
    // Clean up temporary compressed file if it was created
    if (uploadPath !== imagePath && fs.existsSync(uploadPath)) {
      fs.unlinkSync(uploadPath);
      console.log(`🗑️  Cleaned up temporary file: ${uploadPath}`);
    }
    
    console.log(`✅ Image uploaded successfully: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Error uploading image ${imagePath}:`, error);
    throw error;
  }
}

// Helper function to update project in Firestore
async function updateProjectInFirestore(projectId, updateData) {
  try {
    console.log(`📝 Updating project ${projectId}...`);
    
    const docRef = doc(db, 'projects', projectId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: new Date()
    });
    
    console.log(`✅ Project ${projectId} updated successfully`);
  } catch (error) {
    console.error(`❌ Error updating project ${projectId}:`, error);
    throw error;
  }
}

// Main function to upload actual project images
async function uploadActualImages() {
  console.log('🚀 Starting Actual Project Image Upload...\n');
  
  const imageUpdates = [
    {
      projectId: 'hzn553uZj2NmF5pA2ZwT', // Truewaves Letterpad Design
      projectTitle: 'Truewaves Letterpad Design',
      imagePath: 'attached_assets/Mockup.jpg'
    },
    {
      projectId: 'Oc33lgPoqF9V8jyBJkQk', // Healthy Home Loans Business Card
      projectTitle: 'Healthy Home Loans Business Card',
      imagePath: 'attached_assets/Mockup 2.jpg'
    },
    {
      projectId: 'xkzv4CWM1cDhfwY97rtO', // Truewaves Business Card Design
      projectTitle: 'Truewaves Business Card Design',
      imagePath: 'attached_assets/Business Card.jpg'
    }
  ];
  
  for (const update of imageUpdates) {
    try {
      console.log(`\n📁 Processing: ${update.projectTitle}`);
      
      // Check if image file exists
      const fullImagePath = path.resolve(update.imagePath);
      if (!fs.existsSync(fullImagePath)) {
        console.log(`⚠️  Image file not found: ${fullImagePath}`);
        continue;
      }
      
      console.log(`📂 Found image file: ${fullImagePath}`);
      
      // Upload actual image to Cloudinary
      const imageUrl = await uploadImageToCloudinary(fullImagePath);
      
      // Update project in Firestore
      await updateProjectInFirestore(update.projectId, {
        image: imageUrl,
        gallery: [imageUrl] // Update gallery as well
      });
      
      console.log(`✅ Successfully updated ${update.projectTitle} with actual image from ${update.imagePath}`);
      
    } catch (error) {
      console.error(`❌ Failed to update ${update.projectTitle}:`, error);
    }
  }
  
  console.log('\n🎉 Actual project image upload completed!');
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  uploadActualImages().catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}

export { uploadActualImages };
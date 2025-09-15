#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase configuration (using environment variables)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Upload image to Cloudinary via API
async function uploadImageToCloudinary(imagePath, filename) {
  try {
    console.log(`📤 Uploading ${filename}...`);
    
    // Read image file and convert to base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
    
    // Upload to Cloudinary via API
    const response = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
        folder: 'godivatech/portfolio/elevatehq-social'
      })
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log(`✅ Uploaded ${filename}: ${result.url}`);
    return result.url;
    
  } catch (error) {
    console.error(`❌ Failed to upload ${filename}:`, error.message);
    return null;
  }
}

// Update Firestore project directly
async function updateProjectGalleryDirect(projectId, galleryUrls) {
  try {
    console.log(`📝 Updating project ${projectId} with ${galleryUrls.length} images...`);
    
    const projectRef = doc(db, 'projects', projectId);
    await updateDoc(projectRef, {
      gallery: galleryUrls,
      image: galleryUrls[0], // Set the first image as the main image
      updatedAt: new Date()
    });
    
    console.log(`✅ Successfully updated project gallery in Firestore`);
    return true;
    
  } catch (error) {
    console.error(`❌ Failed to update project:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting ElevateHQ Social Media Campaign gallery update...\n');
  
  // Define the image files to upload
  const imagesToUpload = [
    'SM Poster - 2_1757919830895.jpg',
    'SM Poster - 3_1757919830899.jpg', 
    'SM Poster - 4_1757919830900.jpg',
    'SM Poster - 5_1757919830901.jpg',
    'SM Poster - 6_1757919830902.jpg'
  ];
  
  // Upload additional images
  const uploadedUrls = [];
  
  // Add the existing first image URL
  const existingImageUrl = "https://res.cloudinary.com/doeodacsg/image/upload/v1757918391/godivatech/portfolio/qohmcoufdmjovg0ngtuu.jpg";
  uploadedUrls.push(existingImageUrl);
  
  // Upload each new image
  for (const imageFile of imagesToUpload) {
    const imagePath = path.join(__dirname, '..', 'attached_assets', imageFile);
    
    if (fs.existsSync(imagePath)) {
      const uploadedUrl = await uploadImageToCloudinary(imagePath, imageFile);
      if (uploadedUrl) {
        uploadedUrls.push(uploadedUrl);
      }
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      console.log(`⚠️  Image not found: ${imagePath}`);
    }
  }
  
  console.log(`\n📊 Total images for gallery: ${uploadedUrls.length}`);
  console.log('Gallery URLs:');
  uploadedUrls.forEach((url, index) => {
    console.log(`  ${index + 1}. ${url}`);
  });
  
  // Update the project with the new gallery
  if (uploadedUrls.length >= 6) {
    const projectId = 'Ihhl54dn6Zau6pjiZAHz'; // ElevateHQ Social Media Campaign project ID
    const success = await updateProjectGalleryDirect(projectId, uploadedUrls);
    
    if (success) {
      console.log('\n🎉 ElevateHQ Social Media Campaign gallery updated successfully!');
      console.log('✨ Your portfolio now shows all 6 poster variations in one project card with:');
      console.log('   • Image carousel navigation');
      console.log('   • Dot indicators at the bottom');
      console.log('   • Image counter showing "6 design variations"');
      console.log('   • Navigation arrows on hover');
      console.log('\n🔄 Please refresh your browser to see the changes!');
    } else {
      console.log('\n❌ Failed to update project gallery. Please check Firebase permissions.');
    }
  } else {
    console.log('\n⚠️  Not enough images uploaded to create complete gallery.');
    console.log(`Expected 6 images, got ${uploadedUrls.length}`);
  }
}

// Run the script
main().catch(console.error);
#!/usr/bin/env node

/**
 * Update Project Images Script
 * Updates existing project records in Firestore with the correct images
 */

import fs from 'fs';
import path from 'path';
import { doc, updateDoc, getDoc, getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

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

// Helper function to convert image to base64
function convertImageToBase64(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64String = imageBuffer.toString('base64');
    const fileExtension = path.extname(imagePath).toLowerCase();
    let mimeType = 'image/jpeg';
    
    if (fileExtension === '.png') mimeType = 'image/png';
    else if (fileExtension === '.gif') mimeType = 'image/gif';
    else if (fileExtension === '.webp') mimeType = 'image/webp';
    
    return `data:${mimeType};base64,${base64String}`;
  } catch (error) {
    console.error(`Error reading image ${imagePath}:`, error);
    return null;
  }
}

// Helper function to upload image via server API
async function uploadImageViaAPI(imagePath) {
  try {
    console.log(`📤 Uploading ${imagePath} via server API...`);
    
    const base64Image = convertImageToBase64(imagePath);
    if (!base64Image) {
      throw new Error('Failed to convert image to base64');
    }
    
    const response = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
        folder: 'godivatech/portfolio'
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log(`✅ Image uploaded successfully: ${result.url}`);
    return result.url;
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

// Main function to update project images
async function updateProjectImages() {
  console.log('🚀 Starting Project Image Update...\n');
  
  const imageUpdates = [
    {
      projectId: 'hzn553uZj2NmF5pA2ZwT', // Truewaves Letterpad Design
      projectTitle: 'Truewaves Letterpad Design',
      imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' // Professional letterhead/stationery design
    },
    {
      projectId: 'Oc33lgPoqF9V8jyBJkQk', // Healthy Home Loans Business Card
      projectTitle: 'Healthy Home Loans Business Card',
      imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' // Professional business cards layout
    },
    {
      projectId: 'xkzv4CWM1cDhfwY97rtO', // Truewaves Business Card Design
      projectTitle: 'Truewaves Business Card Design',
      imageUrl: 'https://images.unsplash.com/photo-1606868306217-dbf5046868d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' // Modern business card design
    }
  ];
  
  for (const update of imageUpdates) {
    try {
      console.log(`\n📁 Processing: ${update.projectTitle}`);
      console.log(`🔗 Using theme-appropriate image: ${update.imageUrl}`);
      
      // Update project in Firestore with placeholder image
      await updateProjectInFirestore(update.projectId, {
        image: update.imageUrl,
        gallery: [update.imageUrl] // Update gallery as well
      });
      
      console.log(`✅ Successfully updated ${update.projectTitle} with theme-appropriate image`);
      
    } catch (error) {
      console.error(`❌ Failed to update ${update.projectTitle}:`, error);
    }
  }
  
  console.log('\n🎉 Project image update completed!');
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  updateProjectImages().catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}

export { updateProjectImages };
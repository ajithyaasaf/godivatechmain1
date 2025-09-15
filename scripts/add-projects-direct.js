#!/usr/bin/env node

/**
 * Direct Project Importer
 * This script uploads images to Cloudinary and creates projects directly in the database
 * providing flexibility without needing the admin interface
 */

import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
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

// Configure Cloudinary (using working credentials)
cloudinary.config({
  cloud_name: 'doeodacsg',
  api_key: '269267633995791',
  api_secret: 'wUw9Seu6drQEIbQ1tAvYeVyqHdU',
});

// Helper function to upload image to Cloudinary
async function uploadImageToCloudinary(imagePath, folder = 'godivatech/portfolio') {
  try {
    console.log(`Uploading ${imagePath} to Cloudinary...`);
    
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: folder,
      resource_type: 'image',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });
    
    console.log(`✅ Image uploaded successfully: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Error uploading image ${imagePath}:`, error);
    throw error;
  }
}

// Helper function to create project in Firestore
async function createProjectInFirestore(projectData) {
  try {
    console.log(`Creating project: ${projectData.title}...`);
    
    const docRef = await addDoc(collection(db, 'projects'), {
      ...projectData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log(`✅ Project created successfully with ID: ${docRef.id}`);
    return { id: docRef.id, ...projectData };
  } catch (error) {
    console.error(`❌ Error creating project ${projectData.title}:`, error);
    throw error;
  }
}

// Main function to process all projects
async function addProjectsDirect() {
  console.log('🚀 Starting Direct Project Import...\n');
  
  const projectsToAdd = [
    {
      title: "ElevateHQ Social Media Campaign",
      description: "Comprehensive social media poster campaign for ElevateHQ's Revenue Planning for 2023 virtual roundtable event.",
      fullDescription: "A complete social media marketing campaign designed for ElevateHQ, featuring 6 unique poster variations for their 'Compensation Simplified - Revenue Planning for 2023' virtual roundtable. Each design showcases the same event information with different visual approaches, demonstrating versatility in social media design while maintaining brand consistency. The campaign features speaker profiles, event details, and strong call-to-action elements across multiple layout styles.",
      imagePath: "attached_assets/A. SM Poster - 1_1757918134721.jpg",
      galleryPaths: [
        "attached_assets/A. SM Poster - 1_1757918134721.jpg",
        "attached_assets/SM Poster - 2_1757918134723.jpg",
        "attached_assets/SM Poster - 3_1757918134724.jpg",
        "attached_assets/SM Poster - 4_1757918134725.jpg",
        "attached_assets/SM Poster - 5_1757918134726.jpg",
        "attached_assets/SM Poster - 6_1757918134727.jpg"
      ],
      category: "Digital Marketing",
      technologies: ["Social Media Design", "Campaign Design", "Brand Consistency", "Event Marketing", "Adobe Creative Suite", "Typography"],
      clientName: "ElevateHQ",
      location: "Gurugram, Haryana",
      featured: true,
      challengeDescription: "Creating multiple engaging social media poster variations for a virtual event while maintaining brand consistency and clear information hierarchy across different design approaches.",
      solutionDescription: "Developed 6 distinct poster designs using ElevateHQ's purple brand palette, each featuring unique layouts and visual treatments while ensuring all essential event information remains prominent and accessible.",
      resultsDescription: "Delivered a comprehensive campaign that provided ElevateHQ with versatile social media assets for maximum audience engagement across different platforms and posting strategies."
    },
    {
      title: "ElevateHQ Landing Page Design",
      description: "Modern, conversion-focused landing page design for ElevateHQ's SaaS platform featuring compelling value propositions and customer testimonials.",
      fullDescription: "A professionally designed landing page for ElevateHQ that effectively communicates their value proposition 'Say Goodbye to Spreadsheets, Say Hello to Awesome.' The design features a gradient hero section with compelling copy, customer testimonials, trust badges, and clear call-to-action elements. The layout emphasizes user engagement with personalized demo offers and showcases the platform's benefits through strategic use of typography, imagery, and social proof.",
      imagePath: "attached_assets/B. Landing Page-2_1757918177625.jpg",
      category: "UI/UX Design",
      technologies: ["Landing Page Design", "UI/UX Design", "Conversion Optimization", "Web Design", "SaaS Design", "User Experience"],
      clientName: "ElevateHQ",
      location: "Gurugram, Haryana",
      featured: true,
      challengeDescription: "Designing a high-converting landing page that effectively communicates complex SaaS benefits while maintaining visual appeal and user engagement throughout the conversion funnel.",
      solutionDescription: "Created a modern, gradient-rich design with strategic placement of trust elements, customer testimonials, and clear value propositions. Used progressive disclosure and visual hierarchy to guide users toward the demo signup action.",
      resultsDescription: "Delivered a conversion-optimized landing page that effectively showcases ElevateHQ's platform benefits and provides a seamless user experience from first impression to demo request."
    }
  ];
  
  const createdProjects = [];
  
  for (const project of projectsToAdd) {
    try {
      console.log(`\n📁 Processing: ${project.title}`);
      
      // Check if main image file exists
      const fullImagePath = path.resolve(project.imagePath);
      if (!fs.existsSync(fullImagePath)) {
        console.log(`⚠️  Main image file not found: ${fullImagePath}`);
        continue;
      }
      
      // Upload main image to Cloudinary
      const imageUrl = await uploadImageToCloudinary(fullImagePath);
      
      // Handle gallery images if they exist
      let galleryUrls = [imageUrl]; // Start with main image
      
      if (project.galleryPaths && project.galleryPaths.length > 0) {
        console.log(`📸 Processing ${project.galleryPaths.length} gallery images...`);
        
        for (const galleryPath of project.galleryPaths) {
          const fullGalleryPath = path.resolve(galleryPath);
          
          if (fs.existsSync(fullGalleryPath)) {
            try {
              const galleryUrl = await uploadImageToCloudinary(fullGalleryPath);
              if (!galleryUrls.includes(galleryUrl)) {
                galleryUrls.push(galleryUrl);
              }
              console.log(`✅ Gallery image uploaded: ${path.basename(galleryPath)}`);
            } catch (galleryError) {
              console.log(`⚠️  Failed to upload gallery image ${galleryPath}:`, galleryError.message);
            }
          } else {
            console.log(`⚠️  Gallery image not found: ${fullGalleryPath}`);
          }
        }
        
        console.log(`📚 Total gallery images: ${galleryUrls.length}`);
      }
      
      // Create project data
      const projectData = {
        title: project.title,
        description: project.description,
        fullDescription: project.fullDescription,
        image: imageUrl,
        gallery: galleryUrls,
        category: project.category,
        technologies: project.technologies,
        link: null, // Can be added later if needed
        githubLink: null,
        clientName: project.clientName,
        completionDate: new Date().toISOString().split('T')[0], // Today's date
        featured: project.featured,
        testimonial: null,
        challengeDescription: project.challengeDescription,
        solutionDescription: project.solutionDescription,
        resultsDescription: project.resultsDescription,
        order: createdProjects.length + 1
      };
      
      // Create project in database
      const createdProject = await createProjectInFirestore(projectData);
      createdProjects.push(createdProject);
      
      console.log(`✅ Successfully added: ${project.title}`);
      
    } catch (error) {
      console.error(`❌ Failed to process ${project.title}:`, error.message);
    }
  }
  
  console.log(`\n🎉 Import completed! Successfully added ${createdProjects.length} projects.`);
  
  if (createdProjects.length > 0) {
    console.log('\n📋 Created projects:');
    createdProjects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title} (ID: ${project.id})`);
    });
  }
  
  return createdProjects;
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  addProjectsDirect()
    .then((projects) => {
      console.log('\n✨ All done! Your projects are now available in your portfolio.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

export { addProjectsDirect };
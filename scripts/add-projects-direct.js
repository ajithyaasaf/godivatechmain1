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
      title: "Prakash Green Energy - ERP System",
      description: "Comprehensive Vertical ERP System designed specifically for solar energy companies, integrating field service management, HR, payroll, CRM, product management, and analytics into one unified platform.",
      fullDescription: "A complete Enterprise Resource Planning (ERP) solution tailored specifically for solar energy business operations. This vertical ERP system integrates all critical business functions including field service management, HR and payroll processing, customer relationship management (CRM), product and inventory management, and comprehensive analytics. The system features industry-specific workflows for technical teams, marketing departments, and administrative functions with role-based access control and multi-department support. The dashboard provides real-time insights into overall performance, customer management, inventory tracking, and operational analytics specifically designed for the unique needs of solar energy companies.",
      imagePath: "attached_assets/prakash-green-energy-erp.jpg",
      category: "Software Development",
      technologies: ["ERP Development", "Solar Industry Solutions", "Business Management Systems", "Multi-Module Integration", "Role-Based Access Control", "Dashboard Analytics", "Field Service Management"],
      clientName: "Prakash Green Energy",
      location: "India",
      featured: true,
      challengeDescription: "Developing a comprehensive ERP system that addresses the unique operational challenges of solar energy companies, requiring integration of field operations, back-office administration, customer management, and industry-specific analytics in one unified platform.",
      solutionDescription: "Built a vertical ERP system with specialized modules for solar energy operations including quotation management, invoice processing, attendance tracking, leave management, site visit monitoring, employee management, and departmental coordination. Implemented role-based access control and real-time dashboard analytics for performance monitoring.",
      resultsDescription: "Delivered an integrated business management platform that streamlines operations across technical, marketing, and administrative departments, providing solar energy companies with comprehensive visibility and control over their entire business operations from field service to financial management."
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
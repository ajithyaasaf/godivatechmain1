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

// Configure Cloudinary (will use environment variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'doeodacsg',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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
      title: "Truewaves Letterpad Design",
      description: "Professional letterpad mockup design for Truewaves showcasing modern branding and corporate identity.",
      fullDescription: "A comprehensive letterpad design project for Truewaves, featuring clean typography, strategic brand placement, and professional layout. The design emphasizes readability while maintaining strong brand presence through careful use of colors and spacing.",
      imagePath: "attached_assets/Mockup.jpg",
      category: "Brand Design",
      technologies: ["Graphic Design", "Brand Identity", "Print Design", "Typography", "Adobe Creative Suite"],
      clientName: "Truewaves",
      featured: true,
      challengeDescription: "Creating a letterpad design that balances professional appearance with strong brand recognition while ensuring print-ready quality.",
      solutionDescription: "Developed a clean, professional layout with strategic brand element placement and typography that enhances readability and brand recall.",
      resultsDescription: "Delivered a versatile letterpad design that effectively represents the Truewaves brand in professional correspondence."
    },
    {
      title: "Healthy Home Loans Business Card",
      description: "Professional business card design for Healthy Home Loans with modern aesthetics and clear contact information hierarchy.",
      fullDescription: "A sophisticated business card design for Healthy Home Loans that combines professionalism with approachability. The design features clear information hierarchy, modern typography, and a color scheme that conveys trust and reliability in the financial services sector.",
      imagePath: "attached_assets/Mockup 2.jpg",
      category: "Brand Design",
      technologies: ["Business Card Design", "Brand Design", "Print Design", "Typography", "Contact Design"],
      clientName: "Healthy Home Loans",
      featured: true,
      challengeDescription: "Designing a business card that conveys trust and professionalism in the competitive financial services market while maintaining visual appeal.",
      solutionDescription: "Created a clean, trustworthy design with optimal information hierarchy and professional color palette that reflects the company's reliability.",
      resultsDescription: "Produced an effective business card that enhances brand recognition and professional credibility in client interactions."
    },
    {
      title: "Truewaves Business Card Design",
      description: "Modern business card mockup design for Truewaves featuring contemporary layout and professional branding elements.",
      fullDescription: "A contemporary business card design for Truewaves that showcases modern design principles while maintaining professional standards. The design incorporates brand colors effectively and ensures all contact information is clearly presented with optimal readability.",
      imagePath: "attached_assets/Business Card.jpg",
      category: "Brand Design", 
      technologies: ["Business Card Design", "Brand Design", "Print Design", "Modern Typography", "Brand Consistency"],
      clientName: "Truewaves",
      featured: true,
      challengeDescription: "Creating a business card design that stands out in professional settings while maintaining brand consistency with other Truewaves materials.",
      solutionDescription: "Developed a modern, memorable design that effectively uses whitespace and typography to create a professional yet distinctive business card.",
      resultsDescription: "Delivered a business card design that enhances professional networking opportunities and reinforces brand identity."
    }
  ];
  
  const createdProjects = [];
  
  for (const project of projectsToAdd) {
    try {
      console.log(`\n📁 Processing: ${project.title}`);
      
      // Check if image file exists
      const fullImagePath = path.resolve(project.imagePath);
      if (!fs.existsSync(fullImagePath)) {
        console.log(`⚠️  Image file not found: ${fullImagePath}`);
        continue;
      }
      
      // Upload image to Cloudinary
      const imageUrl = await uploadImageToCloudinary(fullImagePath);
      
      // Create project data
      const projectData = {
        title: project.title,
        description: project.description,
        fullDescription: project.fullDescription,
        image: imageUrl,
        gallery: [imageUrl], // Add to gallery as well
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
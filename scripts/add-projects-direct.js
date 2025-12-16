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
      title: "OM Vinayaga Associates",
      description: "Comprehensive building solutions website providing expert diagnosis and treatment for all building ailments with precision and over 10 years of experience.",
      fullDescription: "A modern, professional website for OM Vinayaga Associates, Madurai's most trusted building experts. The site showcases their comprehensive building solutions including complete building diagnostics, advanced waterproofing solutions, and guaranteed leak-free results. Built with modern web technologies, the website features an intuitive design that effectively communicates their expertise in transforming buildings with expert care. The platform includes detailed service information, expert diagnosis capabilities, and clear calls-to-action for customers seeking building solutions.",
      imagePath: "attached_assets/om-vinayaga-associates.jpg",
      category: "Web Development",
      technologies: ["React", "TypeScript", "Firestore Database", "Framer Motion", "Tailwind CSS"],
      clientName: "OM Vinayaga Associates",
      location: "Madurai, Tamil Nadu",
      featured: true,
      link: "https://www.omvinayagaassociates.com",
      challengeDescription: "Creating a professional online presence for a building solutions company that effectively communicates their expertise and services while building trust with potential customers.",
      solutionDescription: "Developed a clean, modern website with clear service messaging, professional imagery, and intuitive navigation. Implemented smooth animations and responsive design to ensure optimal user experience across all devices.",
      resultsDescription: "Delivered a comprehensive digital platform that positions OM Vinayaga Associates as the leading building solutions provider in Madurai, with clear value propositions and easy customer contact options."
    },
    {
      title: "Copper Bear Electrical",
      description: "Modern e-commerce platform for electrical products featuring scalable architecture, optimized performance, and comprehensive product catalog management.",
      fullDescription: "Tamilnadu's biggest electrical megastore featuring a comprehensive e-commerce platform built with modern technologies. The website offers a complete range of electrical products with professional installation services and consulting. Built for scalability and performance optimization, the platform can handle high traffic volumes while maintaining excellent user experience. Features include advanced product search, professional wire collections, sample ordering, and comprehensive electrical product categories from circuit breakers to installation services.",
      imagePath: "attached_assets/copper-bear-electrical.jpg",
      category: "E-commerce Development",
      technologies: ["React", "TypeScript", "Express.js", "Node.js", "MongoDB", "Performance Optimization"],
      clientName: "Copper Bear Electrical",
      location: "Tamil Nadu",
      featured: true,
      challengeDescription: "Building a high-performance e-commerce platform capable of handling large product catalogs and high traffic volumes while maintaining fast loading times and excellent user experience.",
      solutionDescription: "Developed a scalable e-commerce solution with optimized database queries, efficient caching strategies, and modern frontend technologies. Implemented comprehensive product management, search functionality, and seamless checkout processes.",
      resultsDescription: "Created a robust, future-ready e-commerce platform that effectively serves as Tamil Nadu's premier electrical products destination with excellent performance and user satisfaction."
    },
    {
      title: "Smart Group of Companies",
      description: "Innovative corporate website showcasing sustainable future solutions with modern design principles and comprehensive business portfolio presentation.",
      fullDescription: "A sophisticated corporate website for Smart Group of Companies featuring their vision of 'Innovating for a Sustainable Future.' The platform showcases pioneering solutions that transform industries and empower communities. Built with modern design principles, the website effectively communicates the company's commitment to sustainability and innovation across various business sectors. The site features comprehensive company information, service portfolios, and clear messaging about their impact on sustainable development.",
      imagePath: "attached_assets/smart-group-companies.jpg",
      category: "Corporate Website",
      technologies: ["Modern Web Technologies", "Responsive Design", "Corporate Branding"],
      clientName: "Smart Group of Companies",
      location: "India",
      featured: true,
      link: "https://smart-group-main.vercel.app/",
      challengeDescription: "Creating a professional corporate website that effectively communicates the company's sustainability mission and diverse business portfolio while maintaining modern design standards.",
      solutionDescription: "Designed and developed a clean, modern corporate website with focus on sustainability messaging, clear value propositions, and professional presentation of the company's various business initiatives.",
      resultsDescription: "Delivered a compelling digital presence that positions Smart Group as a leader in sustainable business solutions with clear communication of their innovative approach and industry impact."
    },
    {
      title: "Smart Shine Solar",
      description: "Leading solar solutions website in Madurai featuring modern design principles, energy savings calculators, and comprehensive solar service information.",
      fullDescription: "A modern, conversion-focused website for Smart Shine Solar, Madurai's leading solar solutions provider. The platform effectively communicates their message 'Harness The Power of Sun' and showcases how customers can transform their energy consumption with premium solar solutions. Built with modern design principles, the website features energy savings information (80% average reduction in electricity bills), service calculators, and comprehensive solar product information. The site emphasizes local impact and provides clear pathways for customers to get started with solar energy solutions.",
      imagePath: "attached_assets/smart-shine-solar.jpg",
      category: "Solar Solutions Website",
      technologies: ["Modern Design Principles", "Energy Calculators", "Responsive Design"],
      clientName: "Smart Shine Solar",
      location: "Madurai, Tamil Nadu",
      featured: true,
      link: "https://solar-main-1.vercel.app/",
      challengeDescription: "Creating an engaging solar solutions website that effectively communicates the benefits of solar energy while providing tools for customers to understand potential savings and services.",
      solutionDescription: "Developed a visually appealing website with clear energy savings messaging, interactive elements, and comprehensive service information. Implemented modern design principles with focus on user engagement and conversion optimization.",
      resultsDescription: "Delivered a professional solar solutions platform that effectively positions Smart Shine Solar as the premier choice for solar energy in Madurai with clear value propositions and customer engagement tools."
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
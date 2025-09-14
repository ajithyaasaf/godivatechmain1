#!/usr/bin/env node

/**
 * Simple Project Creator
 * Creates projects directly in Firestore with placeholder images
 * You can update the images later through the app or admin interface
 */

import fs from 'fs';
import path from 'path';
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

// Function to upload image via application API
async function uploadViaAPI(base64Image) {
  try {
    console.log('📤 Uploading image via application API...');
    
    const response = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // We'll need to handle authentication later
      },
      body: JSON.stringify({
        image: base64Image,
        folder: 'godivatech/portfolio'
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Image uploaded successfully via API');
      return result.url;
    } else {
      console.log('⚠️ API upload failed, using placeholder image');
      return 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
    }
  } catch (error) {
    console.log('⚠️ API upload failed, using placeholder image:', error.message);
    return 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
  }
}

// Main function to process all projects
async function addProjectsSimple() {
  console.log('🚀 Starting Simple Project Creation...\n');
  
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
      let imageUrl = 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'; // Placeholder
      
      if (fs.existsSync(fullImagePath)) {
        console.log(`📸 Found image: ${fullImagePath}`);
        
        // Convert image to base64 for potential upload
        const base64Image = convertImageToBase64(fullImagePath);
        if (base64Image) {
          // Try to upload via API, fallback to placeholder if it fails
          imageUrl = await uploadViaAPI(base64Image);
        }
      } else {
        console.log(`⚠️  Image file not found: ${fullImagePath}, using placeholder`);
      }
      
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
  
  console.log(`\n🎉 Creation completed! Successfully added ${createdProjects.length} projects.`);
  
  if (createdProjects.length > 0) {
    console.log('\n📋 Created projects:');
    createdProjects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title} (ID: ${project.id})`);
    });
    
    console.log('\n💡 Next steps:');
    console.log('1. Check your portfolio section to see the new projects');
    console.log('2. If using placeholder images, you can update them via:');
    console.log('   - Admin interface (/admin) -> Projects section');
    console.log('   - Or ask me to help you upload the actual images');
  }
  
  return createdProjects;
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  addProjectsSimple()
    .then((projects) => {
      console.log('\n✨ All done! Your projects are now available in your portfolio.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

export { addProjectsSimple };
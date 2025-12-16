#!/usr/bin/env node

// Server-side script to update ElevateHQ project gallery
// Run this from the server directory context

import { storage } from '../server/storage.js';

async function updateElevateHQGallery() {
  console.log('🚀 Updating ElevateHQ Social Media Campaign gallery...\n');

  try {
    // First, let's find the correct project
    const projects = await storage.getAllProjects();
    const elevateHQProject = projects.find(p => 
      p.title === 'ElevateHQ Social Media Campaign' || 
      p.title.includes('ElevateHQ') && p.title.includes('Social Media')
    );

    if (!elevateHQProject) {
      console.error('❌ Could not find ElevateHQ Social Media Campaign project');
      return;
    }

    console.log(`✅ Found project: ${elevateHQProject.title} (ID: ${elevateHQProject.id})`);
    console.log(`   Current gallery length: ${elevateHQProject.gallery?.length || 0}`);

    // Create the new gallery array with all 6 images
    const newGallery = [
      // Keep the original Cloudinary image first
      "https://res.cloudinary.com/doeodacsg/image/upload/v1757918391/godivatech/portfolio/qohmcoufdmjovg0ngtuu.jpg",
      // Add the local images
      "/portfolio/elevatehq-social/sm-poster-2.jpg",
      "/portfolio/elevatehq-social/sm-poster-3.jpg", 
      "/portfolio/elevatehq-social/sm-poster-4.jpg",
      "/portfolio/elevatehq-social/sm-poster-5.jpg",
      "/portfolio/elevatehq-social/sm-poster-6.jpg"
    ];

    console.log('\n📊 New gallery will contain:');
    newGallery.forEach((url, index) => {
      console.log(`  ${index + 1}. ${url}`);
    });

    // Update the project
    const updateData = {
      ...elevateHQProject,
      gallery: newGallery,
      image: newGallery[0], // Keep first image as main
      updatedAt: new Date()
    };

    // Remove Firebase-specific fields that shouldn't be updated
    delete updateData.docId;
    delete updateData.firebaseId;
    delete updateData.createdAt;

    console.log('\n📝 Updating project in database...');
    const success = await storage.updateProject(elevateHQProject.id, updateData);

    if (success) {
      console.log('✅ Successfully updated ElevateHQ Social Media Campaign!');
      console.log('\n🎉 Gallery features now available:');
      console.log('   • 6 poster variations in one project card');
      console.log('   • Carousel navigation with previous/next arrows'); 
      console.log('   • Dot indicators showing current image (1/6, 2/6, etc.)');
      console.log('   • "6 design variations" text display');
      console.log('   • Image counter badge showing total images');
      console.log('\n🔄 Refresh your browser to see the updated portfolio!');
    } else {
      console.error('❌ Failed to update project');
    }

  } catch (error) {
    console.error('❌ Error updating project:', error.message);
  }
}

// Run the update
updateElevateHQGallery().catch(console.error);
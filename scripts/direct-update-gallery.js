#!/usr/bin/env node

// Direct Firestore update for ElevateHQ project gallery

async function updateProjectDirectly() {
  console.log('🚀 Direct Firestore update for ElevateHQ Social Media Campaign...\n');

  try {
    // Make a PUT request to the admin API endpoint
    // First get all projects to find the correct ID
    const projectsResponse = await fetch('http://localhost:5000/api/projects');
    const projects = await projectsResponse.json();
    
    const elevateHQProject = projects.find(p => 
      p.title === 'ElevateHQ Social Media Campaign' || 
      (p.title.includes('ElevateHQ') && p.title.includes('Social Media'))
    );

    if (!elevateHQProject) {
      console.error('❌ Could not find ElevateHQ Social Media Campaign project');
      return;
    }

    console.log(`✅ Found project: ${elevateHQProject.title}`);
    console.log(`   Project ID: ${elevateHQProject.id}`);
    console.log(`   Current gallery length: ${elevateHQProject.gallery?.length || 0}\n`);

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

    console.log('📊 New gallery will contain:');
    newGallery.forEach((url, index) => {
      console.log(`  ${index + 1}. ${url}`);
    });

    // Prepare update data
    const updateData = {
      gallery: newGallery,
      image: newGallery[0] // Keep first image as main
    };

    console.log('\n📝 Project update prepared successfully!');
    console.log('   ✓ Gallery array with 6 images');
    console.log('   ✓ Main image preserved');
    console.log('\n🔧 To complete the update, we need to apply these changes to the database.');
    console.log('   The gallery URLs are ready and the project has been identified.');
    
    // Return the data for manual application
    return {
      projectId: elevateHQProject.id,
      projectData: elevateHQProject,
      updateData: updateData,
      newGallery: newGallery
    };

  } catch (error) {
    console.error('❌ Error preparing update:', error.message);
    return null;
  }
}

// Run the preparation
updateProjectDirectly()
  .then(result => {
    if (result) {
      console.log('\n🎯 Update preparation completed!');
      console.log('✨ When applied, the portfolio will show:');
      console.log('   • All 6 poster variations in one carousel');
      console.log('   • Previous/next navigation arrows');
      console.log('   • Dot indicators (1/6, 2/6, etc.)');
      console.log('   • "6 design variations" label');
      console.log('   • Gallery count badge');
    }
  })
  .catch(console.error);
#!/usr/bin/env node

// Simple script to update ElevateHQ Social Media Campaign with local gallery images

async function updateProjectGallery() {
  console.log('🚀 Updating ElevateHQ Social Media Campaign with gallery images...\n');
  
  // Create gallery array with all 6 poster variations
  const galleryUrls = [
    // Original image (keep as first)
    "https://res.cloudinary.com/doeodacsg/image/upload/v1757918391/godivatech/portfolio/qohmcoufdmjovg0ngtuu.jpg",
    // Local images we just copied
    "/portfolio/elevatehq-social/sm-poster-2.jpg",
    "/portfolio/elevatehq-social/sm-poster-3.jpg", 
    "/portfolio/elevatehq-social/sm-poster-4.jpg",
    "/portfolio/elevatehq-social/sm-poster-5.jpg",
    "/portfolio/elevatehq-social/sm-poster-6.jpg"
  ];
  
  console.log('📊 Gallery will include:');
  galleryUrls.forEach((url, index) => {
    console.log(`  ${index + 1}. ${url}`);
  });
  
  // Project update data
  const updateData = {
    gallery: galleryUrls,
    image: galleryUrls[0], // Keep first image as main image
    updatedAt: new Date().toISOString()
  };
  
  console.log('\n📝 Project update data prepared:');
  console.log('  - Gallery array with 6 images');
  console.log('  - Main image unchanged');
  console.log('  - Updated timestamp');
  
  console.log('\n✅ Gallery URLs are ready for manual update or API call');
  console.log('   The project gallery array should be updated with these URLs');
  
  return { galleryUrls, updateData };
}

// Run the script
updateProjectGallery()
  .then(result => {
    console.log('\n🎉 Gallery preparation completed!');
    console.log('✨ When applied, your portfolio will show:');
    console.log('   • All 6 poster variations in one project card');
    console.log('   • Carousel navigation with arrows');
    console.log('   • Dot indicators (1/6, 2/6, etc.)');
    console.log('   • "6 design variations" text');
    console.log('   • Image counter badge');
  })
  .catch(console.error);
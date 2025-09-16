#!/usr/bin/env node

// Script to add logo projects directly to Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'godivatech-portfolio',
  // Add other config if needed
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Logo projects data with proper image paths
const logoProjects = [
  {
    title: "Kanik's Academy Logo",
    description: "Professional logo design for Kanik's Academy educational institution featuring a modern book and person icon design with blue color scheme representing knowledge and growth.",
    category: "Logo",
    image: "/attached_assets/kaniks-academy.jpg",
    technologies: ["Logo Design", "Brand Identity", "Educational Branding"]
  },
  {
    title: "Living Age Logo",
    description: "Elegant logo design for Living Age fashion brand with sophisticated red and beige color variations, emphasizing style and timeless appeal for all age groups.",
    category: "Logo",
    image: "/attached_assets/living-age.jpg",
    technologies: ["Fashion Branding", "Logo Design", "Brand Identity"]
  },
  {
    title: "Whisky Investments Logo",
    description: "Professional logo design for Whisky Investments featuring dynamic arrow graphics and bold typography, representing growth and investment opportunities in the whisky market.",
    category: "Logo",
    image: "/attached_assets/whisky-investments.png",
    technologies: ["Investment Branding", "Logo Design", "Financial Identity"]
  },
  {
    title: "Sri Mariyamma Group Logo",
    description: "Corporate logo design for Sri Mariyamma Group featuring clean blue typography and architectural elements, representing trust and professionalism in business operations.",
    category: "Logo",
    image: "/attached_assets/sri-mariyamma-group.jpg",
    technologies: ["Corporate Branding", "Logo Design", "Business Identity"]
  },
  {
    title: "The Christian Network Logo",
    description: "Spiritual logo design for The Christian Network featuring dynamic cross and wave elements with blue color scheme, representing faith, community, and divine connection.",
    category: "Logo",
    image: "/attached_assets/the-christian-network.jpg",
    technologies: ["Religious Branding", "Logo Design", "Community Identity"]
  },
  {
    title: "NBM Logo",
    description: "Modern logo design for NBM featuring flame and cross symbolism with vibrant orange and gray colors, representing spiritual guidance and transformation.",
    category: "Logo",
    image: "/attached_assets/nbm.jpg",
    technologies: ["Religious Branding", "Logo Design", "Spiritual Identity"]
  },
  {
    title: "Dermi Logo",
    description: "Medical logo design for Dermi featuring geometric shapes in red and blue, representing precision and trust in dermatological healthcare services.",
    category: "Logo",
    image: "/attached_assets/dermi.png",
    technologies: ["Medical Branding", "Logo Design", "Healthcare Identity"]
  },
  {
    title: "RSS Digital Innovation Logo",
    description: "Tech-forward logo design for RSS Digital Innovation featuring gradient abstract shapes, representing creativity and innovation in digital solutions.",
    category: "Logo",
    image: "/attached_assets/rss-digital-innovation.png",
    technologies: ["Tech Branding", "Logo Design", "Digital Identity"]
  },
  {
    title: "AR Dream Construction Logo",
    description: "Construction company logo for AR Dream Construction featuring architectural elements and vibrant orange colors, representing building dreams and professional construction services.",
    category: "Logo",
    image: "/attached_assets/ar-dream-construction.jpg",
    technologies: ["Construction Branding", "Logo Design", "Industrial Identity"]
  },
  {
    title: "True Waves Group Logo",
    description: "Corporate logo for True Waves Group featuring a powerful lion head with triangular elements and blue color scheme, representing strength, vision, and leadership.",
    category: "Logo",
    image: "/attached_assets/true-waves-group.jpg",
    technologies: ["Corporate Branding", "Logo Design", "Leadership Identity"]
  },
  {
    title: "Stock Trade Theory Logo",
    description: "Financial education logo for Stock Trade Theory featuring dynamic arrow and lightning bolt elements with green and blue colors, representing learning and market growth.",
    category: "Logo",
    image: "/attached_assets/stock-trade-theory.jpg",
    technologies: ["Financial Branding", "Logo Design", "Educational Identity"]
  },
  {
    title: "Thogai Trendz Logo",
    description: "Fashion brand logo for Thogai Trendz featuring elegant peacock feather design with vibrant blues and greens, representing style, beauty, and fashion trends.",
    category: "Logo",
    image: "/attached_assets/thogai-trendz.jpg",
    technologies: ["Fashion Branding", "Logo Design", "Style Identity"]
  },
  {
    title: "Inbaa's Logo",
    description: "Personal brand logo for Inbaa's featuring modern blue typography with dynamic design elements, representing professionalism and personal identity.",
    category: "Logo",
    image: "/attached_assets/inbaa.png",
    technologies: ["Personal Branding", "Logo Design", "Individual Identity"]
  },
  {
    title: "King's Kids Home Logo",
    description: "Charitable organization logo for King's Kids Home featuring a tree with hands and children silhouettes, representing care, growth, and community support for children.",
    category: "Logo",
    image: "/attached_assets/kings-kids-home.jpg",
    technologies: ["Non-profit Branding", "Logo Design", "Charitable Identity"]
  },
  {
    title: "Vedhaa Wellness Logo",
    description: "Wellness center logo for Vedhaa Wellness featuring meditation pose within lotus petals and caring hands, representing holistic health and spiritual well-being.",
    category: "Logo",
    image: "/attached_assets/vedhaa-wellness.jpg",
    technologies: ["Wellness Branding", "Logo Design", "Health Identity"]
  },
  {
    title: "Srithar Associates Logo",
    description: "Professional services logo for Srithar Krishna Associates featuring clean blue typography with modern design elements, representing trust and professional expertise.",
    category: "Logo",
    image: "/attached_assets/srithar-associates.jpg",
    technologies: ["Professional Branding", "Logo Design", "Service Identity"]
  },
  {
    title: "Digital Virally Logo",
    description: "Digital marketing agency logo for Digital Virally featuring modern typography with blue accent, representing digital marketing expertise and viral content strategies.",
    category: "Logo",
    image: "/attached_assets/digital-virally.jpg",
    technologies: ["Digital Marketing Branding", "Logo Design", "Agency Identity"]
  },
  {
    title: "Ambika's Blue Logo",
    description: "Alternative blue version of Ambika's logo featuring clean, modern typography with professional blue color scheme for corporate applications and brand versatility.",
    category: "Logo",
    image: "/attached_assets/ambikas-blue.png",
    technologies: ["Brand Variation", "Logo Design", "Corporate Identity"]
  }
];

async function addProject(project) {
  try {
    console.log(`Adding project: ${project.title}`);
    
    const docRef = await addDoc(collection(db, 'projects'), project);
    console.log(`✅ Successfully added: ${project.title} with ID: ${docRef.id}`);
    return docRef;
  } catch (error) {
    console.error(`❌ Error adding ${project.title}:`, error);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting to add logo projects to Firestore...\n');
  
  let successCount = 0;
  let failureCount = 0;
  
  for (const project of logoProjects) {
    const result = await addProject(project);
    if (result) {
      successCount++;
    } else {
      failureCount++;
    }
    
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('\n📊 Summary:');
  console.log(`✅ Successfully added: ${successCount} projects`);
  console.log(`❌ Failed to add: ${failureCount} projects`);
  console.log(`📝 Total projects: ${logoProjects.length}`);
  
  process.exit(0);
}

// Run the script
main().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});
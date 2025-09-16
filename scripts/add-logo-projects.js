#!/usr/bin/env node

// Script to add logo projects to the portfolio
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000';

// Logo projects data
const logoProjects = [
  {
    title: "Kanik's Academy Logo",
    description: "Professional logo design for Kanik's Academy educational institution featuring a modern book and person icon design with blue color scheme representing knowledge and growth.",
    category: "Logo",
    image: "/client/src/assets/logos/kaniks-academy.jpg",
    technologies: ["Logo Design", "Brand Identity", "Educational Branding"],
    clientName: "Kanik's Academy"
  },
  {
    title: "Living Age Logo",
    description: "Elegant logo design for Living Age fashion brand with sophisticated red and beige color variations, emphasizing style and timeless appeal for all age groups.",
    category: "Logo",
    image: "/client/src/assets/logos/living-age.jpg",
    technologies: ["Fashion Branding", "Logo Design", "Brand Identity"],
    clientName: "Living Age"
  },
  {
    title: "Whisky Investments Logo",
    description: "Professional logo design for Whisky Investments featuring dynamic arrow graphics and bold typography, representing growth and investment opportunities in the whisky market.",
    category: "Logo",
    image: "/client/src/assets/logos/whisky-investments.png",
    technologies: ["Investment Branding", "Logo Design", "Financial Identity"],
    clientName: "Whisky Investments"
  },
  {
    title: "Sri Mariyamma Group Logo",
    description: "Corporate logo design for Sri Mariyamma Group featuring clean blue typography and architectural elements, representing trust and professionalism in business operations.",
    category: "Logo",
    image: "/client/src/assets/logos/sri-mariyamma-group.jpg",
    technologies: ["Corporate Branding", "Logo Design", "Business Identity"],
    clientName: "Sri Mariyamma Group"
  },
  {
    title: "The Christian Network Logo",
    description: "Spiritual logo design for The Christian Network featuring dynamic cross and wave elements with blue color scheme, representing faith, community, and divine connection.",
    category: "Logo",
    image: "/client/src/assets/logos/the-christian-network.jpg",
    technologies: ["Religious Branding", "Logo Design", "Community Identity"],
    clientName: "The Christian Network"
  },
  {
    title: "NBM Logo",
    description: "Modern logo design for NBM featuring flame and cross symbolism with vibrant orange and gray colors, representing spiritual guidance and transformation.",
    category: "Logo",
    image: "/client/src/assets/logos/nbm.jpg",
    technologies: ["Religious Branding", "Logo Design", "Spiritual Identity"],
    clientName: "NBM"
  },
  {
    title: "Dermi Logo",
    description: "Medical logo design for Dermi featuring geometric shapes in red and blue, representing precision and trust in dermatological healthcare services.",
    category: "Logo",
    image: "/client/src/assets/logos/dermi.png",
    technologies: ["Medical Branding", "Logo Design", "Healthcare Identity"],
    clientName: "Dermi"
  },
  {
    title: "RSS Digital Innovation Logo",
    description: "Tech-forward logo design for RSS Digital Innovation featuring gradient abstract shapes, representing creativity and innovation in digital solutions.",
    category: "Logo",
    image: "/client/src/assets/logos/rss-digital-innovation.png",
    technologies: ["Tech Branding", "Logo Design", "Digital Identity"],
    clientName: "RSS Digital Innovation"
  },
  {
    title: "AR Dream Construction Logo",
    description: "Construction company logo for AR Dream Construction featuring architectural elements and vibrant orange colors, representing building dreams and professional construction services.",
    category: "Logo",
    image: "/client/src/assets/logos/ar-dream-construction.jpg",
    technologies: ["Construction Branding", "Logo Design", "Industrial Identity"],
    clientName: "AR Dream Construction"
  },
  {
    title: "True Waves Group Logo",
    description: "Corporate logo for True Waves Group featuring a powerful lion head with triangular elements and blue color scheme, representing strength, vision, and leadership.",
    category: "Logo",
    image: "/client/src/assets/logos/true-waves-group.jpg",
    technologies: ["Corporate Branding", "Logo Design", "Leadership Identity"],
    clientName: "True Waves Group"
  },
  {
    title: "Stock Trade Theory Logo",
    description: "Financial education logo for Stock Trade Theory featuring dynamic arrow and lightning bolt elements with green and blue colors, representing learning and market growth.",
    category: "Logo",
    image: "/client/src/assets/logos/stock-trade-theory.jpg",
    technologies: ["Financial Branding", "Logo Design", "Educational Identity"],
    clientName: "Stock Trade Theory"
  },
  {
    title: "Thogai Trendz Logo",
    description: "Fashion brand logo for Thogai Trendz featuring elegant peacock feather design with vibrant blues and greens, representing style, beauty, and fashion trends.",
    category: "Logo",
    image: "/client/src/assets/logos/thogai-trendz.jpg",
    technologies: ["Fashion Branding", "Logo Design", "Style Identity"],
    clientName: "Thogai Trendz"
  },
  {
    title: "Inbaa's Logo",
    description: "Personal brand logo for Inbaa's featuring modern blue typography with dynamic design elements, representing professionalism and personal identity.",
    category: "Logo",
    image: "/client/src/assets/logos/inbaa.png",
    technologies: ["Personal Branding", "Logo Design", "Individual Identity"],
    clientName: "Inbaa's"
  },
  {
    title: "King's Kids Home Logo",
    description: "Charitable organization logo for King's Kids Home featuring a tree with hands and children silhouettes, representing care, growth, and community support for children.",
    category: "Logo",
    image: "/client/src/assets/logos/kings-kids-home.jpg",
    technologies: ["Non-profit Branding", "Logo Design", "Charitable Identity"],
    clientName: "King's Kids Home"
  },
  {
    title: "Vedhaa Wellness Logo",
    description: "Wellness center logo for Vedhaa Wellness featuring meditation pose within lotus petals and caring hands, representing holistic health and spiritual well-being.",
    category: "Logo",
    image: "/client/src/assets/logos/vedhaa-wellness.jpg",
    technologies: ["Wellness Branding", "Logo Design", "Health Identity"],
    clientName: "Vedhaa Wellness"
  },
  {
    title: "Srithar Associates Logo",
    description: "Professional services logo for Srithar Krishna Associates featuring clean blue typography with modern design elements, representing trust and professional expertise.",
    category: "Logo",
    image: "/client/src/assets/logos/srithar-associates.jpg",
    technologies: ["Professional Branding", "Logo Design", "Service Identity"],
    clientName: "Srithar Krishna Associates"
  },
  {
    title: "Digital Virally Logo",
    description: "Digital marketing agency logo for Digital Virally featuring modern typography with blue accent, representing digital marketing expertise and viral content strategies.",
    category: "Logo",
    image: "/client/src/assets/logos/digital-virally.jpg",
    technologies: ["Digital Marketing Branding", "Logo Design", "Agency Identity"],
    clientName: "Digital Virally"
  },
  {
    title: "Ambika's Blue Logo",
    description: "Alternative blue version of Ambika's logo featuring clean, modern typography with professional blue color scheme for corporate applications and brand versatility.",
    category: "Logo",
    image: "/client/src/assets/logos/ambikas-blue.png",
    technologies: ["Brand Variation", "Logo Design", "Corporate Identity"],
    clientName: "Ambika's"
  }
];

async function addProject(project) {
  try {
    console.log(`Adding project: ${project.title}`);
    
    const response = await fetch(`${API_BASE}/api/admin/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
      credentials: 'include'
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Successfully added: ${project.title}`);
      return result;
    } else {
      const error = await response.text();
      console.error(`❌ Failed to add ${project.title}:`, error);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error adding ${project.title}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting to add logo projects...\n');
  
  let successCount = 0;
  let failureCount = 0;
  
  for (const project of logoProjects) {
    const result = await addProject(project);
    if (result) {
      successCount++;
    } else {
      failureCount++;
    }
    
    // Wait a bit between requests to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n📊 Summary:');
  console.log(`✅ Successfully added: ${successCount} projects`);
  console.log(`❌ Failed to add: ${failureCount} projects`);
  console.log(`📝 Total projects: ${logoProjects.length}`);
}

// Run the script
main().catch(console.error);
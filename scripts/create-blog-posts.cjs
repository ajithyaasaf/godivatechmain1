const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDoc, serverTimestamp } = require('firebase/firestore');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBPE5-p7EvCXhcfNlpFywIIXCEhKYrPxaI",
  authDomain: "godivatech-website.firebaseapp.com",
  projectId: "godivatech-website",
  storageBucket: "godivatech-website.appspot.com",
  messagingSenderId: "1067027851152",
  appId: "1:1067027851152:web:eb4e15bf2b1a7e7b41ab43",
  measurementId: "G-GZHR30C7C3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addBlogPosts() {
  try {
    console.log('Adding SEO-optimized blog posts...');

    // Blog Post 1: Web Development Company Guide
    const blogPost1 = {
      title: "Complete Guide to Choosing the Best Web Development Company in Madurai 2025",
      slug: "best-web-development-company-madurai-guide-2025",
      excerpt: "Looking for a reliable web development company in Madurai? Our comprehensive guide covers everything you need to know to make the right choice for your business in 2025.",
      content: "# Complete Guide to Choosing the Best Web Development Company in Madurai 2025\\n\\nChoosing the right web development company in Madurai can make or break your digital presence. With over 200+ web development agencies in Madurai competing for your business, making the right choice requires careful consideration.\\n\\n## Why Your Choice Matters\\n\\nIn today's digital-first world, your website is often the first interaction potential customers have with your business. A well-crafted website can:\\n\\n- Increase conversion rates by up to 200%\\n- Improve customer trust and credibility\\n- Enhance your search engine rankings\\n- Provide a competitive advantage in the Madurai market\\n\\n## Key Factors to Consider\\n\\n### 1. Technical Expertise and Experience\\n\\nLook for companies with proven experience in:\\n- Modern Frameworks: React, Angular, Vue.js\\n- Backend Technologies: Node.js, Python, PHP\\n- Database Management: MySQL, MongoDB, PostgreSQL\\n- Cloud Platforms: AWS, Google Cloud, Azure\\n- Mobile Responsiveness\\n\\n### 2. Portfolio and Case Studies\\n\\nA reputable Madurai web development company should showcase:\\n- Diverse industry experience\\n- Local business success stories\\n- Before and after performance metrics\\n- Client testimonials and reviews\\n\\n### 3. Understanding of Local Market\\n\\nChoose a company that understands:\\n- Madurai's business landscape\\n- Local consumer behavior\\n- Regional language requirements (Tamil/English)\\n- Local competition analysis\\n\\n## Cost Considerations\\n\\n### Typical Price Ranges:\\n- Basic Website: ₹15,000 - ₹50,000\\n- Business Website: ₹50,000 - ₹1,50,000\\n- E-commerce Platform: ₹1,00,000 - ₹5,00,000\\n- Custom Web Application: ₹2,00,000 - ₹10,00,000+\\n\\n## Questions to Ask Potential Companies\\n\\n1. What technologies do you specialize in?\\n2. How do you ensure website security?\\n3. What is your approach to mobile optimization?\\n4. Can you provide references from Madurai-based clients?\\n5. What post-launch support do you offer?\\n\\n## Red Flags to Avoid\\n\\n- Unrealistic promises\\n- Lack of portfolio\\n- Poor communication\\n- Outdated technologies\\n- Extremely low prices\\n\\n## Conclusion\\n\\nChoosing the best web development company in Madurai requires thorough research and careful evaluation. Focus on finding a partner who understands your business goals and the local market dynamics.\\n\\n**Ready to start your web development project?** Contact GodivaTech today for a free consultation. Our team has helped over 200+ Madurai businesses establish their digital presence successfully.",
      published: true,
      authorName: "GodivaTech Team",
      authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
      coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      publishedAt: serverTimestamp(),
      categoryId: 5 // Web Development category
    };

    // Blog Post 2: SEO for Madurai Businesses
    const blogPost2 = {
      title: "SEO for Madurai Businesses: 10 Local SEO Strategies to Dominate Search Results",
      slug: "local-seo-strategies-madurai-businesses-2025",
      excerpt: "Discover 10 proven local SEO strategies specifically designed for Madurai businesses to rank higher in Google searches and attract more local customers in 2025.",
      content: "# SEO for Madurai Businesses: 10 Local SEO Strategies to Dominate Search Results\\n\\nAs a business owner in Madurai, you're competing not just locally but globally for online visibility. Local SEO is your secret weapon to stand out in the Temple City and attract customers who are actively searching for your services.\\n\\n## Why Local SEO Matters for Madurai Businesses\\n\\nLocal SEO statistics show incredible opportunities:\\n- 46% of all Google searches are looking for local information\\n- 76% of people who search for something nearby visit a business within 24 hours\\n- 78% of local mobile searches result in offline purchases\\n\\n## Strategy 1: Optimize Your Google My Business Profile\\n\\nYour Google My Business (GMB) profile is your digital storefront:\\n\\n### Complete Every Section:\\n- Business Name: Use your exact business name\\n- Address: Ensure consistency across all platforms\\n- Phone Number: Use a local Madurai number\\n- Business Hours: Keep updated, including holidays\\n- Website URL: Link to optimized landing pages\\n\\n### Madurai-Specific Tips:\\n- Add landmarks in descriptions: 'Near Meenakshi Temple'\\n- Include Tamil keywords naturally\\n- Use local area names: Avaniyapuram, Pasumalai, Vilangudi\\n\\n## Strategy 2: Target Madurai-Specific Keywords\\n\\n### Primary Keywords:\\n- '[Your Service] in Madurai'\\n- '[Your Service] near Meenakshi Temple'\\n- 'Best [Your Service] Madurai'\\n- 'Madurai [Your Industry]'\\n\\n## Strategy 3: Create Location-Specific Content\\n\\n### Content Ideas:\\n- Local event coverage (Meenakshi Tirukalyanam, Chithirai Festival)\\n- Area-specific business guides\\n- Customer success stories from Madurai\\n\\n## Strategy 4: Build Local Citations\\n\\n### Essential Directories:\\n- JustDial Madurai\\n- Sulekha Madurai\\n- India Mart\\n- Yellow Pages India\\n- Local Chamber of Commerce\\n\\n## Strategy 5: Leverage Customer Reviews\\n\\n### Review Platform Priorities:\\n1. Google My Business (highest impact)\\n2. Facebook (social proof)\\n3. JustDial (local search)\\n4. Industry-specific platforms\\n\\n## Strategy 6: Optimize for Mobile and Voice Search\\n\\n### Mobile Essentials:\\n- Page loading speed under 3 seconds\\n- Responsive design\\n- Easy-to-tap phone numbers\\n- Simple navigation\\n\\n## Strategy 7: Create Hyper-Local Landing Pages\\n\\nCreate dedicated pages for:\\n- Madurai Central area services\\n- Anna Nagar business solutions\\n- Avaniyapuram service coverage\\n- Pasumalai area specialization\\n\\n## Strategy 8: Implement Technical SEO\\n\\n### Technical Checklist:\\n- Schema markup for local business\\n- XML sitemap with local pages\\n- SSL certificate\\n- Page speed optimization\\n- Image alt tags with local keywords\\n\\n## Strategy 9: Build Local Backlinks\\n\\n### Link Building Opportunities:\\n- Sponsor local events\\n- Partner with Madurai businesses\\n- Guest post on local blogs\\n- Join business associations\\n\\n## Strategy 10: Track and Measure Performance\\n\\n### Key Metrics:\\n- Local search rankings\\n- Google My Business insights\\n- Website traffic from Madurai\\n- Phone calls from search\\n- Direction requests\\n\\n## Common Mistakes to Avoid\\n\\n1. Inconsistent NAP information\\n2. Neglecting reviews\\n3. Duplicate listings\\n4. Generic content\\n5. Ignoring mobile users\\n\\n## Conclusion\\n\\nLocal SEO success in Madurai requires consistent effort and strategic implementation. Start with Google My Business optimization, create local content, and build citations systematically.\\n\\n**Ready to dominate Madurai's local search results?** Our team has helped over 150+ Madurai businesses achieve first-page rankings. Contact GodivaTech today for a free local SEO audit.",
      published: true,
      authorName: "GodivaTech SEO Team",
      authorImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
      coverImage: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=1200&q=80",
      publishedAt: serverTimestamp(),
      categoryId: 2 // SEO category
    };

    // Add blog posts to Firestore with unique IDs
    const blogPost1Id = '10';
    const blogPost2Id = '11';
    
    await setDoc(doc(db, 'blog_posts', blogPost1Id), {
      ...blogPost1,
      id: parseInt(blogPost1Id)
    });

    await setDoc(doc(db, 'blog_posts', blogPost2Id), {
      ...blogPost2,
      id: parseInt(blogPost2Id)
    });

    // Update counter
    await setDoc(doc(db, 'counters', 'blog_posts'), { count: 11 });

    console.log('✅ Successfully added 2 SEO-optimized blog posts:');
    console.log(`1. ${blogPost1.title} (ID: ${blogPost1Id})`);
    console.log(`2. ${blogPost2.title} (ID: ${blogPost2Id})`);

  } catch (error) {
    console.error('❌ Error adding blog posts:', error);
  }
}

// Run the script
addBlogPosts().then(() => {
  console.log('🎉 Blog post creation completed successfully!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
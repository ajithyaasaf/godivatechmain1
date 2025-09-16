const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, serverTimestamp, collection, getDocs } = require('firebase/firestore');

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

// Helper function to get next ID
async function getNextId(counterName) {
  const counterRef = doc(db, 'counters', counterName);
  const counterSnap = await counterRef.get ? await counterRef.get() : await require('firebase/firestore').getDoc(counterRef);
  
  let nextId = 1;
  if (counterSnap.exists()) {
    nextId = (counterSnap.data()?.count || 0) + 1;
  }
  
  // Update the counter
  await setDoc(counterRef, { count: nextId });
  
  return nextId;
}

async function addBlogPosts() {
  try {
    console.log('Adding SEO-optimized blog posts...');

    // Blog Post 1: Web Development Company Guide
    const blogPost1 = {
      title: "Complete Guide to Choosing the Best Web Development Company in Madurai 2025",
      slug: "best-web-development-company-madurai-guide-2025",
      excerpt: "Looking for a reliable web development company in Madurai? Our comprehensive guide covers everything you need to know to make the right choice for your business in 2025.",
      content: `# Complete Guide to Choosing the Best Web Development Company in Madurai 2025

Choosing the right web development company in Madurai can make or break your digital presence. With over 200+ web development agencies in Madurai competing for your business, making the right choice requires careful consideration. This comprehensive guide will help you navigate the process and select a partner that aligns with your business goals.

## Why Your Choice of Web Development Company Matters

In today's digital-first world, your website is often the first interaction potential customers have with your business. A poorly designed website can cost you valuable leads and damage your brand reputation. Conversely, a well-crafted website can:

- Increase conversion rates by up to 200%
- Improve customer trust and credibility
- Enhance your search engine rankings
- Provide a competitive advantage in the Madurai market

## Key Factors to Consider When Choosing a Web Development Company in Madurai

### 1. Technical Expertise and Experience

Look for companies with proven experience in:
- **Modern Frameworks**: React, Angular, Vue.js for frontend development
- **Backend Technologies**: Node.js, Python, PHP, or .NET
- **Database Management**: MySQL, MongoDB, PostgreSQL
- **Cloud Platforms**: AWS, Google Cloud, Azure
- **Mobile Responsiveness**: Ensure your site works perfectly on all devices

### 2. Portfolio and Case Studies

A reputable Madurai web development company should showcase:
- Diverse industry experience
- Local business success stories
- Before and after performance metrics
- Client testimonials and reviews
- Awards and certifications

### 3. Understanding of Local Market

Choose a company that understands:
- Madurai's business landscape
- Local consumer behavior
- Regional language requirements (Tamil/English)
- Local competition analysis
- Cultural sensitivities in design

### 4. SEO and Digital Marketing Integration

Your web development partner should offer:
- Built-in SEO optimization
- Google Analytics integration
- Social media integration
- Local SEO strategies for Madurai businesses
- Conversion tracking setup

## Top Questions to Ask Potential Web Development Companies

### Technical Questions:
1. What technologies do you specialize in?
2. How do you ensure website security?
3. What is your approach to mobile optimization?
4. How do you handle website maintenance and updates?
5. What is your testing process before launch?

### Business Questions:
1. Can you provide references from Madurai-based clients?
2. What is your typical project timeline?
3. How do you handle project communication?
4. What post-launch support do you offer?
5. What are your payment terms?

## Red Flags to Avoid

### Warning Signs of Unreliable Companies:
- **Unrealistic Promises**: Avoid companies promising instant results
- **Lack of Portfolio**: No previous work or case studies to show
- **Poor Communication**: Slow response times or unclear explanations
- **Outdated Technologies**: Still using Flash or outdated frameworks
- **No Contract**: Refusing to provide written agreements
- **Extremely Low Prices**: Quality work requires fair compensation

## Cost Considerations for Web Development in Madurai

### Typical Price Ranges:
- **Basic Website**: ₹15,000 - ₹50,000
- **Business Website**: ₹50,000 - ₹1,50,000
- **E-commerce Platform**: ₹1,00,000 - ₹5,00,000
- **Custom Web Application**: ₹2,00,000 - ₹10,00,000+

### Factors Affecting Cost:
- Complexity of design and functionality
- Number of pages and features
- Integration requirements
- Timeline constraints
- Ongoing maintenance needs

## The Development Process: What to Expect

### Phase 1: Planning and Strategy (1-2 weeks)
- Requirements gathering
- Market research
- Competitor analysis
- Project timeline creation

### Phase 2: Design and Prototyping (2-3 weeks)
- Wireframe creation
- UI/UX design
- Client feedback and revisions
- Final design approval

### Phase 3: Development (4-8 weeks)
- Frontend development
- Backend development
- Database setup
- Third-party integrations

### Phase 4: Testing and Launch (1-2 weeks)
- Quality assurance testing
- Performance optimization
- SEO setup
- Go-live preparation

## Local Success Stories: Madurai Businesses That Got It Right

### Case Study 1: Local Restaurant Chain
**Challenge**: Outdated website with poor mobile experience
**Solution**: Responsive design with online ordering system
**Results**: 300% increase in online orders within 6 months

### Case Study 2: Manufacturing Company
**Challenge**: No digital presence for B2B clients
**Solution**: Professional corporate website with lead generation
**Results**: 150% increase in qualified leads

## Maintenance and Long-term Partnership

### Essential Maintenance Services:
- Regular security updates
- Performance monitoring
- Content updates
- Backup management
- Technical support

### Building a Long-term Relationship:
- Choose partners who understand your growth plans
- Ensure scalability of solutions
- Establish clear communication channels
- Plan for future enhancements

## Making Your Final Decision

### Evaluation Checklist:
- [ ] Technical capabilities match your requirements
- [ ] Portfolio demonstrates relevant experience
- [ ] References speak positively about their work
- [ ] Communication style aligns with your preferences
- [ ] Pricing fits within your budget
- [ ] Timeline meets your launch requirements
- [ ] Post-launch support is comprehensive

## Conclusion

Choosing the best web development company in Madurai requires thorough research and careful evaluation. Focus on finding a partner who not only has the technical skills but also understands your business goals and the local market dynamics.

Remember, the cheapest option is rarely the best value. Invest in a company that can deliver quality work, provide ongoing support, and help your business grow in the competitive Madurai market.

**Ready to start your web development project?** Contact us today for a free consultation and quote. Our team of experienced developers has helped over 200+ Madurai businesses establish their digital presence successfully.

---

*At GodivaTech, we specialize in creating custom web solutions for Madurai businesses. With over 5 years of experience in the local market, we understand what it takes to build websites that drive results. Contact us today to discuss your project requirements.*`,
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
      content: `# SEO for Madurai Businesses: 10 Local SEO Strategies to Dominate Search Results

As a business owner in Madurai, you're competing not just locally but globally for online visibility. Local SEO is your secret weapon to stand out in the Temple City and attract customers who are actively searching for your services. This comprehensive guide reveals 10 proven strategies that Madurai businesses are using to dominate local search results.

## Why Local SEO Matters for Madurai Businesses

Local SEO isn't just about appearing in search results – it's about being found by the right customers at the right time. Consider these statistics:

- **46% of all Google searches** are looking for local information
- **76% of people** who search for something nearby visit a business within 24 hours
- **78% of local mobile searches** result in offline purchases
- **Businesses with optimized Google My Business** are 70% more likely to attract location visits

For Madurai businesses, this means enormous opportunity to capture local market share.

## Strategy 1: Optimize Your Google My Business Profile

Your Google My Business (GMB) profile is your digital storefront. Here's how to maximize it:

### Complete Every Section:
- **Business Name**: Use your exact business name as it appears on your storefront
- **Address**: Ensure consistency across all online platforms
- **Phone Number**: Use a local Madurai number when possible
- **Business Hours**: Keep these updated, including holiday hours
- **Website URL**: Link to your optimized landing page

### Madurai-Specific Tips:
- Add landmarks in your business description: "Near Meenakshi Temple"
- Include Tamil keywords naturally: "Madurai வணிகம்" (Madurai Business)
- Use local area names: Avaniyapuram, Pasumalai, Vilangudi, etc.

### Regular Updates:
- Post weekly updates about your business
- Share local event participation
- Highlight Madurai community involvement

## Strategy 2: Target Madurai-Specific Keywords

### Primary Keywords to Target:
- "[Your Service] in Madurai"
- "[Your Service] near Meenakshi Temple"
- "Best [Your Service] Madurai"
- "[Your Service] Tamil Nadu"
- "Madurai [Your Industry]"

### Long-tail Keyword Examples:
- "Best web development company in Madurai Tamil Nadu"
- "Digital marketing services near Madurai Junction"
- "Professional graphic design in Madurai city"

### Keyword Research Tools:
- Google Keyword Planner
- Ubersuggest
- Google Trends (filter by Tamil Nadu)
- Answer The Public

## Strategy 3: Create Location-Specific Content

### Content Ideas for Madurai Businesses:

#### Local Event Coverage:
- Meenakshi Tirukalyanam festival business opportunities
- Chithirai Festival marketing strategies
- Madurai Float Festival networking events

#### Area-Specific Guides:
- "Complete Business Setup Guide for Madurai Entrepreneurs"
- "Marketing Your Restaurant During Madurai Temple Festivals"
- "How to Start an IT Company in Madurai"

#### Customer Success Stories:
- "How We Helped a Local Madurai Restaurant Increase Sales by 200%"
- "Madurai Manufacturing Company's Digital Transformation Journey"

### Content Optimization Tips:
- Include Madurai in your title tags
- Use local landmarks as reference points
- Incorporate Tamil phrases naturally
- Add schema markup for local content

## Strategy 4: Build Local Citations and Directories

### Essential Madurai Business Directories:
- JustDial Madurai
- Sulekha Madurai
- India Mart (for B2B)
- Yellow Pages India
- Local Chamber of Commerce listings

### Citation Consistency Checklist:
- Business name (exactly as registered)
- Complete address with pin code
- Phone number format
- Website URL
- Business categories

### Local Newspaper Websites:
- The Hindu Madurai edition
- Dinamalar Madurai
- Daily Thanthi Madurai section

## Strategy 5: Leverage Customer Reviews Strategically

### Review Platform Priorities:
1. **Google My Business** (highest impact)
2. **Facebook** (social proof)
3. **JustDial** (local search)
4. **Industry-specific platforms**

### Review Generation Strategy:
- Ask satisfied customers immediately after service
- Send follow-up emails with review links
- Provide incentives (discount on next purchase)
- Create simple QR codes linking to review pages

### Responding to Reviews:
- Respond to ALL reviews within 24 hours
- Thank customers in English and Tamil when appropriate
- Address negative reviews professionally
- Include keywords naturally in responses

## Strategy 6: Optimize for Mobile and Voice Search

### Mobile Optimization Essentials:
- Page loading speed under 3 seconds
- Responsive design for all devices
- Easy-to-tap phone numbers and directions
- Simple navigation menus

### Voice Search Optimization:
Target conversational queries like:
- "Where is the best [service] near me in Madurai?"
- "What are the hours for [business type] in Madurai?"
- "How do I contact [service provider] in Madurai?"

### Technical Implementation:
- Use FAQ schema markup
- Create "near me" optimized pages
- Implement local business schema
- Ensure fast Core Web Vitals scores

## Strategy 7: Create Hyper-Local Landing Pages

### Page Structure for Each Area:
Create dedicated pages for:
- Madurai Central area services
- Anna Nagar business solutions
- Avaniyapuram service coverage
- Pasumalai area specialization

### Content Elements:
- Area-specific service descriptions
- Local landmarks and directions
- Customer testimonials from that area
- Relevant local images

### SEO Elements:
- Title: "[Service] in [Specific Area], Madurai"
- Meta description with local keywords
- H1 tag with area name
- Internal linking between area pages

## Strategy 8: Implement Technical SEO Best Practices

### Schema Markup Implementation:
\\`\\`\\`json
{
  "@type": "LocalBusiness",
  "name": "Your Business Name",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Your Street Address",
    "addressLocality": "Madurai",
    "addressRegion": "Tamil Nadu",
    "postalCode": "625001",
    "addressCountry": "IN"
  },
  "telephone": "+91-XXX-XXX-XXXX"
}
\\`\\`\\`

### Local SEO Technical Checklist:
- XML sitemap with local pages
- Robot.txt optimization
- SSL certificate installation
- Page speed optimization
- Image alt tags with local keywords

## Strategy 9: Build Local Backlinks

### Madurai-Specific Link Building:
- Sponsor local events and festivals
- Partner with other Madurai businesses
- Guest post on local blogs
- Join Madurai business associations

### Link Building Opportunities:
- Madurai Chamber of Commerce
- Local college partnerships
- Community service organizations
- Industry associations in Tamil Nadu

### Content for Link Building:
- Industry reports about Madurai market
- Local business guides
- Expert interviews
- Community event coverage

## Strategy 10: Track and Measure Local SEO Performance

### Key Performance Indicators (KPIs):
- Local search ranking positions
- Google My Business insights
- Website traffic from Madurai
- Phone calls from search
- Direction requests
- Online review ratings

### Essential Tools:
- Google Analytics (with local filters)
- Google Search Console
- Google My Business Insights
- Local rank tracking tools
- Call tracking software

### Monthly Reporting Metrics:
- Keyword ranking improvements
- Local citation consistency
- Review generation progress
- Website conversion rates
- Local competitor analysis

## Common Local SEO Mistakes to Avoid

### Critical Errors:
1. **Inconsistent NAP Information**: Different addresses across platforms
2. **Neglecting Reviews**: Not responding or asking for feedback
3. **Duplicate Listings**: Multiple GMB profiles for same business
4. **Generic Content**: Not localizing website content
5. **Ignoring Mobile**: Poor mobile user experience

### Quick Fixes:
- Audit all online listings monthly
- Set up Google Alerts for business mentions
- Create a review response template
- Use local phone numbers in ads
- Monitor competitor local strategies

## Advanced Local SEO Tactics for Madurai Businesses

### Seasonal Optimization:
- Festival-specific keyword targeting
- Local event content calendar
- Tourism season adjustments
- Weather-based service promotion

### Multi-Location Strategy:
- Separate landing pages for service areas
- Local phone numbers for each area
- Area-specific Google Ads campaigns
- Localized social media content

## Conclusion and Action Plan

Local SEO success in Madurai requires consistent effort and strategic implementation. Start with these priority actions:

### Week 1:
- Claim and optimize Google My Business
- Audit current local citations
- Set up Google Analytics goals

### Week 2:
- Create location-specific content
- Implement schema markup
- Start review generation campaign

### Week 3:
- Build local citations
- Optimize for mobile users
- Launch local link building

### Month 2 and Beyond:
- Monitor and adjust strategies
- Expand to new service areas
- Develop advanced content marketing

**Ready to dominate Madurai's local search results?** Our team of local SEO experts has helped over 150+ Madurai businesses achieve first-page rankings. Contact us today for a free local SEO audit and custom strategy for your business.

---

*GodivaTech specializes in local SEO for Madurai businesses. Our proven strategies have helped local companies increase their online visibility by an average of 300% within 6 months. Let us help your business become the go-to choice in your industry.*`,
      published: true,
      authorName: "GodivaTech SEO Team",
      authorImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
      coverImage: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=1200&q=80",
      publishedAt: serverTimestamp(),
      categoryId: 2 // SEO category
    };

    // Get next IDs for blog posts
    const blogPost1Id = await getNextId('blog_posts');
    const blogPost2Id = blogPost1Id + 1;

    // Update counter for second post
    await setDoc(doc(db, 'counters', 'blog_posts'), { count: blogPost2Id });

    // Add blog posts to Firestore
    await setDoc(doc(db, 'blog_posts', blogPost1Id.toString()), {
      ...blogPost1,
      id: blogPost1Id
    });

    await setDoc(doc(db, 'blog_posts', blogPost2Id.toString()), {
      ...blogPost2,
      id: blogPost2Id
    });

    console.log('✅ Successfully added 2 SEO-optimized blog posts:');
    console.log(`1. ${blogPost1.title} (ID: ${blogPost1Id})`);
    console.log(`2. ${blogPost2.title} (ID: ${blogPost2Id})`);

  } catch (error) {
    console.error('❌ Error adding blog posts:', error);
  }
}

// Run the script
addBlogPosts().then(() => {
  console.log('Blog post creation completed!');
  process.exit(0);
}).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});
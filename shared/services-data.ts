export interface ServiceDefinition {
  id: number;
  title: string;
  description: string;
  slug: string;
  icon: string;
  features: string[];
  longDescription: string;
  processSteps: { title: string; description: string }[];
  benefits: string[];
  technologies: string[];
}

export const ALL_SERVICES: ServiceDefinition[] = [
  {
    id: 1,
    title: "Web Design & Development",
    description: "Custom websites with responsive designs that work seamlessly across all devices, providing optimal user experiences.",
    slug: "web-design-development",
    icon: "globe",
    features: ["Responsive Design", "SEO Optimization", "Custom CMS Integration"],
    longDescription: "Our web design and development service delivers custom, responsive websites that not only look professional but also perform exceptionally well. We focus on creating user-friendly interfaces with intuitive navigation, fast loading times, and mobile optimization to ensure your website provides an excellent experience on any device.",
    processSteps: [
      { title: "Discovery & Planning", description: "We analyze your business needs, target audience, and goals to create a strategic plan for your website." },
      { title: "Design & Prototyping", description: "Our designers create wireframes and visual designs that align with your brand and business objectives." },
      { title: "Development", description: "Our developers bring the designs to life with clean, efficient code and responsive functionality." },
      { title: "Testing & QA", description: "Rigorous testing ensures your website works flawlessly across all browsers and devices." },
      { title: "Launch & Support", description: "After launch, we provide ongoing support and maintenance to keep your website running optimally." }
    ],
    benefits: [
      "Increased online visibility and brand recognition",
      "Improved user engagement and conversion rates",
      "Mobile-friendly experience for all users",
      "Fast loading speeds for better user retention",
      "SEO-optimized structure for better search rankings"
    ],
    technologies: ["HTML5", "CSS3", "JavaScript", "React", "Node.js", "WordPress", "PHP"]
  },
  {
    id: 2,
    title: "Digital Marketing",
    description: "Strategic marketing solutions to increase your online visibility, engage with customers, and drive conversions.",
    slug: "digital-marketing",
    icon: "megaphone",
    features: ["SEO & SEM", "Social Media Marketing", "Content Strategy"],
    longDescription: "Our digital marketing services help businesses increase their online visibility and reach their target audience effectively. We develop data-driven strategies across search engines, social media, email, and content marketing to drive traffic, generate leads, and increase conversions for sustainable business growth.",
    processSteps: [
      { title: "Strategy Development", description: "We create a customized marketing plan based on your business goals and target audience." },
      { title: "Channel Selection", description: "We identify the most effective channels to reach your specific audience." },
      { title: "Content Creation", description: "Our team develops engaging content optimized for each selected platform." },
      { title: "Campaign Execution", description: "We launch and manage campaigns across multiple channels." },
      { title: "Analysis & Optimization", description: "Continuous monitoring and refinement to improve performance and ROI." }
    ],
    benefits: [
      "Increased website traffic and lead generation",
      "Improved conversion rates and sales",
      "Enhanced brand awareness and engagement",
      "Data-driven insights for continuous improvement",
      "Cost-effective targeting of specific audience segments"
    ],
    technologies: ["Google Analytics", "SEO Tools", "Social Media Platforms", "Email Marketing Software", "Content Management Systems"]
  },
  {
    id: 3,
    title: "Custom Software Solutions",
    description: "Build enterprise-grade custom software including CRM systems, ERP solutions, and business management platforms tailored to your needs.",
    slug: "custom-software",
    icon: "database",
    features: ["CRM Systems", "ERP Solutions", "Cloud Ready", "Scalable Architecture"],
    longDescription: "Our custom software solutions help businesses streamline operations and improve efficiency with enterprise-grade systems. We develop CRM platforms, ERP systems, and custom business management solutions tailored to your specific needs, built with scalable architecture for growth.",
    processSteps: [
      { title: "Requirements Analysis", description: "We gather detailed business requirements and technical specifications." },
      { title: "Architecture & Design", description: "We design scalable, maintainable software architecture aligned with your business goals." },
      { title: "Development", description: "Our experienced developers build robust, tested software solutions." },
      { title: "Integration", description: "We integrate with your existing systems and tools for seamless operation." },
      { title: "Deployment & Support", description: "We handle deployment and provide ongoing support and maintenance." }
    ],
    benefits: [
      "Tailored solutions that fit your unique business needs",
      "Improved operational efficiency and productivity",
      "Scalable architecture for future growth",
      "Integration with existing business systems",
      "Expert technical support and maintenance"
    ],
    technologies: ["C#", "Java", "Python", "Node.js", "PostgreSQL", "Cloud Platforms", "API Development"]
  },
  {
    id: 4,
    title: "E-commerce Solutions",
    description: "End-to-end e-commerce platforms with secure payment processing and inventory management systems.",
    slug: "ecommerce-solutions",
    icon: "box",
    features: ["Secure Payments", "Inventory Management", "Mobile Shopping Experience"],
    longDescription: "Our e-commerce solutions provide businesses with robust online stores that drive sales and deliver exceptional shopping experiences. We build customized platforms with secure payment processing, inventory management, and mobile optimization to help you sell products effectively online.",
    processSteps: [
      { title: "Requirements Analysis", description: "We identify your specific e-commerce needs, product types, and business workflows." },
      { title: "Platform Selection", description: "We recommend and implement the best e-commerce platform for your business." },
      { title: "Design & Development", description: "Our team creates a user-friendly store design with optimized product pages." },
      { title: "Payment & Shipping Setup", description: "We integrate secure payment gateways and configure shipping options." },
      { title: "Testing & Launch", description: "Comprehensive testing ensures a flawless shopping experience before launch." }
    ],
    benefits: [
      "24/7 sales capability to customers worldwide",
      "Streamlined inventory and order management",
      "Secure and diverse payment options",
      "Seamless mobile shopping experience",
      "Detailed analytics to optimize sales performance"
    ],
    technologies: ["Shopify", "WooCommerce", "Magento", "Payment Gateways", "Inventory Management Systems"]
  },
  {
    id: 5,
    title: "Mobile App Development",
    description: "Native and cross-platform mobile applications that deliver exceptional user experiences on iOS and Android devices.",
    slug: "app-development",
    icon: "smartphone",
    features: ["Native iOS & Android", "Cross-Platform Solutions", "App Store Optimization"],
    longDescription: "Our mobile app development services create powerful, user-friendly applications that engage your customers and drive business growth. We specialize in both native iOS/Android development and cross-platform solutions using cutting-edge technologies to deliver apps that perform flawlessly across all devices.",
    processSteps: [
      { title: "Strategy & Planning", description: "We define your app's core functionality, target audience, and technical requirements." },
      { title: "UI/UX Design", description: "Our designers create intuitive interfaces optimized for mobile interaction patterns." },
      { title: "Development & Testing", description: "We build your app using best practices and conduct thorough testing on multiple devices." },
      { title: "App Store Submission", description: "We handle the entire app store submission process for both iOS and Android platforms." },
      { title: "Launch & Maintenance", description: "Post-launch support includes updates, monitoring, and feature enhancements." }
    ],
    benefits: [
      "Direct customer engagement through mobile devices",
      "Push notifications for increased user retention",
      "Native device features integration",
      "Offline functionality for better user experience",
      "Revenue generation through app stores"
    ],
    technologies: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase", "Native APIs"]
  },
  {
    id: 6,
    title: "UI/UX Design",
    description: "User-centered design approaches that enhance usability and create engaging digital experiences.",
    slug: "ui-ux-design",
    icon: "layout",
    features: ["User Research", "Wireframing & Prototyping", "Usability Testing"],
    longDescription: "Our UI/UX design services focus on creating intuitive, engaging user experiences that delight your customers and achieve your business goals. We combine research-based insights with creative design thinking to develop interfaces that are both aesthetically pleasing and highly functional.",
    processSteps: [
      { title: "User Research", description: "We study your users' needs, behaviors, and pain points to inform the design process." },
      { title: "Information Architecture", description: "We organize content and features in a logical, intuitive structure." },
      { title: "Wireframing", description: "We create blueprints of key screens to establish layout and functionality." },
      { title: "Visual Design", description: "Our designers develop the visual style and UI elements of your interface." },
      { title: "Prototyping & Testing", description: "We build interactive prototypes and test them with real users for feedback." }
    ],
    benefits: [
      "Improved user satisfaction and engagement",
      "Reduced user errors and support requests",
      "Higher conversion rates and goal completion",
      "Consistent user experience across platforms",
      "Designed based on real user behavior and feedback"
    ],
    technologies: ["Figma", "Adobe XD", "Sketch", "InVision", "User Testing Platforms"]
  },
  {
    id: 7,
    title: "Logo & Brand Design",
    description: "Develop a distinctive visual identity with professional logo design and comprehensive branding that communicates your company values.",
    slug: "logo-brand-design",
    icon: "palette",
    features: ["Logo Design", "Brand Guidelines", "Color Palette", "Typography"],
    longDescription: "Our branding service helps businesses establish a strong, recognizable identity in the marketplace. We create comprehensive brand packages including logos, color schemes, typography, and design elements that communicate your brand's values and personality consistently across all touchpoints.",
    processSteps: [
      { title: "Brand Discovery", description: "We explore your business values, mission, target audience, and competitive landscape." },
      { title: "Concept Development", description: "Our designers create multiple concepts based on research and brand positioning." },
      { title: "Refinement", description: "We refine the selected concept into a polished, professional brand identity." },
      { title: "Brand Guidelines", description: "We develop comprehensive guidelines for consistent application across all media." },
      { title: "Implementation", description: "We help integrate your new branding across various platforms and materials." }
    ],
    benefits: [
      "Strong brand recognition and recall",
      "Consistent representation across all media",
      "Professional image that builds customer trust",
      "Visual identity that communicates your brand values",
      "Differentiation from competitors in your market"
    ],
    technologies: ["Adobe Creative Suite", "Figma", "Brand Strategy Frameworks", "Color Theory", "Typography"]
  },
  {
    id: 8,
    title: "Graphic Design & Creatives",
    description: "Craft eye-catching posters, banners, and marketing materials that effectively communicate your message and attract customer attention.",
    slug: "poster-design",
    icon: "pentool",
    features: ["Creative Design", "Print Ready", "Multiple Formats", "Quick Turnaround"],
    longDescription: "Our graphic design and creatives service crafts visually stunning materials that capture attention and communicate your message effectively. We design print-ready posters, banners, and digital marketing materials that align with your brand and achieve your marketing objectives.",
    processSteps: [
      { title: "Concept & Briefing", description: "We understand your campaign goals and target audience." },
      { title: "Design Creation", description: "Our designers create eye-catching designs with compelling visuals." },
      { title: "Refinement", description: "We refine designs based on your feedback and requirements." },
      { title: "Print Preparation", description: "We prepare files in appropriate formats and specifications for printing." },
      { title: "Delivery", description: "We deliver print-ready files or coordinate printing as needed." }
    ],
    benefits: [
      "Visually striking designs that grab attention",
      "Professional print-quality materials",
      "Consistent brand representation across materials",
      "Quick turnaround on projects",
      "Multiple format options for different needs"
    ],
    technologies: ["Adobe Photoshop", "Adobe Illustrator", "Figma", "Canva Pro", "Print Design Standards"]
  },
  {
    id: 9,
    title: "Corporate Video Production",
    description: "High-impact brand storytelling, commercial advertisements, 3D product animations, and corporate documentaries that elevate your market presence.",
    slug: "corporate-video-production",
    icon: "video",
    features: ["4K Cinematic Production", "Scriptwriting & Storyboarding", "Aerial & Drone Videography", "Motion Graphics & 3D VFX", "Sound Design & Color Grading"],
    longDescription: "Our corporate video production services deliver captivating, cinematic visual stories that connect with your audience, amplify brand authority, and accelerate sales conversions. From high-concept brand films and executive interviews to 3D product showcases and social media reels, we manage every phase from creative concept to final color grading and multi-platform publishing.",
    processSteps: [
      { title: "Concept & Scriptwriting", description: "We define your core message, write compelling scripts, and create visual storyboards." },
      { title: "Pre-Production Planning", description: "Location scouting, casting, equipment setup, and detailed filming schedules." },
      { title: "Cinematic Filming", description: "High-resolution 4K/6K camera shoots, professional audio recording, and aerial drone coverage." },
      { title: "Post-Production & VFX", description: "Precision editing, motion graphics, 3D animations, color grading, and licensed soundtrack scoring." },
      { title: "Multi-Format Delivery", description: "Optimized video exports tailored for websites, YouTube, TV commercials, and social media ad campaigns." }
    ],
    benefits: [
      "Substantially higher audience engagement and memory retention",
      "Increased conversion rates on landing pages and ad campaigns",
      "Premium, authoritative corporate brand positioning",
      "Reusable visual assets across all digital marketing channels",
      "Crystal-clear communication of complex products and business workflows"
    ],
    technologies: ["4K/6K Cinema Cameras", "Adobe Premiere Pro", "After Effects", "DaVinci Resolve", "Blender 3D", "DJI Drones"]
  },
  {
    id: 10,
    title: "Data Analytics & BI",
    description: "Transform raw data into actionable business intelligence with custom dashboards, automated reporting, predictive analytics, and data pipeline engineering.",
    slug: "data-analytics",
    icon: "linechart",
    features: ["Custom BI Dashboards", "Automated Data Pipelines", "Predictive Analytics", "KPI & Revenue Tracking", "Data Warehouse Integration"],
    longDescription: "Our Data Analytics and Business Intelligence services empower organizations to make confident, data-backed decisions. We design robust data architectures, integrate fragmented data sources, and build intuitive, real-time executive dashboards that uncover revenue opportunities, optimize operational workflows, and forecast market trends.",
    processSteps: [
      { title: "Data Discovery & Audit", description: "We assess your existing data infrastructure, sources, data hygiene, and strategic KPIs." },
      { title: "Pipeline & ETL Engineering", description: "We connect disparate databases, APIs, and cloud services into automated, reliable data pipelines." },
      { title: "Data Modeling & Warehousing", description: "Structured data storage optimized for rapid querying, aggregation, and deep analysis." },
      { title: "Interactive Dashboard Design", description: "Intuitive executive and departmental dashboards with real-time alerts and drill-down analytics." },
      { title: "Predictive Analytics & Enablement", description: "Machine learning forecasting, stakeholder training, and continuous analytics optimization." }
    ],
    benefits: [
      "Clear visibility into business performance and revenue drivers",
      "Automated reporting saving hundreds of manual hours",
      "Predictive modeling for customer churn and demand forecasting",
      "Unified source of truth across sales, operations, and marketing",
      "Custom role-based dashboard access for executive teams"
    ],
    technologies: ["Power BI", "Tableau", "Python", "SQL", "BigQuery", "Snowflake", "dbt", "Apache Airflow"]
  }
];

export const SERVICES_BY_SLUG: Record<string, ServiceDefinition> = ALL_SERVICES.reduce((acc, service) => {
  acc[service.slug] = service;
  return acc;
}, {} as Record<string, ServiceDefinition>);

export const getServiceBySlug = (slug: string): ServiceDefinition | undefined => {
  return SERVICES_BY_SLUG[slug];
};

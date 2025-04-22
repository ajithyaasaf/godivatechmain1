/**
 * Sample data for the GodivaTech website
 * This file provides initial data for the application when the API doesn't return data
 */

export const sampleCategories = [
  { id: 1, name: "Technology Trends", slug: "technology-trends" },
  { id: 2, name: "Cloud Computing", slug: "cloud-computing" },
  { id: 3, name: "Cybersecurity", slug: "cybersecurity" },
  { id: 4, name: "AI & Machine Learning", slug: "ai-machine-learning" },
  { id: 5, name: "Software Development", slug: "software-development" }
];

export const sampleBlogPosts = [
  {
    id: 1,
    title: "The Future of Edge Computing in 2023 and Beyond",
    slug: "future-of-edge-computing",
    excerpt: "Explore how edge computing is revolutionizing data processing and enabling new applications in IoT, autonomous vehicles, and more.",
    content: "Edge computing is revolutionizing how data is processed and analyzed, bringing computation closer to where data is generated. This paradigm shift reduces latency, bandwidth usage, and enhances privacy and security.\n\nAs 5G networks continue to expand globally, edge computing will become increasingly important. The combination of 5G's high bandwidth and low latency with edge computing's localized processing creates a powerful foundation for applications that require real-time data processing, such as autonomous vehicles, industrial automation, and augmented reality.\n\nOne of the most promising applications of edge computing is in the Internet of Things (IoT) ecosystem. With billions of connected devices generating vast amounts of data, traditional cloud-based architectures struggle to handle the volume and velocity of information. Edge computing alleviates this burden by processing data locally, sending only relevant information to the cloud.\n\nFor businesses, edge computing offers numerous advantages, including improved operational efficiency, reduced costs, and enhanced customer experiences. By bringing computation closer to end-users, companies can deliver faster, more responsive applications and services.\n\nHowever, edge computing also presents challenges, such as managing distributed infrastructure, ensuring security across multiple locations, and maintaining consistent performance. Organizations must develop new strategies and tools to address these challenges as they adopt edge computing solutions.\n\nAs we look ahead, the future of edge computing appears bright. Analysts predict that by 2025, 75% of enterprise data will be processed at the edge, up from just 10% in 2018. This rapid growth underscores the transformative potential of edge computing in reshaping how we collect, process, and utilize data in the digital age.",
    publishedAt: "2023-06-15T00:00:00.000Z",
    coverImage: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    authorName: "Sarah Johnson",
    authorImage: "https://randomuser.me/api/portraits/women/76.jpg",
    categoryId: 1
  },
  {
    id: 2,
    title: "5 Essential Cybersecurity Measures Every Business Needs",
    slug: "essential-cybersecurity-measures",
    excerpt: "Learn about the critical security controls that can protect your organization from the most common cyber threats.",
    content: "In today's digital landscape, cybersecurity has become a critical concern for businesses of all sizes. With cyber threats growing in sophistication and frequency, organizations must implement robust security measures to protect their sensitive data and systems.\n\nHere are five essential cybersecurity measures that every business should implement:\n\n1. Multi-Factor Authentication (MFA): Passwords alone are no longer sufficient to secure accounts. MFA adds an extra layer of security by requiring users to provide two or more verification factors to gain access to resources, significantly reducing the risk of unauthorized access even if passwords are compromised.\n\n2. Endpoint Protection: With the rise of remote work, endpoints (laptops, smartphones, tablets) have become prime targets for attackers. Modern endpoint protection solutions should include antivirus, anti-malware, and endpoint detection and response (EDR) capabilities to protect devices from various threats.\n\n3. Regular Security Awareness Training: Human error remains one of the biggest security vulnerabilities. Comprehensive security awareness training helps employees recognize phishing attempts, social engineering tactics, and other common attack vectors, turning them into a human firewall for your organization.\n\n4. Data Encryption: Sensitive data should be encrypted both at rest and in transit. Encryption transforms readable data into a coded format that can only be deciphered with the appropriate encryption key, ensuring that even if data is stolen, it remains unreadable to unauthorized parties.\n\n5. Comprehensive Backup Strategy: Ransomware attacks have made backups more critical than ever. Implement a 3-2-1 backup strategy: maintain at least three copies of your data, store two backup copies on different storage media, and keep one copy offsite or in the cloud.\n\nImplementing these security measures requires a strategic approach and ongoing commitment. Remember that cybersecurity is not a one-time project but a continuous process of assessment, implementation, and improvement.",
    publishedAt: "2023-05-28T00:00:00.000Z",
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    authorName: "David Rodriguez",
    authorImage: "https://randomuser.me/api/portraits/men/22.jpg",
    categoryId: 3
  },
  {
    id: 3,
    title: "How AI is Transforming Customer Service Experiences",
    slug: "ai-transforming-customer-service",
    excerpt: "Discover how artificial intelligence is revolutionizing customer support through chatbots, sentiment analysis, and predictive service.",
    content: "Artificial intelligence is fundamentally transforming how businesses interact with their customers, creating more efficient, personalized, and responsive customer service experiences.\n\nOne of the most visible applications of AI in customer service is the rise of intelligent chatbots and virtual assistants. These AI-powered tools can handle routine inquiries, provide instant responses 24/7, and seamlessly escalate complex issues to human agents when necessary. Modern AI chatbots leverage natural language processing (NLP) to understand customer intent and provide contextually relevant responses, making interactions feel more natural and human-like.\n\nBeyond chatbots, AI is enabling businesses to better understand customer sentiment through advanced analytics. AI-powered sentiment analysis tools can analyze customer feedback across multiple channels, including social media, reviews, and support interactions, to identify patterns and trends in customer satisfaction. This allows companies to proactively address emerging issues before they become widespread problems.\n\nPredictive service is another area where AI is making significant inroads. By analyzing historical data and identifying patterns, AI systems can predict when customers might experience problems and initiate proactive support. For example, a telecommunications company might detect potential network issues and reach out to affected customers before they even notice a problem.\n\nAI is also transforming the role of human customer service agents. Rather than replacing humans, AI augments their capabilities by providing real-time recommendations, automating routine tasks, and surfacing relevant information during customer interactions. This allows human agents to focus on complex problems and emotional connections with customers.\n\nPersonalization is perhaps the most powerful impact of AI on customer service. AI systems can analyze vast amounts of customer data to create detailed profiles and deliver highly personalized experiences. From recommending products based on past purchases to tailoring communication styles to individual preferences, AI enables a level of personalization that was previously impossible at scale.\n\nAs AI technology continues to advance, we can expect even more innovative applications in customer service, further blurring the line between automated and human support while delivering increasingly seamless and satisfying customer experiences.",
    publishedAt: "2023-05-10T00:00:00.000Z",
    coverImage: "https://images.unsplash.com/photo-1607798748738-b15c40d33d57?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    authorName: "Emily Patel",
    authorImage: "https://randomuser.me/api/portraits/women/38.jpg",
    categoryId: 4
  },
  {
    id: 4,
    title: "The Rise of Microservices Architecture in Modern Applications",
    slug: "microservices-architecture-modern-applications",
    excerpt: "Explore how microservices architecture is changing the way companies build and scale their applications, offering greater flexibility and resilience.",
    content: "Microservices architecture has emerged as a dominant approach to building complex, scalable, and resilient applications in today's fast-paced digital environment. Unlike traditional monolithic applications, microservices break down software into small, independent services that communicate through well-defined APIs.\n\nThis architectural paradigm offers numerous advantages for modern application development. By decomposing applications into smaller, focused services, development teams can work more independently, using the best technologies for each specific service. This technological flexibility allows organizations to innovate faster and adapt more quickly to changing requirements.\n\nScalability is another significant benefit of microservices. With each service operating independently, teams can scale specific components based on demand rather than scaling the entire application. This granular scalability leads to more efficient resource utilization and cost savings, especially in cloud environments.\n\nResilience is built into the microservices approach. When properly designed with fault isolation, the failure of one service doesn't necessarily bring down the entire system. This isolation enables higher availability and better fault tolerance compared to monolithic architectures where a single bug can potentially crash the entire application.\n\nHowever, microservices aren't without challenges. Distributed systems introduce complexity in areas such as service discovery, inter-service communication, and data consistency. Organizations adopting microservices must invest in robust DevOps practices, monitoring solutions, and automation to manage this complexity effectively.\n\nSuccessful implementation of microservices requires cultural and organizational changes as well. Teams need to adopt a DevOps mindset with increased collaboration between development and operations. Many organizations implement cross-functional teams responsible for the full lifecycle of specific services.\n\nAs containerization technologies like Docker and orchestration platforms like Kubernetes have matured, deploying and managing microservices has become more standardized. These technologies provide the infrastructure needed to handle the operational challenges of microservices at scale.\n\nLooking ahead, the trend toward microservices will likely continue as more organizations seek to increase their agility and ability to innovate. The next evolution may see increased adoption of serverless architectures and event-driven patterns that further enhance the benefits of the microservices approach.",
    publishedAt: "2023-04-22T00:00:00.000Z",
    coverImage: "https://images.unsplash.com/photo-1561736778-92e52a7769ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    authorName: "Michael Chen",
    authorImage: "https://randomuser.me/api/portraits/men/32.jpg",
    categoryId: 5
  },
  {
    id: 5,
    title: "Securing the Cloud: Best Practices for Cloud Security in 2023",
    slug: "cloud-security-best-practices-2023",
    excerpt: "Learn the essential security measures and best practices for protecting your cloud infrastructure and data in today's evolving threat landscape.",
    content: "As organizations continue to migrate their infrastructure and workloads to the cloud, securing these environments has become more critical than ever. Cloud security requires a shared responsibility model between cloud providers and customers, with specific obligations for each party.\n\nThe foundation of robust cloud security begins with identity and access management (IAM). Implementing the principle of least privilege ensures that users and services have only the permissions they need to perform their functions. Multi-factor authentication should be mandatory for all users, especially those with administrative privileges. Organizations should also implement just-in-time access for privileged accounts to reduce the attack surface.\n\nData protection in the cloud requires a multi-layered approach. Encryption should be applied to data at rest, in transit, and increasingly, in use through technologies like confidential computing. Data classification helps organizations understand what they're storing in the cloud and apply appropriate protection measures based on sensitivity. Additionally, implementing robust key management practices ensures that encryption keys are properly secured and rotated.\n\nNetwork security remains essential in cloud environments. Security groups, network ACLs, and firewalls should be configured to restrict traffic based on the principle of least privilege. Organizations should segment their cloud networks to contain potential breaches and implement DDoS protection services to safeguard public-facing applications.\n\nContinuous monitoring and threat detection are crucial components of cloud security. Cloud-native security information and event management (SIEM) solutions can aggregate logs across multiple cloud services and environments, providing visibility into potential security incidents. Automated responses to common threats can reduce the time to remediation and limit the impact of security breaches.\n\nSecure DevOps practices, often referred to as DevSecOps, integrate security throughout the development lifecycle. Infrastructure as Code (IaC) templates should undergo security reviews and scanning to identify misconfigurations before deployment. Container security requires scanning images for vulnerabilities, implementing runtime protection, and securing the container orchestration platform.\n\nRegular security assessments, including vulnerability scanning and penetration testing, help identify and address security gaps in cloud environments. These assessments should be performed whenever significant changes are made to the cloud infrastructure.\n\nAs the threat landscape continues to evolve, organizations must stay informed about emerging cloud security threats and adjust their security controls accordingly. By implementing these best practices and maintaining vigilance, organizations can safely enjoy the benefits of cloud computing while protecting their most sensitive assets.",
    publishedAt: "2023-03-15T00:00:00.000Z",
    coverImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    authorName: "Jennifer Miller",
    authorImage: "https://randomuser.me/api/portraits/women/44.jpg",
    categoryId: 2
  },
  {
    id: 6,
    title: "Implementing DevOps: Challenges and Solutions for Modern Development Teams",
    slug: "implementing-devops-challenges-solutions",
    excerpt: "Discover the common challenges organizations face when adopting DevOps practices and effective strategies to overcome them.",
    content: "DevOps has evolved from a buzzword to a fundamental approach for software delivery, enabling organizations to release high-quality applications faster and more reliably. However, implementing DevOps practices often comes with significant challenges that must be addressed to realize its full benefits.\n\nOne of the primary challenges in DevOps adoption is cultural resistance. Traditional organizations with separate development and operations teams may struggle with the collaboration and shared responsibility that DevOps requires. Overcoming this resistance requires strong leadership support, clear communication about the benefits of DevOps, and potentially reorganizing teams around products or services rather than technical functions.\n\nTechnical complexity presents another major hurdle. Building a fully automated CI/CD pipeline with integrated testing, security scanning, and deployment verification requires significant technical expertise. Organizations can address this by starting with smaller, incremental improvements and gradually expanding automation coverage. Investing in training and potentially hiring DevOps specialists can also help bridge knowledge gaps.\n\nLegacy systems and technical debt often complicate DevOps implementation. These systems weren't designed for continuous integration and deployment, making automation difficult. Organizations should consider implementing DevOps practices for new applications first, while gradually modernizing legacy systems or implementing API layers to facilitate integration.\n\nSecurity integration, often called DevSecOps, presents unique challenges. Traditional security processes were designed for waterfall development and can become bottlenecks in a DevOps pipeline. Embedding security throughout the development lifecycle through automated scanning, secure coding practices, and security as code helps address these concerns without sacrificing speed.\n\nMetrics and measurement are critical for successful DevOps adoption but can be challenging to implement correctly. Organizations should focus on outcome-based metrics like deployment frequency, lead time for changes, mean time to recovery, and change failure rate, rather than traditional activity-based metrics.\n\nTooling proliferation is a common issue in DevOps environments, with teams using numerous specialized tools that may not integrate well. Creating a cohesive toolchain with well-defined integration points or adopting platform solutions that provide end-to-end functionality can help manage this complexity.\n\nOrganizations that successfully implement DevOps despite these challenges typically share certain characteristics: they start small with achievable goals, focus on continuous improvement, invest in automation, foster a learning culture, and maintain a relentless focus on delivering value to customers. By addressing these common challenges with proven strategies, organizations can successfully transform their software delivery capabilities through DevOps practices.",
    publishedAt: "2023-02-25T00:00:00.000Z",
    coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    authorName: "Robert Thompson",
    authorImage: "https://randomuser.me/api/portraits/men/68.jpg",
    categoryId: 5
  }
];

export const sampleServices = [
  {
    id: 1,
    title: "Web Development",
    description: "Create affordable, responsive websites for your business that work on all devices and help your brand stand out online.",
    icon: "code",
    slug: "web-development"
  },
  {
    id: 2,
    title: "Digital Marketing",
    description: "Boost your online presence with our comprehensive digital marketing strategies including SEO, social media management, and online advertising.",
    icon: "cloud",
    slug: "digital-marketing"
  },
  {
    id: 3,
    title: "Mobile App Development",
    description: "Build custom mobile applications for Android and iOS platforms that connect you with your customers wherever they are.",
    icon: "users",
    slug: "app-development"
  },
  {
    id: 4,
    title: "Poster Design",
    description: "Craft eye-catching posters and marketing materials that effectively communicate your message and attract customer attention.",
    icon: "shield",
    slug: "poster-design"
  },
  {
    id: 5,
    title: "UI/UX Design",
    description: "Create intuitive and engaging user interfaces that provide exceptional user experiences and keep customers coming back.",
    icon: "bar-chart",
    slug: "ui-ux-design"
  },
  {
    id: 6,
    title: "Logo & Brand Design",
    description: "Develop a distinctive visual identity with professional logo design and comprehensive branding that communicates your company values.",
    icon: "brain",
    slug: "logo-brand-design"
  }
];

export const sampleTeamMembers = [
  {
    id: 1,
    name: "Michael Chen",
    position: "Chief Executive Officer",
    bio: "20+ years of experience in tech leadership and business transformation.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    linkedIn: "https://linkedin.com",
    twitter: "https://twitter.com"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    position: "Chief Technology Officer",
    bio: "Former Google engineer with expertise in cloud architecture and AI.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    linkedIn: "https://linkedin.com",
    twitter: "https://twitter.com"
  },
  {
    id: 3,
    name: "David Rodriguez",
    position: "VP of Client Services",
    bio: "Dedicated to building strong client relationships and delivering results.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    linkedIn: "https://linkedin.com",
    twitter: "https://twitter.com"
  },
  {
    id: 4,
    name: "Emily Patel",
    position: "Director of Innovation",
    bio: "Leading our R&D efforts to bring cutting-edge solutions to market.",
    image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    linkedIn: "https://linkedin.com",
    twitter: "https://twitter.com"
  }
];

export const sampleProjects = [
  {
    id: 1,
    title: "E-Commerce Platform Redesign",
    description: "Completely redesigned the online shopping experience for a leading retailer, resulting in a 40% increase in conversions.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Software Development",
    technologies: ["React", "Node.js", "AWS"]
  },
  {
    id: 2,
    title: "Healthcare Data Migration",
    description: "Migrated a healthcare provider's legacy systems to a secure cloud infrastructure, improving performance by 60%.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Cloud Solutions",
    technologies: ["Azure", "Kubernetes", "HIPAA"]
  },
  {
    id: 3,
    title: "Predictive Maintenance System",
    description: "Developed an AI-powered system for a manufacturing company that predicts equipment failures before they occur.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "AI & Machine Learning",
    technologies: ["Python", "TensorFlow", "IoT"]
  },
  {
    id: 4,
    title: "Financial Services Mobile App",
    description: "Created a secure mobile banking application with advanced features like biometric authentication and real-time notifications.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Software Development",
    technologies: ["React Native", "Node.js", "MongoDB"]
  },
  {
    id: 5,
    title: "Enterprise Resource Planning System",
    description: "Designed and implemented a custom ERP solution that integrated all departments and streamlined business processes.",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Software Development",
    technologies: ["Java", "Spring Boot", "PostgreSQL"]
  },
  {
    id: 6,
    title: "Cybersecurity Infrastructure Upgrade",
    description: "Strengthened a financial institution's security posture with advanced threat detection and prevention systems.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Cybersecurity",
    technologies: ["Palo Alto", "Splunk", "AWS Security"]
  }
];

export const sampleTestimonials = [
  {
    id: 1,
    name: "Jennifer Miller",
    position: "Marketing Director",
    company: "Axon Enterprises",
    content: "GodivaTech transformed our digital presence with a new website and custom CRM integration. Their team was professional, responsive, and delivered a solution that exceeded our expectations.",
    image: "https://randomuser.me/api/portraits/women/32.jpg"
  },
  {
    id: 2,
    name: "Robert Thompson",
    position: "CTO",
    company: "HealthFirst",
    content: "Working with GodivaTech on our cloud migration was a game-changer. They made a complex process seamless and helped us achieve significant cost savings while improving performance.",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 3,
    name: "Maria Sanchez",
    position: "Operations Manager",
    company: "Global Logistics",
    content: "The custom software GodivaTech developed for our logistics operations has increased efficiency by 35%. Their ongoing support and continuous improvements have made them a valuable partner.",
    image: "https://randomuser.me/api/portraits/women/28.jpg"
  }
];

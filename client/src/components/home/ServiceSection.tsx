import React from "react";
import { Link } from "wouter";
import { 
  Globe, Megaphone, Smartphone, PenTool, Layout, Palette, 
  ArrowRight, Star, CheckCircle 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Simple service interface
interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  slug: string;
  features?: string[];
}

// API service interface (from backend)
interface ApiService {
  id: number;
  title: string;
  description: string;
  icon?: string;
  slug: string;
}

// Modern service card component
const ServiceCard: React.FC<{ service: Service; index: number }> = ({ service, index }) => {
  const IconComponent = service.icon;
  
  return (
    <div className="group relative">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl 
                      opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      
      {/* Main card */}
      <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100 p-8 
                      group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300">
        
        {/* Icon section */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl 
                          flex items-center justify-center shadow-lg">
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          <div className="text-right">
            <div className="flex items-center text-amber-500 mb-1">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
            </div>
            <span className="text-sm text-gray-500">Top Rated</span>
          </div>
        </div>
        
        {/* Content */}
        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
          {service.title}
        </h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {service.description}
        </p>
        
        {/* Features list */}
        <div className="space-y-2 mb-6">
          {(service.features || ["Professional Service", "Quick Delivery", "24/7 Support"]).map((feature, idx) => (
            <div key={idx} className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              {feature}
            </div>
          ))}
        </div>
        
        {/* CTA Button */}
        <Link href={`/services/${service.slug}`}>
          <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
                           py-3 px-6 rounded-xl font-semibold group-hover:from-blue-600 
                           group-hover:to-indigo-700 transition-all duration-300 
                           flex items-center justify-center">
            Learn More
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>
    </div>
  );
};

// Icon mapping function
const getIconComponent = (iconName?: string): React.ElementType => {
  if (!iconName) return Globe;
  
  const iconMap: Record<string, React.ElementType> = {
    'globe': Globe,
    'megaphone': Megaphone,
    'smartphone': Smartphone,
    'pentool': PenTool,
    'layout': Layout,
    'palette': Palette,
  };
  
  return iconMap[iconName.toLowerCase()] || Globe;
};

// Main services section component
const ServiceSection: React.FC = () => {
  // Fetch services from API
  const { data: apiServices = [] } = useQuery<ApiService[]>({
    queryKey: ['/api/services'],
    staleTime: 5 * 60 * 1000,
  });

  // Default services with features
  const defaultServices: Service[] = [
    {
      id: 1,
      title: "Web Development",
      description: "Create affordable, responsive websites for your business that work on all devices and help your brand stand out online.",
      icon: Globe,
      slug: "web-development",
      features: ["Responsive Design", "SEO Optimized", "Fast Loading", "Mobile Friendly"]
    },
    {
      id: 2,
      title: "Digital Marketing",
      description: "Boost your online presence with our comprehensive digital marketing strategies including SEO, social media management, and online advertising.",
      icon: Megaphone,
      slug: "digital-marketing",
      features: ["SEO Strategy", "Social Media", "Google Ads", "Analytics"]
    },
    {
      id: 3,
      title: "Mobile App Development",
      description: "Build custom mobile applications for Android and iOS platforms that connect you with your customers wherever they are.",
      icon: Smartphone,
      slug: "app-development",
      features: ["iOS & Android", "Native Performance", "App Store Ready", "Cloud Integration"]
    },
    {
      id: 4,
      title: "Poster Design",
      description: "Craft eye-catching posters and marketing materials that effectively communicate your message and attract customer attention.",
      icon: PenTool,
      slug: "poster-design",
      features: ["Creative Design", "Print Ready", "Multiple Formats", "Quick Turnaround"]
    },
    {
      id: 5,
      title: "UI/UX Design",
      description: "Create intuitive and engaging user interfaces that provide exceptional user experiences and keep customers coming back.",
      icon: Layout,
      slug: "ui-ux-design",
      features: ["User Research", "Wireframing", "Prototyping", "User Testing"]
    },
    {
      id: 6,
      title: "Logo & Brand Design",
      description: "Develop a distinctive visual identity with professional logo design and comprehensive branding that communicates your company values.",
      icon: Palette,
      slug: "logo-brand-design",
      features: ["Logo Design", "Brand Guidelines", "Color Palette", "Typography"]
    }
  ];

  // Convert API services to Service format
  const convertApiToService = (apiService: ApiService): Service => ({
    ...apiService,
    icon: getIconComponent(apiService.icon),
    features: ["Professional Service", "Quick Delivery", "24/7 Support"] // Default features for API services
  });

  // Use API services if available, otherwise use defaults
  const services: Service[] = apiServices.length > 0 
    ? apiServices.map(convertApiToService)
    : defaultServices;

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
              OUR SERVICES
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Professional <span className="text-blue-600">IT Solutions</span> for Your Business
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From web development to digital marketing, we provide comprehensive technology services 
            to help businesses in Madurai establish a strong online presence.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service: Service, index: number) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6">
              Let's discuss your project and see how we can help bring your ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold 
                                 hover:bg-blue-700 transition-colors">
                  Start Your Project
                </button>
              </Link>
              <Link href="/portfolio">
                <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-xl 
                                 font-semibold hover:bg-blue-50 transition-colors">
                  View Our Work
                </button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ServiceSection;
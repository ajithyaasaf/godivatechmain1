import React, { memo } from "react";
import { Link } from "wouter";
import { ArrowRight, Star, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ALL_SERVICES, type ServiceDefinition } from "@shared/services-data";
import { getServiceIcon } from "@/lib/service-icons";

// Modern service card component
const ServiceCard: React.FC<{ service: Partial<ServiceDefinition>; index: number }> = memo(({ service }) => {
  const IconComponent = getServiceIcon(service.icon, service.title, service.slug);
  
  return (
    <div className="group relative">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl 
                      opacity-0 group-hover:opacity-100 transition-all duration-500" />
      
      {/* Main card */}
      <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100 p-8 h-full
                      group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300 
                      flex flex-col">
        
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
        
        {/* Content - flex-grow to push button to bottom */}
        <div className="flex-grow">
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
        </div>
        
        {/* CTA Button - always at bottom */}
        <div className="mt-auto">
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
    </div>
  );
});

ServiceCard.displayName = "ServiceCard";

// Main services section component
const ServiceSection: React.FC = () => {
  // Fetch services from API with fallback to Single Source of Truth
  const { data: apiServices = [] } = useQuery<ServiceDefinition[]>({
    queryKey: ['/api/services'],
    staleTime: 5 * 60 * 1000,
  });

  const services = apiServices.length > 0 ? apiServices : ALL_SERVICES;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Premium Services
          </h2>
          <p className="text-lg text-gray-600">
            Comprehensive digital solutions designed to elevate your business and accelerate growth.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.id || index} service={service} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link href="/services">
            <button className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
              View All Services
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default memo(ServiceSection);
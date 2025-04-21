import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import founderImage from "../../assets/team/ceo.jpg";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <img 
                src={founderImage} 
                alt="Rajesh Kumar - Founder & CEO of GodivaTech" 
                className="rounded-lg shadow-xl w-full object-cover" 
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
                <p className="text-white font-semibold text-lg">Rajesh Kumar</p>
                <p className="text-white/90 text-sm">Founder & CEO</p>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl font-bold text-neutral-800 mb-6">
              Empowering businesses through innovative technology
            </h2>
            <p className="text-lg text-neutral-600 mb-6">
              GodivaTech was founded in 2010 with a clear mission: to help businesses harness the power of technology to achieve their goals. Over the years, we've grown from a small team of passionate developers to a full-service technology partner trusted by businesses worldwide.
            </p>
            <p className="text-lg text-neutral-600 mb-8">
              Our team of experts combines technical expertise with business acumen to deliver solutions that drive real-world results. We believe in building long-term partnerships with our clients, becoming an extension of their team and a trusted advisor in their digital journey.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary mb-2">12+</p>
                <p className="text-neutral-600">Years Experience</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary mb-2">200+</p>
                <p className="text-neutral-600">Projects Completed</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary mb-2">50+</p>
                <p className="text-neutral-600">Tech Experts</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary mb-2">98%</p>
                <p className="text-neutral-600">Client Satisfaction</p>
              </div>
            </div>
            
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/about">
                Learn More About Us
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

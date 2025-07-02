import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import workspaceImage from "../../assets/modern-workspace.jpeg";
import { safeImageProps } from "@/lib/dom-elements-safe";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <img 
                {...safeImageProps({
                  src: workspaceImage,
                  alt: "Modern Workspace at GodivaTech",
                  className: "rounded-lg shadow-xl w-full object-cover h-[400px]",
                  loading: "lazy",
                  decoding: "async"
                })}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
                <p className="text-white font-semibold text-lg">Modern Workspace</p>
                <p className="text-white/90 text-sm">GodivaTech Office</p>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl font-bold text-neutral-800 mb-6">
              Expert IT Solutions & Digital Services in Madurai
            </h2>
            <p className="text-lg text-neutral-600 mb-6">
              At Godiva Tech, we provide a range of digital marketing services in Madurai, including web development, mobile app development, UI/UX design, poster design, and marketing strategies.
            </p>
            <p className="text-lg text-neutral-600 mb-8">
              We work with businesses to create user-friendly websites, develop cross-platform mobile apps, design engaging interfaces, and craft eye-catching posters. Our goal is to help your brand stand out online and achieve growth through effective and innovative solutions.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary mb-2">13+</p>
                <p className="text-neutral-600">Years of Experience</p>
                <p className="text-sm text-neutral-500 mt-1">Delivering quality IT solutions since 2010</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary mb-2">150+</p>
                <p className="text-neutral-600">Successfully Completed Projects</p>
                <p className="text-sm text-neutral-500 mt-1">Web development, marketing & design projects</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary mb-2">120+</p>
                <p className="text-neutral-600">Satisfied Happy Clients</p>
                <p className="text-sm text-neutral-500 mt-1">From businesses in Madurai and beyond</p>
              </div>
            </div>
            
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/about">
                More About
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { RocketIcon } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-800 rounded-lg shadow-xl overflow-hidden">
          <div className="lg:flex">
            <div className="lg:w-1/2 p-10 md:p-16">
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to elevate your online presence?
              </h2>
              <p className="text-neutral-300 mb-8 text-lg">
                Let's discuss how our digital solutions can help grow your business. Contact us today for a free consultation with our expert team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-primary hover:bg-primary/90 text-white">
                  <Link href="/contact">Start a Project</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="bg-transparent border border-white text-white hover:bg-white/10"
                >
                  <Link href="/services">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 bg-gradient-to-br from-primary to-secondary hidden lg:block">
              <div className="relative h-full">
                <img
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Technology team working"
                  className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-white text-6xl mb-4">
                      <RocketIcon className="h-16 w-16 mx-auto" />
                    </div>
                    <p className="text-white text-xl font-semibold">
                      Affordable IT & Technology Solutions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

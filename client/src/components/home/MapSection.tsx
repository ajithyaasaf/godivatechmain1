import React, { useState, useEffect, memo } from "react";
import { safeIframeProps } from "@/lib/dom-elements-safe";

const MapSection = memo(() => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Lazy load map on scroll into view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "50px" }
    );

    const section = document.getElementById("map-section");
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="map-section"
      className="w-full h-96 relative bg-gray-100 overflow-hidden"
    >
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <p className="text-gray-600">Loading map...</p>
        </div>
      )}
      
      {isVisible && (
        <iframe 
          {...safeIframeProps({
            src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.2447328426597!2d78.12676887499555!3d9.914743590198706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00c55ecaaa6f6f%3A0x91a537a5446e2bb!2sVaigai%20Main%20Rd%2C%20Sri%20Nagar%2C%20Iyer%20Bungalow%2C%20Madurai%2C%20Tamil%20Nadu%20625007!5e0!3m2!1sen!2sin!4v1713865445981!5m2!1sen!2sin",
            title: "GodivaTech Office Location",
            width: "100%",
            height: "100%",
            loading: "lazy",
            allowFullScreen: true,
            referrerPolicy: "no-referrer-when-downgrade",
            className: "w-full h-full",
            style: { 
              border: 0, 
              display: 'block',
              minWidth: '100%',
              minHeight: '100%'
            }
          })}
          data-testid="google-maps-embed"
          onLoad={() => setIsLoaded(true)}
        ></iframe>
      )}
      
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md max-w-xs z-10">
        <p className="font-medium text-neutral-800 text-sm">GodivaTech</p>
        <p className="text-neutral-600 text-xs">
          261, Vaigai mainroad 4th Street, Sri Nagar, Iyer Bungalow, Madurai 625007
        </p>
      </div>
    </section>
  );
});

MapSection.displayName = "MapSection";

export default MapSection;

import React from "react";
import { MapIcon } from "lucide-react";

const MapSection = () => {
  return (
    <section className="h-96 relative">
      {/* Google Maps integration would typically go here */}
      <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl text-neutral-400 mb-4">
            <MapIcon className="h-16 w-16 mx-auto" />
          </div>
          <p className="text-neutral-500 font-medium">
            Google Maps Integration
          </p>
          <p className="text-neutral-400 text-sm">
            Our office is located at 261, Vaigai mainroad 4th Street, Sri Nagar, Iyer Bungalow, Madurai 625007
          </p>
        </div>
      </div>
    </section>
  );
};

export default MapSection;

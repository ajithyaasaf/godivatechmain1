import React from "react";

const MapSection = () => {
  return (
    <section className="h-96 relative">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.2447328426597!2d78.12676887499555!3d9.914743590198706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00c55ecaaa6f6f%3A0x91a537a5446e2bb!2sVaigai%20Main%20Rd%2C%20Sri%20Nagar%2C%20Iyer%20Bungalow%2C%20Madurai%2C%20Tamil%20Nadu%20625007!5e0!3m2!1sen!2sin!4v1713865445981!5m2!1sen!2sin" 
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        allowFullScreen={true} 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="GodivaTech Office Location"
        className="absolute inset-0"
      ></iframe>
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md max-w-xs">
        <p className="font-medium text-neutral-800 text-sm">GodivaTech</p>
        <p className="text-neutral-600 text-xs">
          261, Vaigai mainroad 4th Street, Sri Nagar, Iyer Bungalow, Madurai 625007
        </p>
      </div>
    </section>
  );
};

export default MapSection;

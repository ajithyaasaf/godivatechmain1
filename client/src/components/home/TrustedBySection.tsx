import React from "react";
import godivaLogo from "../../assets/godiva-logo.png";

const TrustedBySection = () => {
  return (
    <section className="bg-white py-8 border-b border-neutral-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-neutral-500 font-medium mb-8">
          Trusted by innovative companies
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {/* First client logo is our actual logo, others are placeholders */}
          <img 
            src={godivaLogo} 
            alt="GodivaTech" 
            className="h-10 opacity-80 hover:opacity-100 transition-opacity"
          />
          
          {/* The rest remain as placeholder logos */}
          <svg className="h-8 opacity-60 hover:opacity-100 transition-opacity" viewBox="0 0 150 50" xmlns="http://www.w3.org/2000/svg">
            <rect width="150" height="50" fill="none"/>
            <text x="75" y="30" fontSize="14" textAnchor="middle" fill="#555">Client Logo</text>
          </svg>
          
          <svg className="h-8 opacity-60 hover:opacity-100 transition-opacity" viewBox="0 0 150 50" xmlns="http://www.w3.org/2000/svg">
            <rect width="150" height="50" fill="none"/>
            <text x="75" y="30" fontSize="14" textAnchor="middle" fill="#555">Client Logo</text>
          </svg>
          
          <svg className="h-8 opacity-60 hover:opacity-100 transition-opacity" viewBox="0 0 150 50" xmlns="http://www.w3.org/2000/svg">
            <rect width="150" height="50" fill="none"/>
            <text x="75" y="30" fontSize="14" textAnchor="middle" fill="#555">Client Logo</text>
          </svg>
          
          <svg className="h-8 opacity-60 hover:opacity-100 transition-opacity" viewBox="0 0 150 50" xmlns="http://www.w3.org/2000/svg">
            <rect width="150" height="50" fill="none"/>
            <text x="75" y="30" fontSize="14" textAnchor="middle" fill="#555">Client Logo</text>
          </svg>
          
          <svg className="h-8 opacity-60 hover:opacity-100 transition-opacity" viewBox="0 0 150 50" xmlns="http://www.w3.org/2000/svg">
            <rect width="150" height="50" fill="none"/>
            <text x="75" y="30" fontSize="14" textAnchor="middle" fill="#555">Client Logo</text>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;

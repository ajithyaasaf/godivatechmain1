import React from "react";
import omVinayagaLogo from "../../assets/om-vinayaga-logo.png";
import padmarajamLogo from "../../assets/padmarajam-logo.png";
import ambikasLogo from "../../assets/ambikas-logo.png";
import prakashGreenEnergyLogo from "../../assets/prakash-green-energy-logo.png";

const TrustedBySection = () => {
  return (
    <section className="bg-white py-8 border-b border-neutral-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-neutral-500 font-medium mb-8">
          Trusted by innovative companies
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          {/* Client logos in order */}
          <img
            src={omVinayagaLogo}
            alt="OM VINAYAGA ASSOCIATES"
            className="h-10 opacity-80 hover:opacity-100 transition-opacity"
          />

          <img
            src={padmarajamLogo}
            alt="PADMARAJAM INSTITUTE OF MANAGEMENT"
            className="h-10 opacity-80 hover:opacity-100 transition-opacity"
          />

          <img
            src={ambikasLogo}
            alt="Ambika's"
            className="h-16 opacity-80 hover:opacity-100 transition-opacity"
          />

          <img
            src={prakashGreenEnergyLogo}
            alt="Prakash Green Energy"
            className="h-16 opacity-80 hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;

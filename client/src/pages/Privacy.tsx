import React from "react";
import PageTransition, { TransitionItem } from "@/components/PageTransition";
import SEO from "@/components/SEO";
import { getOrganizationData, getWebPageData, getBreadcrumbData } from "@/lib/structuredData";
import { ShieldCheck, Lock, Eye, FileText } from "lucide-react";

const Privacy = () => {
  const structuredData = [
    getOrganizationData(),
    getWebPageData(
      "Privacy Policy | GodivaTech",
      "Read GodivaTech's privacy policy to understand how we collect, protect, and handle your information.",
      "https://godivatech.com/privacy"
    ),
    getBreadcrumbData([
      { name: "Home", item: "https://godivatech.com/" },
      { name: "Privacy Policy", item: "https://godivatech.com/privacy" }
    ])
  ];

  return (
    <>
      <SEO
        title="Privacy Policy | GodivaTech"
        description="Learn how GodivaTech protects your privacy, collects information, and manages data securely."
        canonicalUrl="/privacy"
        ogType="website"
        robots="index, follow"
        structuredData={structuredData}
      />

      <PageTransition>
        <div className="relative pt-24 pb-16 bg-neutral-50 min-h-screen">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <TransitionItem>
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 sm:p-12 mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Privacy Policy</h1>
                    <p className="text-neutral-500 text-sm mt-1">Last Updated: January 2026</p>
                  </div>
                </div>

                <div className="prose prose-neutral max-w-none space-y-6 text-neutral-700 leading-relaxed">
                  <p>
                    At <strong>GodivaTech</strong>, accessible from <a href="https://godivatech.com" className="text-primary hover:underline">https://godivatech.com</a>, the privacy of our visitors and clients is one of our top priorities. This Privacy Policy document outlines the types of personal information that is received and collected by GodivaTech and how it is used.
                  </p>

                  <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2 pt-4">
                    <Eye className="w-5 h-5 text-primary" /> 1. Information We Collect
                  </h2>
                  <p>
                    When you contact us, request a quote, or subscribe to our newsletter, you may be asked to provide your name, email address, phone number, and details about your business requirements. We only collect information that you voluntarily provide to us.
                  </p>

                  <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2 pt-4">
                    <Lock className="w-5 h-5 text-primary" /> 2. How We Use Your Information
                  </h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>To provide, operate, and maintain our web development and digital marketing services.</li>
                    <li>To respond directly to customer inquiries, support requests, and quotation submissions.</li>
                    <li>To send administrative information, service updates, and occasional promotional communications (you may opt out at any time).</li>
                    <li>To monitor and analyze trends, usage, and activities in connection with our website to improve user experience.</li>
                  </ul>

                  <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2 pt-4">
                    <FileText className="w-5 h-5 text-primary" /> 3. Data Protection and Security
                  </h2>
                  <p>
                    We implement industry-standard administrative, technical, and physical security measures to safeguard your personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>

                  <h2 className="text-xl font-bold text-neutral-900 pt-4">
                    4. Third-Party Services
                  </h2>
                  <p>
                    We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties, except trusted service providers who assist us in operating our website, conducting our business, or serving our clients (such as secure cloud infrastructure and analytics), so long as those parties agree to keep this information confidential.
                  </p>

                  <h2 className="text-xl font-bold text-neutral-900 pt-4">
                    5. Contact Us
                  </h2>
                  <p>
                    If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at <a href="mailto:info@godivatech.com" className="text-primary hover:underline font-medium">info@godivatech.com</a> or call us at <a href="tel:+919600520130" className="text-primary hover:underline font-medium">+91 96005 20130</a>.
                  </p>
                </div>
              </div>
            </TransitionItem>
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default Privacy;

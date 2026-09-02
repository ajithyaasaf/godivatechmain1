import React from "react";
import PageTransition, { TransitionItem } from "@/components/PageTransition";
import SEO from "@/components/SEO";
import { getOrganizationData, getWebPageData, getBreadcrumbData } from "@/lib/structuredData";
import { FileCheck, BookOpen, CheckCircle, HelpCircle } from "lucide-react";

const Terms = () => {
  const structuredData = [
    getOrganizationData(),
    getWebPageData(
      "Terms of Service | GodivaTech",
      "Read the terms and conditions governing the use of GodivaTech's services and website.",
      "https://godivatech.com/terms"
    ),
    getBreadcrumbData([
      { name: "Home", item: "https://godivatech.com/" },
      { name: "Terms of Service", item: "https://godivatech.com/terms" }
    ])
  ];

  return (
    <>
      <SEO
        title="Terms of Service | GodivaTech"
        description="Review GodivaTech's Terms of Service for digital marketing, mobile app development, and web solutions."
        canonicalUrl="/terms"
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
                    <FileCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Terms of Service</h1>
                    <p className="text-neutral-500 text-sm mt-1">Last Updated: January 2026</p>
                  </div>
                </div>

                <div className="prose prose-neutral max-w-none space-y-6 text-neutral-700 leading-relaxed">
                  <p>
                    Welcome to <strong>GodivaTech</strong>. By accessing our website at <a href="https://godivatech.com" className="text-primary hover:underline">https://godivatech.com</a> and using our services, you agree to comply with and be bound by the following terms and conditions.
                  </p>

                  <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2 pt-4">
                    <BookOpen className="w-5 h-5 text-primary" /> 1. Scope of Services
                  </h2>
                  <p>
                    GodivaTech provides custom web development, mobile application development, UI/UX design, search engine optimization (SEO), digital marketing, and branding services. All projects are governed by individual client proposals, scope of work documents, and formal agreements.
                  </p>

                  <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2 pt-4">
                    <CheckCircle className="w-5 h-5 text-primary" /> 2. Intellectual Property Rights
                  </h2>
                  <p>
                    Unless otherwise stated in a project contract, upon full payment for development services, intellectual property rights for custom code and design assets created specifically for the client are transferred to the client. GodivaTech retains the right to showcase completed works in our portfolio.
                  </p>

                  <h2 className="text-xl font-bold text-neutral-900 pt-4">
                    3. Client Responsibilities
                  </h2>
                  <p>
                    Clients agree to provide necessary materials, content, brand assets, and feedback in a timely manner to facilitate project delivery according to agreed schedules.
                  </p>

                  <h2 className="text-xl font-bold text-neutral-900 pt-4">
                    4. Limitation of Liability
                  </h2>
                  <p>
                    GodivaTech shall not be held liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our services, third-party hosting downtimes, or external cyber incidents beyond our reasonable control.
                  </p>

                  <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2 pt-4">
                    <HelpCircle className="w-5 h-5 text-primary" /> 5. Inquiries & Clarifications
                  </h2>
                  <p>
                    If you have questions regarding our Terms of Service, please reach out via email at <a href="mailto:info@godivatech.com" className="text-primary hover:underline font-medium">info@godivatech.com</a>.
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

export default Terms;

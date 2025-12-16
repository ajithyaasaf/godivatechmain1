import React, { useState } from 'react';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { getFaqData } from '@/lib/structuredData';

type FAQ = {
  question: string;
  answer: string;
};

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  faqs: FAQ[];
  className?: string;
  structuredData?: boolean;
  canonicalUrl?: string;
}

/**
 * FAQ Section Component with Schema.org structured data
 * 
 * This component renders an accessible, animated FAQ section that automatically includes
 * FAQPage schema for improved SEO and rich results in Google search.
 */
const FAQSection: React.FC<FAQSectionProps> = ({
  title = "Frequently Asked Questions",
  subtitle,
  faqs,
  className = "",
  structuredData = true,
  canonicalUrl
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Use proper semantic HTML for better SEO/accessibility
  return (
    <LazyMotion features={domAnimation}>
      <section className={`py-12 bg-white ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {title && (
            <h2 className="text-3xl font-bold text-center text-neutral-800 mb-4">
              {title}
            </h2>
          )}
          
          {subtitle && (
            <p className="text-center text-neutral-600 mb-10 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
          
          {/* Include structured data for SEO */}
          {structuredData && (
            <script 
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(getFaqData(faqs, canonicalUrl))
              }}
            />
          )}
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="border border-neutral-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex justify-between items-center w-full p-4 text-left font-medium text-neutral-800 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="flex-1 pr-4">{faq.question}</span>
                  <m.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-5 w-5 text-neutral-500" />
                  </m.div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <m.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div 
                        className="p-4 pt-0 text-neutral-700 bg-white border-t border-neutral-100"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    </LazyMotion>
  );
};

export default FAQSection;
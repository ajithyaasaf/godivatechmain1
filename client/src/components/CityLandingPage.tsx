import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import PageTransition, { TransitionItem } from "@/components/PageTransition";
import SEO from "@/components/SEO";
import { ArrowRight } from "lucide-react";
import { 
  getOrganizationData, 
  getWebPageData,
  getBreadcrumbData 
} from "@/lib/structuredData";

interface CityLandingPageProps {
  city: string;
  district: string;
  industryFocus: string;
  landmark: string;
  metaDescription: string;
  industryText: string;
}

const CityLandingPage: React.FC<CityLandingPageProps> = ({
  city,
  district,
  industryFocus,
  landmark,
  metaDescription,
  industryText
}) => {
  const structuredData = [
    getOrganizationData(),
    getWebPageData(
      `Web Design & Digital Marketing in ${city} | ${industryFocus}`,
      metaDescription,
      `https://godivatech.com/web-design-${city.toLowerCase().replace(/\s+/g, '-')}`
    ),
    getBreadcrumbData([
      { name: "Home", item: "https://godivatech.com/" },
      { name: "Areas We Serve", item: "https://godivatech.com/areas-we-serve" },
      { name: city, item: `https://godivatech.com/web-design-${city.toLowerCase().replace(/\s+/g, '-')}` }
    ])
  ];

  return (
    <>
      <SEO
        title={`Web Design & Digital Marketing in ${city} | ${industryFocus}`}
        description={metaDescription}
        keywords={[`web design ${city}`, `digital marketing ${city}`, industryFocus, `${city} web services`].join(", ")}
        canonicalUrl={`/web-design-${city.toLowerCase().replace(/\s+/g, '-')}`}
        ogType="website"
        ogImage="/images/services-og-image.jpg"
        imageWidth={1200}
        imageHeight={630}
        cityName={city}
        regionName="Tamil Nadu"
        countryName="India"
        twitterCard="summary_large_image"
        twitterSite="@godivatech"
        twitterCreator="@godivatech"
        robots="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        alternateUrls={[
          { hrefLang: "en-in", href: `https://godivatech.com/web-design-${city.toLowerCase().replace(/\s+/g, '-')}` }
        ]}
        structuredData={structuredData}
      />

      <PageTransition>
        <div className="relative">
          {/* Hero Section */}
          <TransitionItem>
            <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-70" />
              <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl opacity-70" />

              <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                  className="text-center mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                >
                  <div className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 mb-6">
                    <span className="text-sm font-semibold">{district} District</span>
                  </div>
                  <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                    Web Design in {city}
                  </h1>
                  <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-4">
                    Specialized Services for {industryFocus}
                  </p>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Your trusted local partner in {landmark}
                  </p>
                </motion.div>
              </div>
            </section>
          </TransitionItem>

          {/* Industry Focus Section */}
          <TransitionItem delay={0.1}>
            <section className="py-16 md:py-24 bg-white">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                  <motion.div
                    className="bg-blue-50 border border-blue-200 rounded-2xl p-8 md:p-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                      Why {city} Needs Digital Visibility
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                      {industryText}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                        {industryFocus}
                      </span>
                      <span className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm">
                        Local SEO
                      </span>
                      <span className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm">
                        B2B Export Ready
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>
          </TransitionItem>

          {/* Services Section */}
          <TransitionItem delay={0.2}>
            <section className="py-16 md:py-24 bg-gray-50">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
                  Our Services for {city} Businesses
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      title: "Local SEO Optimization",
                      description: "Get found by customers searching for your services in " + city
                    },
                    {
                      title: "Professional Websites",
                      description: "Modern, fast-loading websites that establish credibility"
                    },
                    {
                      title: "E-Commerce Solutions",
                      description: "Sell your products online with integrated inventory and payments"
                    },
                    {
                      title: "Digital Marketing",
                      description: "Google Ads, Facebook marketing tailored for " + city + " market"
                    },
                    {
                      title: "B2B Export Portals",
                      description: "Reach national and international buyers with professional catalogs"
                    },
                    {
                      title: "Mobile-First Design",
                      description: "Perfect experience on all devices for your local customers"
                    }
                  ].map((service, idx) => (
                    <motion.div
                      key={idx}
                      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {service.title}
                      </h3>
                      <p className="text-gray-600">{service.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </TransitionItem>

          {/* CTA Section */}
          <TransitionItem delay={0.3}>
            <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-indigo-600">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  className="max-w-2xl mx-auto text-center text-white"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h3 className="text-3xl md:text-4xl font-bold mb-6">
                    Ready to Grow Your Business Online?
                  </h3>
                  <p className="text-lg text-blue-100 mb-8">
                    Let's discuss how Godiva Tech can help your {city} business reach customers across Tamil Nadu and beyond.
                  </p>
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50 rounded-full px-8"
                  >
                    <Link href="/contact" className="flex items-center gap-2">
                      Schedule a Free Consultation
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </section>
          </TransitionItem>

          {/* Back to Hub */}
          <TransitionItem delay={0.4}>
            <section className="py-8 bg-white border-t border-gray-200">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-gray-600 mb-4">
                  Looking for services in other areas?
                </p>
                <Link href="/areas-we-serve">
                  <a className="text-blue-600 font-semibold hover:underline flex items-center justify-center gap-2">
                    View All Service Areas
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Link>
              </div>
            </section>
          </TransitionItem>
        </div>
      </PageTransition>
    </>
  );
};

export default CityLandingPage;

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import PageTransition, { TransitionItem } from "@/components/PageTransition";
import SEO from "@/components/SEO";
import { pageKeywords } from "@/lib/seoKeywords";
import {
  getOrganizationData,
  getWebPageData,
  getBreadcrumbData
} from "@/lib/structuredData";
import { ArrowRight } from "lucide-react";

const AreasWeServe = () => {
  // SEO structured data
  const structuredData = [
    getOrganizationData(),
    getWebPageData(
      "Service Areas | Godiva Tech Web Design Madurai",
      "Godiva Tech serves businesses across Madurai, Virudhunagar, Ramanathapuram, and Sivaganga districts. Local web design & digital marketing services tailored to regional industries.",
      "https://godivatech.com/areas-we-serve"
    ),
    getBreadcrumbData([
      { name: "Home", item: "https://godivatech.com/" },
      { name: "Areas We Serve", item: "https://godivatech.com/areas-we-serve" }
    ])
  ];

  const districts = [
    {
      name: "Madurai District",
      color: "from-blue-500 to-blue-600",
      cities: [
        {
          name: "Madurai City (Headquarters)",
          description: "Serving Iyer Bungalow, Anna Nagar, KK Nagar, and Bypass Road.",
          slug: "/",
          featured: true
        },
        {
          name: "Melur",
          description: "Granite & Agriculture industries.",
          slug: "/web-design-melur"
        },
        {
          name: "Thirumangalam",
          description: "Industrial estate & logistics support.",
          slug: "/web-design-thirumangalam"
        }
      ]
    },
    {
      name: "Virudhunagar District",
      color: "from-indigo-500 to-indigo-600",
      cities: [
        {
          name: "Rajapalayam",
          description: "Specialized E-commerce for Surgical Cotton, Textile Mills, and Mango Pulp exporters.",
          slug: "/web-design-rajapalayam",
          featured: true
        },
        {
          name: "Sivakasi",
          description: "Digital catalogs for Printing, Fireworks, and Safety Match industries.",
          slug: "/web-design-sivakasi",
          featured: true
        },
        {
          name: "Aruppukottai",
          description: "Solutions for Spinning Mills & Handloom Weavers.",
          slug: "/web-design-aruppukottai"
        }
      ]
    },
    {
      name: "Ramnad & Sivaganga",
      color: "from-purple-500 to-purple-600",
      cities: [
        {
          name: "Ramanathapuram",
          description: "Websites for Solar Energy (Kamuthi), Seafood Exports, and Logistics.",
          slug: "/web-design-ramanathapuram",
          featured: true
        },
        {
          name: "Paramakudi",
          description: "Digital marketing for Chilli Trading & Charcoal industries.",
          slug: "/web-design-paramakudi"
        },
        {
          name: "Manamadurai",
          description: "Support for SIPCOT manufacturers & Agro-processing.",
          slug: "/web-design-manamadurai"
        }
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <>
      <SEO
        title="Service Areas | Godiva Tech Web Design Madurai"
        description="Godiva Tech serves businesses across Madurai, Virudhunagar, Ramanathapuram, and Sivaganga districts. Local web design & digital marketing services tailored to regional industries."
        keywords={["web design Madurai", "digital marketing Rajapalayam", "areas we serve", "service areas", "southern tamil nadu"].join(", ")}
        canonicalUrl="/areas-we-serve"
        ogType="website"
        ogImage="/images/services-og-image.jpg"
        imageWidth={1200}
        imageHeight={630}
        cityName="Madurai"
        regionName="Tamil Nadu"
        countryName="India"
        twitterCard="summary_large_image"
        twitterSite="@godivatech"
        twitterCreator="@godivatech"
        robots="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        alternateUrls={[
          { hrefLang: "en-in", href: "https://godivatech.com/areas-we-serve" },
          { hrefLang: "ta-in", href: "https://godivatech.com/ta/areas-we-serve" }
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
                  className="text-center mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                    Serving Southern Tamil Nadu
                  </h1>
                  <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                    We bring Madurai-quality IT solutions to your doorstep. From the textile hubs of Rajapalayam to the trading centers of Paramakudi, we help local businesses go global.
                  </p>
                </motion.div>
              </div>
            </section>
          </TransitionItem>

          {/* Districts Grid */}
          <TransitionItem delay={0.2}>
            <section className="py-16 md:py-24 bg-white">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  {districts.map((district, districtIdx) => (
                    <motion.div
                      key={districtIdx}
                      variants={itemVariants}
                      className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      {/* District Header */}
                      <div className={`bg-gradient-to-r ${district.color} p-6 text-white`}>
                        <h2 className="text-2xl font-bold">{district.name}</h2>
                      </div>

                      {/* Cities List */}
                      <div className="p-8">
                        <ul className="space-y-6">
                          {district.cities.map((city, cityIdx) => (
                            <motion.li
                              key={cityIdx}
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              transition={{ delay: cityIdx * 0.1 }}
                            >
                              <Link href={city.slug}>
                                <a className="group">
                                  <h3 className={`font-${city.featured ? "semibold" : "medium"} text-gray-900 group-hover:text-blue-600 transition-colors ${city.featured ? "text-lg" : ""}`}>
                                    {city.name}
                                  </h3>
                                </a>
                              </Link>
                              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                                {city.description}
                              </p>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>
          </TransitionItem>

          {/* CTA Section */}
          <TransitionItem delay={0.4}>
            <section className="py-16 md:py-24 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  className="max-w-2xl mx-auto text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Don't see your city?
                  </h3>
                  <p className="text-lg text-gray-700 mb-8">
                    We serve the entire Southern Tamil Nadu region. Contact our Madurai headquarters to discuss how we can help your business.
                  </p>
                  <Button
                    asChild
                    size="lg"
                    className="bg-blue-600 text-white hover:bg-blue-700 rounded-full px-8"
                  >
                    <Link href="/contact" className="flex items-center gap-2">
                      Get a Quote
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </section>
          </TransitionItem>
        </div>
      </PageTransition>
    </>
  );
};

export default AreasWeServe;

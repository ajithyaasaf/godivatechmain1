import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  ChevronDown, 
  Send, 
  CheckCircle, 
  Mail, 
  Phone,
  Code2,
  Users,
  GraduationCap
} from "lucide-react";
import SEO from "@/components/SEO";
import PageTransition, { TransitionItem } from "@/components/PageTransition";
import CTASection from "@/components/home/CTASection";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { trackEvent, trackFormSubmission } from "@/lib/analytics";
import { JOB_OPENINGS, type JobOpening } from "@shared/careers-data";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Careers = () => {
  const { toast } = useToast();
  const [expandedJob, setExpandedJob] = useState<string | null>("ui-ux-designer");
  
  // Application Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    resumeUrl: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Apply button click
  const handleApplyClick = (jobTitle: string) => {
    setFormData((prev) => ({ ...prev, position: jobTitle }));
    const formElement = document.getElementById("apply-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.position) {
      toast({
        title: "Please fill required fields",
        description: "Name, email, and position are required.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const subjectText = `Job Application: ${formData.position} - ${formData.name}`;
      const messageContent = `
Job Application Details:
------------------------
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || "Not provided"}
Position: ${formData.position}
Resume Link: ${formData.resumeUrl || "Not provided"}

Message / Note:
${formData.message || "None"}
      `.trim();

      await apiRequest("POST", "/api/contact", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "+91 96005 20130",
        subject: subjectText,
        message: messageContent
      });

      toast({
        title: "Application Received",
        description: "Thank you for applying. We will review your profile and reach out to you."
      });

      trackFormSubmission("career_application", true);
      trackEvent("career_application", "submit", formData.position);

      setFormData({
        name: "",
        email: "",
        phone: "",
        position: "",
        resumeUrl: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "Error submitting application",
        description: "Please try again or send your resume to info@godivatech.com",
        variant: "destructive"
      });
      trackFormSubmission("career_application", false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Careers | Job Openings at Godiva Technologies"
        description="Explore career opportunities at Godiva Technologies in Madurai & Rajapalayam. We are hiring web developers, UI/UX designers, and digital marketers."
        keywords="careers at godivatech, web developer jobs madurai, UI UX designer jobs madurai, tech jobs rajapalayam"
        canonicalUrl="/careers"
        ogType="website"
      />

      <PageTransition>
        <div className="relative">
          {/* ================= HERO SECTION ================= */}
          <TransitionItem>
            <section className="relative py-20 lg:py-24 bg-gradient-to-br from-primary via-blue-700 to-indigo-900 text-white overflow-hidden">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
                <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 text-white text-xs font-semibold tracking-wide uppercase mb-4 border border-white/20">
                  We're Hiring
                </span>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                  Careers at GodivaTech
                </h1>
                <p className="text-lg text-blue-100 leading-relaxed">
                  Join our team in Madurai & Rajapalayam. We build websites, software, and marketing strategies that help businesses grow.
                </p>
              </div>
            </section>
          </TransitionItem>

          {/* ================= WHY WORK WITH US ================= */}
          <TransitionItem>
            <section className="py-16 bg-neutral-50 border-b border-neutral-200">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <h2 className="text-2xl sm:text-3xl font-bold text-neutral-800 mb-3">
                    Working at GodivaTech
                  </h2>
                  <p className="text-neutral-600">
                    A collaborative and friendly workplace focused on learning and real client impact.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                      <Code2 className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-800 mb-2">Modern Technology</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      Work with modern stacks including React, TypeScript, Node.js, Next.js, and cloud platforms.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-800 mb-2">Continuous Learning</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      Learn directly from senior engineers and gain practical hands-on experience on live client projects.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                      <Users className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-800 mb-2">Friendly Environment</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      Open communication, flexible hybrid options, and a supportive team that values your ideas.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </TransitionItem>

          {/* ================= OPEN POSITIONS LIST ================= */}
          <TransitionItem>
            <section className="py-16 bg-white">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <div className="text-center mb-12">
                  <h2 className="text-2xl sm:text-3xl font-bold text-neutral-800 mb-3">
                    Current Openings
                  </h2>
                  <p className="text-neutral-600">
                    Find the role that fits your skill set and experience.
                  </p>
                </div>

                <div className="space-y-4">
                  {JOB_OPENINGS.map((job) => {
                    const isExpanded = expandedJob === job.id;
                    return (
                      <div
                        key={job.id}
                        className="border border-neutral-200 rounded-xl overflow-hidden shadow-sm transition-all"
                      >
                        {/* Job Row Header */}
                        <div
                          onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                          className="p-6 bg-white hover:bg-neutral-50 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                                {job.department}
                              </span>
                              <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                                {job.type}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-neutral-800">{job.title}</h3>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 mt-1.5">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Briefcase className="w-3.5 h-3.5" />
                                {job.experience}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApplyClick(job.title);
                              }}
                              className="bg-primary hover:bg-primary/90 text-white text-sm"
                            >
                              Apply
                            </Button>
                            <ChevronDown
                              className={`w-5 h-5 text-neutral-400 transition-transform duration-200 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </div>

                        {/* Accordion Details */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border-t border-neutral-100 bg-neutral-50/60 p-6 space-y-4 text-sm text-neutral-700"
                            >
                              <div>
                                <h4 className="font-semibold text-neutral-800 mb-1">Role Overview</h4>
                                <p className="text-neutral-600">{job.overview}</p>
                              </div>

                              <div>
                                <h4 className="font-semibold text-neutral-800 mb-2">Key Responsibilities</h4>
                                <ul className="space-y-1.5 pl-1">
                                  {job.responsibilities.map((r, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-neutral-600">
                                      <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                      <span>{r}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h4 className="font-semibold text-neutral-800 mb-2">Requirements</h4>
                                <ul className="space-y-1.5 pl-1">
                                  {job.requirements.map((req, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-neutral-600">
                                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                                      <span>{req}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="pt-2">
                                <Button
                                  onClick={() => handleApplyClick(job.title)}
                                  className="bg-primary hover:bg-primary/90 text-white text-sm"
                                >
                                  Apply for {job.title}
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </TransitionItem>

          {/* ================= APPLICATION FORM ================= */}
          <TransitionItem>
            <section id="apply-form" className="py-16 bg-neutral-50 border-t border-neutral-200">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
                <div className="bg-white p-8 sm:p-10 rounded-2xl border border-neutral-200 shadow-md">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-neutral-800 mb-2">
                      Apply Online
                    </h2>
                    <p className="text-sm text-neutral-600">
                      Fill in your details below and we will get back to you shortly.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                          Email Address *
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email address"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                          Phone Number
                        </label>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Position Applying For *
                      </label>
                      <select
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        required
                        className="w-full h-10 px-3 rounded-md border border-neutral-300 bg-white text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Select a position...</option>
                        {JOB_OPENINGS.map((job) => (
                          <option key={job.id} value={job.title}>
                            {job.title}
                          </option>
                        ))}
                        <option value="General Application">Other / General Application</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Resume Link (Google Drive / LinkedIn / Portfolio)
                      </label>
                      <Input
                        type="url"
                        name="resumeUrl"
                        value={formData.resumeUrl}
                        onChange={handleInputChange}
                        placeholder="https://drive.google.com/... or LinkedIn URL"
                      />
                      <p className="text-xs text-neutral-500 mt-1">
                        Paste a public Google Drive or LinkedIn link to your resume.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Short Message / Note
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Tell us briefly about your background and experience..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-medium"
                    >
                      {isSubmitting ? "Submitting Application..." : "Submit Application"}
                    </Button>
                  </form>

                  <div className="mt-6 pt-6 border-t border-neutral-200 text-center text-xs text-neutral-500">
                    Prefer email? Send your resume directly to{" "}
                    <a href="mailto:info@godivatech.com" className="text-primary font-semibold hover:underline">
                      info@godivatech.com
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </TransitionItem>

          <TransitionItem>
            <CTASection />
          </TransitionItem>
        </div>
      </PageTransition>
    </>
  );
};

export default Careers;

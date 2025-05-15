import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon, LinkedinIcon, TwitterIcon, FacebookIcon, InstagramIcon } from "lucide-react";
import { trackEvent, trackFormSubmission } from "@/lib/analytics";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    privacyPolicy: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, privacyPolicy: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track form interaction event
    trackEvent('contact_form_submit_attempt', 'engagement', 'Contact Form');
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      
      // Track validation error for SEO form optimization
      trackEvent(
        'form_validation_error', 
        'engagement', 
        'Contact Form',
        undefined,
        false,
        { 
          form_type: 'contact',
          error_type: 'missing_required_fields' 
        }
      );
      
      return;
    }

    if (!formData.privacyPolicy) {
      toast({
        title: "Error",
        description: "Please agree to the privacy policy",
        variant: "destructive",
      });
      
      // Track privacy policy error
      trackEvent(
        'form_validation_error', 
        'engagement', 
        'Contact Form',
        undefined,
        false,
        { 
          form_type: 'contact',
          error_type: 'privacy_policy_not_accepted' 
        }
      );
      
      return;
    }

    setIsSubmitting(true);
    
    try {
      await apiRequest('POST', '/api/contact', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });
      
      toast({
        title: "Success",
        description: "Your message has been sent. We'll get back to you soon!",
      });
      
      // Track successful form submission for conversion tracking
      trackFormSubmission('contact_form', true);
      
      // Track additional conversion details for SEO analysis
      trackEvent(
        'lead_generated', 
        'conversion', 
        formData.subject,
        undefined,
        false,
        { 
          lead_type: 'contact_form',
          lead_source: window.location.pathname,
          lead_subject: formData.subject
        }
      );
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        privacyPolicy: false,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
      
      // Track form submission failure
      trackFormSubmission('contact_form', false);
      
      // Track error for debugging and optimization
      trackEvent(
        'form_submission_error',
        'error',
        'Contact Form',
        undefined,
        false,
        { error_type: 'api_failure' }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">Get In Touch</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Have a question or ready to start a project? Contact us today to discuss how we can help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow p-8 h-full">
              <h3 className="text-xl font-semibold text-neutral-800 mb-6">Contact Information</h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 shrink-0">
                    <MapPinIcon className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800 mb-1">Our Office</p>
                    <p className="text-neutral-600">
                      261, Vaigai Mainroad 4th Street<br />
                      Sri Nagar, Iyer Bungalow<br />
                      Madurai 625007, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 shrink-0">
                    <PhoneIcon className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800 mb-1">Phone</p>
                    <p className="text-neutral-600">+91 96005 20130</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 shrink-0">
                    <MailIcon className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800 mb-1">Email</p>
                    <p className="text-neutral-600">info@godivatech.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 shrink-0">
                    <ClockIcon className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800 mb-1">Business Hours</p>
                    <p className="text-neutral-600">
                      Monday - Friday: 9am - 5pm<br />
                      Saturday - Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-medium text-neutral-800 mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    aria-label="LinkedIn"
                  >
                    <LinkedinIcon className="h-5 w-5" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    aria-label="Twitter"
                  >
                    <TwitterIcon className="h-5 w-5" />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    aria-label="Facebook"
                  >
                    <FacebookIcon className="h-5 w-5" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    aria-label="Instagram"
                  >
                    <InstagramIcon className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-xl font-semibold text-neutral-800 mb-6">Send Us a Message</h3>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-neutral-700 font-medium mb-2">
                      Your Name *
                    </label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full py-3 px-4 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-neutral-700 font-medium mb-2">
                      Your Email *
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full py-3 px-4 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="phone" className="block text-neutral-700 font-medium mb-2">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full py-3 px-4 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="+91 96005 20130"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="subject" className="block text-neutral-700 font-medium mb-2">
                    Subject *
                  </label>
                  <Input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full py-3 px-4 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="How can we help you?"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-neutral-700 font-medium mb-2">
                    Your Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full py-3 px-4 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Please provide details about your project or inquiry..."
                    required
                  />
                </div>

                <div className="mb-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="privacy-policy"
                      checked={formData.privacyPolicy}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <label
                      htmlFor="privacy-policy"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the{" "}
                      <a href="/privacy" className="text-primary hover:underline">
                        privacy policy
                      </a>
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

import React, { memo, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaLinkedin, FaTwitter } from "react-icons/fa";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { Link } from "wouter";
import { Users, ArrowRight } from "lucide-react";
import ceoImage from "../../assets/team/ceo.jpg";
import OptimizedImage from "@/components/ui/optimized-image";

interface TeamMember {
  id: number;
  name: string;
  position: string;
  bio: string;
  image: string;
  linkedIn?: string;
  twitter?: string;
}

// Optimized for performance with memoization
const TeamMemberCard = memo(({ member, index }: { member: TeamMember; index: number }) => {
  // Calculate staggered animation delay based on index
  const animationDelay = useMemo(() => Math.min(index * 0.1, 0.5), [index]);
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      style={{ 
        willChange: "transform", 
        animationDelay: `${animationDelay}s` 
      }}
    >
      <div className="relative">
        <OptimizedImage
          src={member.image}
          alt={`${member.name} - ${member.position}`}
          className="w-full h-64 object-cover object-center"
          width={400}
          height={256}
        />
        {/* Static gradient overlay instead of animation */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-primary mb-1 border-b border-primary pb-2">{member.name}</h3>
        <p className="text-neutral-700 font-medium mt-3 mb-3">{member.position}</p>
        <p className="text-neutral-600 mb-4 line-clamp-3 hover:line-clamp-none transition-all duration-300">{member.bio}</p>
        <div className="flex space-x-3">
          {member.linkedIn && (
            <a
              href={member.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-primary transition-colors"
              aria-label={`${member.name}'s LinkedIn profile`}
            >
              <FaLinkedin />
            </a>
          )}
          {member.twitter && (
            <a
              href={member.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-primary transition-colors"
              aria-label={`${member.name}'s Twitter profile`}
            >
              <FaTwitter />
            </a>
          )}
        </div>
      </div>
    </div>
  );
});

// Apply displayName for React DevTools
TeamMemberCard.displayName = "TeamMemberCard";

// Optimize with memoization
const TeamSection = memo(() => {
  const { data: teamMembers = [] } = useQuery<TeamMember[]>({
    queryKey: ['/api/team-members'],
  });

  // Memoize default team members to avoid re-creating on each render
  const defaultTeamMembers = useMemo(() => [
    {
      id: 1,
      name: "Ananth",
      position: "Founder & CEO",
      bio: "Founded Godiva Technologies in 2012 with a vision to provide innovative web solutions and digital transformation services to businesses worldwide.",
      image: ceoImage,
      linkedIn: "https://linkedin.com",
      twitter: "https://twitter.com"
    },
    {
      id: 2,
      name: "Priya Sankar",
      position: "Creative Director",
      bio: "Leads our creative design team with over 8 years of experience in branding and visual communications.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      linkedIn: "https://linkedin.com",
      twitter: "https://twitter.com"
    },
    {
      id: 3,
      name: "Karthik Rajan",
      position: "Technical Lead",
      bio: "Heads our web development team with expertise in responsive design and modern frameworks.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      linkedIn: "https://linkedin.com",
      twitter: "https://twitter.com"
    },
    {
      id: 4,
      name: "Meena Krishnan",
      position: "Digital Marketing Specialist",
      bio: "Manages our digital marketing strategies with a focus on SEO, content marketing, and social media campaigns.",
      image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      linkedIn: "https://linkedin.com",
      twitter: "https://twitter.com"
    }
  ], []);

  // Memoize to avoid recalculation on re-renders
  const displayTeamMembers = useMemo(() => 
    teamMembers.length > 0 ? teamMembers : defaultTeamMembers
  , [teamMembers, defaultTeamMembers]);

  return (
    <section className="py-20 bg-neutral-50 relative">
      {/* Subtle background pattern for visual interest without heavy animations */}
      <div className="absolute inset-0 opacity-5 
        [background-image:radial-gradient(#4f46e520_1px,transparent_1px)] 
        [background-size:20px_20px]"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <LazyMotion features={domAnimation} strict>
          <m.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">Talented Web Developers & Digital Marketing Experts</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Meet our team of experienced professionals who are passionate about creating innovative digital solutions and delivering exceptional website development and marketing results for our clients in Madurai and beyond.
            </p>
          </m.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {displayTeamMembers.map((member, index) => (
              <m.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ 
                  duration: 0.5,
                  delay: Math.min(0.1 * index, 0.3),
                  ease: "easeOut"
                }}
                style={{ willChange: "transform, opacity" }}
              >
                <TeamMemberCard 
                  member={member}
                  index={index}
                />
              </m.div>
            ))}
          </div>
          
          {/* View Team link for internal linking */}
          <div className="text-center">
            <Link 
              href="/about#team" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-full
                        bg-white border border-primary/20 text-primary font-semibold
                        shadow-md hover:shadow-xl transition-all duration-300
                        hover:scale-105 hover:bg-primary/5 active:scale-95"
            >
              <Users className="mr-2 h-4 w-4" />
              Meet Our Full Team
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </LazyMotion>
      </div>
    </section>
  );
});

// Apply displayName for React DevTools
TeamSection.displayName = "TeamSection";

export default TeamSection;

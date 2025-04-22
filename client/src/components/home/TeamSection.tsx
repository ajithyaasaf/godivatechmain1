import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaLinkedin, FaTwitter } from "react-icons/fa";
import ceoImage from "../../assets/team/ceo.jpg";

interface TeamMember {
  id: number;
  name: string;
  position: string;
  bio: string;
  image: string;
  linkedIn?: string;
  twitter?: string;
}

const TeamMemberCard = ({ member }: { member: TeamMember }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <img
        src={member.image}
        alt={`${member.name} - ${member.position}`}
        className="w-full h-64 object-cover"
      />
      <div className="p-6">
        <h3 className="text-2xl font-bold text-primary mb-1 border-b border-primary pb-2">{member.name}</h3>
        <p className="text-neutral-700 font-medium mt-3 mb-3">{member.position}</p>
        <p className="text-neutral-600 mb-4">{member.bio}</p>
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
};

const TeamSection = () => {
  const { data: teamMembers = [] } = useQuery<TeamMember[]>({
    queryKey: ['/api/team-members'],
  });

  // Default team members in case API doesn't return data
  const defaultTeamMembers = [
    {
      id: 1,
      name: "Srinivas Reddy",
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
  ];

  const displayTeamMembers = teamMembers.length > 0 ? teamMembers : defaultTeamMembers;

  return (
    <section className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">Leadership Team</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Meet our leadership team of experienced professionals who are passionate about creating innovative digital solutions and delivering exceptional results for our clients worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayTeamMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;

import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronRightIcon } from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  technologies: string[];
  link?: string;
}

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="bg-neutral-50 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 right-4 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
          {project.category}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-neutral-800 mb-2">{project.title}</h3>
        <p className="text-neutral-600 mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className="bg-neutral-200 text-neutral-700 text-xs font-medium px-2.5 py-1 rounded"
            >
              {tech}
            </span>
          ))}
        </div>
        <Link
          href={project.link || "/portfolio"}
          className="text-primary font-medium hover:text-primary/90 transition duration-150 flex items-center"
        >
          View Case Study <ChevronRightIcon className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

const PortfolioSection = () => {
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  // Default projects in case API doesn't return data
  const defaultProjects = [
    {
      id: 1,
      title: "Tilted – Email Campaign",
      description: "Created engaging email campaign designs to maximize customer engagement and conversion rates.",
      image: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Marketing",
      technologies: ["Email Design", "Digital Marketing", "Brand Strategy"]
    },
    {
      id: 2,
      title: "Marakkaar Biryani",
      description: "Developed promotional materials and marketing strategy for this popular food brand to increase visibility.",
      image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Marketing",
      technologies: ["Social Media", "Poster Design", "Brand Promotion"]
    },
    {
      id: 3,
      title: "India Cater",
      description: "Created distinctive marketing materials that showcased the catering company's services and offerings.",
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Marketing",
      technologies: ["Brand Identity", "Poster Design", "Marketing Strategy"]
    },
    {
      id: 4,
      title: "Siddahayur Health Care",
      description: "Designed healthcare marketing materials that effectively communicated wellness services to potential clients.",
      image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Marketing",
      technologies: ["Healthcare Marketing", "Visual Design", "Brand Strategy"]
    },
    {
      id: 5,
      title: "Wrap & Eat",
      description: "Created vibrant promotional materials for this food business to attract customers and build brand recognition.",
      image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Marketing",
      technologies: ["Food Marketing", "Graphic Design", "Branding"]
    },
    {
      id: 6,
      title: "Jeeva Vasal Church",
      description: "Designed compelling poster designs for events and communications that aligned with the organization's mission.",
      image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Marketing",
      technologies: ["Event Promotion", "Community Outreach", "Visual Design"]
    }
  ];

  const displayProjects = projects.length > 0 ? projects : defaultProjects;

  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">Explore our recent projects</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Take a look at our diverse portfolio of successful marketing and web development projects for various clients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            variant="outline"
            className="bg-white border border-primary text-primary hover:bg-primary hover:text-white"
          >
            <Link href="/portfolio">View All Projects</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;

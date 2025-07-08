import { Helmet } from "react-helmet";
import { 
  Code, 
  ExternalLink, 
  Calendar, 
  Star, 
  Github, 
  BarChart3, 
  Users, 
  ArrowUp, 
  ArrowDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AdminLayout from "@/components/admin/AdminLayout";
import ContentDataTable from "@/components/admin/ContentDataTable";
import ProjectForm from "@/components/admin/ProjectForm";

const ProjectsPage = () => {
  // Define columns for the projects data table
  const columns = [
    {
      key: "order",
      title: "Order",
      render: (value: number) => (
        <div className="flex items-center justify-center">
          <span className="font-mono text-sm bg-secondary px-2 py-0.5 rounded-md">
            {value || 0}
          </span>
        </div>
      ),
    },
    {
      key: "title",
      title: "Project Name",
      render: (value: string, item: any) => (
        <div className="flex items-center gap-2">
          <div 
            className="h-10 w-10 rounded-md bg-muted bg-cover bg-center"
            style={{ 
              backgroundImage: item.image ? `url(${item.image})` : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {!item.image && <Code className="h-5 w-5 text-muted-foreground" />}
          </div>
          <div className="space-y-1">
            <div className="font-medium">{value}</div>
            {item.featured && (
              <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                Featured
              </Badge>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "category",
      title: "Category",
      render: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      ),
    },
    {
      key: "clientName",
      title: "Client",
      render: (value: string) => (
        value ? (
          <div className="flex items-center">
            <Users className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            <span>{value}</span>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )
      ),
    },
    {
      key: "technologies",
      title: "Technologies",
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {value && value.map((tech: string, index: number) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "completionDate",
      title: "Date",
      render: (value: string) => (
        value ? (
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            <span>{value}</span>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )
      ),
    },
    {
      key: "links",
      title: "Links",
      render: (_: any, item: any) => (
        <div className="flex items-center gap-2">
          {item.link && (
            <a 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-primary hover:underline"
              title="View live project"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          
          {item.githubLink && (
            <a 
              href={item.githubLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-primary hover:underline"
              title="View GitHub repository"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          
          {(!item.link && !item.githubLink) && (
            <span className="text-muted-foreground text-sm">No links</span>
          )}
        </div>
      ),
    },
    {
      key: "gallery",
      title: "Media",
      render: (value: string[], item: any) => {
        const galleryCount = value?.length || 0;
        const totalImages = (item.image ? 1 : 0) + galleryCount;
        
        return (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {totalImages} {totalImages === 1 ? 'image' : 'images'}
            </Badge>
          </div>
        );
      },
    },
    {
      key: "caseStudy",
      title: "Case Study",
      render: (_: any, item: any) => {
        // Check if case study sections are filled
        const hasChallenge = !!item.challengeDescription;
        const hasSolution = !!item.solutionDescription;
        const hasResults = !!item.resultsDescription;
        const completeness = [hasChallenge, hasSolution, hasResults].filter(Boolean).length;
        
        return (
          <div className="flex items-center gap-1">
            <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{completeness}/3 sections</span>
          </div>
        );
      }
    },
  ];

  return (
    <AdminLayout>
      <Helmet>
        <title>Manage Projects | GodivaTech Admin</title>
      </Helmet>
      
      <ContentDataTable
        title="Projects"
        endpoint="/projects"
        columns={columns}
        renderForm={(project, onSave, onCancel) => (
          <ProjectForm project={project} onSave={onSave} onCancel={onCancel} />
        )}
      />
    </AdminLayout>
  );
};

export default ProjectsPage;
import { Helmet } from "react-helmet";
import { Code, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AdminLayout from "@/components/admin/AdminLayout";
import ContentDataTable from "@/components/admin/ContentDataTable";
import ProjectForm from "@/components/admin/ProjectForm";

const ProjectsPage = () => {
  // Define columns for the projects data table
  const columns = [
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
          <div className="font-medium">{value}</div>
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
      key: "technologies",
      title: "Technologies",
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1 max-w-[250px]">
          {value && value.map((tech: string, index: number) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "link",
      title: "Live Link",
      render: (value: string) => (
        value ? (
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-primary hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1" />
            View
          </a>
        ) : (
          <span className="text-muted-foreground text-sm">No link</span>
        )
      ),
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
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFirestore } from "@/hooks/use-firestore";
import FileUpload from "@/components/admin/FileUpload";
import { Badge } from "@/components/ui/badge";

// Form schema for Projects
const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string().optional().nullable(),
  category: z.string().min(2, "Category is required"),
  technologies: z.array(z.string()).min(1, "At least one technology is required"),
  link: z.string().url("Must be a valid URL").optional().nullable(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const ProjectForm = ({ project, onSave, onCancel }: ProjectFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
    project?.image || null
  );
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(null);
  const [newTech, setNewTech] = useState("");

  const firestore = useFirestore("projects");

  // Initialize form with existing project data or defaults
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      image: project?.image || "",
      category: project?.category || "",
      technologies: project?.technologies || [],
      link: project?.link || "",
    },
  });

  // Handle image upload
  const handleImageUpload = (url: string, path: string) => {
    setUploadedImageUrl(url);
    setUploadedImagePath(path);
    form.setValue("image", url);
  };

  // Handle image removal
  const handleImageRemove = () => {
    setUploadedImageUrl(null);
    setUploadedImagePath(null);
    form.setValue("image", null);
  };

  // Add a technology
  const addTechnology = () => {
    if (newTech.trim() === "") return;
    
    const currentTechs = form.getValues("technologies") || [];
    if (!currentTechs.includes(newTech.trim())) {
      form.setValue("technologies", [...currentTechs, newTech.trim()]);
      setNewTech("");
    }
  };

  // Remove a technology
  const removeTechnology = (tech: string) => {
    const currentTechs = form.getValues("technologies") || [];
    form.setValue(
      "technologies",
      currentTechs.filter((t) => t !== tech)
    );
  };

  // Form submission handler
  const onSubmit = async (values: ProjectFormValues) => {
    try {
      setIsSubmitting(true);

      // Update image path from uploadedImageUrl if available
      if (uploadedImageUrl) {
        values.image = uploadedImageUrl;
      }

      // For Firebase, we'll handle the save here
      if (project?.id) {
        // Update existing project
        await firestore.update(project.id, values);
      } else {
        // Create new project
        await firestore.add(values);
      }

      // Also call the original onSave for API compatibility
      onSave(values);
    } catch (error) {
      console.error("Error saving project:", error);
      // Form will handle error display via resolver
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Title</FormLabel>
              <FormControl>
                <Input placeholder="Project title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Web Development, Mobile App" {...field} />
                </FormControl>
                <FormDescription>
                  The type of project or primary classification
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://..." 
                    {...field} 
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>
                  Link to the live project or GitHub repository
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Image</FormLabel>
              <FormDescription>
                Upload a screenshot or featured image of the project
              </FormDescription>
              <FormControl>
                <div className="mt-2">
                  <FileUpload
                    onUploadComplete={handleImageUpload}
                    folder="projects"
                    accept="image/*"
                    buttonText="Upload Project Image"
                    showPreview={true}
                    existingFileUrl={field.value || undefined}
                    onRemove={handleImageRemove}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the project, its features, and your role..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="technologies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Technologies Used</FormLabel>
              <FormDescription>
                List the technologies, languages, and tools used in this project
              </FormDescription>
              
              <div className="flex flex-wrap gap-2 mb-2">
                {field.value?.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-sm">
                    {tech}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeTechnology(tech)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Add a technology..."
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTechnology();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addTechnology}
                >
                  Add
                </Button>
              </div>
              
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Project'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProjectForm;
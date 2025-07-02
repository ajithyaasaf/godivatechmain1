import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X, Plus, Trash2, GripVertical } from "lucide-react";

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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Enhanced form schema for Projects with all the new fields
const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  fullDescription: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  gallery: z.array(z.string()).optional().default([]),
  category: z.string().min(2, "Category is required"),
  technologies: z.array(z.string()).min(1, "At least one technology is required"),
  link: z.string().url("Must be a valid URL").optional().nullable(),
  githubLink: z.string().url("Must be a valid URL").optional().nullable(),
  clientName: z.string().optional().nullable(),
  completionDate: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  testimonial: z.string().optional().nullable(),
  challengeDescription: z.string().optional().nullable(),
  solutionDescription: z.string().optional().nullable(),
  resultsDescription: z.string().optional().nullable(),
  order: z.number().int().default(0),
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
  const [newGalleryImages, setNewGalleryImages] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("basic");

  const firestore = useFirestore("projects");

  // Initialize form with existing project data or defaults
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      fullDescription: project?.fullDescription || "",
      image: project?.image || "",
      gallery: project?.gallery || [],
      category: project?.category || "",
      technologies: project?.technologies || [],
      link: project?.link || "",
      githubLink: project?.githubLink || "",
      clientName: project?.clientName || "",
      completionDate: project?.completionDate || "",
      featured: project?.featured || false,
      testimonial: project?.testimonial || "",
      challengeDescription: project?.challengeDescription || "",
      solutionDescription: project?.solutionDescription || "",
      resultsDescription: project?.resultsDescription || "",
      order: project?.order || 0,
    },
  });

  // Handle main image upload
  const handleImageUpload = (url: string, path: string) => {
    setUploadedImageUrl(url);
    setUploadedImagePath(path);
    form.setValue("image", url);
  };

  // Handle main image removal
  const handleImageRemove = () => {
    setUploadedImageUrl(null);
    setUploadedImagePath(null);
    form.setValue("image", null);
  };

  // Handle gallery image upload
  const handleGalleryImageUpload = (url: string) => {
    const currentGallery = form.getValues("gallery") || [];
    form.setValue("gallery", [...currentGallery, url]);
    setNewGalleryImages([...newGalleryImages, url]);
  };

  // Handle gallery image removal
  const handleGalleryImageRemove = (urlToRemove: string) => {
    const currentGallery = form.getValues("gallery") || [];
    form.setValue("gallery", currentGallery.filter(url => url !== urlToRemove));
    setNewGalleryImages(newGalleryImages.filter(url => url !== urlToRemove));
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

  // Handle ordering change
  const handleOrderChange = (change: number) => {
    const currentOrder = form.getValues("order") || 0;
    form.setValue("order", currentOrder + change);
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
        {/* Tabs for organizing the form sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="media">Images</TabsTrigger>
            <TabsTrigger value="case-study">Case Study</TabsTrigger>
            <TabsTrigger value="seo">SEO & Display</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-6 pt-4">
            <div className="grid grid-cols-1 gap-6">
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
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Client or company name" 
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription>
                        The client or company the project was for
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A brief summary of the project (will appear in project cards)..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This short description appears in project cards and listings (around 100-150 characters)
                    </FormDescription>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="completionDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Completion Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="date"
                          placeholder="Select completion date" 
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription>
                        When the project was completed
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Featured Project</FormLabel>
                        <FormDescription>
                          Display this project prominently on the homepage and portfolio
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6 pt-4">
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="fullDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a detailed description of the project..."
                        className="min-h-[200px]"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      A comprehensive description that will appear on the project detail page
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Live Project URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://..." 
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription>
                        Link to the live project
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="githubLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub Repository</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://github.com/..." 
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription>
                        Link to the GitHub repository (if public)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="testimonial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Testimonial</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What the client said about the project or your work..."
                        className="min-h-[100px]"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      A testimonial or quote from the client about this project
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6 pt-4">
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Project Image</FormLabel>
                    <FormDescription>
                      The main image that represents this project (will be shown in cards and headers)
                    </FormDescription>
                    <FormControl>
                      <div className="mt-2">
                        <FileUpload
                          onUploadComplete={handleImageUpload}
                          folder="projects"
                          accept="image/*"
                          buttonText="Upload Featured Image"
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
                name="gallery"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Gallery</FormLabel>
                    <FormDescription>
                      Additional images showcasing different aspects of the project
                    </FormDescription>
                    <FormControl>
                      <div className="mt-2">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          {field.value?.map((imageUrl, index) => (
                            <div key={index} className="relative group">
                              <img 
                                src={imageUrl} 
                                alt={`Gallery image ${index + 1}`} 
                                className="w-full h-auto object-cover rounded-md border border-border aspect-video"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleGalleryImageRemove(imageUrl)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <GripVertical className="h-6 w-6 text-primary-foreground opacity-0 group-hover:opacity-70" />
                              </div>
                            </div>
                          ))}
                          
                          <div className="border border-dashed border-border rounded-md p-6 flex flex-col items-center justify-center">
                            <FileUpload
                              onUploadComplete={(url) => handleGalleryImageUpload(url)}
                              folder="projects/gallery"
                              accept="image/*"
                              buttonText={
                                <>
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Gallery Image
                                </>
                              }
                              showPreview={false}
                            />
                            <p className="text-sm text-muted-foreground mt-2">Upload additional images</p>
                          </div>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          {/* Case Study Tab */}
          <TabsContent value="case-study" className="space-y-6 pt-4">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Case Study</CardTitle>
                  <CardDescription>
                    Provide details about the challenges, solutions, and results of this project
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="challengeDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>The Challenge</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the challenges or problems that needed to be solved..."
                            className="min-h-[100px]"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>
                          What problems or challenges did this project address?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="solutionDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>The Solution</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Explain your approach and how you solved the challenges..."
                            className="min-h-[100px]"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>
                          How did you tackle the problem? What was your approach?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="resultsDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>The Results</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the outcomes and impact of the project..."
                            className="min-h-[100px]"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>
                          What were the outcomes? Any metrics or success stories to share?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* SEO & Display Tab */}
          <TabsContent value="seo" className="space-y-6 pt-4">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Display Settings</CardTitle>
                  <CardDescription>
                    Control how and where this project appears on the site
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Order</FormLabel>
                        <div className="flex items-center gap-4">
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => handleOrderChange(-1)}
                            >
                              <span>-</span>
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => handleOrderChange(1)}
                            >
                              <span>+</span>
                            </Button>
                          </div>
                        </div>
                        <FormDescription>
                          Lower numbers appear first. Projects with the same order will be sorted by date.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Featured Project</FormLabel>
                          <FormDescription>
                            Featured projects are highlighted on the homepage and portfolio
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

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
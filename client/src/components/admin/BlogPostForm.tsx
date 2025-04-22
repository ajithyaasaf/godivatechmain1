import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useFirestore } from "@/hooks/use-firestore";
import FileUpload from "@/components/admin/FileUpload";
import { useCollection } from "@/hooks/use-firestore";

// Form schema for Blog Posts
const blogPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  coverImage: z.string().optional().nullable(),
  authorName: z.string().min(2, "Author name is required"),
  authorImage: z.string().optional().nullable(),
  published: z.boolean().default(false),
  publishedAt: z.string().optional().nullable(),
  categoryId: z.string().min(1, "Category is required"),
});

type BlogPostFormValues = z.infer<typeof blogPostSchema>;

interface BlogPostFormProps {
  post?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const BlogPostForm = ({ post, onSave, onCancel }: BlogPostFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedCoverImageUrl, setUploadedCoverImageUrl] = useState<string | null>(
    post?.coverImage || null
  );
  const [uploadedAuthorImageUrl, setUploadedAuthorImageUrl] = useState<string | null>(
    post?.authorImage || null
  );
  
  const firestore = useFirestore("blog-posts");
  const { data: categories } = useCollection("categories");
  
  // Format date as ISO string or use current date if publishing for the first time
  const formatPublishedDate = () => {
    if (post?.publishedAt) {
      return post.publishedAt;
    }
    
    return format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
  };

  // Initialize form with existing post data or defaults
  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      excerpt: post?.excerpt || "",
      content: post?.content || "",
      coverImage: post?.coverImage || "",
      authorName: post?.authorName || "",
      authorImage: post?.authorImage || "",
      published: post?.published || false,
      publishedAt: post?.publishedAt || null,
      categoryId: post?.categoryId || "",
    },
  });

  // Generate slug from title (only if slug is empty)
  const generateSlug = () => {
    const title = form.getValues("title");
    if (title && !form.getValues("slug")) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      form.setValue("slug", slug);
    }
  };

  // Handle cover image upload
  const handleCoverImageUpload = (url: string) => {
    setUploadedCoverImageUrl(url);
    form.setValue("coverImage", url);
  };

  // Handle cover image removal
  const handleCoverImageRemove = () => {
    setUploadedCoverImageUrl(null);
    form.setValue("coverImage", null);
  };

  // Handle author image upload
  const handleAuthorImageUpload = (url: string) => {
    setUploadedAuthorImageUrl(url);
    form.setValue("authorImage", url);
  };

  // Handle author image removal
  const handleAuthorImageRemove = () => {
    setUploadedAuthorImageUrl(null);
    form.setValue("authorImage", null);
  };

  // Update published date when published status changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "published" && value.published) {
        if (!form.getValues("publishedAt")) {
          form.setValue("publishedAt", formatPublishedDate());
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  // Form submission handler
  const onSubmit = async (values: BlogPostFormValues) => {
    try {
      setIsSubmitting(true);

      // Update image paths from uploaded image URLs if available
      if (uploadedCoverImageUrl) {
        values.coverImage = uploadedCoverImageUrl;
      }
      
      if (uploadedAuthorImageUrl) {
        values.authorImage = uploadedAuthorImageUrl;
      }

      // For Firebase, we'll handle the save here
      if (post?.id) {
        // Update existing post
        await firestore.update(post.id, values);
      } else {
        // Create new post
        await firestore.add(values);
      }

      // Also call the original onSave for API compatibility
      onSave(values);
    } catch (error) {
      console.error("Error saving blog post:", error);
      // Form will handle error display via resolver
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Post title" {...field} onBlur={generateSlug} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL Slug</FormLabel>
                <FormControl>
                  <Input placeholder="post-slug" {...field} />
                </FormControl>
                <FormDescription>
                  Used in the URL (e.g., /blog/post-title)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief summary of the post"
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A short teaser that appears in blog listings
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <div className="mt-2">
                  <FileUpload
                    onUploadComplete={handleCoverImageUpload}
                    folder="blog-covers"
                    accept="image/*"
                    buttonText="Upload Cover Image"
                    showPreview={true}
                    existingFileUrl={field.value || undefined}
                    onRemove={handleCoverImageRemove}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Featured image for the blog post
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories?.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="authorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author Name</FormLabel>
                <FormControl>
                  <Input placeholder="Author's name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="authorImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author Image</FormLabel>
                <FormControl>
                  <div className="mt-2">
                    <FileUpload
                      onUploadComplete={handleAuthorImageUpload}
                      folder="author-images"
                      accept="image/*"
                      buttonText="Upload Author Picture"
                      showPreview={true}
                      existingFileUrl={field.value || undefined}
                      onRemove={handleAuthorImageRemove}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Full blog post content..."
                  className="min-h-[300px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The main content of your blog post
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Published</FormLabel>
                  <FormDescription>
                    Make this post publicly visible
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("published") && (
            <FormField
              control={form.control}
              name="publishedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publication Date</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      value={field.value ? field.value.substring(0, 16) : ""}
                      onChange={(e) => {
                        field.onChange(e.target.value ? new Date(e.target.value).toISOString() : null);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    When this post was or will be published
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

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
              'Save Post'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BlogPostForm;
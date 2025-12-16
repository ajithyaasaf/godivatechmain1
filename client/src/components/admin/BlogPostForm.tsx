import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  Loader2,
  Check,
  X,
  AlertCircle,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  ChevronDown
} from "lucide-react";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useFirestore } from "@/hooks/use-firestore";
import FileUpload from "@/components/admin/FileUpload";
import { useCollection } from "@/hooks/use-firestore";

// Enhanced Zod schema with better validation
const blogPostSchema = z.object({
  // Title with soft validation (warning) and hard limit for extremes
  title: z.string()
    .min(30, "Title too short - aim for 50-60 characters for optimal SEO")
    .max(70, "Title too long - Google may truncate. Keep under 60 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  // Excerpt with meta description fallback requirements (120-160 chars)
  excerpt: z.string()
    .min(120, "Excerpt too short - should be 120-160 characters (works as meta description fallback)")
    .max(160, "Excerpt too long - keep under 160 characters for meta description compatibility"),
  // Content minimum increased to prevent thin content (300 chars ≈ 50 words minimum)
  content: z.string()
    .min(300, "Content too thin - aim for at least 300 words (1500 characters) for quality SEO")
    .max(50000, "Content exceeds reasonable length"),
  coverImage: z.string().optional().nullable(),
  coverImageAlt: z.string().optional().nullable(),
  // Meta title with max length enforcement
  metaTitle: z.string()
    .max(60, "Meta title too long - Google truncates after 60 characters")
    .optional()
    .nullable(),
  // META DESCRIPTION IS CRITICAL FOR SEO - REQUIRED!
  metaDescription: z.string()
    .min(120, "Meta description too short - aim for 150-160 characters for optimal SEO")
    .max(160, "Meta description too long - Google truncates after 160 characters"),
  // FOCUS KEYWORD IS CRITICAL FOR SEO - REQUIRED!
  focusKeyword: z.string()
    .min(2, "Focus keyword is required for SEO targeting")
    .max(60, "Focus keyword too long - keep it concise"),
  // Enhanced tags validation - prevents empty strings and validates length
  tags: z.array(
    z.string()
      .min(1, "Tag cannot be empty")
      .max(50, "Tag must be less than 50 characters")
      .trim()
  ).optional().nullable(),
  authorName: z.string().min(2, "Author name is required"),
  authorImage: z.string().optional().nullable(),
  published: z.boolean().default(false),
  publishedAt: z.string().optional().nullable(),
  categoryId: z.string().min(1, "Category is required"),
}).refine(
  (data) => {
    // If cover image exists, alt text is REQUIRED for SEO and accessibility
    if (data.coverImage && data.coverImage.trim().length > 0) {
      return data.coverImageAlt && data.coverImageAlt.trim().length >= 10;
    }
    return true;
  },
  {
    message: "Alt text is required when cover image is uploaded (minimum 10 characters for SEO and accessibility)",
    path: ["coverImageAlt"],
  }
);

type BlogPostFormValues = z.infer<typeof blogPostSchema>;

interface BlogPostFormProps {
  post?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

interface SEOCheckItem {
  label: string;
  passed: boolean;
  message: string;
}

const BlogPostForm = ({ post, onSave, onCancel }: BlogPostFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedCoverImageUrl, setUploadedCoverImageUrl] = useState<string | null>(
    post?.coverImage || null
  );
  const [uploadedAuthorImageUrl, setUploadedAuthorImageUrl] = useState<string | null>(
    post?.authorImage || null
  );
  const [tagsInput, setTagsInput] = useState<string>(
    post?.tags?.join(", ") || ""
  );
  // Track if slug was manually edited to prevent auto-overwrite
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!post?.slug);
  // Collapsible SEO section state
  const [seoExpanded, setSeoExpanded] = useState(false);

  // Image validation warnings (non-blocking)
  const [imageWarnings, setImageWarnings] = useState<{
    coverImage?: string[];
  }>({});

  const firestore = useFirestore("blog-posts");

  // Fetch categories from API instead of Firestore hook
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          console.log('Categories loaded:', data); // Debug log
          setCategories(data || []);
        } else {
          console.error('Failed to fetch categories:', response.status);
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const formatPublishedDate = () => {
    if (post?.publishedAt) {
      return post.publishedAt;
    }
    return format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
  };

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      excerpt: post?.excerpt || "",
      content: post?.content || "",
      coverImage: post?.coverImage || "",
      coverImageAlt: post?.coverImageAlt || "",
      metaTitle: post?.metaTitle || "",
      metaDescription: post?.metaDescription || "",
      focusKeyword: post?.focusKeyword || "",
      tags: post?.tags || [],
      authorName: post?.authorName || "",
      authorImage: post?.authorImage || "",
      published: post?.published || false,
      publishedAt: post?.publishedAt || null,
      categoryId: post?.categoryId || "",
    },
  });

  const watchedValues = form.watch();

  // Improved slug generation - respects manual edits
  const generateSlug = () => {
    const title = form.getValues("title");
    const currentSlug = form.getValues("slug");

    // Only auto-generate if: 1) slug is empty OR 2) user hasn't manually edited
    if (title && (!currentSlug || !slugManuallyEdited)) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-") // Remove consecutive hyphens
        .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
      form.setValue("slug", slug);
    }
  };

  // Handle cover image upload with validation
  const handleCoverImageUpload = (url: string) => {
    setUploadedCoverImageUrl(url);
    form.setValue("coverImage", url);

    // Validate image dimensions and file size
    const img = new Image();
    img.src = url;

    img.onload = () => {
      const warnings: string[] = [];
      const { width, height } = img;

      // Check dimensions (social sharing best practice, not SEO ranking factor)
      if (width !== 1200 || height !== 630) {
        if (width < 1200 || height < 630) {
          warnings.push(
            `⚠️ Image is ${width}×${height}. Recommended 1200×630 for optimal social sharing (Facebook, LinkedIn, Twitter). Smaller images may appear pixelated when shared.`
          );
        } else {
          warnings.push(
            `ℹ️ Image is ${width}×${height}. Recommended 1200×630 for consistent social sharing. Current size will work but may be cropped on some platforms.`
          );
        }
      }

      // Estimate file size from URL (if we had the fetch API we could get exact size)
      // For now, warn about dimensions which correlate with file size
      if (width > 2000 || height > 2000) {
        warnings.push(
          `🔴 Large image dimensions (${width}×${height}) may impact page load speed and Core Web Vitals score. Consider resizing to 1200×630 for better performance.`
        );
      }

      if (warnings.length > 0) {
        setImageWarnings(prev => ({ ...prev, coverImage: warnings }));
      } else {
        // Clear warnings if image is perfect
        setImageWarnings(prev => ({ ...prev, coverImage: undefined }));
      }
    };
  };

  const handleCoverImageRemove = () => {
    setUploadedCoverImageUrl(null);
    form.setValue("coverImage", null);
    setImageWarnings(prev => ({ ...prev, coverImage: undefined })); // Clear warnings on remove
  };

  const handleAuthorImageUpload = (url: string) => {
    setUploadedAuthorImageUrl(url);
    form.setValue("authorImage", url);
  };

  const handleAuthorImageRemove = () => {
    setUploadedAuthorImageUrl(null);
    form.setValue("authorImage", null);
  };

  // Enhanced tags handling - removes duplicates and empty strings
  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    const tagsArray = value
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .filter((tag, index, self) => self.indexOf(tag) === index); // Remove duplicates
    form.setValue("tags", tagsArray);
  };

  const insertHeading = (level: number) => {
    const content = form.getValues("content");
    const headingMark = "#".repeat(level) + " ";
    form.setValue("content", content + "\n\n" + headingMark);
  };

  const insertFormatting = (formatType: string) => {
    const content = form.getValues("content");
    const formats: Record<string, string> = {
      bold: "**bold text**",
      italic: "*italic text*",
      list: "\n- List item 1\n- List item 2\n- List item 3",
      orderedList: "\n1. First item\n2. Second item\n3. Third item",
      link: "[link text](https://example.com)",
      image: "![alt text](image-url)"
    };
    form.setValue("content", content + " " + (formats[formatType] || ""));
  };

  // Fixed published date logic - proper toggle behavior
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "published") {
        if (value.published) {
          // When publishing, set date only if not already set
          if (!form.getValues("publishedAt")) {
            form.setValue("publishedAt", formatPublishedDate());
          }
        } else {
          // When unpublishing a NEW post, clear the date
          if (!post?.id) {
            form.setValue("publishedAt", null);
          }
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, post?.id]);

  // Consistent word count calculation
  const getWordCount = (text: string) => {
    return text?.split(/\s+/).filter(Boolean).length || 0;
  };

  const getSEOChecks = useCallback((): SEOCheckItem[] => {
    const metaTitle = watchedValues.metaTitle || watchedValues.title || "";
    const metaDescription = watchedValues.metaDescription || watchedValues.excerpt || "";
    const focusKeyword = watchedValues.focusKeyword || "";
    const content = watchedValues.content || "";
    const coverImageAlt = watchedValues.coverImageAlt || "";
    const coverImage = watchedValues.coverImage || "";

    const wordCount = getWordCount(content);

    const checks: SEOCheckItem[] = [
      {
        label: "Meta Title Length",
        passed: metaTitle.length >= 50 && metaTitle.length <= 60,
        message: metaTitle.length === 0
          ? "Add a meta title"
          : metaTitle.length < 50
            ? `Too short (${metaTitle.length}/50-60)`
            : metaTitle.length > 60
              ? `Too long (${metaTitle.length}/50-60)`
              : `Perfect (${metaTitle.length}/50-60)`
      },
      {
        label: "Meta Description Length",
        passed: metaDescription.length >= 150 && metaDescription.length <= 160,
        message: metaDescription.length === 0
          ? "Add a meta description"
          : metaDescription.length < 150
            ? `Too short (${metaDescription.length}/150-160)`
            : metaDescription.length > 160
              ? `Too long (${metaDescription.length}/150-160)`
              : `Perfect (${metaDescription.length}/150-160)`
      },
      {
        label: "Focus Keyword",
        passed: focusKeyword.length > 0,
        message: focusKeyword.length === 0 ? "Add a focus keyword" : `Keyword: "${focusKeyword}"`
      },
      {
        label: "Keyword in Title",
        passed: focusKeyword.length > 0 && metaTitle.toLowerCase().includes(focusKeyword.toLowerCase()),
        message: focusKeyword.length === 0
          ? "Set focus keyword first"
          : metaTitle.toLowerCase().includes(focusKeyword.toLowerCase())
            ? "Keyword found in title"
            : "Add keyword to title"
      },
      {
        label: "Keyword in Content",
        passed: focusKeyword.length > 0 && content.toLowerCase().includes(focusKeyword.toLowerCase()),
        message: focusKeyword.length === 0
          ? "Set focus keyword first"
          : content.toLowerCase().includes(focusKeyword.toLowerCase())
            ? "Keyword found in content"
            : "Add keyword to content"
      },
      {
        label: "Featured Image",
        passed: Boolean(coverImage),
        message: coverImage ? "Image added" : "Add a featured image"
      },
      {
        label: "Image Alt Text",
        passed: Boolean(coverImageAlt) || !coverImage,
        message: !coverImage
          ? "No image added yet"
          : coverImageAlt
            ? "Alt text added"
            : "Add alt text for SEO"
      },
      {
        label: "Content Length",
        passed: wordCount >= 300,
        message: `${wordCount} words (aim for 300+)`
      },
      {
        label: "Headings Used",
        passed: content.includes("# ") || content.includes("## ") || content.includes("<h"),
        message: content.includes("# ") || content.includes("## ") || content.includes("<h")
          ? "Headings found"
          : "Add H1/H2/H3 headings"
      }
    ];

    return checks;
  }, [watchedValues]);

  const seoChecks = getSEOChecks();
  const seoScore = Math.round((seoChecks.filter(c => c.passed).length / seoChecks.length) * 100);

  const onSubmit = async (values: BlogPostFormValues) => {
    try {
      setIsSubmitting(true);

      // Sync uploaded image URLs
      if (uploadedCoverImageUrl) {
        values.coverImage = uploadedCoverImageUrl;
      }

      if (uploadedAuthorImageUrl) {
        values.authorImage = uploadedAuthorImageUrl;
      }

      if (post?.id) {
        await firestore.update(post.id, values);
      } else {
        await firestore.add(values);
      }

      onSave(values);
    } catch (error) {
      console.error("Error saving blog post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title and Slug Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => {
                  const titleLength = field.value?.length || 0;
                  const isOptimal = titleLength >= 50 && titleLength <= 60;
                  const isAcceptable = (titleLength >= 30 && titleLength < 50) || (titleLength > 60 && titleLength <= 70);

                  return (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        <span>Title</span>
                        <span className={`text-xs font-medium ${isOptimal
                          ? "text-green-600"
                          : isAcceptable
                            ? "text-amber-600"
                            : "text-red-600"
                          }`}>
                          {titleLength}/70 {
                            isOptimal ? "✓ Perfect" :
                              isAcceptable ? "⚠ Acceptable" :
                                titleLength < 30 ? "Too Short" :
                                  "Too Long"
                          }
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          data-testid="input-blog-title"
                          placeholder="Write a compelling 50-60 character title..."
                          {...field}
                          onBlur={generateSlug}
                        />
                      </FormControl>
                      <FormDescription>
                        Optimal: 50-60 characters. This appears in Google search results.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Slug</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="input-blog-slug"
                        placeholder="post-slug"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          // Track manual edits
                          if (e.target.value) {
                            setSlugManuallyEdited(true);
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Used in the URL (e.g., /blog/post-title)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-4" />

            {/* Collapsible SEO Settings Section */}
            <button
              type="button"
              onClick={() => setSeoExpanded(!seoExpanded)}
              className="flex items-center justify-between w-full py-2 text-left hover:bg-muted/50 rounded-md px-2 -mx-2 transition-colors"
            >
              <h3 className="text-lg font-semibold">SEO Settings (Advanced)</h3>
              <ChevronDown
                className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${seoExpanded ? 'rotate-180' : ''}`}
              />
            </button>
            <p className="text-sm text-muted-foreground -mt-2">
              Leave blank to auto-populate from post title and excerpt
            </p>

            {seoExpanded && (
              <div className="grid grid-cols-1 gap-4 pt-2 animate-in slide-in-from-top-2 duration-200">
                <FormField
                  control={form.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        <span>Meta Title (Optional)</span>
                        <span className={`text-xs ${(field.value?.length || 0) >= 50 && (field.value?.length || 0) <= 60
                          ? "text-green-600"
                          : "text-muted-foreground"
                          }`}>
                          {field.value?.length || 0}/60
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          data-testid="input-meta-title"
                          placeholder="Leave blank to use post title"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Customize how this appears in Google search (50-60 chars optimal)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        <span>Meta Description <span className="text-red-600">*</span></span>
                        <span className={`text-xs ${(field.value?.length || 0) >= 120 && (field.value?.length || 0) <= 160
                          ? "text-green-600"
                          : (field.value?.length || 0) < 120
                            ? "text-amber-600"
                            : "text-red-600"
                          }`}>
                          {field.value?.length || 0}/160 {
                            (field.value?.length || 0) >= 120 && (field.value?.length || 0) <= 160
                              ? "✓ Perfect"
                              : (field.value?.length || 0) < 120
                                ? "Too short"
                                : "Too long"
                          }
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          data-testid="input-meta-description"
                          placeholder="Write a compelling 150-160 character description that will appear in Google search results"
                          className="min-h-[80px]"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        CRITICAL for SEO! This appears in Google search results and affects your click-through rate. Aim for 150-160 characters.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="focusKeyword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Focus Keyword <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-focus-keyword"
                            placeholder="e.g., web development Madurai"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          The primary keyword you want this post to rank for on Google
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <Input
                      data-testid="input-tags"
                      placeholder="tag1, tag2, tag3"
                      value={tagsInput}
                      onChange={(e) => handleTagsChange(e.target.value)}
                    />
                    <FormDescription>
                      Comma-separated tags (duplicates removed automatically)
                    </FormDescription>
                  </FormItem>
                </div>
              </div>
            )}

            <Separator className="my-4" />

            {/* Excerpt Section */}
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => {
                const excerptLength = field.value?.length || 0;
                const isOptimal = excerptLength >= 150 && excerptLength <= 160;
                const isAcceptable = excerptLength >= 120 && excerptLength < 150;

                return (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      <span>Excerpt</span>
                      <span className={`text-xs font-medium ${isOptimal
                        ? "text-green-600"
                        : isAcceptable
                          ? "text-amber-600"
                          : "text-red-600"
                        }`}>
                        {excerptLength}/160 {
                          isOptimal ? "✓ Perfect" :
                            isAcceptable ? "⚠ Good" :
                              excerptLength < 120 ? "Too Short" :
                                "Too Long"
                        }
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        data-testid="input-excerpt"
                        placeholder="Write a compelling 150-160 character summary..."
                        className="min-h-[80px]"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      120-160 characters. Used in blog listings AND as meta description fallback.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Cover Image Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                        {/* Image Validation Warnings */}
                        {imageWarnings.coverImage && imageWarnings.coverImage.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {imageWarnings.coverImage.map((warning, idx) => (
                              <div
                                key={idx}
                                className={`text-xs p-2 rounded border flex items-start gap-2 ${warning.includes("🔴")
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                                  }`}
                              >
                                <span className="mt-0.5 select-none">{warning.split(" ")[0]}</span>
                                <span>{warning.substring(warning.indexOf(" ") + 1)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Recommended: 1200x630px (Max 200KB) for optimal performance & social sharing
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coverImageAlt"
                render={({ field }) => {
                  const hasCoverImage = form.watch("coverImage");
                  return (
                    <FormItem>
                      <FormLabel>
                        Image Alt Text
                        {hasCoverImage && <span className="text-red-600"> *</span>}
                      </FormLabel>
                      <FormControl>
                        <Input
                          data-testid="input-cover-image-alt"
                          placeholder="Describe the image for SEO and accessibility"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        {hasCoverImage
                          ? "REQUIRED for SEO and accessibility when image is uploaded (min 10 characters)"
                          : "Important for SEO and screen readers if you upload an image"
                        }
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            {/* Category Section with Loading/Empty States */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) => field.onChange(value)}
                    disabled={categoriesLoading || !categories?.length}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-category">
                        <SelectValue placeholder={
                          categoriesLoading
                            ? "Loading categories..."
                            : !categories?.length
                              ? "No categories available"
                              : "Select a category"
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category: any) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!categoriesLoading && !categories?.length && (
                    <FormDescription className="text-amber-600">
                      Please create a category first before adding blog posts
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Author Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="authorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author Name</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="input-author-name"
                        placeholder="Author's name"
                        {...field}
                      />
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

            <Separator className="my-4" />
            <h3 className="text-lg font-semibold">Content</h3>

            {/* Content Editor Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 bg-muted rounded-t-md border border-b-0">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => insertHeading(1)}
                title="Heading 1"
              >
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => insertHeading(2)}
                title="Heading 2"
              >
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => insertHeading(3)}
                title="Heading 3"
              >
                <Heading3 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => insertHeading(4)}
                title="Heading 4"
              >
                <Heading4 className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6 mx-1" />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => insertFormatting("bold")}
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => insertFormatting("italic")}
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6 mx-1" />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => insertFormatting("list")}
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => insertFormatting("orderedList")}
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6 mx-1" />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => insertFormatting("link")}
                title="Insert Link"
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => insertFormatting("image")}
                title="Insert Image"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </div>

            {/* Content Textarea */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      data-testid="input-content"
                      placeholder="Write your blog post content here...

Use headings to structure your content:
# Heading 1 (Main title - use sparingly)
## Heading 2 (Section titles)
### Heading 3 (Subsections)
#### Heading 4 (Minor sections)

Format text:
**bold text** and *italic text*

Create lists:
- Bullet point 1
- Bullet point 2

Or numbered lists:
1. First item
2. Second item

Add links: [link text](https://example.com)
Add images: ![alt text](image-url)"
                      className="min-h-[400px] rounded-t-none font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="flex items-center justify-between">
                    <span>Use Markdown for formatting. Supports headings, bold, italic, lists, and links.</span>
                    <span className="text-muted-foreground">
                      {getWordCount(field.value || "")} words
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Publish Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        data-testid="checkbox-published"
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
                          data-testid="input-published-at"
                          type="datetime-local"
                          // Fixed null handling - check type before substring
                          value={field.value && typeof field.value === 'string' ? field.value.substring(0, 16) : ""}
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

            {/* Form Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                data-testid="button-cancel"
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || (!categoriesLoading && !categories?.length)}
                data-testid="button-save-post"
                className="w-full sm:w-auto"
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
      </div>

      {/* SEO Checklist Sidebar */}
      <div className="lg:col-span-1">
        <Card className="sticky top-4">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between gap-2">
              <span>SEO Checklist</span>
              <Badge
                variant={seoScore >= 80 ? "default" : seoScore >= 50 ? "secondary" : "destructive"}
                className="text-sm"
              >
                {seoScore}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {seoChecks.map((check, index) => (
              <div
                key={index}
                className="flex items-start gap-2 text-sm"
              >
                {check.passed ? (
                  <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                ) : (
                  <X className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                )}
                <div>
                  <div className={check.passed ? "text-foreground" : "text-muted-foreground"}>
                    {check.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {check.message}
                  </div>
                </div>
              </div>
            ))}

            <Separator className="my-4" />

            <div className="text-xs text-muted-foreground space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                <span>Higher SEO scores generally lead to better search rankings</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogPostForm;

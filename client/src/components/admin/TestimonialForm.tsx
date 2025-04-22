import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useFirestore } from "@/hooks/use-firestore";
import FileUpload from "@/components/admin/FileUpload";

// Form schema for Testimonials
const testimonialSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  position: z.string().min(2, "Position must be at least 2 characters"),
  company: z.string().min(2, "Company must be at least 2 characters"),
  content: z.string().min(10, "Testimonial content must be at least 10 characters"),
  image: z.string().optional().nullable(),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

interface TestimonialFormProps {
  testimonial?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const TestimonialForm = ({ testimonial, onSave, onCancel }: TestimonialFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
    testimonial?.image || null
  );
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(null);

  const firestore = useFirestore("testimonials");

  // Initialize form with existing testimonial data or defaults
  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: testimonial?.name || "",
      position: testimonial?.position || "",
      company: testimonial?.company || "",
      content: testimonial?.content || "",
      image: testimonial?.image || "",
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

  // Form submission handler
  const onSubmit = async (values: TestimonialFormValues) => {
    try {
      setIsSubmitting(true);

      // Update image path from uploadedImageUrl if available
      if (uploadedImageUrl) {
        values.image = uploadedImageUrl;
      }

      // For Firebase, we'll handle the save here
      if (testimonial?.id) {
        // Update existing testimonial
        await firestore.update(testimonial.id, values);
      } else {
        // Create new testimonial
        await firestore.add(values);
      }

      // Also call the original onSave for API compatibility
      onSave(values);
    } catch (error) {
      console.error("Error saving testimonial:", error);
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <FormControl>
                  <Input placeholder="Client's full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position/Title</FormLabel>
                <FormControl>
                  <Input placeholder="Client's job title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input placeholder="Company name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Photo</FormLabel>
              <FormDescription>
                Upload a professional headshot (recommended: 150×150px)
              </FormDescription>
              <FormControl>
                <div className="mt-2">
                  <FileUpload
                    onUploadComplete={handleImageUpload}
                    folder="testimonials"
                    accept="image/*"
                    buttonText="Upload Photo"
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
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Testimonial</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Client's testimonial about your services"
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
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
              'Save Testimonial'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TestimonialForm;
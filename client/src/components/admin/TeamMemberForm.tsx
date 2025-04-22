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

// Form schema for Team Members
const teamMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  position: z.string().min(2, "Position must be at least 2 characters"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  image: z.string().optional().nullable(),
  linkedIn: z.string().url("Must be a valid URL").optional().nullable(),
  twitter: z.string().url("Must be a valid URL").optional().nullable(),
});

type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;

interface TeamMemberFormProps {
  teamMember?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const TeamMemberForm = ({ teamMember, onSave, onCancel }: TeamMemberFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
    teamMember?.image || null
  );
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(null);
  
  const firestore = useFirestore("team-members");

  // Initialize form with existing teamMember data or defaults
  const form = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: teamMember?.name || "",
      position: teamMember?.position || "",
      bio: teamMember?.bio || "",
      image: teamMember?.image || "",
      linkedIn: teamMember?.linkedIn || "",
      twitter: teamMember?.twitter || "",
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
  const onSubmit = async (values: TeamMemberFormValues) => {
    try {
      setIsSubmitting(true);

      // Update image path from uploadedImageUrl if available
      if (uploadedImageUrl) {
        values.image = uploadedImageUrl;
      }

      // For Firebase, we'll handle the save here
      if (teamMember?.id) {
        // Update existing team member
        await firestore.update(teamMember.id, values);
      } else {
        // Create new team member
        await firestore.add(values);
      }

      // Also call the original onSave for API compatibility
      onSave(values);
    } catch (error) {
      console.error("Error saving team member:", error);
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Full name" {...field} />
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
              <FormLabel>Position</FormLabel>
              <FormControl>
                <Input placeholder="Job title or position" {...field} />
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
              <FormLabel>Profile Image</FormLabel>
              <FormDescription>
                Upload a professional headshot (recommended: 400×400px)
              </FormDescription>
              <FormControl>
                <div className="mt-2">
                  <FileUpload
                    onUploadComplete={handleImageUpload}
                    folder="team-members"
                    accept="image/*"
                    buttonText="Upload Image"
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
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Short biography or description"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="linkedIn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://linkedin.com/in/username"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="twitter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://twitter.com/username"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
              'Save Team Member'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TeamMemberForm;
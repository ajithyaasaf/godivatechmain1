import { useState, useRef, ChangeEvent } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

interface FileUploadProps {
  folder: string;
  onUploadComplete: (url: string, path: string) => void;
  onRemove?: () => void;
  accept?: string;
  buttonText?: string;
  showPreview?: boolean;
  existingFileUrl?: string;
  multiple?: boolean;
}

const FileUpload = ({
  folder,
  onUploadComplete,
  onRemove,
  accept = "*",
  buttonText = "Upload File",
  showPreview = false,
  existingFileUrl,
  multiple = false,
}: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingFileUrl || null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isImage = accept.includes("image");

  // Trigger file input click
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      setUploadError(null);

      const file = files[0]; // For now, just handle the first file
      
      // Create a preview for images and prepare for upload
      let imageBase64 = '';
      if (isImage) {
        const reader = new FileReader();
        
        // Create a promise to wait for the FileReader to complete
        const readAsDataURLPromise = new Promise<string>((resolve, reject) => {
          reader.onload = (e) => {
            if (e.target?.result) {
              const result = e.target.result.toString();
              setPreviewUrl(result);
              resolve(result);
            } else {
              reject(new Error("Failed to read file"));
            }
          };
          reader.onerror = () => reject(reader.error);
        });
        
        reader.readAsDataURL(file);
        imageBase64 = await readAsDataURLPromise;
      }
      
      // Upload to Cloudinary via our API
      const response = await apiRequest('POST', '/api/upload', {
        image: imageBase64,
        folder: folder || 'godivatech/portfolio'
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      const { url } = await response.json();
      
      // Pass the URL back to the parent component
      onUploadComplete(url, url); // Using URL as path since we don't need storage paths with Cloudinary
      
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Failed to upload file. Please try again.");
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file removal
  const handleRemove = async () => {
    if (!previewUrl) return;
    
    try {
      setIsUploading(true);
      
      // Clear the preview and notify parent
      setPreviewUrl(null);
      if (onRemove) onRemove();
      
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      // Note: We're not actually deleting from Cloudinary here
      // This would require implementing a delete endpoint with proper security
      // For now, we're just removing the reference in our application
    } catch (error) {
      console.error("Error removing file:", error);
      setUploadError("Failed to remove file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleButtonClick}
          disabled={isUploading}
          className="flex-shrink-0"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {buttonText}
            </>
          )}
        </Button>
        
        {previewUrl && onRemove && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemove}
            disabled={isUploading}
            className="flex-shrink-0"
          >
            <X className="mr-2 h-4 w-4" />
            Remove
          </Button>
        )}
        
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
          multiple={multiple}
        />
      </div>
      
      {/* Preview for images if showPreview is true */}
      {showPreview && previewUrl && isImage && (
        <div className="mt-2 relative">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-h-48 max-w-full rounded-md object-cover border"
          />
        </div>
      )}
      
      {/* Display filename for non-image files */}
      {previewUrl && !isImage && (
        <div className="text-sm font-medium mt-2">
          {previewUrl.split("/").pop()?.split("?")[0]}
        </div>
      )}
      
      {/* Display upload error if any */}
      {uploadError && (
        <div className="text-sm text-destructive mt-2">{uploadError}</div>
      )}
    </div>
  );
};

export default FileUpload;
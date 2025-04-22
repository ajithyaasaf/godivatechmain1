import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { uploadFile, generateUniqueFilename } from "@/lib/storage";
import { Loader2, Upload, X } from "lucide-react";

interface FileUploadProps {
  onUploadComplete: (url: string, path: string) => void;
  folder: string;
  accept?: string;
  buttonText?: string;
  showPreview?: boolean;
  existingFileUrl?: string;
  onRemove?: () => void;
}

const FileUpload = ({
  onUploadComplete,
  folder,
  accept = "*",
  buttonText = "Upload File",
  showPreview = true,
  existingFileUrl,
  onRemove,
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filePreview, setFilePreview] = useState<string | null>(existingFileUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 200);

      // Generate a unique filename to prevent collisions
      const uniqueFilename = generateUniqueFilename(file.name);
      const storagePath = `${folder}/${uniqueFilename}`;

      // Upload the file
      const downloadUrl = await uploadFile(file, storagePath);

      // Create a preview for images
      if (file.type.startsWith("image/") && showPreview) {
        setFilePreview(downloadUrl);
      }

      // Complete the upload
      clearInterval(progressInterval);
      setProgress(100);
      onUploadComplete(downloadUrl, storagePath);

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setFilePreview(null);
    if (onRemove) {
      onRemove();
    }
  };

  // Determine if it's an image for preview
  const isImage = filePreview && (
    filePreview.toLowerCase().endsWith('.jpg') ||
    filePreview.toLowerCase().endsWith('.jpeg') ||
    filePreview.toLowerCase().endsWith('.png') ||
    filePreview.toLowerCase().endsWith('.gif') ||
    filePreview.toLowerCase().endsWith('.webp')
  );

  return (
    <div className="space-y-4">
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        disabled={uploading}
      />
      
      {showPreview && filePreview && (
        <div className="relative rounded-md overflow-hidden border p-1 max-w-xs">
          {isImage ? (
            <img 
              src={filePreview} 
              alt="File preview" 
              className="max-h-48 w-auto object-contain mx-auto" 
            />
          ) : (
            <div className="h-16 flex items-center justify-center bg-muted rounded">
              <span className="text-sm text-muted-foreground">
                File uploaded
              </span>
            </div>
          )}
          
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 bg-white opacity-70 hover:opacity-100"
            onClick={handleRemove}
            disabled={uploading}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2 w-full" />
          <p className="text-xs text-muted-foreground">
            Uploading... {Math.round(progress)}%
          </p>
        </div>
      )}
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleButtonClick}
        disabled={uploading}
      >
        {uploading ? (
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
    </div>
  );
};

export default FileUpload;
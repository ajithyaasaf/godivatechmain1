import { v2 as cloudinary } from 'cloudinary';
import { log } from './vite';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: "wUw9Seu6drQEIbQ1tAvYeVyqHdU", // Using the provided API key
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Verify Cloudinary configuration is present
const verifyCloudinaryConfig = () => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_SECRET) {
    log('Missing Cloudinary environment variables', 'cloudinary');
    return false;
  }
  return true;
};

// Upload a file to Cloudinary
export const uploadImage = async (file: string, folder = 'portfolio'): Promise<string> => {
  if (!verifyCloudinaryConfig()) {
    throw new Error('Cloudinary configuration is missing');
  }

  try {
    // For files that are already URLs (from the client)
    if (file.startsWith('data:image')) {
      // Upload the base64 image data
      const result = await cloudinary.uploader.upload(file, {
        folder,
        resource_type: 'auto',
      });
      return result.secure_url;
    } else if (file.startsWith('http')) {
      // If it's already a URL, check if it's a Cloudinary URL
      if (file.includes('cloudinary.com')) {
        return file; // Already a Cloudinary URL, just return it
      }
      
      // Upload from external URL
      const result = await cloudinary.uploader.upload(file, {
        folder,
        resource_type: 'auto',
      });
      return result.secure_url;
    }
    
    // If it's neither a data URL nor an HTTP URL, it's not supported
    throw new Error('Unsupported image format');
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

// Delete an image from Cloudinary
export const deleteImage = async (imageUrl: string): Promise<boolean> => {
  if (!verifyCloudinaryConfig() || !imageUrl) {
    return false;
  }

  try {
    // Extract the public_id from the URL
    const urlParts = imageUrl.split('/');
    const filenameWithExtension = urlParts[urlParts.length - 1];
    const publicIdParts = filenameWithExtension.split('.');
    const filename = publicIdParts[0];
    
    // Find the folder in the URL (after upload/)
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    if (uploadIndex === -1 || uploadIndex + 1 >= urlParts.length) {
      return false;
    }
    
    // Construct the full public_id (folder/filename)
    const folders = urlParts.slice(uploadIndex + 1, urlParts.length - 1);
    const publicId = [...folders, filename].join('/');
    
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
};

export default cloudinary;
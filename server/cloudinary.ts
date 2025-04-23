import { v2 as cloudinary } from 'cloudinary';
import { log } from './vite';

// Trim any potential whitespace from environment variables
const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

// Configure Cloudinary with environment variables
console.log('Cloudinary Config:', {
  cloud_name: cloudName,
  api_key: apiKey ? 'Exists (not shown)' : 'Missing',
  api_secret: apiSecret ? 'Exists (not shown)' : 'Missing'
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

// Verify Cloudinary configuration is present
const verifyCloudinaryConfig = () => {
  if (!cloudName || !apiKey || !apiSecret) {
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

  // Re-apply configuration to ensure it's using the latest values
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  try {
    // For files that are already URLs (from the client)
    if (file.startsWith('data:image')) {
      console.log('Uploading base64 image to Cloudinary folder:', folder);
      // Upload the base64 image data
      const result = await cloudinary.uploader.upload(file, {
        folder,
        resource_type: 'auto',
      });
      console.log('Successfully uploaded to Cloudinary:', result.secure_url);
      return result.secure_url;
    } else if (file.startsWith('http')) {
      // If it's already a URL, check if it's a Cloudinary URL
      if (file.includes('cloudinary.com')) {
        console.log('Image is already in Cloudinary:', file);
        return file; // Already a Cloudinary URL, just return it
      }
      
      console.log('Uploading URL to Cloudinary folder:', folder);
      // Upload from external URL
      const result = await cloudinary.uploader.upload(file, {
        folder,
        resource_type: 'auto',
      });
      console.log('Successfully uploaded URL to Cloudinary:', result.secure_url);
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

  // Re-apply configuration to ensure it's using the latest values
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  try {
    // Extract the public_id from the URL
    const urlParts = imageUrl.split('/');
    const filenameWithExtension = urlParts[urlParts.length - 1];
    const publicIdParts = filenameWithExtension.split('.');
    const filename = publicIdParts[0];
    
    // Find the folder in the URL (after upload/)
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    if (uploadIndex === -1 || uploadIndex + 1 >= urlParts.length) {
      console.log('Could not find upload path in URL:', imageUrl);
      return false;
    }
    
    // Construct the full public_id (folder/filename)
    const folders = urlParts.slice(uploadIndex + 1, urlParts.length - 1);
    const publicId = [...folders, filename].join('/');
    
    console.log('Deleting image from Cloudinary, public ID:', publicId);
    await cloudinary.uploader.destroy(publicId);
    console.log('Successfully deleted image from Cloudinary:', publicId);
    return true;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
};

export default cloudinary;
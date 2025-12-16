import { v2 as cloudinary } from 'cloudinary';
import { log } from './vite';

// Directly define the cloudinary credentials
const CLOUDINARY_CLOUD_NAME = 'doeodacsg';
const CLOUDINARY_API_KEY = '269267633995791';
const CLOUDINARY_API_SECRET = 'wUw9Seu6drQEIbQ1tAvYeVyqHdU';

// Function to get cloudinary credentials - using hardcoded values for now to debug
const getCloudinaryConfig = () => {
  return {
    cloudName: CLOUDINARY_CLOUD_NAME,
    apiKey: CLOUDINARY_API_KEY, 
    apiSecret: CLOUDINARY_API_SECRET
  };
};

// Function to update Cloudinary configuration
const configureCloudinary = () => {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

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

  return { cloudName, apiKey, apiSecret };
};

// Initial configuration
configureCloudinary();

// Verify Cloudinary configuration is present
const verifyCloudinaryConfig = () => {
  // Get fresh credentials
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  
  if (!cloudName || !apiKey || !apiSecret) {
    log('Missing Cloudinary environment variables', 'cloudinary');
    return false;
  }

  // Update configuration with current credentials
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  
  return true;
};

// Upload a file to Cloudinary
export const uploadImage = async (file: string, folder = 'godivatech/portfolio'): Promise<string> => {
  if (!verifyCloudinaryConfig()) {
    throw new Error('Cloudinary configuration is missing');
  }

  try {
    // For files that are already URLs (from the client)
    if (file.startsWith('data:image')) {
      console.log('Uploading base64 image to Cloudinary folder:', folder);
      // Upload the base64 image data with more detailed logging
      console.log('Image data length:', file.length);
      console.log('Image data type:', file.substring(0, 30) + '...');
      
      try {
        const result = await cloudinary.uploader.upload(file, {
          folder,
          resource_type: 'auto',
        });
        console.log('Successfully uploaded to Cloudinary:', result.secure_url);
        return result.secure_url;
      } catch (uploadError: any) {
        console.error('Specific upload error:', uploadError.message);
        console.error('Error details:', uploadError);
        throw uploadError;
      }
    } else if (file.startsWith('http')) {
      // If it's already a URL, check if it's a Cloudinary URL
      if (file.includes('cloudinary.com')) {
        console.log('Image is already in Cloudinary:', file);
        return file; // Already a Cloudinary URL, just return it
      }
      
      console.log('Uploading URL to Cloudinary folder:', folder);
      // Upload from external URL
      try {
        const result = await cloudinary.uploader.upload(file, {
          folder,
          resource_type: 'auto',
        });
        console.log('Successfully uploaded URL to Cloudinary:', result.secure_url);
        return result.secure_url;
      } catch (uploadError: any) {
        console.error('Specific URL upload error:', uploadError.message);
        console.error('Error details:', uploadError);
        throw uploadError;
      }
    }
    
    // If it's neither a data URL nor an HTTP URL, it's not supported
    console.error('Unsupported image format. File starts with:', file.substring(0, 30));
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
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";
import { storage } from "./firebase";

/**
 * Upload a file to Firebase Storage
 * @param file - The file to upload
 * @param path - The path in storage to upload to
 * @param metadata - Optional metadata for the file
 * @returns Promise with the download URL of the uploaded file
 */
export const uploadFile = async (
  file: File,
  path: string,
  metadata?: any
): Promise<string> => {
  try {
    // Create a reference to the file in Firebase Storage
    const storageRef = ref(storage, path);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file, metadata);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

/**
 * Delete a file from Firebase Storage
 * @param path - The path of the file to delete
 * @returns Promise that resolves when the delete is complete
 */
export const deleteFile = async (path: string): Promise<void> => {
  try {
    // Create a reference to the file
    const storageRef = ref(storage, path);
    
    // Delete the file
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

/**
 * Generate a unique filename for upload
 * @param originalFilename - The original filename
 * @returns A unique filename with timestamp
 */
export const generateUniqueFilename = (originalFilename: string): string => {
  const extension = originalFilename.split('.').pop() || '';
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  
  return `${timestamp}-${randomString}.${extension}`;
};
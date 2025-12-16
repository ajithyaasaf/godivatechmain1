import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./firebase";

/**
 * Upload a file to Firebase Storage
 * @param file File to upload
 * @param folder Folder path within storage
 * @returns Promise with download URL and storage path
 */
export async function uploadFile(file: File, folder: string = "uploads"): Promise<{ url: string; path: string }> {
  try {
    // Generate a unique filename with timestamp
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const path = `${folder}/${filename}`;
    const storageRef = ref(storage, path);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const url = await getDownloadURL(snapshot.ref);
    
    return { url, path };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file. Please try again.");
  }
}

/**
 * Delete a file from Firebase Storage
 * @param path Storage path to the file
 * @returns Promise that resolves when the file is deleted
 */
export async function deleteFile(path: string): Promise<void> {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error("Failed to delete file. Please try again.");
  }
}

/**
 * Get a download URL for a file in Firebase Storage
 * @param path Storage path to the file
 * @returns Promise with download URL
 */
export async function getFileUrl(path: string): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error getting file URL:", error);
    throw new Error("Failed to get file URL. Please try again.");
  }
}
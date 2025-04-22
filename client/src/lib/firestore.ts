import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryConstraint,
  DocumentReference,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// Export firebase query constraint helpers for use in hooks
export const queryConstraints = {
  where,
  orderBy,
  limit,
  startAfter,
};

/**
 * Convert Firebase Timestamp fields to regular Date objects
 * @param data Firestore document data
 * @returns Document data with timestamps converted to Date objects
 */
function convertTimestamps(data: any): any {
  if (!data) return data;
  
  const result = { ...data };
  
  Object.keys(result).forEach(key => {
    if (result[key] instanceof Timestamp) {
      result[key] = result[key].toDate();
    } else if (typeof result[key] === 'object' && result[key] !== null) {
      result[key] = convertTimestamps(result[key]);
    }
  });
  
  return result;
}

/**
 * Fetch all documents from a collection
 * @param collectionName Name of the collection
 * @param constraints Optional query constraints
 * @returns Array of documents with their IDs
 */
export async function getCollection(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<DocumentData[]> {
  try {
    const collectionRef = collection(db, collectionName);
    const q = constraints.length > 0 
      ? query(collectionRef, ...constraints)
      : query(collectionRef);
    
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data()),
    }));
    
    return documents;
  } catch (error) {
    console.error(`Error fetching collection ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Fetch a single document by ID
 * @param collectionName Name of the collection
 * @param documentId Document ID
 * @returns Document data with its ID
 */
export async function getDocument(
  collectionName: string,
  documentId: string
): Promise<DocumentData | null> {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...convertTimestamps(docSnap.data()),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error fetching document ${documentId} from ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Add a new document to a collection
 * @param collectionName Name of the collection
 * @param data Document data
 * @returns ID of the newly created document
 */
export async function addDocument(
  collectionName: string,
  data: DocumentData
): Promise<string> {
  try {
    // Add created timestamp if not provided
    if (!data.createdAt) {
      data.createdAt = serverTimestamp();
    }
    
    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, data);
    return docRef.id;
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Update an existing document
 * @param collectionName Name of the collection
 * @param documentId Document ID
 * @param data Updated document data
 */
export async function updateDocument(
  collectionName: string,
  documentId: string,
  data: DocumentData
): Promise<void> {
  try {
    // Add updated timestamp
    data.updatedAt = serverTimestamp();
    
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error(`Error updating document ${documentId} in ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Delete a document
 * @param collectionName Name of the collection
 * @param documentId Document ID
 */
export async function deleteDocument(
  collectionName: string,
  documentId: string
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting document ${documentId} from ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Get a document reference
 * @param collectionName Name of the collection
 * @param documentId Document ID
 * @returns Document reference
 */
export function getDocumentRef(
  collectionName: string,
  documentId: string
): DocumentReference {
  return doc(db, collectionName, documentId);
}
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryConstraint,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Get all documents from a collection
 * @param collectionName - The name of the collection
 * @param constraints - Optional query constraints (where, orderBy, limit, etc.)
 * @returns Promise with array of documents
 */
export const getCollection = async (
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<DocumentData[]> => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = constraints.length ? query(collectionRef, ...constraints) : query(collectionRef);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Get a single document from a collection
 * @param collectionName - The name of the collection
 * @param documentId - The ID of the document
 * @returns Promise with document data or null if not found
 */
export const getDocument = async (
  collectionName: string,
  documentId: string
): Promise<DocumentData | null> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error getting document ${documentId} from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Add a new document to a collection
 * @param collectionName - The name of the collection
 * @param data - The data to add
 * @param addTimestamp - Whether to add a timestamp
 * @returns Promise with the ID of the new document
 */
export const addDocument = async (
  collectionName: string,
  data: DocumentData,
  addTimestamp = true
): Promise<string> => {
  try {
    const docData = addTimestamp 
      ? { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }
      : data;
      
    const docRef = await addDoc(collection(db, collectionName), docData);
    return docRef.id;
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Update a document in a collection
 * @param collectionName - The name of the collection
 * @param documentId - The ID of the document to update
 * @param data - The data to update
 * @param addTimestamp - Whether to add an updated timestamp
 * @returns Promise that resolves when the update is complete
 */
export const updateDocument = async (
  collectionName: string,
  documentId: string,
  data: DocumentData,
  addTimestamp = true
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const updateData = addTimestamp
      ? { ...data, updatedAt: serverTimestamp() }
      : data;
      
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error(`Error updating document ${documentId} in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Delete a document from a collection
 * @param collectionName - The name of the collection
 * @param documentId - The ID of the document to delete
 * @returns Promise that resolves when the deletion is complete
 */
export const deleteDocument = async (
  collectionName: string,
  documentId: string
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting document ${documentId} from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Create query constraints for firestore queries
 */
export const queryConstraints = {
  where,
  orderBy,
  limit
};
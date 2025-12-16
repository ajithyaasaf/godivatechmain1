import { useState, useEffect } from 'react';
import { DocumentData, QueryConstraint } from 'firebase/firestore';
import { 
  getCollection, 
  getDocument, 
  addDocument, 
  updateDocument, 
  deleteDocument,
  queryConstraints 
} from '@/lib/firestore';

// A hook for fetching all documents from a collection
export const useCollection = (
  collectionName: string,
  constraints: QueryConstraint[] = [],
  deps: any[] = []
) => {
  const [data, setData] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getCollection(collectionName, constraints);
        setData(result);
        setError(null);
      } catch (err) {
        console.error(`Error fetching collection ${collectionName}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, ...deps]);

  return { data, loading, error };
};

// A hook for fetching a single document
export const useDocument = (
  collectionName: string,
  documentId: string | null,
  deps: any[] = []
) => {
  const [data, setData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!documentId) {
        setData(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await getDocument(collectionName, documentId);
        setData(result);
        setError(null);
      } catch (err) {
        console.error(`Error fetching document ${documentId} from ${collectionName}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, documentId, ...deps]);

  return { data, loading, error };
};

// A hook that provides CRUD operations for a collection
export const useFirestore = (collectionName: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Add a document
  const add = async (data: DocumentData) => {
    setLoading(true);
    setError(null);
    try {
      const id = await addDocument(collectionName, data);
      setLoading(false);
      return id;
    } catch (err) {
      console.error(`Error adding document to ${collectionName}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
      throw err;
    }
  };

  // Update a document
  const update = async (id: string, data: DocumentData) => {
    setLoading(true);
    setError(null);
    try {
      await updateDocument(collectionName, id, data);
      setLoading(false);
    } catch (err) {
      console.error(`Error updating document ${id} in ${collectionName}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
      throw err;
    }
  };

  // Delete a document
  const remove = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteDocument(collectionName, id);
      setLoading(false);
    } catch (err) {
      console.error(`Error deleting document ${id} from ${collectionName}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
      throw err;
    }
  };

  return {
    add,
    update,
    remove,
    loading,
    error,
    // Expose query constraints
    queryConstraints
  };
};
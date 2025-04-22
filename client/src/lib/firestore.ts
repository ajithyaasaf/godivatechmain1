import { 
  collection, doc, getDoc, getDocs, 
  query, where, orderBy, limit,
  DocumentData, QueryDocumentSnapshot,
  Timestamp, QueryConstraint, addDoc,
  updateDoc, deleteDoc, setDoc,
  serverTimestamp,
  WhereFilterOp, OrderByDirection
} from "firebase/firestore";
import { db } from "./firebase";
import type { BlogPost, Category } from "@shared/schema";

// Firestore collection names
const BLOG_POSTS_COLLECTION = "blog_posts";
const CATEGORIES_COLLECTION = "categories";

// Generic Functions for Firestore CRUD Operations
// -----------------------------------------------

// Get all documents from a collection with optional query constraints
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
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error);
    throw error;
  }
}

// Get a single document by ID
export async function getDocument(
  collectionName: string,
  documentId: string
): Promise<DocumentData | null> {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    };
  } catch (error) {
    console.error(`Error getting document ${documentId} from ${collectionName}:`, error);
    throw error;
  }
}

// Add a document to a collection
export async function addDocument(
  collectionName: string,
  data: DocumentData
): Promise<string> {
  try {
    // Add timestamp
    const dataWithTimestamp = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, collectionName), dataWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
}

// Update a document
export async function updateDocument(
  collectionName: string,
  documentId: string,
  data: DocumentData
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, documentId);
    
    // Add timestamp
    const dataWithTimestamp = {
      ...data,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(docRef, dataWithTimestamp);
  } catch (error) {
    console.error(`Error updating document ${documentId} in ${collectionName}:`, error);
    throw error;
  }
}

// Delete a document
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

// Query constraints factory for easier querying
export const queryConstraints = {
  where: (field: string, operator: WhereFilterOp, value: any) => where(field, operator, value),
  orderBy: (field: string, direction: OrderByDirection = 'asc') => orderBy(field, direction),
  limit: (limitCount: number) => limit(limitCount)
};

// Blog Post Specific Functions
// ---------------------------

// Converts Firestore data to BlogPost object
export function convertToBlogPost(doc: QueryDocumentSnapshot<DocumentData>): BlogPost {
  const data = doc.data();
  // Handle Firestore Timestamp
  const publishedAt = data.publishedAt instanceof Timestamp 
    ? new Date(data.publishedAt.toMillis()) 
    : new Date();

  return {
    id: parseInt(doc.id),
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    published: data.published ?? true,
    authorName: data.authorName,
    authorImage: data.authorImage ?? null,
    coverImage: data.coverImage ?? null,
    publishedAt: publishedAt,
    categoryId: data.categoryId ?? null
  };
}

// Converts Firestore data to Category object
export function convertToCategory(doc: QueryDocumentSnapshot<DocumentData>): Category {
  const data = doc.data();
  return {
    id: parseInt(doc.id),
    name: data.name,
    slug: data.slug
  };
}

// Get all blog posts
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const blogPostsRef = collection(db, BLOG_POSTS_COLLECTION);
    const q = query(blogPostsRef, orderBy("publishedAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(convertToBlogPost);
  } catch (error) {
    console.error("Error getting all blog posts:", error);
    return [];
  }
}

// Get blog post by ID
export async function getBlogPostById(id: number): Promise<BlogPost | null> {
  try {
    const docRef = doc(db, BLOG_POSTS_COLLECTION, id.toString());
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return convertToBlogPost(docSnap as QueryDocumentSnapshot<DocumentData>);
  } catch (error) {
    console.error("Error getting blog post by ID:", error);
    return null;
  }
}

// Get blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const blogPostsRef = collection(db, BLOG_POSTS_COLLECTION);
    const q = query(blogPostsRef, where("slug", "==", slug), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    return convertToBlogPost(querySnapshot.docs[0]);
  } catch (error) {
    console.error("Error getting blog post by slug:", error);
    return null;
  }
}

// Get all categories
export async function getAllCategories(): Promise<Category[]> {
  try {
    const categoriesRef = collection(db, CATEGORIES_COLLECTION);
    const q = query(categoriesRef, orderBy("name"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(convertToCategory);
  } catch (error) {
    console.error("Error getting all categories:", error);
    return [];
  }
}

// Get category by ID
export async function getCategoryById(id: number): Promise<Category | null> {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, id.toString());
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return convertToCategory(docSnap as QueryDocumentSnapshot<DocumentData>);
  } catch (error) {
    console.error("Error getting category by ID:", error);
    return null;
  }
}

// Get category by slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const categoriesRef = collection(db, CATEGORIES_COLLECTION);
    const q = query(categoriesRef, where("slug", "==", slug), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    return convertToCategory(querySnapshot.docs[0]);
  } catch (error) {
    console.error("Error getting category by slug:", error);
    return null;
  }
}

// Get blog posts by category ID
export async function getBlogPostsByCategoryId(categoryId: number): Promise<BlogPost[]> {
  try {
    const blogPostsRef = collection(db, BLOG_POSTS_COLLECTION);
    const q = query(
      blogPostsRef, 
      where("categoryId", "==", categoryId),
      where("published", "==", true),
      orderBy("publishedAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(convertToBlogPost);
  } catch (error) {
    console.error("Error getting blog posts by category ID:", error);
    return [];
  }
}

// Search blog posts by query string (title or excerpt)
export async function searchBlogPosts(searchQuery: string): Promise<BlogPost[]> {
  try {
    const blogPostsRef = collection(db, BLOG_POSTS_COLLECTION);
    const q = query(
      blogPostsRef,
      where("published", "==", true),
      orderBy("publishedAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    
    // Client-side filtering since Firestore doesn't support text search directly
    const lowerQuery = searchQuery.toLowerCase();
    return querySnapshot.docs
      .map(convertToBlogPost)
      .filter(post => 
        post.title.toLowerCase().includes(lowerQuery) || 
        post.excerpt.toLowerCase().includes(lowerQuery)
      );
  } catch (error) {
    console.error("Error searching blog posts:", error);
    return [];
  }
}

// Initialize Firestore with sample data if empty
export async function initializeFirestoreWithSampleData() {
  // Check if we already have data
  const blogPostsRef = collection(db, BLOG_POSTS_COLLECTION);
  const categoriesRef = collection(db, CATEGORIES_COLLECTION);
  
  const blogPostsSnapshot = await getDocs(blogPostsRef);
  const categoriesSnapshot = await getDocs(categoriesRef);
  
  // If we already have data, don't initialize
  if (!blogPostsSnapshot.empty || !categoriesSnapshot.empty) {
    return;
  }
  
  console.log("Initializing Firestore with sample data...");
  
  // Create some categories first
  const categories = [
    { name: "Technology Trends", slug: "technology-trends" },
    { name: "Web Development", slug: "web-development" },
    { name: "Digital Marketing", slug: "digital-marketing" },
    { name: "UI/UX Design", slug: "ui-ux-design" },
    { name: "SEO", slug: "seo" }
  ];
  
  const categoryIds = [];
  for (const category of categories) {
    const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), category);
    categoryIds.push(docRef.id);
  }
  
  // Create some sample blog posts
  const samplePosts = [
    {
      title: "The Future of Web Development in Madurai",
      slug: "future-web-development-madurai",
      excerpt: "Discover the latest trends in web development and how businesses in Madurai can leverage these technologies.",
      content: "Web Development in Madurai is evolving rapidly with new technologies and frameworks being adopted by local businesses...",
      published: true,
      authorName: "Rajesh Kumar",
      authorImage: "https://randomuser.me/api/portraits/men/1.jpg",
      coverImage: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80",
      publishedAt: new Date(),
      categoryId: 1
    },
    {
      title: "Digital Marketing Strategies for Madurai Businesses",
      slug: "digital-marketing-strategies-madurai",
      excerpt: "Learn effective digital marketing strategies tailored for businesses in Madurai to increase online visibility.",
      content: "Digital Marketing has become essential for businesses in Madurai looking to expand their customer base...",
      published: true,
      authorName: "Priya Lakshmi",
      authorImage: "https://randomuser.me/api/portraits/women/2.jpg",
      coverImage: "https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=800&q=80",
      publishedAt: new Date(),
      categoryId: 3
    }
  ];
  
  for (const post of samplePosts) {
    await addDoc(collection(db, BLOG_POSTS_COLLECTION), post);
  }
  
  console.log("Sample data initialized successfully");
}
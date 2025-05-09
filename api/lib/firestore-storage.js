// Simplified Firestore storage adapter for serverless functions
import { firestore } from './firebase-admin.js';

// Convert Firestore timestamp to Date
const convertTimestampToDate = (timestamp) => {
  if (!timestamp) return null;
  if (typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  return timestamp;
};

// Helper to process document data
const processDocData = (doc) => {
  if (!doc.exists) return null;
  
  const data = doc.data();
  
  // Convert timestamps
  if (data.createdAt) data.createdAt = convertTimestampToDate(data.createdAt);
  if (data.updatedAt) data.updatedAt = convertTimestampToDate(data.updatedAt);
  if (data.publishedAt) data.publishedAt = convertTimestampToDate(data.publishedAt);
  
  return {
    id: doc.id,
    ...data
  };
};

// Serverless-optimized Firestore Storage
class FirestoreStorage {
  // Service methods
  async getAllServices() {
    try {
      const snapshot = await firestore.collection('services').get();
      return snapshot.docs.map(processDocData);
    } catch (error) {
      console.error('Error getting services:', error);
      throw error;
    }
  }

  async getService(id) {
    try {
      const doc = await firestore.collection('services').doc(id.toString()).get();
      return processDocData(doc);
    } catch (error) {
      console.error(`Error getting service ${id}:`, error);
      throw error;
    }
  }

  // Project methods
  async getAllProjects() {
    try {
      const snapshot = await firestore.collection('projects').get();
      return snapshot.docs.map(processDocData);
    } catch (error) {
      console.error('Error getting projects:', error);
      throw error;
    }
  }

  async getProject(id) {
    try {
      const doc = await firestore.collection('projects').doc(id.toString()).get();
      return processDocData(doc);
    } catch (error) {
      console.error(`Error getting project ${id}:`, error);
      throw error;
    }
  }

  // Blog post methods
  async getAllBlogPosts() {
    try {
      const snapshot = await firestore.collection('blog_posts').get();
      return snapshot.docs.map(processDocData);
    } catch (error) {
      console.error('Error getting blog posts:', error);
      throw error;
    }
  }

  async getBlogPost(id) {
    try {
      const doc = await firestore.collection('blog_posts').doc(id.toString()).get();
      return processDocData(doc);
    } catch (error) {
      console.error(`Error getting blog post ${id}:`, error);
      throw error;
    }
  }

  async getBlogPostBySlug(slug) {
    try {
      const snapshot = await firestore.collection('blog_posts')
        .where('slug', '==', slug)
        .limit(1)
        .get();
      
      if (snapshot.empty) return null;
      return processDocData(snapshot.docs[0]);
    } catch (error) {
      console.error(`Error getting blog post by slug ${slug}:`, error);
      throw error;
    }
  }

  // Team member methods
  async getAllTeamMembers() {
    try {
      const snapshot = await firestore.collection('team_members').get();
      return snapshot.docs.map(processDocData);
    } catch (error) {
      console.error('Error getting team members:', error);
      throw error;
    }
  }

  // Testimonial methods
  async getAllTestimonials() {
    try {
      const snapshot = await firestore.collection('testimonials').get();
      return snapshot.docs.map(processDocData);
    } catch (error) {
      console.error('Error getting testimonials:', error);
      throw error;
    }
  }

  // Category methods
  async getAllCategories() {
    try {
      const snapshot = await firestore.collection('categories').get();
      return snapshot.docs.map(processDocData);
    } catch (error) {
      console.error('Error getting categories:', error);
      throw error;
    }
  }

  async getCategoryBySlug(slug) {
    try {
      const snapshot = await firestore.collection('categories')
        .where('slug', '==', slug)
        .limit(1)
        .get();
      
      if (snapshot.empty) return null;
      return processDocData(snapshot.docs[0]);
    } catch (error) {
      console.error(`Error getting category by slug ${slug}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const firestoreStorage = new FirestoreStorage();
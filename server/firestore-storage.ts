import session from "express-session";
import MemoryStore from "memorystore";
import { db } from "./firebase";
import { 
  collection, doc, getDoc, getDocs, 
  query, where, orderBy, limit, 
  addDoc, updateDoc, deleteDoc, setDoc,
  serverTimestamp, Timestamp, 
  DocumentData, QueryDocumentSnapshot
} from "firebase/firestore";
import { 
  InsertUser, User,
  InsertBlogPost, BlogPost,
  InsertCategory, Category,
  InsertProject, Project,
  InsertService, Service,
  InsertTeamMember, TeamMember,
  InsertTestimonial, Testimonial,
  InsertContactMessage, ContactMessage,
  InsertSubscriber, Subscriber
} from "@shared/schema";

// Create a memory store for session storage
const MemoryStoreClass = MemoryStore(session);

// Helper function to convert Firestore timestamp to Date
const convertTimestampToDate = (timestamp: any): Date => {
  if (timestamp instanceof Timestamp) {
    return new Date(timestamp.toMillis());
  }
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  return new Date();
};

export class FirestoreStorage {
  sessionStore: any; // Use 'any' type to avoid SessionStore issues

  constructor() {
    this.sessionStore = new MemoryStoreClass({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  // Helper method to get a new ID from a counter
  private async getNextId(counterName: string): Promise<number> {
    const counterRef = doc(db, 'counters', counterName);
    const counterSnap = await getDoc(counterRef);
    
    let nextId = 1;
    if (counterSnap.exists()) {
      nextId = (counterSnap.data()?.count || 0) + 1;
    }
    
    // Update the counter
    await setDoc(counterRef, { count: nextId });
    
    return nextId;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const docRef = doc(db, 'users', id.toString());
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return undefined;
      
      const userData = docSnap.data() as User;
      return { ...userData, id };
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username), limit(1));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) return undefined;
      
      const userDoc = querySnapshot.docs[0];
      return { ...userDoc.data() as User, id: parseInt(userDoc.id) };
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const nextId = await this.getNextId('users');
      
      // Create the user
      const userRef = doc(db, 'users', nextId.toString());
      const user: User = { ...insertUser, id: nextId };
      await setDoc(userRef, user);
      
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Blog posts methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    try {
      const blogPostsRef = collection(db, 'blog_posts');
      const q = query(blogPostsRef, orderBy('publishedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(docSnap => {
        const data = docSnap.data() as any;
        
        return { 
          ...data,
          id: parseInt(docSnap.id),
          publishedAt: convertTimestampToDate(data.publishedAt),
          published: data.published ?? true,
          authorImage: data.authorImage ?? null,
          coverImage: data.coverImage ?? null,
          categoryId: data.categoryId ?? null
        } as BlogPost;
      });
    } catch (error) {
      console.error("Error getting all blog posts:", error);
      return [];
    }
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    try {
      const docRef = doc(db, 'blog_posts', id.toString());
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return undefined;
      
      const data = docSnap.data() as any;
      
      return { 
        ...data,
        id,
        publishedAt: convertTimestampToDate(data.publishedAt),
        published: data.published ?? true,
        authorImage: data.authorImage ?? null,
        coverImage: data.coverImage ?? null,
        categoryId: data.categoryId ?? null
      } as BlogPost;
    } catch (error) {
      console.error("Error getting blog post:", error);
      return undefined;
    }
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    try {
      const blogPostsRef = collection(db, 'blog_posts');
      const q = query(blogPostsRef, where('slug', '==', slug), limit(1));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) return undefined;
      
      const docSnap = querySnapshot.docs[0];
      const data = docSnap.data() as any;
      
      return { 
        ...data,
        id: parseInt(docSnap.id),
        publishedAt: convertTimestampToDate(data.publishedAt),
        published: data.published ?? true,
        authorImage: data.authorImage ?? null,
        coverImage: data.coverImage ?? null,
        categoryId: data.categoryId ?? null
      } as BlogPost;
    } catch (error) {
      console.error("Error getting blog post by slug:", error);
      return undefined;
    }
  }

  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    try {
      const nextId = await this.getNextId('blog_posts');
      
      // Create the blog post with required fields
      const blogPost: BlogPost = {
        ...insertBlogPost,
        id: nextId,
        published: insertBlogPost.published ?? true,
        authorImage: insertBlogPost.authorImage ?? null,
        coverImage: insertBlogPost.coverImage ?? null,
        publishedAt: insertBlogPost.publishedAt ?? new Date(),
        categoryId: insertBlogPost.categoryId ?? null
      };
      
      // Save to Firestore
      const blogPostRef = doc(db, 'blog_posts', nextId.toString());
      await setDoc(blogPostRef, {
        ...blogPost,
        publishedAt: serverTimestamp() // Use Firestore timestamp for storage
      });
      
      return blogPost;
    } catch (error) {
      console.error("Error creating blog post:", error);
      throw error;
    }
  }

  async updateBlogPost(id: number, blogPost: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    try {
      const blogPostRef = doc(db, 'blog_posts', id.toString());
      const docSnap = await getDoc(blogPostRef);
      
      if (!docSnap.exists()) return undefined;
      
      // Update the blog post
      await updateDoc(blogPostRef, {
        ...blogPost,
        updatedAt: serverTimestamp()
      });
      
      // Get the updated document
      const updatedSnap = await getDoc(blogPostRef);
      const data = updatedSnap.data() as any;
      
      return { 
        ...data,
        id,
        publishedAt: convertTimestampToDate(data.publishedAt),
        published: data.published ?? true,
        authorImage: data.authorImage ?? null,
        coverImage: data.coverImage ?? null,
        categoryId: data.categoryId ?? null
      } as BlogPost;
    } catch (error) {
      console.error("Error updating blog post:", error);
      return undefined;
    }
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    try {
      const docRef = doc(db, 'blog_posts', id.toString());
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Error deleting blog post:", error);
      return false;
    }
  }

  // Categories methods
  async getAllCategories(): Promise<Category[]> {
    try {
      const categoriesRef = collection(db, 'categories');
      const q = query(categoriesRef, orderBy('name'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(docSnap => {
        const data = docSnap.data() as Category;
        return { 
          ...data,
          id: parseInt(docSnap.id)
        };
      });
    } catch (error) {
      console.error("Error getting all categories:", error);
      return [];
    }
  }

  async getCategory(id: number): Promise<Category | undefined> {
    try {
      const docRef = doc(db, 'categories', id.toString());
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return undefined;
      
      const data = docSnap.data() as Category;
      return { ...data, id };
    } catch (error) {
      console.error("Error getting category:", error);
      return undefined;
    }
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    try {
      const categoriesRef = collection(db, 'categories');
      const q = query(categoriesRef, where('slug', '==', slug), limit(1));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) return undefined;
      
      const docSnap = querySnapshot.docs[0];
      const data = docSnap.data() as Category;
      
      return { ...data, id: parseInt(docSnap.id) };
    } catch (error) {
      console.error("Error getting category by slug:", error);
      return undefined;
    }
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    try {
      const nextId = await this.getNextId('categories');
      
      // Create the category
      const category: Category = {
        ...insertCategory,
        id: nextId
      };
      
      const categoryRef = doc(db, 'categories', nextId.toString());
      await setDoc(categoryRef, category);
      
      return category;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    try {
      const categoryRef = doc(db, 'categories', id.toString());
      const docSnap = await getDoc(categoryRef);
      
      if (!docSnap.exists()) return undefined;
      
      // Update the category
      await updateDoc(categoryRef, {
        ...category,
        updatedAt: serverTimestamp()
      });
      
      // Get the updated document
      const updatedSnap = await getDoc(categoryRef);
      const data = updatedSnap.data() as Category;
      
      return { ...data, id };
    } catch (error) {
      console.error("Error updating category:", error);
      return undefined;
    }
  }

  async deleteCategory(id: number): Promise<boolean> {
    try {
      const docRef = doc(db, 'categories', id.toString());
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Error deleting category:", error);
      return false;
    }
  }

  // Projects methods
  async getAllProjects(): Promise<Project[]> {
    try {
      const projectsRef = collection(db, 'projects');
      const q = query(projectsRef, orderBy('title'));
      const querySnapshot = await getDocs(q);
      
      console.log(`Found ${querySnapshot.size} projects in Firestore collection`);
      
      return querySnapshot.docs.map(docSnap => {
        const data = docSnap.data() as any;
        // Use the actual document ID as the project ID
        const projectId = docSnap.id;
        console.log(`Processing project: id=${projectId}, title=${data.title}`);
        
        return { 
          ...data,
          id: projectId, // Use the Firebase document ID directly
          docId: projectId, // Also store the document ID in docId for reference
          firebaseId: projectId, // Additional field to make it clear this is a Firebase ID
          link: data.link ?? null,
          image: data.image ?? null
        } as Project;
      });
    } catch (error) {
      console.error("Error getting all projects:", error);
      return [];
    }
  }

  async getProject(id: number | string): Promise<Project | undefined> {
    try {
      // Convert id to string for document ID
      const docId = id.toString(); 
      console.log(`Fetching project with document ID: ${docId}`);
      
      const docRef = doc(db, 'projects', docId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        console.log(`No project document found with ID: ${docId}`);
        
        // If the ID looks numeric and doesn't exist, try querying all projects to find by numeric ID
        if (!isNaN(Number(id))) {
          console.log(`Trying to find project by numeric ID: ${id}`);
          const allProjects = await this.getAllProjects();
          const projectWithNumericId = allProjects.find(p => {
            const numericId = p.id && typeof p.id === 'string' ? parseInt(p.id) : null;
            return numericId === Number(id);
          });
          
          if (projectWithNumericId) {
            console.log(`Found project with numeric ID match: ${projectWithNumericId.id}, title: ${projectWithNumericId.title}`);
            return projectWithNumericId;
          }
        }
        
        return undefined;
      }
      
      const data = docSnap.data() as any;
      console.log(`Found project with document ID: ${docId}, title: ${data.title}`);
      
      return { 
        ...data,
        id: docId, // Use the document ID as is
        docId: docId, // Also include the doc ID separately
        firebaseId: docId, // Explicit field indicating this is a Firebase ID
        link: data.link ?? null,
        image: data.image ?? null
      } as Project;
    } catch (error) {
      console.error(`Error getting project with ID ${id}:`, error);
      return undefined;
    }
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    try {
      console.log('Creating new project in Firestore with data:', insertProject);
      
      // Use Firestore's auto-generated document ID instead of numeric ID
      const projectsCollection = collection(db, 'projects');
      const newDocRef = doc(projectsCollection); // This creates a reference with an auto-generated ID
      const newDocId = newDocRef.id;
      
      console.log(`Generated new Firestore document ID: ${newDocId}`);
      
      // Create the project with required fields - matching schema properties
      // Use the Firestore document ID as the project ID
      const projectData = {
        ...insertProject,
        // Include these properties but not in the 'id' field which is handled specially
        link: insertProject.link ?? null,
        image: insertProject.image ?? null,
        gallery: insertProject.gallery ?? null,
        fullDescription: insertProject.fullDescription ?? null,
        clientName: insertProject.clientName ?? null,
        completionDate: insertProject.completionDate ?? null,
        githubLink: insertProject.githubLink ?? null,
        testimonial: insertProject.testimonial ?? null,
        challengeDescription: insertProject.challengeDescription ?? null,
        solutionDescription: insertProject.solutionDescription ?? null,
        resultsDescription: insertProject.resultsDescription ?? null,
        featured: insertProject.featured ?? false,
        order: insertProject.order ?? null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // Set the document with the auto-generated ID
      await setDoc(newDocRef, projectData);
      
      console.log(`Successfully created project with ID: ${newDocId}`);
      
      // Return the project with the Firestore document ID
      const project: Project = {
        ...projectData,
        id: newDocId, // Use the Firebase document ID
        docId: newDocId, // Also include document ID explicitly 
        firebaseId: newDocId // Additional field to be explicit
      } as Project;
      
      return project;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  }

  async updateProject(id: number | string, project: Partial<InsertProject>): Promise<Project | undefined> {
    try {
      // Enhanced logging
      console.log(`=== FIRESTORE PROJECT UPDATE ===`);
      console.log(`Attempting to update project with ID: ${id} (type: ${typeof id}) in Firestore`);
      
      // Always convert to string for document ID (Firebase document IDs are always strings)
      const docId = id.toString();
      
      // First check if the document exists
      const projectRef = doc(db, 'projects', docId);
      const docSnap = await getDoc(projectRef);
      
      if (!docSnap.exists()) {
        console.warn(`Project with direct document ID ${docId} not found in Firestore, searching all projects...`);
        
        // Try finding the project by querying all projects
        const projectsCollection = collection(db, 'projects');
        const querySnapshot = await getDocs(projectsCollection);
        
        console.log(`Found ${querySnapshot.size} projects in Firestore collection to search through`);
        
        // Check for different possible matches
        let foundDoc: QueryDocumentSnapshot<DocumentData> | null = null;
        
        querySnapshot.forEach(docSnapshot => {
          const data = docSnapshot.data();
          
          // Log each document for debugging
          console.log(`Checking project: id=${docSnapshot.id}, title=${data.title || 'unknown'}`);
          
          // Check for ID matches in various formats
          if (
            docSnapshot.id === docId || // Direct document ID match
            (data.id && String(data.id) === String(id)) || // ID property match
            (data.id && typeof data.id === 'number' && 
              typeof id === 'string' && !isNaN(Number(id)) && 
              data.id === Number(id)) // Numeric ID match
          ) {
            console.log(`✓ Found matching project: id=${docSnapshot.id}, title=${data.title || 'unknown'}`);
            foundDoc = docSnapshot;
          }
        });
        
        if (!foundDoc) {
          console.warn(`No matching project found for ID: ${id} in any format`);
          return undefined;
        }
        
        // Use the found document reference for the update
        console.log(`Using found document ID: ${foundDoc.id} for update operation`);
        const foundDocRef = doc(db, 'projects', foundDoc.id);
        
        // Update existing fields but add an updatedAt timestamp
        await updateDoc(foundDocRef, {
          ...project,
          updatedAt: serverTimestamp()
        });
        
        // Get the updated document
        const updatedSnap = await getDoc(foundDocRef);
        const data = updatedSnap.data() as any;
        
        console.log(`Successfully updated project with document ID: ${foundDoc.id} in Firestore`);
        
        // Return the updated project with the correct IDs preserved
        return { 
          ...data,
          id: id, // Keep the original ID
          docId: foundDoc.id, // Include the Firestore document ID
          firebaseId: foundDoc.id, // For compatibility
          link: data.link ?? null,
          image: data.image ?? null
        } as Project;
      }
      
      // If we made it here, the document was found with the direct ID
      console.log(`Project found using direct document ID, updating with new data`, project);
      
      // Update the project
      await updateDoc(projectRef, {
        ...project,
        updatedAt: serverTimestamp()
      });
      
      // Get the updated document
      const updatedSnap = await getDoc(projectRef);
      const data = updatedSnap.data() as any;
      
      console.log(`Successfully updated project with document ID: ${docId} in Firestore`);
      
      // Return the updated project with correct IDs
      return { 
        ...data,
        id: id, // Preserve the original ID that was passed in
        docId: docId, // Include the Firestore document ID
        firebaseId: docId, // For compatibility
        link: data.link ?? null,
        image: data.image ?? null
      } as Project;
    } catch (error) {
      console.error(`Error updating project with ID ${id} in Firestore:`, error);
      return undefined;
    }
  }

  async deleteProject(id: number | string): Promise<boolean> {
    try {
      console.log(`Attempting to delete project with ID: ${id} (type: ${typeof id})`);
      
      // Validate ID to prevent "null" or undefined
      if (id === null || id === undefined) {
        console.error(`Invalid project ID for deletion: ${id}`);
        return false;
      }
      
      // Use a safer approach - first find the document in the collection
      console.log('Retrieving all projects to find the target document');
      const projectsCollection = collection(db, 'projects');
      const querySnapshot = await getDocs(projectsCollection);
      
      console.log(`Found ${querySnapshot.size} projects in collection`);
      
      // Look for exact match first with string comparison
      const targetDocId = typeof id === 'string' ? id : id.toString();
      let foundDoc: QueryDocumentSnapshot<DocumentData> | null = null;
      
      querySnapshot.forEach(docSnapshot => {
        const data = docSnapshot.data();
        console.log(`Checking project: id=${docSnapshot.id}, title=${data.title || 'unknown'}`);
        
        // Check for different possible ID matches
        if (
          docSnapshot.id === targetDocId || 
          (data.id && (
            (typeof data.id === 'number' && data.id === Number(id)) || 
            (typeof data.id === 'string' && data.id === String(id)) ||
            String(data.id) === targetDocId
          ))
        ) {
          console.log(`✓ Found matching project: id=${docSnapshot.id}, title=${data.title || 'unknown'}`);
          foundDoc = docSnapshot;
        }
      });
      
      if (!foundDoc) {
        console.warn(`No matching project found for ID: ${id}`);
        return false;
      }
      
      // Log the document data for debugging
      console.log(`Project found with document ID: ${foundDoc.id}`);
      console.log(`Proceeding with deletion of document 'projects/${foundDoc.id}'`);
      
      try {
        // Get a reference and perform the deletion
        const projectRef = doc(db, 'projects', foundDoc.id);
        await deleteDoc(projectRef);
        
        // Verify deletion was successful by checking if document still exists
        const verifySnap = await getDoc(projectRef);
        
        if (!verifySnap.exists()) {
          console.log(`Project with document ID ${foundDoc.id} successfully deleted!`);
          return true;
        } else {
          console.error(`Deletion operation did not remove document 'projects/${foundDoc.id}'`);
          return false;
        }
      } catch (deleteError) {
        console.error(`Error during document deletion:`, deleteError);
        return false;
      }
    } catch (error) {
      console.error(`Error in deleteProject with ID ${id}:`, error);
      return false;
    }
  }

  // Services methods
  async getAllServices(): Promise<Service[]> {
    try {
      const servicesRef = collection(db, 'services');
      const q = query(servicesRef, orderBy('title'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(docSnap => {
        const data = docSnap.data() as Service;
        return { ...data, id: parseInt(docSnap.id) };
      });
    } catch (error) {
      console.error("Error getting all services:", error);
      return [];
    }
  }

  async getService(id: number): Promise<Service | undefined> {
    try {
      const docRef = doc(db, 'services', id.toString());
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return undefined;
      
      const data = docSnap.data() as Service;
      return { ...data, id };
    } catch (error) {
      console.error("Error getting service:", error);
      return undefined;
    }
  }

  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    try {
      const servicesRef = collection(db, 'services');
      const q = query(servicesRef, where('slug', '==', slug), limit(1));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) return undefined;
      
      const docSnap = querySnapshot.docs[0];
      const data = docSnap.data() as Service;
      
      return { ...data, id: parseInt(docSnap.id) };
    } catch (error) {
      console.error("Error getting service by slug:", error);
      return undefined;
    }
  }

  async createService(insertService: InsertService): Promise<Service> {
    try {
      const nextId = await this.getNextId('services');
      
      // Create the service
      const service: Service = {
        ...insertService,
        id: nextId
      };
      
      const serviceRef = doc(db, 'services', nextId.toString());
      await setDoc(serviceRef, service);
      
      return service;
    } catch (error) {
      console.error("Error creating service:", error);
      throw error;
    }
  }

  async updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined> {
    try {
      const serviceRef = doc(db, 'services', id.toString());
      const docSnap = await getDoc(serviceRef);
      
      if (!docSnap.exists()) return undefined;
      
      // Update the service
      await updateDoc(serviceRef, {
        ...service,
        updatedAt: serverTimestamp()
      });
      
      // Get the updated document
      const updatedSnap = await getDoc(serviceRef);
      const data = updatedSnap.data() as Service;
      
      return { ...data, id };
    } catch (error) {
      console.error("Error updating service:", error);
      return undefined;
    }
  }

  async deleteService(id: number): Promise<boolean> {
    try {
      const docRef = doc(db, 'services', id.toString());
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Error deleting service:", error);
      return false;
    }
  }

  // Team members methods
  async getAllTeamMembers(): Promise<TeamMember[]> {
    try {
      const teamMembersRef = collection(db, 'team_members');
      const q = query(teamMembersRef, orderBy('name'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(docSnap => {
        const data = docSnap.data() as any;
        return { 
          ...data,
          id: parseInt(docSnap.id),
          image: data.image ?? null,
          linkedIn: data.linkedIn ?? null,
          twitter: data.twitter ?? null
        } as TeamMember;
      });
    } catch (error) {
      console.error("Error getting all team members:", error);
      return [];
    }
  }

  async getTeamMember(id: number): Promise<TeamMember | undefined> {
    try {
      const docRef = doc(db, 'team_members', id.toString());
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return undefined;
      
      const data = docSnap.data() as any;
      return { 
        ...data,
        id,
        image: data.image ?? null,
        linkedIn: data.linkedIn ?? null,
        twitter: data.twitter ?? null
      } as TeamMember;
    } catch (error) {
      console.error("Error getting team member:", error);
      return undefined;
    }
  }

  async createTeamMember(insertTeamMember: InsertTeamMember): Promise<TeamMember> {
    try {
      const nextId = await this.getNextId('team_members');
      
      // Create the team member with required fields
      const teamMember: TeamMember = {
        ...insertTeamMember,
        id: nextId,
        image: insertTeamMember.image ?? null,
        linkedIn: insertTeamMember.linkedIn ?? null,
        twitter: insertTeamMember.twitter ?? null
      };
      
      const teamMemberRef = doc(db, 'team_members', nextId.toString());
      await setDoc(teamMemberRef, teamMember);
      
      return teamMember;
    } catch (error) {
      console.error("Error creating team member:", error);
      throw error;
    }
  }

  async updateTeamMember(id: number, teamMember: Partial<InsertTeamMember>): Promise<TeamMember | undefined> {
    try {
      const teamMemberRef = doc(db, 'team_members', id.toString());
      const docSnap = await getDoc(teamMemberRef);
      
      if (!docSnap.exists()) return undefined;
      
      // Update the team member
      await updateDoc(teamMemberRef, {
        ...teamMember,
        updatedAt: serverTimestamp()
      });
      
      // Get the updated document
      const updatedSnap = await getDoc(teamMemberRef);
      const data = updatedSnap.data() as any;
      
      return { 
        ...data,
        id,
        image: data.image ?? null,
        linkedIn: data.linkedIn ?? null,
        twitter: data.twitter ?? null
      } as TeamMember;
    } catch (error) {
      console.error("Error updating team member:", error);
      return undefined;
    }
  }

  async deleteTeamMember(id: number): Promise<boolean> {
    try {
      const docRef = doc(db, 'team_members', id.toString());
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Error deleting team member:", error);
      return false;
    }
  }

  // Testimonials methods
  async getAllTestimonials(): Promise<Testimonial[]> {
    try {
      const testimonialsRef = collection(db, 'testimonials');
      const q = query(testimonialsRef, orderBy('name'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(docSnap => {
        const data = docSnap.data() as any;
        return { 
          ...data,
          id: parseInt(docSnap.id),
          image: data.image ?? null
        } as Testimonial;
      });
    } catch (error) {
      console.error("Error getting all testimonials:", error);
      return [];
    }
  }

  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    try {
      const docRef = doc(db, 'testimonials', id.toString());
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return undefined;
      
      const data = docSnap.data() as any;
      return { 
        ...data,
        id,
        image: data.image ?? null
      } as Testimonial;
    } catch (error) {
      console.error("Error getting testimonial:", error);
      return undefined;
    }
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    try {
      const nextId = await this.getNextId('testimonials');
      
      // Create the testimonial with required fields
      const testimonial: Testimonial = {
        ...insertTestimonial,
        id: nextId,
        image: insertTestimonial.image ?? null
      };
      
      const testimonialRef = doc(db, 'testimonials', nextId.toString());
      await setDoc(testimonialRef, testimonial);
      
      return testimonial;
    } catch (error) {
      console.error("Error creating testimonial:", error);
      throw error;
    }
  }

  async updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    try {
      const testimonialRef = doc(db, 'testimonials', id.toString());
      const docSnap = await getDoc(testimonialRef);
      
      if (!docSnap.exists()) return undefined;
      
      // Update the testimonial
      await updateDoc(testimonialRef, {
        ...testimonial,
        updatedAt: serverTimestamp()
      });
      
      // Get the updated document
      const updatedSnap = await getDoc(testimonialRef);
      const data = updatedSnap.data() as any;
      
      return { 
        ...data,
        id,
        image: data.image ?? null
      } as Testimonial;
    } catch (error) {
      console.error("Error updating testimonial:", error);
      return undefined;
    }
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    try {
      const docRef = doc(db, 'testimonials', id.toString());
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      return false;
    }
  }

  // Contact messages methods
  async getAllContactMessages(): Promise<ContactMessage[]> {
    try {
      console.log('Fetching all contact messages from Firestore');
      
      // Get collection reference - using the exact name from Firestore
      // Note: the collection might be "contacts" in Firestore based on your screenshot
      console.log('Trying "contacts" as collection name');
      const contactMessagesRef = collection(db, 'contacts');
      
      // Try to query without filters first
      console.log('Querying contacts collection');
      const simpleSnapshot = await getDocs(contactMessagesRef);
      console.log(`Found ${simpleSnapshot.docs.length} contact messages with simple query`);
      
      if (simpleSnapshot.docs.length === 0) {
        console.log('No contacts found in collection. Trying alternative collection name...');
        // Try alternative collection name
        const altContactsRef = collection(db, 'contact_messages');
        const altSnapshot = await getDocs(altContactsRef);
        console.log(`Found ${altSnapshot.docs.length} contact messages with alternative collection name`);
        
        if (altSnapshot.docs.length === 0) {
          console.log('No contact messages found in either collection.');
          return [];
        }
        
        // Use the alternative collection if it has data
        return altSnapshot.docs.map(docSnap => {
          const data = docSnap.data() as any;
          console.log(`Contact message ${docSnap.id}: ${JSON.stringify(data, null, 2)}`);
          
          // Handle different document ID formats
          let docId: number;
          try {
            docId = parseInt(docSnap.id);
          } catch (e) {
            console.log(`Could not parse document ID "${docSnap.id}" as number, using fallback ID`);
            docId = 9999;
          }
          
          // Handle different date formats
          let createdAtDate: Date;
          try {
            createdAtDate = convertTimestampToDate(data.createdAt);
          } catch (e) {
            console.log(`Could not convert createdAt for message ${docSnap.id}, using current date`);
            createdAtDate = new Date();
          }
          
          return { 
            ...data,
            id: docId,
            createdAt: createdAtDate
          } as ContactMessage;
        });
      }
      
      // Process documents with detailed logging
      const messages = simpleSnapshot.docs.map(docSnap => {
        const data = docSnap.data() as any;
        console.log(`Contact message ${docSnap.id}: ${JSON.stringify(data, null, 2)}`);
        
        // Handle different document ID formats
        let docId: number;
        try {
          docId = parseInt(docSnap.id);
        } catch (e) {
          console.log(`Could not parse document ID "${docSnap.id}" as number, using fallback ID`);
          docId = 9999;
        }
        
        // Handle different date formats
        let createdAtDate: Date;
        try {
          createdAtDate = convertTimestampToDate(data.createdAt);
        } catch (e) {
          console.log(`Could not convert createdAt for message ${docSnap.id}, using current date`);
          createdAtDate = new Date();
        }
        
        return { 
          ...data,
          id: docId,
          createdAt: createdAtDate
        } as ContactMessage;
      });
      
      console.log(`Successfully processed ${messages.length} contact messages`);
      return messages;
    } catch (error) {
      console.error("Error getting all contact messages:", error);
      console.error(error instanceof Error ? error.stack : String(error));
      return [];
    }
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    try {
      const docRef = doc(db, 'contact_messages', id.toString());
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return undefined;
      
      const data = docSnap.data() as any;
      return { 
        ...data,
        id,
        createdAt: convertTimestampToDate(data.createdAt)
      } as ContactMessage;
    } catch (error) {
      console.error("Error getting contact message:", error);
      return undefined;
    }
  }

  async createContactMessage(insertContactMessage: InsertContactMessage): Promise<ContactMessage> {
    try {
      const nextId = await this.getNextId('contact_messages');
      
      // Create the contact message and add timestamp
      const contactMessage: ContactMessage = {
        ...insertContactMessage,
        id: nextId,
        phone: insertContactMessage.phone ?? null,
        createdAt: new Date()
      };
      
      const contactMessageRef = doc(db, 'contact_messages', nextId.toString());
      await setDoc(contactMessageRef, {
        ...contactMessage,
        createdAt: serverTimestamp() // Use Firestore timestamp for storage
      });
      
      return contactMessage;
    } catch (error) {
      console.error("Error creating contact message:", error);
      throw error;
    }
  }

  async deleteContactMessage(id: number): Promise<boolean> {
    try {
      const docRef = doc(db, 'contact_messages', id.toString());
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Error deleting contact message:", error);
      return false;
    }
  }

  // Subscribers methods
  async getAllSubscribers(): Promise<Subscriber[]> {
    try {
      console.log('Fetching all subscribers from Firestore');
      
      // Get collection reference - using the exact name from Firestore
      console.log('Using "subscribers" as collection name');
      const subscribersRef = collection(db, 'subscribers');
      
      // Try to query without filters first to see if collection exists and has docs
      console.log('Querying subscribers collection');
      const simpleSnapshot = await getDocs(subscribersRef);
      console.log(`Found ${simpleSnapshot.docs.length} subscribers with simple query`);
      
      if (simpleSnapshot.docs.length === 0) {
        console.log('No subscribers found in collection. Checking if collection exists...');
        
        // List all collections in Firestore
        try {
          // Need to use Firestore admin listCollections instead of empty path
          console.log('Available collections: subscribers, contacts, blog_posts, etc.');
        } catch (e) {
          console.error('Error listing collections:', e);
        }
        
        return [];
      }
      
      // Process documents with detailed logging
      const subscribers = simpleSnapshot.docs.map(docSnap => {
        const data = docSnap.data() as any;
        console.log(`Subscriber ${docSnap.id}: ${JSON.stringify(data, null, 2)}`);
        
        // Handle different document ID formats
        let docId: number;
        try {
          docId = parseInt(docSnap.id);
        } catch (e) {
          console.log(`Could not parse document ID "${docSnap.id}" as number, using docSnap.id as string`);
          // Use a fallback ID since we couldn't parse it
          docId = 9999; 
        }
        
        // Handle different date formats in createdAt
        let createdAtDate: Date;
        try {
          createdAtDate = convertTimestampToDate(data.createdAt);
        } catch (e) {
          console.log(`Could not convert createdAt for subscriber ${docSnap.id}, using current date`);
          createdAtDate = new Date();
        }
        
        return { 
          ...data,
          id: docId,
          createdAt: createdAtDate
        } as Subscriber;
      });
      
      console.log(`Successfully processed ${subscribers.length} subscribers`);
      return subscribers;
    } catch (error) {
      console.error("Error getting all subscribers:", error);
      console.error(error instanceof Error ? error.stack : String(error));
      return [];
    }
  }

  async getSubscriber(id: number): Promise<Subscriber | undefined> {
    try {
      const docRef = doc(db, 'subscribers', id.toString());
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return undefined;
      
      const data = docSnap.data() as any;
      return { 
        ...data,
        id,
        createdAt: convertTimestampToDate(data.createdAt)
      } as Subscriber;
    } catch (error) {
      console.error("Error getting subscriber:", error);
      return undefined;
    }
  }

  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    try {
      const subscribersRef = collection(db, 'subscribers');
      const q = query(subscribersRef, where('email', '==', email), limit(1));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) return undefined;
      
      const docSnap = querySnapshot.docs[0];
      const data = docSnap.data() as any;
      
      return { 
        ...data,
        id: parseInt(docSnap.id),
        createdAt: convertTimestampToDate(data.createdAt)
      } as Subscriber;
    } catch (error) {
      console.error("Error getting subscriber by email:", error);
      return undefined;
    }
  }

  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    try {
      const nextId = await this.getNextId('subscribers');
      
      // Create the subscriber with timestamp
      const subscriber: Subscriber = {
        ...insertSubscriber,
        id: nextId,
        createdAt: new Date()
      };
      
      const subscriberRef = doc(db, 'subscribers', nextId.toString());
      await setDoc(subscriberRef, {
        ...subscriber,
        createdAt: serverTimestamp() // Use Firestore timestamp for storage
      });
      
      return subscriber;
    } catch (error) {
      console.error("Error creating subscriber:", error);
      throw error;
    }
  }

  async deleteSubscriber(id: number): Promise<boolean> {
    try {
      const docRef = doc(db, 'subscribers', id.toString());
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      return false;
    }
  }
}

// Create and export a singleton instance
export const firestoreStorage = new FirestoreStorage();
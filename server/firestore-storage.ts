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
      
      return querySnapshot.docs.map(docSnap => {
        const data = docSnap.data() as any;
        return { 
          ...data,
          id: parseInt(docSnap.id),
          link: data.link ?? null,
          image: data.image ?? null
        } as Project;
      });
    } catch (error) {
      console.error("Error getting all projects:", error);
      return [];
    }
  }

  async getProject(id: number): Promise<Project | undefined> {
    try {
      const docRef = doc(db, 'projects', id.toString());
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return undefined;
      
      const data = docSnap.data() as any;
      return { 
        ...data,
        id,
        link: data.link ?? null,
        image: data.image ?? null
      } as Project;
    } catch (error) {
      console.error("Error getting project:", error);
      return undefined;
    }
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    try {
      const nextId = await this.getNextId('projects');
      
      // Create the project with required fields
      const project: Project = {
        ...insertProject,
        id: nextId,
        link: insertProject.link ?? null,
        image: insertProject.image ?? null,
        gallery: insertProject.gallery ?? null,
        fullDescription: insertProject.fullDescription ?? null,
        showcaseUrl: insertProject.showcaseUrl ?? null,
        videoUrl: insertProject.videoUrl ?? null,
        clientName: insertProject.clientName ?? null,
        clientUrl: insertProject.clientUrl ?? null,
        featured: insertProject.featured ?? false,
        completed: insertProject.completed ?? true,
        completionDate: insertProject.completionDate ?? null,
        order: insertProject.order ?? null
      };
      
      const projectRef = doc(db, 'projects', nextId.toString());
      await setDoc(projectRef, project);
      
      return project;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined> {
    try {
      const projectRef = doc(db, 'projects', id.toString());
      const docSnap = await getDoc(projectRef);
      
      if (!docSnap.exists()) return undefined;
      
      // Update the project
      await updateDoc(projectRef, {
        ...project,
        updatedAt: serverTimestamp()
      });
      
      // Get the updated document
      const updatedSnap = await getDoc(projectRef);
      const data = updatedSnap.data() as any;
      
      return { 
        ...data,
        id,
        link: data.link ?? null,
        image: data.image ?? null
      } as Project;
    } catch (error) {
      console.error("Error updating project:", error);
      return undefined;
    }
  }

  async deleteProject(id: number): Promise<boolean> {
    try {
      console.log(`Attempting to delete project with ID: ${id}`);
      
      // Validate ID to prevent "null" or undefined
      if (id === null || id === undefined || isNaN(id)) {
        console.error(`Invalid project ID for deletion: ${id}`);
        return false;
      }
      
      // Check if the document exists before deleting
      const projectRef = doc(db, 'projects', id.toString());
      const docSnap = await getDoc(projectRef);
      
      if (!docSnap.exists()) {
        console.warn(`Project with ID ${id} not found, cannot delete`);
        return false;
      }
      
      console.log(`Project found, proceeding with deletion of ID: ${id}`);
      await deleteDoc(projectRef);
      console.log(`Project with ID ${id} successfully deleted from Firestore`);
      return true;
    } catch (error) {
      console.error("Error deleting project:", error);
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
      const contactMessagesRef = collection(db, 'contact_messages');
      const q = query(contactMessagesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(docSnap => {
        const data = docSnap.data() as any;
        return { 
          ...data,
          id: parseInt(docSnap.id),
          createdAt: convertTimestampToDate(data.createdAt)
        } as ContactMessage;
      });
    } catch (error) {
      console.error("Error getting all contact messages:", error);
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
      const subscribersRef = collection(db, 'subscribers');
      const q = query(subscribersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(docSnap => {
        const data = docSnap.data() as any;
        return { 
          ...data,
          id: parseInt(docSnap.id),
          createdAt: convertTimestampToDate(data.createdAt)
        } as Subscriber;
      });
    } catch (error) {
      console.error("Error getting all subscribers:", error);
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
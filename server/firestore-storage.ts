import session from "express-session";
import MemoryStore from "memorystore";
import { db } from "./firebase";
import { 
  collection, doc, getDoc, getDocs, 
  query, where, orderBy, limit, 
  addDoc, updateDoc, deleteDoc, setDoc,
  serverTimestamp, Timestamp
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

export class FirestoreStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new MemoryStoreClass({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const userDoc = await db.collection('users').doc(id.toString()).get();
      if (!userDoc.exists) return undefined;
      
      const userData = userDoc.data() as User;
      return { ...userData, id };
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const usersRef = db.collection('users');
      const querySnapshot = await usersRef.where('username', '==', username).limit(1).get();
      
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
      // Get the latest ID
      const counterRef = db.collection('counters').doc('users');
      const counterDoc = await counterRef.get();
      
      let nextId = 1;
      if (counterDoc.exists) {
        nextId = (counterDoc.data()?.count || 0) + 1;
      }
      
      // Update the counter
      await counterRef.set({ count: nextId });
      
      // Create the user
      const userRef = db.collection('users').doc(nextId.toString());
      await userRef.set({
        ...insertUser,
        id: nextId
      });
      
      return { ...insertUser, id: nextId };
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
      
      return querySnapshot.docs.map(docSnapshot => {
        const data = docSnapshot.data() as any;
        // Handle Firestore Timestamp conversion to Date
        const publishedAt = data.publishedAt instanceof Timestamp 
          ? new Date(data.publishedAt.toMillis()) 
          : new Date();
          
        return { 
          ...data,
          id: parseInt(docSnapshot.id),
          publishedAt,
          // Ensure required fields have default values if missing
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
      const blogPostDoc = await db.collection('blog_posts').doc(id.toString()).get();
      
      if (!blogPostDoc.exists) return undefined;
      
      const data = blogPostDoc.data() as BlogPost;
      return { 
        ...data,
        id,
        publishedAt: data.publishedAt.toString(), // Convert Firestore timestamp to string
      };
    } catch (error) {
      console.error("Error getting blog post:", error);
      return undefined;
    }
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    try {
      const blogPostsRef = db.collection('blog_posts');
      const querySnapshot = await blogPostsRef.where('slug', '==', slug).limit(1).get();
      
      if (querySnapshot.empty) return undefined;
      
      const blogPostDoc = querySnapshot.docs[0];
      const data = blogPostDoc.data() as BlogPost;
      
      return { 
        ...data,
        id: parseInt(blogPostDoc.id),
        publishedAt: data.publishedAt.toString(), // Convert Firestore timestamp to string
      };
    } catch (error) {
      console.error("Error getting blog post by slug:", error);
      return undefined;
    }
  }

  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    try {
      // Get the latest ID
      const counterRef = db.collection('counters').doc('blog_posts');
      const counterDoc = await counterRef.get();
      
      let nextId = 1;
      if (counterDoc.exists) {
        nextId = (counterDoc.data()?.count || 0) + 1;
      }
      
      // Update the counter
      await counterRef.set({ count: nextId });
      
      // Create the blog post
      const blogPostRef = db.collection('blog_posts').doc(nextId.toString());
      await blogPostRef.set({
        ...insertBlogPost,
        id: nextId
      });
      
      return { ...insertBlogPost, id: nextId };
    } catch (error) {
      console.error("Error creating blog post:", error);
      throw error;
    }
  }

  async updateBlogPost(id: number, blogPost: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    try {
      const blogPostRef = db.collection('blog_posts').doc(id.toString());
      const blogPostDoc = await blogPostRef.get();
      
      if (!blogPostDoc.exists) return undefined;
      
      // Update the blog post
      await blogPostRef.update(blogPost);
      
      // Get the updated document
      const updatedDoc = await blogPostRef.get();
      const data = updatedDoc.data() as BlogPost;
      
      return { 
        ...data,
        id,
        publishedAt: data.publishedAt.toString(), // Convert Firestore timestamp to string
      };
    } catch (error) {
      console.error("Error updating blog post:", error);
      return undefined;
    }
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    try {
      await db.collection('blog_posts').doc(id.toString()).delete();
      return true;
    } catch (error) {
      console.error("Error deleting blog post:", error);
      return false;
    }
  }

  // Categories methods
  async getAllCategories(): Promise<Category[]> {
    try {
      const categoriesRef = db.collection('categories');
      const querySnapshot = await categoriesRef.orderBy('name').get();
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as Category;
        return { 
          ...data,
          id: parseInt(doc.id)
        };
      });
    } catch (error) {
      console.error("Error getting all categories:", error);
      return [];
    }
  }

  async getCategory(id: number): Promise<Category | undefined> {
    try {
      const categoryDoc = await db.collection('categories').doc(id.toString()).get();
      
      if (!categoryDoc.exists) return undefined;
      
      const data = categoryDoc.data() as Category;
      return { ...data, id };
    } catch (error) {
      console.error("Error getting category:", error);
      return undefined;
    }
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    try {
      const categoriesRef = db.collection('categories');
      const querySnapshot = await categoriesRef.where('slug', '==', slug).limit(1).get();
      
      if (querySnapshot.empty) return undefined;
      
      const categoryDoc = querySnapshot.docs[0];
      const data = categoryDoc.data() as Category;
      
      return { ...data, id: parseInt(categoryDoc.id) };
    } catch (error) {
      console.error("Error getting category by slug:", error);
      return undefined;
    }
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    try {
      // Get the latest ID
      const counterRef = db.collection('counters').doc('categories');
      const counterDoc = await counterRef.get();
      
      let nextId = 1;
      if (counterDoc.exists) {
        nextId = (counterDoc.data()?.count || 0) + 1;
      }
      
      // Update the counter
      await counterRef.set({ count: nextId });
      
      // Create the category
      const categoryRef = db.collection('categories').doc(nextId.toString());
      await categoryRef.set({
        ...insertCategory,
        id: nextId
      });
      
      return { ...insertCategory, id: nextId };
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    try {
      const categoryRef = db.collection('categories').doc(id.toString());
      const categoryDoc = await categoryRef.get();
      
      if (!categoryDoc.exists) return undefined;
      
      // Update the category
      await categoryRef.update(category);
      
      // Get the updated document
      const updatedDoc = await categoryRef.get();
      const data = updatedDoc.data() as Category;
      
      return { ...data, id };
    } catch (error) {
      console.error("Error updating category:", error);
      return undefined;
    }
  }

  async deleteCategory(id: number): Promise<boolean> {
    try {
      await db.collection('categories').doc(id.toString()).delete();
      return true;
    } catch (error) {
      console.error("Error deleting category:", error);
      return false;
    }
  }

  // Implement the remaining methods required by IStorage
  // These will follow the same pattern as the ones above

  // Projects methods
  async getAllProjects(): Promise<Project[]> {
    try {
      const projectsRef = db.collection('projects');
      const querySnapshot = await projectsRef.orderBy('order').get();
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as Project;
        return { ...data, id: parseInt(doc.id) };
      });
    } catch (error) {
      console.error("Error getting all projects:", error);
      return [];
    }
  }

  async getProject(id: number): Promise<Project | undefined> {
    try {
      const projectDoc = await db.collection('projects').doc(id.toString()).get();
      
      if (!projectDoc.exists) return undefined;
      
      const data = projectDoc.data() as Project;
      return { ...data, id };
    } catch (error) {
      console.error("Error getting project:", error);
      return undefined;
    }
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    try {
      // Get the latest ID
      const counterRef = db.collection('counters').doc('projects');
      const counterDoc = await counterRef.get();
      
      let nextId = 1;
      if (counterDoc.exists) {
        nextId = (counterDoc.data()?.count || 0) + 1;
      }
      
      // Update the counter
      await counterRef.set({ count: nextId });
      
      // Create the project
      const projectRef = db.collection('projects').doc(nextId.toString());
      await projectRef.set({
        ...insertProject,
        id: nextId
      });
      
      return { ...insertProject, id: nextId };
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined> {
    try {
      const projectRef = db.collection('projects').doc(id.toString());
      const projectDoc = await projectRef.get();
      
      if (!projectDoc.exists) return undefined;
      
      // Update the project
      await projectRef.update(project);
      
      // Get the updated document
      const updatedDoc = await projectRef.get();
      const data = updatedDoc.data() as Project;
      
      return { ...data, id };
    } catch (error) {
      console.error("Error updating project:", error);
      return undefined;
    }
  }

  async deleteProject(id: number): Promise<boolean> {
    try {
      await db.collection('projects').doc(id.toString()).delete();
      return true;
    } catch (error) {
      console.error("Error deleting project:", error);
      return false;
    }
  }

  // Services methods
  async getAllServices(): Promise<Service[]> {
    try {
      const servicesRef = db.collection('services');
      const querySnapshot = await servicesRef.orderBy('order').get();
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as Service;
        return { ...data, id: parseInt(doc.id) };
      });
    } catch (error) {
      console.error("Error getting all services:", error);
      return [];
    }
  }

  async getService(id: number): Promise<Service | undefined> {
    try {
      const serviceDoc = await db.collection('services').doc(id.toString()).get();
      
      if (!serviceDoc.exists) return undefined;
      
      const data = serviceDoc.data() as Service;
      return { ...data, id };
    } catch (error) {
      console.error("Error getting service:", error);
      return undefined;
    }
  }

  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    try {
      const servicesRef = db.collection('services');
      const querySnapshot = await servicesRef.where('slug', '==', slug).limit(1).get();
      
      if (querySnapshot.empty) return undefined;
      
      const serviceDoc = querySnapshot.docs[0];
      const data = serviceDoc.data() as Service;
      
      return { ...data, id: parseInt(serviceDoc.id) };
    } catch (error) {
      console.error("Error getting service by slug:", error);
      return undefined;
    }
  }

  async createService(insertService: InsertService): Promise<Service> {
    try {
      // Get the latest ID
      const counterRef = db.collection('counters').doc('services');
      const counterDoc = await counterRef.get();
      
      let nextId = 1;
      if (counterDoc.exists) {
        nextId = (counterDoc.data()?.count || 0) + 1;
      }
      
      // Update the counter
      await counterRef.set({ count: nextId });
      
      // Create the service
      const serviceRef = db.collection('services').doc(nextId.toString());
      await serviceRef.set({
        ...insertService,
        id: nextId
      });
      
      return { ...insertService, id: nextId };
    } catch (error) {
      console.error("Error creating service:", error);
      throw error;
    }
  }

  async updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined> {
    try {
      const serviceRef = db.collection('services').doc(id.toString());
      const serviceDoc = await serviceRef.get();
      
      if (!serviceDoc.exists) return undefined;
      
      // Update the service
      await serviceRef.update(service);
      
      // Get the updated document
      const updatedDoc = await serviceRef.get();
      const data = updatedDoc.data() as Service;
      
      return { ...data, id };
    } catch (error) {
      console.error("Error updating service:", error);
      return undefined;
    }
  }

  async deleteService(id: number): Promise<boolean> {
    try {
      await db.collection('services').doc(id.toString()).delete();
      return true;
    } catch (error) {
      console.error("Error deleting service:", error);
      return false;
    }
  }

  // Team members methods
  async getAllTeamMembers(): Promise<TeamMember[]> {
    try {
      const teamMembersRef = db.collection('team_members');
      const querySnapshot = await teamMembersRef.orderBy('order').get();
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as TeamMember;
        return { ...data, id: parseInt(doc.id) };
      });
    } catch (error) {
      console.error("Error getting all team members:", error);
      return [];
    }
  }

  async getTeamMember(id: number): Promise<TeamMember | undefined> {
    try {
      const teamMemberDoc = await db.collection('team_members').doc(id.toString()).get();
      
      if (!teamMemberDoc.exists) return undefined;
      
      const data = teamMemberDoc.data() as TeamMember;
      return { ...data, id };
    } catch (error) {
      console.error("Error getting team member:", error);
      return undefined;
    }
  }

  async createTeamMember(insertTeamMember: InsertTeamMember): Promise<TeamMember> {
    try {
      // Get the latest ID
      const counterRef = db.collection('counters').doc('team_members');
      const counterDoc = await counterRef.get();
      
      let nextId = 1;
      if (counterDoc.exists) {
        nextId = (counterDoc.data()?.count || 0) + 1;
      }
      
      // Update the counter
      await counterRef.set({ count: nextId });
      
      // Create the team member
      const teamMemberRef = db.collection('team_members').doc(nextId.toString());
      await teamMemberRef.set({
        ...insertTeamMember,
        id: nextId
      });
      
      return { ...insertTeamMember, id: nextId };
    } catch (error) {
      console.error("Error creating team member:", error);
      throw error;
    }
  }

  async updateTeamMember(id: number, teamMember: Partial<InsertTeamMember>): Promise<TeamMember | undefined> {
    try {
      const teamMemberRef = db.collection('team_members').doc(id.toString());
      const teamMemberDoc = await teamMemberRef.get();
      
      if (!teamMemberDoc.exists) return undefined;
      
      // Update the team member
      await teamMemberRef.update(teamMember);
      
      // Get the updated document
      const updatedDoc = await teamMemberRef.get();
      const data = updatedDoc.data() as TeamMember;
      
      return { ...data, id };
    } catch (error) {
      console.error("Error updating team member:", error);
      return undefined;
    }
  }

  async deleteTeamMember(id: number): Promise<boolean> {
    try {
      await db.collection('team_members').doc(id.toString()).delete();
      return true;
    } catch (error) {
      console.error("Error deleting team member:", error);
      return false;
    }
  }

  // Testimonials methods
  async getAllTestimonials(): Promise<Testimonial[]> {
    try {
      const testimonialsRef = db.collection('testimonials');
      const querySnapshot = await testimonialsRef.orderBy('order').get();
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as Testimonial;
        return { ...data, id: parseInt(doc.id) };
      });
    } catch (error) {
      console.error("Error getting all testimonials:", error);
      return [];
    }
  }

  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    try {
      const testimonialDoc = await db.collection('testimonials').doc(id.toString()).get();
      
      if (!testimonialDoc.exists) return undefined;
      
      const data = testimonialDoc.data() as Testimonial;
      return { ...data, id };
    } catch (error) {
      console.error("Error getting testimonial:", error);
      return undefined;
    }
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    try {
      // Get the latest ID
      const counterRef = db.collection('counters').doc('testimonials');
      const counterDoc = await counterRef.get();
      
      let nextId = 1;
      if (counterDoc.exists) {
        nextId = (counterDoc.data()?.count || 0) + 1;
      }
      
      // Update the counter
      await counterRef.set({ count: nextId });
      
      // Create the testimonial
      const testimonialRef = db.collection('testimonials').doc(nextId.toString());
      await testimonialRef.set({
        ...insertTestimonial,
        id: nextId
      });
      
      return { ...insertTestimonial, id: nextId };
    } catch (error) {
      console.error("Error creating testimonial:", error);
      throw error;
    }
  }

  async updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    try {
      const testimonialRef = db.collection('testimonials').doc(id.toString());
      const testimonialDoc = await testimonialRef.get();
      
      if (!testimonialDoc.exists) return undefined;
      
      // Update the testimonial
      await testimonialRef.update(testimonial);
      
      // Get the updated document
      const updatedDoc = await testimonialRef.get();
      const data = updatedDoc.data() as Testimonial;
      
      return { ...data, id };
    } catch (error) {
      console.error("Error updating testimonial:", error);
      return undefined;
    }
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    try {
      await db.collection('testimonials').doc(id.toString()).delete();
      return true;
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      return false;
    }
  }

  // Contact messages methods
  async getAllContactMessages(): Promise<ContactMessage[]> {
    try {
      const contactMessagesRef = db.collection('contact_messages');
      const querySnapshot = await contactMessagesRef.orderBy('createdAt', 'desc').get();
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as ContactMessage;
        return { 
          ...data,
          id: parseInt(doc.id),
          createdAt: data.createdAt.toString()
        };
      });
    } catch (error) {
      console.error("Error getting all contact messages:", error);
      return [];
    }
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    try {
      const contactMessageDoc = await db.collection('contact_messages').doc(id.toString()).get();
      
      if (!contactMessageDoc.exists) return undefined;
      
      const data = contactMessageDoc.data() as ContactMessage;
      return { 
        ...data,
        id,
        createdAt: data.createdAt.toString()
      };
    } catch (error) {
      console.error("Error getting contact message:", error);
      return undefined;
    }
  }

  async createContactMessage(insertContactMessage: InsertContactMessage): Promise<ContactMessage> {
    try {
      // Get the latest ID
      const counterRef = db.collection('counters').doc('contact_messages');
      const counterDoc = await counterRef.get();
      
      let nextId = 1;
      if (counterDoc.exists) {
        nextId = (counterDoc.data()?.count || 0) + 1;
      }
      
      // Update the counter
      await counterRef.set({ count: nextId });
      
      // Create the contact message with timestamp
      const now = new Date();
      const contactMessageRef = db.collection('contact_messages').doc(nextId.toString());
      await contactMessageRef.set({
        ...insertContactMessage,
        id: nextId,
        createdAt: now.toISOString()
      });
      
      return { 
        ...insertContactMessage, 
        id: nextId,
        createdAt: now.toISOString()
      };
    } catch (error) {
      console.error("Error creating contact message:", error);
      throw error;
    }
  }

  async deleteContactMessage(id: number): Promise<boolean> {
    try {
      await db.collection('contact_messages').doc(id.toString()).delete();
      return true;
    } catch (error) {
      console.error("Error deleting contact message:", error);
      return false;
    }
  }

  // Subscribers methods
  async getAllSubscribers(): Promise<Subscriber[]> {
    try {
      const subscribersRef = db.collection('subscribers');
      const querySnapshot = await subscribersRef.orderBy('createdAt', 'desc').get();
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as Subscriber;
        return { 
          ...data,
          id: parseInt(doc.id),
          createdAt: data.createdAt.toString()
        };
      });
    } catch (error) {
      console.error("Error getting all subscribers:", error);
      return [];
    }
  }

  async getSubscriber(id: number): Promise<Subscriber | undefined> {
    try {
      const subscriberDoc = await db.collection('subscribers').doc(id.toString()).get();
      
      if (!subscriberDoc.exists) return undefined;
      
      const data = subscriberDoc.data() as Subscriber;
      return { 
        ...data,
        id,
        createdAt: data.createdAt.toString()
      };
    } catch (error) {
      console.error("Error getting subscriber:", error);
      return undefined;
    }
  }

  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    try {
      const subscribersRef = db.collection('subscribers');
      const querySnapshot = await subscribersRef.where('email', '==', email).limit(1).get();
      
      if (querySnapshot.empty) return undefined;
      
      const subscriberDoc = querySnapshot.docs[0];
      const data = subscriberDoc.data() as Subscriber;
      
      return { 
        ...data,
        id: parseInt(subscriberDoc.id),
        createdAt: data.createdAt.toString()
      };
    } catch (error) {
      console.error("Error getting subscriber by email:", error);
      return undefined;
    }
  }

  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    try {
      // Get the latest ID
      const counterRef = db.collection('counters').doc('subscribers');
      const counterDoc = await counterRef.get();
      
      let nextId = 1;
      if (counterDoc.exists) {
        nextId = (counterDoc.data()?.count || 0) + 1;
      }
      
      // Update the counter
      await counterRef.set({ count: nextId });
      
      // Create the subscriber with timestamp
      const now = new Date();
      const subscriberRef = db.collection('subscribers').doc(nextId.toString());
      await subscriberRef.set({
        ...insertSubscriber,
        id: nextId,
        createdAt: now.toISOString()
      });
      
      return { 
        ...insertSubscriber, 
        id: nextId,
        createdAt: now.toISOString()
      };
    } catch (error) {
      console.error("Error creating subscriber:", error);
      throw error;
    }
  }

  async deleteSubscriber(id: number): Promise<boolean> {
    try {
      await db.collection('subscribers').doc(id.toString()).delete();
      return true;
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      return false;
    }
  }
}

// Create and export a singleton instance
export const firestoreStorage = new FirestoreStorage();
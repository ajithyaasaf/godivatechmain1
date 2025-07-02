import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  blogPosts, type BlogPost, type InsertBlogPost,
  testimonials, type Testimonial, type InsertTestimonial,
  projects, type Project, type InsertProject,
  services, type Service, type InsertService,
  teamMembers, type TeamMember, type InsertTeamMember,
  contactMessages, type ContactMessage, type InsertContactMessage,
  subscribers, type Subscriber, type InsertSubscriber
} from "@shared/schema";
import session from "express-session";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Blog posts methods
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, blogPost: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  
  // Categories methods
  getAllCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Projects methods
  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number | string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number | string): Promise<boolean>;
  
  // Services methods
  getAllServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  getServiceBySlug(slug: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;
  
  // Team members methods
  getAllTeamMembers(): Promise<TeamMember[]>;
  getTeamMember(id: number): Promise<TeamMember | undefined>;
  createTeamMember(teamMember: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: number, teamMember: Partial<InsertTeamMember>): Promise<TeamMember | undefined>;
  deleteTeamMember(id: number): Promise<boolean>;
  
  // Testimonials methods
  getAllTestimonials(): Promise<Testimonial[]>;
  getTestimonial(id: number): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;
  
  // Contact messages methods
  getAllContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  createContactMessage(contactMessage: InsertContactMessage): Promise<ContactMessage>;
  deleteContactMessage(id: number): Promise<boolean>;
  
  // Subscribers methods
  getAllSubscribers(): Promise<Subscriber[]>;
  getSubscriber(id: number): Promise<Subscriber | undefined>;
  getSubscriberByEmail(email: string): Promise<Subscriber | undefined>;
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  deleteSubscriber(id: number): Promise<boolean>;
  
  // Session store for authentication
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private blogPosts: Map<number, BlogPost>;
  private categories: Map<number, Category>;
  private projects: Map<number, Project>;
  private services: Map<number, Service>;
  private teamMembers: Map<number, TeamMember>;
  private testimonials: Map<number, Testimonial>;
  private contactMessages: Map<number, ContactMessage>;
  private subscribers: Map<number, Subscriber>;
  
  private userCurrentId: number;
  private blogPostCurrentId: number;
  private categoryCurrentId: number;
  private projectCurrentId: number;
  private serviceCurrentId: number;
  private teamMemberCurrentId: number;
  private testimonialCurrentId: number;
  private contactMessageCurrentId: number;
  private subscriberCurrentId: number;

  constructor() {
    this.users = new Map();
    this.blogPosts = new Map();
    this.categories = new Map();
    this.projects = new Map();
    this.services = new Map();
    this.teamMembers = new Map();
    this.testimonials = new Map();
    this.contactMessages = new Map();
    this.subscribers = new Map();
    
    this.userCurrentId = 1;
    this.blogPostCurrentId = 1;
    this.categoryCurrentId = 1;
    this.projectCurrentId = 1;
    this.serviceCurrentId = 1;
    this.teamMemberCurrentId = 1;
    this.testimonialCurrentId = 1;
    this.contactMessageCurrentId = 1;
    this.subscriberCurrentId = 1;
    
    // In production, data is fetched from API/database instead of initializing with sample data
    console.log("MemStorage initialized - ready for real data");
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Blog posts methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }
  
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(
      (post) => post.slug === slug,
    );
  }
  
  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogPostCurrentId++;
    const blogPost: BlogPost = { ...insertBlogPost, id };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }
  
  // Categories methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug,
    );
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryCurrentId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  
  // Projects methods
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }
  
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }
  
  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectCurrentId++;
    const project: Project = { ...insertProject, id };
    this.projects.set(id, project);
    return project;
  }
  
  // Services methods
  async getAllServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }
  
  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }
  
  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    return Array.from(this.services.values()).find(
      (service) => service.slug === slug,
    );
  }
  
  async createService(insertService: InsertService): Promise<Service> {
    const id = this.serviceCurrentId++;
    const service: Service = { ...insertService, id };
    this.services.set(id, service);
    return service;
  }
  
  // Team members methods
  async getAllTeamMembers(): Promise<TeamMember[]> {
    return Array.from(this.teamMembers.values());
  }
  
  async getTeamMember(id: number): Promise<TeamMember | undefined> {
    return this.teamMembers.get(id);
  }
  
  async createTeamMember(insertTeamMember: InsertTeamMember): Promise<TeamMember> {
    const id = this.teamMemberCurrentId++;
    const teamMember: TeamMember = { ...insertTeamMember, id };
    this.teamMembers.set(id, teamMember);
    return teamMember;
  }
  
  // Testimonials methods
  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }
  
  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }
  
  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialCurrentId++;
    const testimonial: Testimonial = { ...insertTestimonial, id };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
  
  // Contact messages methods
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }
  
  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    return this.contactMessages.get(id);
  }
  
  async createContactMessage(insertContactMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.contactMessageCurrentId++;
    const createdAt = new Date();
    const contactMessage: ContactMessage = { ...insertContactMessage, id, createdAt };
    this.contactMessages.set(id, contactMessage);
    return contactMessage;
  }
  
  // Subscribers methods
  async getAllSubscribers(): Promise<Subscriber[]> {
    return Array.from(this.subscribers.values());
  }
  
  async getSubscriber(id: number): Promise<Subscriber | undefined> {
    return this.subscribers.get(id);
  }
  
  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    return Array.from(this.subscribers.values()).find(
      (subscriber) => subscriber.email === email,
    );
  }
  
  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const id = this.subscriberCurrentId++;
    const createdAt = new Date();
    const subscriber: Subscriber = { ...insertSubscriber, id, createdAt };
    this.subscribers.set(id, subscriber);
    return subscriber;
  }
}

// Add missing MemStorage methods to align with updated IStorage interface
MemStorage.prototype.updateBlogPost = async function(id: number, blogPost: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
  const existingPost = this.blogPosts.get(id);
  if (!existingPost) {
    return undefined;
  }
  const updatedPost = { ...existingPost, ...blogPost };
  this.blogPosts.set(id, updatedPost);
  return updatedPost;
};

MemStorage.prototype.deleteBlogPost = async function(id: number): Promise<boolean> {
  return this.blogPosts.delete(id);
};

MemStorage.prototype.updateCategory = async function(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
  const existingCategory = this.categories.get(id);
  if (!existingCategory) {
    return undefined;
  }
  const updatedCategory = { ...existingCategory, ...category };
  this.categories.set(id, updatedCategory);
  return updatedCategory;
};

MemStorage.prototype.deleteCategory = async function(id: number): Promise<boolean> {
  return this.categories.delete(id);
};

MemStorage.prototype.updateProject = async function(id: number | string, project: Partial<InsertProject>): Promise<Project | undefined> {
  // Handle string or number IDs
  let projectId = id;
  
  // Convert string ID to number if it's numeric for consistency with Map keys
  if (typeof id === 'string' && !isNaN(Number(id))) {
    projectId = Number(id);
  }
  
  // Try to get the project with the processed ID
  const existingProject = this.projects.get(projectId);
  
  if (!existingProject) {
    // If not found and we have a numeric ID that was originally a string,
    // try again with the original string ID (for Firebase doc IDs)
    if (typeof id === 'string' && typeof projectId === 'number') {
      const stringIdProject = this.projects.get(id);
      if (stringIdProject) {
        const updatedProject = { ...stringIdProject, ...project };
        this.projects.set(id, updatedProject);
        return updatedProject;
      }
    }
    return undefined;
  }
  
  const updatedProject = { ...existingProject, ...project };
  this.projects.set(projectId, updatedProject);
  return updatedProject;
};

MemStorage.prototype.deleteProject = async function(id: number | string): Promise<boolean> {
  if (typeof id === 'string' && !isNaN(Number(id))) {
    // Convert string ID to number if it's a valid number
    return this.projects.delete(Number(id));
  }
  // For string IDs or numeric IDs, try direct deletion
  return this.projects.delete(typeof id === 'string' ? id : Number(id));
};

MemStorage.prototype.updateService = async function(id: number, service: Partial<InsertService>): Promise<Service | undefined> {
  const existingService = this.services.get(id);
  if (!existingService) {
    return undefined;
  }
  const updatedService = { ...existingService, ...service };
  this.services.set(id, updatedService);
  return updatedService;
};

MemStorage.prototype.deleteService = async function(id: number): Promise<boolean> {
  return this.services.delete(id);
};

MemStorage.prototype.updateTeamMember = async function(id: number, teamMember: Partial<InsertTeamMember>): Promise<TeamMember | undefined> {
  const existingMember = this.teamMembers.get(id);
  if (!existingMember) {
    return undefined;
  }
  const updatedMember = { ...existingMember, ...teamMember };
  this.teamMembers.set(id, updatedMember);
  return updatedMember;
};

MemStorage.prototype.deleteTeamMember = async function(id: number): Promise<boolean> {
  return this.teamMembers.delete(id);
};

MemStorage.prototype.updateTestimonial = async function(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
  const existingTestimonial = this.testimonials.get(id);
  if (!existingTestimonial) {
    return undefined;
  }
  const updatedTestimonial = { ...existingTestimonial, ...testimonial };
  this.testimonials.set(id, updatedTestimonial);
  return updatedTestimonial;
};

MemStorage.prototype.deleteTestimonial = async function(id: number): Promise<boolean> {
  return this.testimonials.delete(id);
};

MemStorage.prototype.deleteContactMessage = async function(id: number): Promise<boolean> {
  return this.contactMessages.delete(id);
};

MemStorage.prototype.deleteSubscriber = async function(id: number): Promise<boolean> {
  return this.subscribers.delete(id);
};

// Add memory session store
import createMemoryStore from "memorystore";
const MemoryStore = createMemoryStore(session);

Object.defineProperty(MemStorage.prototype, 'sessionStore', {
  get: function() {
    if (!this._sessionStore) {
      this._sessionStore = new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      });
    }
    return this._sessionStore;
  }
});

// Database storage implementation
// Only use db for type compatibility - actual operations will use Firebase
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import session from "express-session";

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;
  
  constructor() {
    // Use MemoryStore instead of PostgreSQL for sessions
    const MemoryStore = require('memorystore')(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Blog posts methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));
  }
  
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }
  
  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db.insert(blogPosts).values(insertBlogPost).returning();
    return post;
  }

  async updateBlogPost(id: number, blogPost: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updated] = await db.update(blogPosts)
      .set(blogPost)
      .where(eq(blogPosts.id, id))
      .returning();
    return updated;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return true;
  }
  
  // Categories methods
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updated] = await db.update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return updated;
  }

  async deleteCategory(id: number): Promise<boolean> {
    await db.delete(categories).where(eq(categories.id, id));
    return true;
  }
  
  // Projects methods
  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }
  
  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }
  
  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  async updateProject(id: number | string, project: Partial<InsertProject>): Promise<Project | undefined> {
    // Convert string IDs to numbers if they're numeric
    if (typeof id === 'string') {
      const numericId = parseInt(id);
      
      if (!isNaN(numericId)) {
        try {
          const [updated] = await db.update(projects)
            .set(project)
            .where(eq(projects.id, numericId))
            .returning();
          return updated;
        } catch (error) {
          console.error(`Error updating project with ID ${id} (converted to ${numericId}):`, error);
          return undefined;
        }
      } else {
        console.error(`Cannot convert project ID to a valid number for update: ${id}`);
        return undefined;
      }
    }
    
    // Handle numeric IDs directly
    try {
      const [updated] = await db.update(projects)
        .set(project)
        .where(eq(projects.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error(`Error updating project with ID ${id}:`, error);
      return undefined;
    }
  }

  async deleteProject(id: number | string): Promise<boolean> {
    // Convert string IDs to numbers if they're numeric
    const numericId = typeof id === 'string' ? parseInt(id) : id;
    
    // Only proceed if we have a valid number
    if (!isNaN(numericId)) {
      await db.delete(projects).where(eq(projects.id, numericId));
      return true;
    }
    
    console.error(`Cannot convert project ID to a valid number for deletion: ${id}`);
    return false;
  }
  
  // Services methods
  async getAllServices(): Promise<Service[]> {
    return await db.select().from(services);
  }
  
  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }
  
  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.slug, slug));
    return service;
  }
  
  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db.insert(services).values(insertService).returning();
    return service;
  }

  async updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined> {
    const [updated] = await db.update(services)
      .set(service)
      .where(eq(services.id, id))
      .returning();
    return updated;
  }

  async deleteService(id: number): Promise<boolean> {
    await db.delete(services).where(eq(services.id, id));
    return true;
  }
  
  // Team members methods
  async getAllTeamMembers(): Promise<TeamMember[]> {
    return await db.select().from(teamMembers);
  }
  
  async getTeamMember(id: number): Promise<TeamMember | undefined> {
    const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
    return member;
  }
  
  async createTeamMember(insertTeamMember: InsertTeamMember): Promise<TeamMember> {
    const [member] = await db.insert(teamMembers).values(insertTeamMember).returning();
    return member;
  }

  async updateTeamMember(id: number, teamMember: Partial<InsertTeamMember>): Promise<TeamMember | undefined> {
    const [updated] = await db.update(teamMembers)
      .set(teamMember)
      .where(eq(teamMembers.id, id))
      .returning();
    return updated;
  }

  async deleteTeamMember(id: number): Promise<boolean> {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
    return true;
  }
  
  // Testimonials methods
  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }
  
  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return testimonial;
  }
  
  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db.insert(testimonials).values(insertTestimonial).returning();
    return testimonial;
  }

  async updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const [updated] = await db.update(testimonials)
      .set(testimonial)
      .where(eq(testimonials.id, id))
      .returning();
    return updated;
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    await db.delete(testimonials).where(eq(testimonials.id, id));
    return true;
  }
  
  // Contact messages methods
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }
  
  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    const [message] = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return message;
  }
  
  async createContactMessage(insertContactMessage: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db.insert(contactMessages).values(insertContactMessage).returning();
    return message;
  }

  async deleteContactMessage(id: number): Promise<boolean> {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
    return true;
  }
  
  // Subscribers methods
  async getAllSubscribers(): Promise<Subscriber[]> {
    return await db.select().from(subscribers).orderBy(desc(subscribers.createdAt));
  }
  
  async getSubscriber(id: number): Promise<Subscriber | undefined> {
    const [subscriber] = await db.select().from(subscribers).where(eq(subscribers.id, id));
    return subscriber;
  }
  
  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    const [subscriber] = await db.select().from(subscribers).where(eq(subscribers.email, email));
    return subscriber;
  }
  
  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const [subscriber] = await db.insert(subscribers).values(insertSubscriber).returning();
    return subscriber;
  }

  async deleteSubscriber(id: number): Promise<boolean> {
    await db.delete(subscribers).where(eq(subscribers.id, id));
    return true;
  }
}

// Import Firebase Firestore storage implementation
import { firestoreStorage } from "./firestore-storage";

// Use FirestoreStorage instead of DatabaseStorage
export const storage = firestoreStorage;

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
  sessionStore: session.Store;
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

  private _sessionStore: session.Store | undefined;

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

  // Session store getter
  get sessionStore(): session.Store {
    if (!this._sessionStore) {
      const createMemoryStore = require("memorystore");
      const MemoryStore = createMemoryStore(session);
      this._sessionStore = new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      });
    }
    return this._sessionStore!;
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
    const user: User = { ...insertUser, id, name: insertUser.name ?? null };
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
    const blogPost: BlogPost = {
      ...insertBlogPost,
      id,
      published: insertBlogPost.published ?? false,
      authorImage: insertBlogPost.authorImage ?? null,
      coverImage: insertBlogPost.coverImage ?? null,
      coverImageAlt: insertBlogPost.coverImageAlt ?? null,
      metaTitle: insertBlogPost.metaTitle ?? null,
      metaDescription: insertBlogPost.metaDescription ?? null,
      focusKeyword: insertBlogPost.focusKeyword ?? null,
      tags: insertBlogPost.tags ?? null,
      categoryId: insertBlogPost.categoryId ?? null,
      publishedAt: insertBlogPost.publishedAt ?? new Date(),
    };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }

  async updateBlogPost(id: number, blogPost: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const existingPost = this.blogPosts.get(id);
    if (!existingPost) {
      return undefined;
    }
    const updatedPost = { ...existingPost, ...blogPost };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
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

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const existingCategory = this.categories.get(id);
    if (!existingCategory) {
      return undefined;
    }
    const updatedCategory = { ...existingCategory, ...category };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
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
    const project: Project = {
      ...insertProject,
      id,
      link: insertProject.link ?? null,
      fullDescription: insertProject.fullDescription ?? null,
      image: insertProject.image ?? null,
      gallery: insertProject.gallery ?? null,
      clientName: insertProject.clientName ?? null,
      githubLink: insertProject.githubLink ?? null,
      completionDate: insertProject.completionDate ?? null,
      // Removed fields not in schema: clientLogo, testimonialAuthor
      challengeDescription: insertProject.challengeDescription ?? null,
      solutionDescription: insertProject.solutionDescription ?? null,
      resultsDescription: insertProject.resultsDescription ?? null,
      testimonial: insertProject.testimonial ?? null,
      featured: insertProject.featured ?? null,
      order: insertProject.order ?? null,
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number | string, project: Partial<InsertProject>): Promise<Project | undefined> {
    const numericId = typeof id === 'string' ? parseInt(id) : id;
    if (isNaN(numericId)) return undefined;
    const existingProject = this.projects.get(numericId);
    if (!existingProject) return undefined;
    const updatedProject = { ...existingProject, ...project };
    this.projects.set(numericId, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number | string): Promise<boolean> {
    const numericId = typeof id === 'string' ? parseInt(id) : id;
    if (isNaN(numericId)) return false;
    return this.projects.delete(numericId);
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

  async updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined> {
    const existingService = this.services.get(id);
    if (!existingService) return undefined;
    const updatedService = { ...existingService, ...service };
    this.services.set(id, updatedService);
    return updatedService;
  }

  async deleteService(id: number): Promise<boolean> {
    return this.services.delete(id);
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
    const teamMember: TeamMember = {
      ...insertTeamMember,
      id,
      image: insertTeamMember.image ?? null,
      linkedIn: insertTeamMember.linkedIn ?? null,
      twitter: insertTeamMember.twitter ?? null,
    };
    this.teamMembers.set(id, teamMember);
    return teamMember;
  }

  async updateTeamMember(id: number, teamMember: Partial<InsertTeamMember>): Promise<TeamMember | undefined> {
    const existingMember = this.teamMembers.get(id);
    if (!existingMember) return undefined;
    const updatedMember = { ...existingMember, ...teamMember };
    this.teamMembers.set(id, updatedMember);
    return updatedMember;
  }

  async deleteTeamMember(id: number): Promise<boolean> {
    return this.teamMembers.delete(id);
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
    const testimonial: Testimonial = {
      ...insertTestimonial,
      id,
      image: insertTestimonial.image ?? null,
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  async updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const existingTestimonial = this.testimonials.get(id);
    if (!existingTestimonial) return undefined;
    const updatedTestimonial = { ...existingTestimonial, ...testimonial };
    this.testimonials.set(id, updatedTestimonial);
    return updatedTestimonial;
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    return this.testimonials.delete(id);
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
    const contactMessage: ContactMessage = {
      ...insertContactMessage,
      id,
      createdAt,
      phone: insertContactMessage.phone ?? null,
    };
    this.contactMessages.set(id, contactMessage);
    return contactMessage;
  }

  async deleteContactMessage(id: number): Promise<boolean> {
    return this.contactMessages.delete(id);
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

  async deleteSubscriber(id: number): Promise<boolean> {
    return this.subscribers.delete(id);
  }
}

// Import Firebase Firestore storage implementation
import { firestoreStorage } from "./firestore-storage";

// Use FirestoreStorage - the primary storage implementation
export const storage = firestoreStorage;

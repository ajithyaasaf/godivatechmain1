// This is a modified version of the schema.ts file for client-side use in Vercel
// It removes server-side dependencies but maintains the type definitions

import { z } from "zod";

// Type definitions without the actual table implementations
export type User = {
  id: number;
  username: string;
  password: string;
};

export type InsertUser = Pick<User, "username" | "password">;

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  authorName: string;
  authorImage: string;
  coverImage: string;
  publishedAt: Date;
  categoryId: number;
};

export type InsertBlogPost = Omit<BlogPost, "id">;

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
};

export type InsertCategory = Omit<Category, "id">;

export type Project = {
  id: number;
  title: string;
  description: string;
  slug: string;
  image: string;
  gallery: string[];
  client: string;
  category: string;
  tags: string[];
  featured: boolean;
  demoLink: string;
  githubLink: string;
  order: number;
  fullDescription: string;
  challengeDescription: string;
  solutionDescription: string;
  resultsDescription: string;
  testimonial: string;
};

export type InsertProject = Omit<Project, "id">;

export type Service = {
  id: number;
  title: string;
  slug: string;
  description: string;
  icon: string;
  features: string[];
  order: number;
  fullDescription: string;
};

export type InsertService = Omit<Service, "id">;

export type TeamMember = {
  id: number;
  name: string;
  position: string;
  bio: string;
  image: string;
  socialLinks: Record<string, string>;
  order: number;
};

export type InsertTeamMember = Omit<TeamMember, "id">;

export type Testimonial = {
  id: number;
  name: string;
  position: string;
  company: string;
  content: string;
  image: string;
  rating: number;
  featured: boolean;
};

export type InsertTestimonial = Omit<Testimonial, "id">;

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: Date;
  read: boolean;
};

export type InsertContactMessage = Omit<ContactMessage, "id" | "createdAt" | "read">;

export type Subscriber = {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
  active: boolean;
};

export type InsertSubscriber = Omit<Subscriber, "id" | "createdAt" | "active">;

// Validation schemas
export const insertUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export const insertBlogPostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string(),
  content: z.string(),
  published: z.boolean().default(false),
  authorName: z.string(),
  authorImage: z.string(),
  coverImage: z.string(),
  publishedAt: z.date().optional(),
  categoryId: z.number(),
});

export const insertCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
});

export const insertProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  slug: z.string().min(1),
  image: z.string(),
  gallery: z.array(z.string()),
  client: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  featured: z.boolean().default(false),
  demoLink: z.string().optional(),
  githubLink: z.string().optional(),
  order: z.number().default(0),
  fullDescription: z.string(),
  challengeDescription: z.string().optional(),
  solutionDescription: z.string().optional(),
  resultsDescription: z.string().optional(),
  testimonial: z.string().optional(),
});

export const insertServiceSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  icon: z.string(),
  features: z.array(z.string()),
  order: z.number().default(0),
  fullDescription: z.string(),
});

export const insertTeamMemberSchema = z.object({
  name: z.string().min(1),
  position: z.string().min(1),
  bio: z.string(),
  image: z.string(),
  socialLinks: z.record(z.string()),
  order: z.number().default(0),
});

export const insertTestimonialSchema = z.object({
  name: z.string().min(1),
  position: z.string(),
  company: z.string(),
  content: z.string().min(1),
  image: z.string(),
  rating: z.number().min(1).max(5).default(5),
  featured: z.boolean().default(false),
});

export const insertContactMessageSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

export const insertSubscriberSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

// Type exports for convenience
export type SelectUser = User;
export type SelectBlogPost = BlogPost;
export type SelectCategory = Category;
export type SelectProject = Project;
export type SelectService = Service;
export type SelectTeamMember = TeamMember;
export type SelectTestimonial = Testimonial;
export type SelectContactMessage = ContactMessage;
export type SelectSubscriber = Subscriber;
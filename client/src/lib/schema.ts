// Frontend-safe schema version that doesn't import drizzle-zod
import { z } from "zod";

// User schemas
export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  name: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export interface User {
  id: number;
  username: string;
  password: string;
  name?: string;
}

// Category schemas
export const insertCategorySchema = z.object({
  name: z.string(),
  slug: z.string(),
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export interface Category {
  id: number;
  name: string;
  slug: string;
}

// Blog post schemas
export const insertBlogPostSchema = z.object({
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  content: z.string(),
  published: z.boolean().default(true),
  authorName: z.string(),
  authorImage: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  publishedAt: z.date().or(z.string()).optional(),
  categoryId: z.number().optional().nullable(),
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  authorName: string;
  authorImage: string | null;
  coverImage: string | null;
  publishedAt: string | Date;
  categoryId: number | null;
}

// Extended BlogPost interface
export interface ExtendedBlogPost extends BlogPost {
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

// Testimonial schemas
export const insertTestimonialSchema = z.object({
  name: z.string(),
  position: z.string(),
  company: z.string(),
  content: z.string(),
  image: z.string().optional().nullable(),
});

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  content: string;
  image: string | null;
}

// Project schemas
export const insertProjectSchema = z.object({
  title: z.string(),
  description: z.string(),
  fullDescription: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  gallery: z.array(z.string()).optional(),
  category: z.string(),
  technologies: z.array(z.string()),
  link: z.string().optional().nullable(),
  githubLink: z.string().optional().nullable(),
  clientName: z.string().optional().nullable(),
  completionDate: z.string().optional().nullable(),
  featured: z.boolean().default(false).optional(),
  testimonial: z.string().optional().nullable(),
  challengeDescription: z.string().optional().nullable(),
  solutionDescription: z.string().optional().nullable(),
  resultsDescription: z.string().optional().nullable(),
  order: z.number().default(0).optional(),
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export interface Project {
  id: number;
  title: string;
  description: string;
  fullDescription: string | null;
  image: string | null;
  gallery: string[];
  category: string;
  technologies: string[];
  link: string | null;
  githubLink: string | null;
  clientName: string | null;
  completionDate: string | null;
  featured: boolean;
  testimonial: string | null;
  challengeDescription: string | null;
  solutionDescription: string | null;
  resultsDescription: string | null;
  order: number;
}

// Service schemas
export const insertServiceSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  slug: z.string(),
});

export type InsertService = z.infer<typeof insertServiceSchema>;
export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  slug: string;
}

// Team member schemas
export const insertTeamMemberSchema = z.object({
  name: z.string(),
  position: z.string(),
  bio: z.string(),
  image: z.string().optional().nullable(),
  linkedIn: z.string().optional().nullable(),
  twitter: z.string().optional().nullable(),
});

export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export interface TeamMember {
  id: number;
  name: string;
  position: string;
  bio: string;
  image: string | null;
  linkedIn: string | null;
  twitter: string | null;
}

// Contact message schemas
export const insertContactMessageSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  subject: z.string(),
  message: z.string(),
});

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  createdAt: string | Date;
}

// Subscriber schemas
export const insertSubscriberSchema = z.object({
  email: z.string().email(),
});

export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export interface Subscriber {
  id: number;
  email: string;
  createdAt: string | Date;
}
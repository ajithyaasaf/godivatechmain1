import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  published: boolean("published").notNull().default(true),
  authorName: text("author_name").notNull(),
  authorImage: text("author_image"),
  coverImage: text("cover_image"),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  categoryId: integer("category_id").references(() => categories.id),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  published: true,
  authorName: true,
  authorImage: true,
  coverImage: true,
  publishedAt: true,
  categoryId: true,
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

// Extended BlogPost type that includes category information
export interface ExtendedBlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  authorName: string;
  authorImage: string | null;
  coverImage: string | null;
  // publishedAt can be Date or string since it might come from API as string
  publishedAt: string | Date;
  categoryId: number | null;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  company: text("company").notNull(),
  content: text("content").notNull(),
  image: text("image"),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).pick({
  name: true,
  position: true,
  company: true,
  content: true,
  image: true,
});

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  fullDescription: text("full_description"), // Detailed project description
  image: text("image"),
  gallery: text("gallery").array(), // Additional images for project gallery
  category: text("category").notNull(),
  technologies: text("technologies").array().notNull(),
  link: text("link"),
  githubLink: text("github_link"), // Link to GitHub repository
  clientName: text("client_name"), // Client or company name
  completionDate: text("completion_date"), // When the project was completed
  featured: boolean("featured").default(false), // Whether to show as featured project
  testimonial: text("testimonial"), // Client testimonial about the project
  challengeDescription: text("challenge_description"), // Description of challenges faced
  solutionDescription: text("solution_description"), // Description of solutions implemented
  resultsDescription: text("results_description"), // Description of results achieved
  order: integer("order").default(0), // For manual ordering of projects
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  title: true,
  description: true,
  fullDescription: true,
  image: true,
  gallery: true,
  category: true,
  technologies: true,
  link: true,
  githubLink: true,
  clientName: true,
  completionDate: true,
  featured: true,
  testimonial: true,
  challengeDescription: true,
  solutionDescription: true,
  resultsDescription: true,
  order: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  slug: text("slug").notNull().unique(),
});

export const insertServiceSchema = createInsertSchema(services).pick({
  title: true,
  description: true,
  icon: true,
  slug: true,
});

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  bio: text("bio").notNull(),
  image: text("image"),
  linkedIn: text("linkedin"),
  twitter: text("twitter"),
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).pick({
  name: true,
  position: true,
  bio: true,
  image: true,
  linkedIn: true,
  twitter: true,
});

export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  phone: true,
  subject: true,
  message: true,
});

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSubscriberSchema = createInsertSchema(subscribers).pick({
  email: true,
});

export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type Subscriber = typeof subscribers.$inferSelect;

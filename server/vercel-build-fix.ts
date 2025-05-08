// This file is a simplified version for Vercel deployment
// that avoids TypeScript errors by using any types
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { firestoreStorage } from './firestore-storage';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Enable CORS
app.use(cors({
  origin: true,
  credentials: true
}));

// Use compression
app.use(compression());

// Parse JSON body
app.use(express.json());

// Basic authentication middleware
const isAuthenticated = (req: any, res: any, next: any) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
};

// Simple API routes for Vercel
app.get('/api/check-env', (_req, res) => {
  const envChecks = {
    NODE_ENV: process.env.NODE_ENV || 'not set',
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ? 'set' : 'not set',
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY ? 'set' : 'not set',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'set' : 'not set',
  };
  
  res.status(200).json({
    status: 'Vercel environment check',
    environment: process.env.NODE_ENV,
    checks: envChecks,
    timestamp: new Date().toISOString()
  });
});

// API routes
app.get('/api/blog-posts', async (_req, res) => {
  try {
    const posts = await firestoreStorage.getAllBlogPosts();
    res.json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    res.status(500).json({ message: "Failed to fetch blog posts" });
  }
});

app.get('/api/categories', async (_req, res) => {
  try {
    const categories = await firestoreStorage.getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

app.get('/api/services', async (_req, res) => {
  try {
    const services = await firestoreStorage.getAllServices();
    res.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: "Failed to fetch services" });
  }
});

app.get('/api/projects', async (_req, res) => {
  try {
    const projects = await firestoreStorage.getAllProjects();
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

app.get('/api/team-members', async (_req, res) => {
  try {
    const teamMembers = await firestoreStorage.getAllTeamMembers();
    res.json(teamMembers);
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({ message: "Failed to fetch team members" });
  }
});

app.get('/api/testimonials', async (_req, res) => {
  try {
    const testimonials = await firestoreStorage.getAllTestimonials();
    res.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ message: "Failed to fetch testimonials" });
  }
});

// Contact form submission
app.post('/api/contact', async (req, res) => {
  try {
    const contactMessage = await firestoreStorage.createContactMessage(req.body);
    res.status(201).json(contactMessage);
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({ message: "Failed to submit contact form" });
  }
});

// Newsletter subscription
app.post('/api/subscribe', async (req, res) => {
  try {
    const existingSubscriber = await firestoreStorage.getSubscriberByEmail(req.body.email);
    if (existingSubscriber) {
      return res.status(400).json({ message: "Email already subscribed" });
    }
    
    const subscriber = await firestoreStorage.createSubscriber(req.body);
    res.status(201).json(subscriber);
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    res.status(500).json({ message: "Failed to subscribe to newsletter" });
  }
});

// Serve static client files
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// SPA fallback
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return;
  }
  
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Error handling middleware
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'An internal server error occurred' });
});

// Export app for Vercel
export default app;
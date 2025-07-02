import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertContactMessageSchema, 
  insertSubscriberSchema,
  insertBlogPostSchema,
  insertCategorySchema,
  insertProjectSchema,
  insertServiceSchema,
  insertTeamMemberSchema,
  insertTestimonialSchema
} from "@shared/schema";
import { setupAuth, isAuthenticated } from "./auth";
import { uploadImage, deleteImage } from "./cloudinary";
import { setupEnhancedSitemaps } from "./sitemap-enhanced";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  // Set up enhanced XML sitemaps with sharding and validation
  setupEnhancedSitemaps(app);
  
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development"
    });
  });
  
  // Ping endpoint for network connectivity checks
  app.get("/api/ping", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      server: "GodivaTech API"
    });
  });
  
  // HEAD request for fast network connectivity checks
  app.head("/api/ping", (req, res) => {
    res.setHeader("X-Server-Time", new Date().toISOString());
    res.setHeader("X-Server", "GodivaTech API");
    res.status(200).end();
  });
  
  // Debug endpoint (only in development)
  if (process.env.NODE_ENV !== "production") {
    app.get("/api/debug", (req, res) => {
      res.json({
        nodeEnv: process.env.NODE_ENV,
        hasFirebaseConfig: !!process.env.FIREBASE_PROJECT_ID,
        hasCloudinary: !!process.env.CLOUDINARY_CLOUD_NAME,
        allowedOrigins: process.env.ALLOWED_ORIGINS || "not set"
      });
    });
  }
  
  // Image Upload API
  app.post("/api/upload", isAuthenticated, async (req, res) => {
    try {
      const { image, folder } = req.body;
      
      if (!image) {
        return res.status(400).json({ message: "No image provided" });
      }
      
      const uploadedUrl = await uploadImage(image, folder || 'godivatech/portfolio');
      res.json({ url: uploadedUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });
  
  // API routes for the GodivaTech website
  
  // Health check endpoint for deployment monitoring
  app.get("/api/health", (req, res) => {
    res.status(200).json({ 
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development"
    });
  });
  
  // Get all blog posts
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const blogPosts = await storage.getAllBlogPosts();
      
      // For each blog post, add the category information
      const postsWithCategories = await Promise.all(
        blogPosts.map(async (post) => {
          if (post.categoryId) {
            const category = await storage.getCategory(post.categoryId);
            return { ...post, category };
          }
          return post;
        })
      );
      
      res.json(postsWithCategories);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  // Get blog post by slug
  app.get("/api/blog-posts/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const blogPost = await storage.getBlogPostBySlug(slug);
      
      if (!blogPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      // Add category information if available
      if (blogPost.categoryId) {
        const category = await storage.getCategory(blogPost.categoryId);
        return res.json({ ...blogPost, category });
      }
      
      res.json(blogPost);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get all services
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getAllServices();
      
      // Transform services to ensure icon field is properly formatted
      // This prevents React DOM warnings about unrecognized HTML tags
      const transformedServices = services.map(service => ({
        ...service,
        // Ensure icon is a string that can be mapped to a React component
        // Remove any invalid characters and normalize the icon name
        icon: service.icon ? String(service.icon).toLowerCase().replace(/[^a-z0-9]/g, '') : 'globe'
      }));
      
      res.json(transformedServices);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  // Get service by slug
  app.get("/api/services/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const service = await storage.getServiceBySlug(slug);
      
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      res.json(service);
    } catch (error) {
      console.error("Error fetching service:", error);
      res.status(500).json({ message: "Failed to fetch service" });
    }
  });

  // Get all team members
  app.get("/api/team-members", async (req, res) => {
    try {
      const teamMembers = await storage.getAllTeamMembers();
      res.json(teamMembers);
    } catch (error) {
      console.error("Error fetching team members:", error);
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  // Get all projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // Get all testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  // Submit contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const contactMessage = await storage.createContactMessage(validatedData);
      res.status(201).json(contactMessage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid form data", errors: error.errors });
      }
      console.error("Error submitting contact form:", error);
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  // Subscribe to newsletter
  app.post("/api/subscribe", async (req, res) => {
    try {
      const validatedData = insertSubscriberSchema.parse(req.body);
      
      // Check if email already exists
      const existingSubscriber = await storage.getSubscriberByEmail(validatedData.email);
      if (existingSubscriber) {
        return res.status(400).json({ message: "Email already subscribed" });
      }
      
      const subscriber = await storage.createSubscriber(validatedData);
      res.status(201).json(subscriber);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid email", errors: error.errors });
      }
      console.error("Error subscribing to newsletter:", error);
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  // ==== ADMIN API ROUTES ====
  
  // Blog Posts CRUD
  app.get("/api/admin/blog-posts", isAuthenticated, async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });
  
  app.post("/api/admin/blog-posts", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating blog post:", error);
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });
  
  app.put("/api/admin/blog-posts/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.updateBlogPost(id, req.body);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });
  
  app.delete("/api/admin/blog-posts/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBlogPost(id);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });
  
  // Categories CRUD
  app.get("/api/admin/categories", isAuthenticated, async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  
  app.post("/api/admin/categories", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });
  
  app.put("/api/admin/categories/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.updateCategory(id, req.body);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Failed to update category" });
    }
  });
  
  app.delete("/api/admin/categories/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCategory(id);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });
  
  // Services CRUD
  app.get("/api/admin/services", isAuthenticated, async (req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });
  
  app.post("/api/admin/services", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating service:", error);
      res.status(500).json({ message: "Failed to create service" });
    }
  });
  
  app.put("/api/admin/services/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const service = await storage.updateService(id, req.body);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      console.error("Error updating service:", error);
      res.status(500).json({ message: "Failed to update service" });
    }
  });
  
  app.delete("/api/admin/services/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteService(id);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ message: "Failed to delete service" });
    }
  });
  
  // Team Members CRUD
  app.get("/api/admin/team-members", isAuthenticated, async (req, res) => {
    try {
      const members = await storage.getAllTeamMembers();
      res.json(members);
    } catch (error) {
      console.error("Error fetching team members:", error);
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });
  
  app.post("/api/admin/team-members", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertTeamMemberSchema.parse(req.body);
      const member = await storage.createTeamMember(validatedData);
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating team member:", error);
      res.status(500).json({ message: "Failed to create team member" });
    }
  });
  
  app.put("/api/admin/team-members/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const member = await storage.updateTeamMember(id, req.body);
      if (!member) {
        return res.status(404).json({ message: "Team member not found" });
      }
      res.json(member);
    } catch (error) {
      console.error("Error updating team member:", error);
      res.status(500).json({ message: "Failed to update team member" });
    }
  });
  
  app.delete("/api/admin/team-members/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTeamMember(id);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting team member:", error);
      res.status(500).json({ message: "Failed to delete team member" });
    }
  });
  
  // Projects CRUD
  app.get("/api/admin/projects", isAuthenticated, async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });
  
  app.post("/api/admin/projects", isAuthenticated, async (req, res) => {
    try {
      console.log("Project creation request received:", req.body);
      
      // Validate the input data
      const validatedData = insertProjectSchema.parse(req.body);
      
      // Check for duplicate projects before creating
      const existingProjects = await storage.getAllProjects();
      
      console.log(`Checking against ${existingProjects.length} existing projects`);
      
      // Check for duplicates based on title
      const isDuplicate = existingProjects.some(existingProject => 
        existingProject.title && 
        validatedData.title && 
        existingProject.title.toLowerCase() === validatedData.title.toLowerCase()
      );
      
      if (isDuplicate) {
        console.log(`Duplicate project detected: "${validatedData.title}"`);
        return res.status(409).json({ 
          message: "A project with this title already exists",
          status: "duplicate"
        });
      }
      
      console.log("Creating new project:", validatedData);
      const project = await storage.createProject(validatedData);
      
      // Broadcast to WebSocket clients if available
      if (wss) {
        try {
          const message = {
            type: 'project_created',
            data: project
          };
          
          console.log(`Broadcasting project_created event to ${wss.clients.size} clients`);
          
          wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(message));
            }
          });
        } catch (wsError) {
          console.error("Error broadcasting project creation:", wsError);
        }
      }
      
      console.log("Project created successfully:", project);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });
  
  // Project update endpoint moved to the enhanced version below with WebSocket broadcast support
  
  // The project delete handler was moved below to include WebSocket broadcast functionality
  
  // Testimonials CRUD
  app.get("/api/admin/testimonials", isAuthenticated, async (req, res) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });
  
  app.post("/api/admin/testimonials", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      res.status(201).json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating testimonial:", error);
      res.status(500).json({ message: "Failed to create testimonial" });
    }
  });
  
  app.put("/api/admin/testimonials/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const testimonial = await storage.updateTestimonial(id, req.body);
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      res.json(testimonial);
    } catch (error) {
      console.error("Error updating testimonial:", error);
      res.status(500).json({ message: "Failed to update testimonial" });
    }
  });
  
  app.delete("/api/admin/testimonials/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTestimonial(id);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      res.status(500).json({ message: "Failed to delete testimonial" });
    }
  });
  
  // Contact Messages
  // Public endpoint for contact messages (protected by auth middleware)
  app.get("/api/contact-messages", isAuthenticated, async (req, res) => {
    console.log('GET /api/contact-messages endpoint called');
    try {
      console.log('Calling storage.getAllContactMessages()');
      const messages = await storage.getAllContactMessages();
      console.log(`Fetched ${messages.length} contact messages from Firestore through storage interface`);
      console.log('Contact message data:', messages);
      
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });
  
  // Admin endpoint for contact messages (with /admin prefix for consistency)
  app.get("/api/admin/contact-messages", isAuthenticated, async (req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });
  
  app.delete("/api/admin/contact-messages/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteContactMessage(id);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting contact message:", error);
      res.status(500).json({ message: "Failed to delete contact message" });
    }
  });
  
  // Subscribers
  // Public subscribers endpoint - for admin page that doesn't use /admin prefix
  app.get("/api/subscribers", isAuthenticated, async (req, res) => {
    console.log('GET /api/subscribers endpoint called');
    try {
      console.log('Calling storage.getAllSubscribers()');
      const subscribers = await storage.getAllSubscribers();
      console.log(`Fetched ${subscribers.length} subscribers from Firestore through storage interface`);
      console.log('Subscriber data:', subscribers);
      
      // Manually check the collection name in Firestore directly
      // For logging/debugging only
      console.log('Manually checking "subscribers" collection');
      
      res.json(subscribers);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      res.status(500).json({ message: "Failed to fetch subscribers" });
    }
  });

  // Admin subscribers endpoint - same as above but with /admin prefix for consistency
  app.get("/api/admin/subscribers", isAuthenticated, async (req, res) => {
    try {
      const subscribers = await storage.getAllSubscribers();
      res.json(subscribers);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      res.status(500).json({ message: "Failed to fetch subscribers" });
    }
  });
  
  app.delete("/api/admin/subscribers/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSubscriber(id);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      res.status(500).json({ message: "Failed to delete subscriber" });
    }
  });

  const httpServer = createServer(app);
  
  // Create WebSocket server with explicit path
  console.log('Setting up WebSocket server on path: /ws');
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws',
    // Add more options for debugging
    clientTracking: true,
    perMessageDeflate: false
  });
  
  // WebSocket connection handling
  wss.on('connection', (ws, req) => {
    const clientIp = req.socket.remoteAddress;
    const url = req.url || 'unknown';
    console.log(`Client connected to WebSocket from ${clientIp}, URL: ${url}`);
    
    // Send an initial message to confirm connection
    ws.send(JSON.stringify({ 
      type: 'connection', 
      message: 'Connected to GodivaTech WebSocket server',
      timestamp: new Date().toISOString()
    }));
    
    // Listen for messages from client
    ws.on('message', (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        console.log(`Received WebSocket message:`, parsedMessage);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });
    
    // Handle disconnect
    ws.on('close', (code, reason) => {
      console.log(`Client disconnected from WebSocket with code ${code}${reason ? `, reason: ${reason}` : ''}`);
    });
    
    // Handle errors
    ws.on('error', (error) => {
      console.error('WebSocket connection error:', error);
    });
  });
  
  // Log any server errors
  wss.on('error', (error) => {
    console.error('WebSocket server error:', error);
  });
  
  // Helper function to broadcast data to all connected clients
  const broadcastUpdate = (type: string, data: any) => {
    console.log(`Broadcasting ${type} update to ${wss.clients.size} clients`);
    
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ 
          type, 
          data,
          timestamp: new Date().toISOString()
        }));
      }
    });
  };
  
  // Enhanced delete handler for projects to broadcast updates with better debugging
  app.delete("/api/admin/projects/:id", isAuthenticated, async (req, res) => {
    try {
      console.log(`=== PROJECT DELETION OPERATION ===`);
      console.log(`Received delete request for project with ID: ${req.params.id} (type: ${typeof req.params.id})`);
      
      // Validate the ID parameter
      if (!req.params.id || req.params.id === 'null' || req.params.id === 'undefined') {
        console.error(`Invalid project ID for deletion: ${req.params.id}`);
        return res.status(400).json({ 
          message: "Invalid project ID provided for deletion",
          received: req.params.id
        });
      }
      
      // Support both numeric and string IDs for flexibility
      let id = req.params.id;
      const originalId = req.params.id;
      
      // Log the original ID from the request
      console.log(`Original ID from request: '${originalId}', type: ${typeof originalId}`);
      
      // Before proceeding, find the actual project document
      try {
        console.log(`Attempting to find project in database...`);
        const allProjects = await storage.getAllProjects();
        
        console.log(`Found ${allProjects.length} projects in storage`);
        
        if (allProjects.length === 0) {
          console.warn('No projects found in database');
          return res.status(404).json({ 
            message: "No projects found in database",
            id: originalId
          });
        }
        
        // Look for projects with matching ID in any format
        const matchingProject = allProjects.find(p => {
          // Try multiple matching approaches for compatibility with different ID formats
          const stringMatch = p.id !== undefined && String(p.id) === String(id);
          const numericMatch = p.id !== undefined && typeof p.id === 'number' && p.id === Number(id);
          
          // Safely check for object with _key property
          const objectMatch = p.id !== undefined && 
                             typeof p.id === 'object' && 
                             p.id !== null && 
                             (p.id as any)._key !== undefined && 
                             (p.id as any)._key === id;
          
          // For Firestore documents, check document ID
          const firestoreMatch = (p as any).docId !== undefined && (p as any).docId === id;
          
          return stringMatch || numericMatch || objectMatch || firestoreMatch;
        });
        
        if (matchingProject) {
          console.log(`Found matching project:`, {
            id: matchingProject.id,
            title: matchingProject.title,
            docId: 'docId' in matchingProject ? matchingProject.docId : undefined
          });
          
          // Try both IDs for deletion
          let specificId = matchingProject.id;
          let docId = 'docId' in matchingProject && typeof matchingProject.docId === 'string' 
            ? matchingProject.docId 
            : null;
          
          // Try deleting with document ID first if available
          if (docId && typeof docId === 'string') {
            console.log(`Attempting to delete project with document ID: ${docId}`);
            const docSuccess = await storage.deleteProject(docId);
            
            if (docSuccess) {
              console.log(`Successfully deleted project with document ID: ${docId}`);
              broadcastUpdate('project_deleted', { id: specificId, docId });
              
              return res.status(200).json({ 
                message: "Project successfully deleted",
                id: specificId,
                docId
              });
            }
          }
          
          // If document ID deletion failed or wasn't available, try regular ID
          console.log(`Attempting to delete project with ID: ${specificId} (type: ${typeof specificId})`);
          const idSuccess = await storage.deleteProject(specificId);
          
          if (idSuccess) {
            console.log(`Successfully deleted project with ID: ${specificId}`);
            broadcastUpdate('project_deleted', { id: specificId });
            
            return res.status(200).json({ 
              message: "Project successfully deleted",
              id: specificId
            });
          }
          
          // If both attempts failed, try one more time with the original ID string
          console.log(`Attempting to delete project with original ID: ${originalId}`);
          const originalSuccess = await storage.deleteProject(originalId);
          
          if (originalSuccess) {
            console.log(`Successfully deleted project with original ID: ${originalId}`);
            broadcastUpdate('project_deleted', { id: originalId });
            
            return res.status(200).json({ 
              message: "Project successfully deleted",
              id: originalId
            });
          }
          
          // If we reached here, all deletion attempts failed
          console.error(`Failed to delete project after multiple attempts`);
          return res.status(500).json({ 
            message: "Failed to delete project after multiple attempts",
            id: originalId
          });
        } else {
          console.warn(`No matching project found with ID: ${id}`);
          return res.status(404).json({ 
            message: "Project not found",
            id: originalId
          });
        }
      } catch (searchError) {
        console.error(`Error when searching for project:`, searchError);
        return res.status(500).json({ 
          message: "Error searching for project",
          error: searchError instanceof Error ? searchError.message : String(searchError)
        });
      }
    } catch (error) {
      console.error("Error in project deletion route:", error);
      // Send a clean JSON response even for 500 errors - avoid HTML error pages
      return res.status(500).json({ 
        message: "Server error during project deletion",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Enhanced project create endpoint with better WebSocket broadcasting
  app.post("/api/admin/projects", isAuthenticated, async (req, res) => {
    try {
      console.log(`=== PROJECT CREATION OPERATION ===`);
      
      // Validate the input data
      const validatedData = insertProjectSchema.parse(req.body);
      console.log(`Creating new project with title: "${validatedData.title}"`);
      
      // Create the project in storage
      const project = await storage.createProject(validatedData);
      console.log(`Successfully created project with ID: ${project.id}, docId: ${(project as any).docId || 'N/A'}`);
      
      // Broadcast the creation to all connected clients
      console.log(`Broadcasting project_created event to connected clients`);
      try {
        broadcastUpdate('project_created', project);
      } catch (wsError) {
        console.error("Error broadcasting project creation:", wsError);
      }
      
      // Return the created project
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error creating project:", error.errors);
        return res.status(400).json({ 
          message: "Invalid project data", 
          errors: error.errors 
        });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ 
        message: "Failed to create project",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Enhanced project update endpoint with Firebase document ID support and WebSocket broadcasting
  app.put("/api/admin/projects/:id", isAuthenticated, async (req, res) => {
    try {
      console.log(`=== PROJECT UPDATE OPERATION ===`);
      console.log(`Received update request for project with ID: ${req.params.id} (type: ${typeof req.params.id})`);
      
      // Always keep the original ID as a string for Firebase IDs
      const originalId = req.params.id;
      
      // Validate the ID parameter
      if (!req.params.id || req.params.id === 'null' || req.params.id === 'undefined') {
        console.error(`Invalid project ID for update: ${req.params.id}`);
        return res.status(400).json({ 
          message: "Invalid project ID provided for update",
          received: req.params.id
        });
      }
      
      // Before proceeding, find the actual project document - don't convert to numbers for Firebase IDs
      try {
        console.log(`Attempting to find project in database...`);
        const allProjects = await storage.getAllProjects();
        
        console.log(`Found ${allProjects.length} projects in storage for update operation`);
        
        if (allProjects.length === 0) {
          console.warn('No projects found in database');
          return res.status(404).json({ 
            message: "No projects found in database",
            id: originalId
          });
        }
        
        // Look for projects with matching ID in any format
        const matchingProject = allProjects.find(p => {
          // Try multiple matching approaches for compatibility with different ID formats
          const stringMatch = p.id !== undefined && String(p.id) === String(originalId);
          const numericMatch = p.id !== undefined && 
                              typeof p.id === 'number' && 
                              !isNaN(Number(originalId)) && 
                              p.id === Number(originalId);
          
          // For Firestore documents, check document ID specifically
          const firestoreMatch = (p as any).docId !== undefined && (p as any).docId === originalId;
          
          return stringMatch || numericMatch || firestoreMatch;
        });
        
        if (matchingProject) {
          console.log(`Found matching project for update:`, {
            id: matchingProject.id,
            title: matchingProject.title,
            docId: 'docId' in matchingProject ? matchingProject.docId : undefined
          });
          
          // Determine the most accurate ID to use for the update
          let updateId: string | number = originalId; // Default to the original ID from the URL
          
          // If we have a Firestore document ID, prioritize it
          if ('docId' in matchingProject && matchingProject.docId && typeof matchingProject.docId === 'string') {
            console.log(`Using Firebase document ID for update: ${matchingProject.docId}`);
            updateId = matchingProject.docId as string;
          }
          
          console.log(`Attempting to update project with final ID: ${updateId}`);
          const project = await storage.updateProject(updateId, req.body);
          
          if (!project) {
            console.warn(`Project with ID ${updateId} not found or could not be updated`);
            return res.status(404).json({ 
              message: "Project not found or could not be updated",
              id: updateId
            });
          }
          
          console.log(`Successfully updated project with ID: ${updateId}, broadcasting update`);
          // Broadcast the update to all connected clients
          broadcastUpdate('project_updated', project);
          
          res.json(project);
        } else {
          console.warn(`No matching project found with ID: ${originalId} for update`);
          return res.status(404).json({ 
            message: "Project not found",
            id: originalId
          });
        }
      } catch (searchError) {
        console.error(`Error when searching for project:`, searchError);
        return res.status(500).json({ 
          message: "Error searching for project",
          error: searchError instanceof Error ? searchError.message : String(searchError)
        });
      }
    } catch (error) {
      console.error("Error in project update route:", error);
      // Send a clean JSON response even for 500 errors - avoid HTML error pages
      return res.status(500).json({ 
        message: "Server error during project update",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  return httpServer;
}

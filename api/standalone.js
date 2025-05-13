// api/standalone.js - Simplified API handler for Vercel
import express from "express";
import cors from "cors";

// Create Express app
const app = express();

// CORS setup
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// JSON body parser
app.use(express.json());

// User data store (in-memory for demo)
const users = [
  { id: 1, username: "admin", password: "password123" }
];

// Mock session store
const sessions = {};

// Simple auth middleware
const isAuth = (req, res, next) => {
  const sessionId = req.headers.authorization?.split(' ')[1];
  if (sessionId && sessions[sessionId]) {
    req.user = sessions[sessionId];
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
};

// Auth routes
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  
  // Create session
  const sessionId = Math.random().toString(36).substring(2);
  const { password: _, ...userWithoutPassword } = user;
  sessions[sessionId] = userWithoutPassword;
  
  res.json({ 
    user: userWithoutPassword,
    token: sessionId
  });
});

app.post("/api/logout", (req, res) => {
  const sessionId = req.headers.authorization?.split(' ')[1];
  if (sessionId) {
    delete sessions[sessionId];
  }
  res.status(200).json({ message: "Logged out successfully" });
});

app.get("/api/user", isAuth, (req, res) => {
  res.json(req.user);
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "production"
  });
});

// Other API endpoints
app.get("/api/services", (req, res) => {
  res.json([
    {
      id: 1,
      title: "Web Development",
      description: "Professional, responsive websites tailored for your business",
      icon: "code",
      slug: "web-development"
    },
    {
      id: 2,
      title: "Mobile App Development",
      description: "Custom mobile applications for iOS and Android",
      icon: "smartphone",
      slug: "mobile-app-development"
    }
  ]);
});

app.get("/api/categories", (req, res) => {
  res.json([
    { id: 1, name: "Web Development", slug: "web-development" },
    { id: 2, name: "Digital Marketing", slug: "digital-marketing" },
    { id: 3, name: "Mobile App Development", slug: "mobile-app-development" }
  ]);
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message
  });
});

// Export for Vercel serverless functions
export default app;
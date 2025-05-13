// api/index.js - Vercel Serverless API handler
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createServer } from "http";
import { setupAuth } from "../server/auth.js";
import { setupSitemap } from "../server/sitemap.js";

// Initialize environment variables
dotenv.config();

// Create Express app
const app = express();

// CORS setup
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// JSON body parser
app.use(express.json());

// Set up authentication routes
setupAuth(app);

// Set up sitemap
setupSitemap(app);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "production"
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

// Add more API routes as needed
// ...

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

// Create server for local development
const server = createServer(app);

// Start server if not in Vercel environment
if (typeof process.env.VERCEL === 'undefined') {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`[api] Server is running on port ${PORT}`);
  });
}

// Export for Vercel serverless functions
export default app;
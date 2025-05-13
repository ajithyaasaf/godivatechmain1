// Load environment variables from .env file first
import dotenv from 'dotenv';
dotenv.config();

import express, { type Request, Response, NextFunction } from "express";
import cors from 'cors';
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Configure CORS for cross-origin requests
let allowedOrigins;

if (process.env.NODE_ENV === 'production') {
  if (process.env.ALLOWED_ORIGINS) {
    // Parse comma-separated list of allowed origins
    allowedOrigins = process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
    console.log('Allowed origins from env:', allowedOrigins);
  } else {
    // Default production origins if not specified
    allowedOrigins = [
      'https://godivatech.vercel.app', // Main production frontend
      'https://godiva-tech.vercel.app', // Alternative production domain
      'https://www.godivatech.com',    // Production domain
      'https://godivatech.com',        // Production domain without www
      /\.vercel\.app$/ // Allow all Vercel preview deployments
    ];
  }
} else {
  // In development, allow all origins
  allowedOrigins = '*';
}

// Standard CORS middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Add a custom middleware to ensure CORS headers are always present
// This handles cases where the main CORS middleware might not apply
app.use((req, res, next) => {
  // For preflight requests
  if (req.method === 'OPTIONS') {
    // Set CORS headers for preflight requests
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight request
    res.status(204).end();
    return;
  }
  
  // Set CORS headers for all other requests
  // This ensures headers are set even if the cors middleware doesn't catch it
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  next();
});

// Increase JSON body limit to 10MB for image uploads
app.use(express.json({ limit: '10mb' })); 
// Increase URL-encoded body limit to 10MB
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();

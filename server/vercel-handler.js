// Vercel serverless entry point
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { registerRoutes } from './routes';
import { setupAuth } from './auth';
import { setupSitemap } from './sitemap';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import setupWebSocketServer from './vercel-websocket';
import dotenv from 'dotenv';

// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config();
}

// Create and configure Express app
function createApp() {
  // Initialize Express app
  const app = express();
  const server = createServer(app);

  // Setup WebSocket with Vercel-compatible adapter
  const websocketServer = setupWebSocketServer(server);

  // Make WebSocket server available globally
  app.locals.wss = websocketServer;

  // Enable CORS
  app.use(cors({
    origin: true,
    credentials: true
  }));

  // Use compression
  app.use(compression());

  // Parse JSON body
  app.use(express.json());

  // Setup auth
  setupAuth(app);

  // Setup sitemap
  setupSitemap(app);

  // Register API routes
  registerRoutes(app);

  // Serve static client files from the dist directory
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const clientDistPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientDistPath));

  // Serve the index.html file for all other routes (SPA fallback)
  app.get('*', (req, res) => {
    // Skip API and websocket routes
    if (req.path.startsWith('/api/') || req.path === '/ws') {
      return;
    }
    
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });

  // Error handling middleware
  app.use((err, _req, res, _next) => {
    console.error('Server error:', err);
    res.status(500).json({ message: 'An internal server error occurred' });
  });

  return { app, server };
}

// Create the Express application
const { app, server } = createApp();

// For development server (will not run in Vercel production)
if (typeof process.env.VERCEL === 'undefined') {
  // Start HTTP server for local development
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export app for Vercel and testing purposes
export default app;
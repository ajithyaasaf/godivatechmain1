// Simplified Vercel serverless entry point
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { registerRoutes } from './routes';
import { setupAuth } from './auth';
import { setupSitemap } from './sitemap';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Express app
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
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return;
  }
  
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'An internal server error occurred' });
});

// Export app for Vercel
export default app;
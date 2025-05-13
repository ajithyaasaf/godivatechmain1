// server/vercel.js - Production server for Vercel deployment
import dotenv from "dotenv";
import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';

// Initialize environment variables
dotenv.config();

// Get directory path in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Set up CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files from the React app
app.use(express.static(join(__dirname, '../dist')));

// Define API routes here
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  // Exclude API routes from catch-all
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Create HTTP server
const server = createServer(app);

// Start server if not in Vercel environment
if (typeof process.env.VERCEL === 'undefined') {
  server.listen(PORT, () => {
    console.log(`[vercel] Server is running on port ${PORT}`);
  });
}

export default app;
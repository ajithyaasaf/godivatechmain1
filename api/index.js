// This file serves as an entry point for Vercel serverless functions
// It proxies requests to our Express server

import { createServer } from 'http';
import { parse } from 'url';
import '../dist/index.js'; // Import the compiled server code

export default function handler(req, res) {
  // Proxy to the Express server
  const parsedUrl = parse(req.url, true);
  req.query = parsedUrl.query;
  
  // Forward the request to our Express server
  return import('../dist/index.js').then((module) => {
    if (typeof module.default === 'function') {
      return module.default(req, res);
    } else {
      res.statusCode = 500;
      res.end('Internal Server Error: Express app not found');
    }
  });
}
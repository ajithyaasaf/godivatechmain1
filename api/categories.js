// Serverless API endpoint for categories
// For Vercel deployment

import { firestoreStorage } from './lib/firestore-storage.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // GET request handler
    if (req.method === 'GET') {
      // Check for slug parameter
      const { slug } = req.query;
      
      if (slug) {
        const category = await firestoreStorage.getCategoryBySlug(slug);
        
        if (!category) {
          return res.status(404).json({ message: 'Category not found' });
        }
        
        return res.status(200).json(category);
      }
      
      // Get all categories
      const categories = await firestoreStorage.getAllCategories();
      return res.status(200).json(categories);
    }
    
    // Method not allowed
    return res.status(405).json({ message: 'Method not allowed' });
    
  } catch (error) {
    console.error('Error handling categories request:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
}
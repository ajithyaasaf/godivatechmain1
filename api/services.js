// Serverless API endpoint for services
// For Vercel deployment

import { firestoreStorage } from '../server/firestore-storage.js';

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
    // GET: Fetch all services
    if (req.method === 'GET') {
      const services = await firestoreStorage.getAllServices();
      return res.status(200).json(services);
    }
    
    // POST: Create a new service (requires authentication)
    if (req.method === 'POST') {
      // In a real implementation, you'd add authentication here
      /*
      if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      */
      
      const serviceData = req.body;
      const newService = await firestoreStorage.createService(serviceData);
      return res.status(201).json(newService);
    }
    
    // Method not allowed
    return res.status(405).json({ message: 'Method not allowed' });
    
  } catch (error) {
    console.error('Error handling services request:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
}
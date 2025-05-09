// Serverless API endpoint for projects
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
    // GET all projects
    if (req.method === 'GET') {
      // Check if there's an ID in the query parameter
      const { id } = req.query;
      
      if (id) {
        // Get a specific project
        const project = await firestoreStorage.getProject(id);
        
        if (!project) {
          return res.status(404).json({ message: 'Project not found' });
        }
        
        return res.status(200).json(project);
      }
      
      // Get all projects
      const projects = await firestoreStorage.getAllProjects();
      return res.status(200).json(projects);
    }
    
    // Method not allowed
    return res.status(405).json({ message: 'Method not allowed' });
    
  } catch (error) {
    console.error('Error handling projects request:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
}
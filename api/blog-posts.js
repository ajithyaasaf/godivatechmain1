// Serverless API endpoint for blog posts
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
      // Check for slug or id in query params
      const { slug, id } = req.query;
      
      // Get blog post by slug
      if (slug) {
        const blogPost = await firestoreStorage.getBlogPostBySlug(slug);
        
        if (!blogPost) {
          return res.status(404).json({ message: 'Blog post not found' });
        }
        
        // Load category data if categoryId exists
        if (blogPost.categoryId) {
          try {
            const category = await firestoreStorage.getCategory(blogPost.categoryId);
            if (category) {
              blogPost.category = category;
            }
          } catch (err) {
            console.error('Error loading category for blog post:', err);
            // Continue without category data
          }
        }
        
        return res.status(200).json(blogPost);
      }
      
      // Get blog post by id
      if (id) {
        const blogPost = await firestoreStorage.getBlogPost(id);
        
        if (!blogPost) {
          return res.status(404).json({ message: 'Blog post not found' });
        }
        
        // Load category data if categoryId exists
        if (blogPost.categoryId) {
          try {
            const category = await firestoreStorage.getCategory(blogPost.categoryId);
            if (category) {
              blogPost.category = category;
            }
          } catch (err) {
            console.error('Error loading category for blog post:', err);
            // Continue without category data
          }
        }
        
        return res.status(200).json(blogPost);
      }
      
      // Get all blog posts
      const blogPosts = await firestoreStorage.getAllBlogPosts();
      
      // Load categories for blog posts
      const postsWithCategories = await Promise.all(
        blogPosts.map(async (post) => {
          if (post.categoryId) {
            try {
              const category = await firestoreStorage.getCategory(post.categoryId);
              if (category) {
                return { ...post, category };
              }
            } catch (err) {
              console.error(`Error loading category for blog post ${post.id}:`, err);
            }
          }
          return post;
        })
      );
      
      return res.status(200).json(postsWithCategories);
    }
    
    // Method not allowed
    return res.status(405).json({ message: 'Method not allowed' });
    
  } catch (error) {
    console.error('Error handling blog posts request:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
}
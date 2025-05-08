// Simple script to verify environment variables
// This can be used as a health check in Vercel

export default function handler(req, res) {
  // Don't expose sensitive values, just check if they exist
  const envChecks = {
    NODE_ENV: process.env.NODE_ENV || 'not set',
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ? 'set' : 'not set',
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY ? 'set' : 'not set',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'set' : 'not set',
    SESSION_SECRET: process.env.SESSION_SECRET ? 'set' : 'not set'
  };
  
  res.status(200).json({
    status: 'Vercel environment check',
    environment: process.env.NODE_ENV,
    checks: envChecks,
    timestamp: new Date().toISOString()
  });
}
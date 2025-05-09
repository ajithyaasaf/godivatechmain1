// Simple API proxy for Vercel deployment
// This approach deploys only the frontend to Vercel
// And points API requests to an external backend (on Render)

export default function handler(req, res) {
  // Point to your Render backend URL
  const BACKEND_URL = process.env.BACKEND_URL || 'https://godivatech.onrender.com';
  
  // For now, let's return a simple response
  res.status(200).json({
    message: "API endpoint is working",
    info: "In production, this would proxy to your backend server",
    timestamp: new Date().toISOString(),
    backendUrl: BACKEND_URL
  });
}
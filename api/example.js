// Sample API endpoint to verify Vercel deployment

export default function handler(req, res) {
  const data = {
    name: "GodivaTech API",
    status: "online",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "unknown",
    routes: [
      { path: "/api", description: "Main API endpoint" },
      { path: "/api/example", description: "This example endpoint" }
    ]
  };
  
  res.status(200).json(data);
}
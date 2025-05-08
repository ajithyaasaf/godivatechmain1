// Special WebSocket adapter for Vercel serverless functions
import { WebSocketServer } from 'ws';
import { isAuthenticated } from './auth';

// This is a simplified implementation for Vercel
export function setupWebSocketServer(server) {
  // Use conditional WebSocket support for serverless environment
  if (typeof process.env.VERCEL !== 'undefined') {
    console.log("Running in Vercel environment - WebSocket functionality will be limited");
    
    // In Vercel environment, we'll use a simpler approach
    // This won't maintain persistent connections, but will handle basic API functionality
    return {
      sendToAll: (message) => {
        console.log("WebSocket message suppressed in serverless environment:", message);
      },
      getConnectionCount: () => 0
    };
  }
  
  // For non-Vercel environments, use standard WebSocket implementation
  console.log("Setting up WebSocket server on path: /ws");
  
  // Create WebSocket server
  const wss = new WebSocketServer({ 
    server,
    path: '/ws'
  });
  
  // Track connected clients
  let clients = [];
  
  wss.on('connection', (ws, req) => {
    console.log("WebSocket client connected");
    clients.push(ws);
    
    // Handle client messages
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        console.log("Received message:", data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    });
    
    // Handle disconnection
    ws.on('close', () => {
      console.log("WebSocket client disconnected");
      clients = clients.filter(client => client !== ws);
    });
  });
  
  // Return helper functions
  return {
    sendToAll: (message) => {
      const messageStr = typeof message === 'string' 
        ? message 
        : JSON.stringify(message);
        
      clients.forEach(client => {
        if (client.readyState === 1) { // OPEN
          client.send(messageStr);
        }
      });
    },
    getConnectionCount: () => clients.length
  };
}

export default setupWebSocketServer;
# Full-Stack Vercel Deployment Guide for GodivaTech

This guide will help you deploy your entire GodivaTech application (frontend and backend) on Vercel.

## Current Deployment Architecture

The current setup has:
1. Frontend deployed on Vercel
2. Backend deployed on Render

To deploy the full application on Vercel only, we need to make several changes.

## Deployment Steps for Full-Stack on Vercel

### 1. Prepare API Routes for Serverless Deployment

Vercel uses serverless functions for API routes. We need to convert our Express API to be compatible with Vercel's serverless functions.

#### Create API Handlers:

Create these files in the `/api` directory (based on your core routes):

1. **Create services.js**
```javascript
// /api/services.js
import { firestoreStorage } from '../server/firestore-storage';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const services = await firestoreStorage.getAllServices();
    res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Failed to fetch services' });
  }
}
```

2. **Create similar handlers for all API endpoints**:
   - `/api/projects.js`
   - `/api/blog-posts.js`
   - `/api/team-members.js`
   - `/api/testimonials.js`
   - `/api/categories.js`
   - etc.

### 2. Update Vercel Configuration

Modify `vercel.json` to properly handle the serverless functions:

```json
{
  "version": 2,
  "builds": [
    { 
      "src": "api/*.js",
      "use": "@vercel/node"
    },
    { 
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "buildCommand": "cd client && npm install && npm run vercel-build",
        "outputDirectory": "client/dist"
      }
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "src": "/(.*)", "dest": "/client/dist/$1" }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 3. Ensure Firebase Admin SDK Initialization

Create a dedicated initialization file for Firebase Admin SDK to be used in serverless functions:

```javascript
// /api/lib/firebase-admin.js
import admin from 'firebase-admin';

// Initialize the app only if it hasn't been initialized yet
let app;
try {
  app = admin.app();
} catch (error) {
  // Initialize with service account if available
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } else {
    // Use application default credentials
    app = admin.initializeApp();
  }
}

const firestore = admin.firestore();
export { admin, firestore };
```

### 4. Environment Variables

In Vercel, add these environment variables:

```
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"...","client_email":"..."}
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

### 5. Update Frontend API Client

Update the API client to use relative paths for API calls:

```typescript
// client/src/lib/queryClient.ts (modified lines)
const API_BASE_URL = import.meta.env.VITE_SERVER_URL || import.meta.env.VITE_API_URL || '';
```

### 6. Deploy to Vercel

1. Push your code to GitHub
2. Connect to Vercel
3. Import your project
4. Set environment variables
5. Deploy

## Important Notes for Full-Stack Vercel Deployment

1. **Serverless Functions Limitations**:
   - 10-second execution time limit for the Hobby plan
   - 50MB function size limit
   - No persistent file system
   - Cannot start additional servers/processes

2. **Session Management**:
   - Use a JWT-based approach instead of session cookies
   - Or use a service like Firebase Authentication directly from frontend

3. **Monitoring and Debugging**:
   - Use Vercel's built-in logs for debugging
   - Consider adding Sentry for error tracking

## Testing Your Deployment

After deploying, test all API routes to make sure they're working:
- Check `/api/services` to see if services data loads
- Test blog, projects, and other endpoints
- Verify that the frontend correctly displays data from the API

## Fallback Option

If full-stack deployment on Vercel proves difficult, you can:
1. Keep the frontend on Vercel
2. Deploy the backend on Render/Railway/Fly.io
3. Connect them by setting the `VITE_API_URL` environment variable in Vercel to point to your backend

This hybrid approach is often more reliable for complex Express applications.

## Security Considerations

1. Protect your API routes with proper authentication
2. Store sensitive credentials as Vercel secrets
3. Use environment variables for all configuration
4. Set appropriate CORS headers in your API routes
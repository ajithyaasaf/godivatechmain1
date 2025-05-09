# Comprehensive Deployment Guide for GodivaTech

This guide provides step-by-step instructions for deploying your GodivaTech website using two approaches:

1. **Full-Stack Deployment on Vercel**: Deploy both frontend and backend on Vercel
2. **Split Deployment**: Deploy frontend on Vercel and backend on Render

## Option 1: Full-Stack Deployment on Vercel

### Prerequisites
- A Vercel account (https://vercel.com)
- A Firebase project with Firestore database
- A Cloudinary account for image management

### Step 1: Prepare Your Environment Variables
Create a `.env` file in your project root with the following variables:

```
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Session secret (for authentication)
SESSION_SECRET=your_session_secret

# Client-side environment variables (prefixed with VITE_)
VITE_FIREBASE_API_KEY=${FIREBASE_API_KEY}
VITE_FIREBASE_AUTH_DOMAIN=${FIREBASE_AUTH_DOMAIN}
VITE_FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
VITE_FIREBASE_STORAGE_BUCKET=${FIREBASE_STORAGE_BUCKET}
VITE_FIREBASE_MESSAGING_SENDER_ID=${FIREBASE_MESSAGING_SENDER_ID}
VITE_FIREBASE_APP_ID=${FIREBASE_APP_ID}
VITE_FIREBASE_MEASUREMENT_ID=${FIREBASE_MEASUREMENT_ID}
VITE_API_URL=/api
```

### Step 2: Update Vercel Configuration

Your `vercel.json` file is already set up, but let's make sure it has the correct configuration:

```json
{
  "version": 2,
  "buildCommand": "chmod +x vercel-build.sh && ./vercel-build.sh",
  "outputDirectory": "dist",
  "functions": {
    "api/**": {
      "memory": 1024
    }
  },
  "api": {
    "runtime": "nodejs18.x"
  },
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" },
    { "source": "/(.*)", "destination": "/" }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Step 3: Deploy to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to your Vercel account and click "Add New" → "Project"
3. Import your repository and configure it as follows:
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. Add all the environment variables from your `.env` file
5. Click "Deploy"

### Step 4: Verify Deployment

1. Once deployment is complete, Vercel will provide a URL to access your site
2. Test all features to ensure everything is working properly:
   - Home page loads correctly
   - Blog posts are accessible
   - Contact form works
   - Admin dashboard is accessible (if implemented)

## Option 2: Split Deployment (Frontend on Vercel, Backend on Render)

### Part A: Backend Deployment on Render

1. **Create a Web Service on Render**:
   - Log in to your Render account
   - Click "New" and select "Web Service"
   - Connect to your repository
   - Name your service (e.g., "godivatech-backend")
   - Set the following configuration:
     - Runtime: Node
     - Build Command: `chmod +x render-build.sh && ./render-build.sh`
     - Start Command: `./render-start.sh`

2. **Set Environment Variables**:
   - Add all the environment variables from the `.env` file
   - Make sure to set `NODE_ENV=production`

3. **Deploy the Backend**:
   - Click "Create Web Service"
   - Wait for the deployment to complete
   - Note the URL of your service (e.g., `https://godivatech-backend.onrender.com`)

### Part B: Frontend Deployment on Vercel

1. **Update API URL**:
   - For this split deployment approach, you'll need to update the API URL environment variable to point to your Render backend:
   - Set `VITE_API_URL=https://your-render-backend-url.onrender.com/api`

2. **Deploy the Frontend to Vercel**:
   - Follow the same steps as in Option 1, but:
     - Use client-only build command: `cd client && npm install && npm run build`
     - Set Output Directory to `client/dist`
     - Only add the VITE_* environment variables and other frontend-related variables

3. **Update CORS Settings**:
   - Make sure your backend allows requests from your Vercel frontend:
   - Add your Vercel frontend URL to the `ALLOWED_ORIGINS` environment variable on Render

## Environment Variables Guide

Below is a complete list of environment variables used in the application:

### Firebase Configuration
```
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

### Cloudinary Configuration
```
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Session Configuration
```
SESSION_SECRET=a_random_string_for_securing_sessions
```

### Frontend Environment Variables
```
VITE_FIREBASE_API_KEY=${FIREBASE_API_KEY}
VITE_FIREBASE_AUTH_DOMAIN=${FIREBASE_AUTH_DOMAIN}
VITE_FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
VITE_FIREBASE_STORAGE_BUCKET=${FIREBASE_STORAGE_BUCKET}
VITE_FIREBASE_MESSAGING_SENDER_ID=${FIREBASE_MESSAGING_SENDER_ID}
VITE_FIREBASE_APP_ID=${FIREBASE_APP_ID}
VITE_FIREBASE_MEASUREMENT_ID=${FIREBASE_MEASUREMENT_ID}
VITE_API_URL=/api (for Vercel full-stack) or https://your-backend-url.onrender.com/api (for split deployment)
```

### Backend Configuration
```
NODE_ENV=production
PORT=10000 (for Render; Vercel handles this automatically)
ALLOWED_ORIGINS=https://your-frontend-url.vercel.app (for split deployment)
```

## Post-Deployment Tasks

1. **Set up Custom Domain** (optional):
   - In Vercel, go to your project settings → Domains
   - Add your custom domain and follow the instructions
   - If using split deployment, make sure to update CORS settings and redirect URLs

2. **Set up Firebase Authentication**:
   - Add your deployment URL to the authorized domains in Firebase Console
   - Ensure your Firebase security rules are properly configured for production

3. **Monitor Application**:
   - Check Vercel and/or Render logs for any issues
   - Set up uptime monitoring for your production site

## Troubleshooting Common Issues

### Firebase Connection Issues
- Ensure all Firebase environment variables are correctly set
- Verify that your Firebase project has the appropriate services enabled (Firestore, Authentication)
- Check if your IP is restricted in Firebase Console

### Cloudinary Image Upload Problems
- Verify Cloudinary credentials
- Check upload preset settings in Cloudinary dashboard
- Ensure the proper CORS settings are configured

### API Connection Errors
- For split deployment, ensure CORS is properly configured
- Check network requests in browser console for specific error messages
- Verify that API endpoints are correctly formatted

### Authentication Issues
- Ensure the SESSION_SECRET is properly set
- Verify Firebase Authentication is configured correctly
- Check authorized domains in Firebase Console
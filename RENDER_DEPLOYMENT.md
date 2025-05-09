# Deploying GodivaTech Backend to Render

This guide explains how to deploy the GodivaTech backend to Render.

## Prerequisites

- A Render account (https://render.com)
- Your GodivaTech codebase (this repository)
- Firebase project (for authentication and database)
- Cloudinary account (for image uploads)

## Backend Deployment Steps

### 1. Prepare Your Repository

Ensure your code is in a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Create a Web Service on Render

1. Log in to your Render account
2. Click "New +" and select "Web Service"
3. Connect your Git repository
4. Configure your web service:
   - **Name**: godiva-tech-backend (or your preferred name)
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Choose Free (or larger if needed)

### 3. Set Environment Variables

In the Render dashboard, go to your web service's "Environment" tab and add the following environment variables:

```
NODE_ENV=production
PORT=10000

# Firebase configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id

# Cloudinary configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Session secret for authentication
SESSION_SECRET=a_long_random_string_for_security
```

### 4. Deploy and Note Your Backend URL

1. Click "Create Web Service" to deploy
2. Wait for the deployment to complete
3. Note your service URL (e.g., `https://godiva-tech-backend.onrender.com`)
4. You'll need this URL when configuring the frontend

## Frontend Configuration for Backend

When deploying the frontend to Vercel, you need to point it to your Render backend:

1. In Vercel, add an environment variable:
   - Name: `VITE_API_URL`
   - Value: Your Render URL (e.g., `https://godiva-tech-backend.onrender.com`)

## CORS Configuration

Your backend automatically allows CORS requests from any origin. If you need to restrict this:

1. Edit the CORS configuration in `server/index.ts` to only allow your Vercel frontend domain.

## Security Considerations

- Always use HTTPS for communication between frontend and backend
- Ensure your Firebase and Cloudinary credentials are kept secure
- Consider implementing rate limiting for API endpoints if needed

## Testing Your Deployment

After deployment:

1. Test that your frontend can connect to the backend
2. Verify that all API routes work correctly
3. Check that database operations function as expected

## Troubleshooting

- If connections time out, check your Render service's logs for issues
- Ensure all environment variables are correctly set
- Verify that your Firebase and Cloudinary accounts are active
- If using the free tier of Render, be aware the service will spin down after periods of inactivity
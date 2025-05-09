# Split Deployment Guide for GodivaTech

This guide will walk you through deploying the GodivaTech website with a split architecture:
1. Frontend on Vercel
2. Backend on Render

## Prerequisites

- GitHub repository with your code
- Vercel account
- Render account
- Your Firebase credentials
- Your Cloudinary credentials

## Part 1: Backend Deployment on Render

### Step 1: Create a new Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Fill in the following details:
   - **Name**: `godivatech-backend` (or your preferred name)
   - **Runtime**: `Node`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm run start`

### Step 2: Configure Environment Variables

Add the following environment variables in the Render dashboard:

```
NODE_ENV=production
FIREBASE_TYPE=
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_CLIENT_ID=
FIREBASE_AUTH_URI=
FIREBASE_TOKEN_URI=
FIREBASE_AUTH_PROVIDER_CERT_URL=
FIREBASE_CLIENT_CERT_URL=
CLOUDINARY_CLOUD_NAME=doeodacsg
CLOUDINARY_API_KEY=269267633995791
CLOUDINARY_API_SECRET=wUw9Seu6drQEIbQ1tAvYeVyqHdU
SESSION_SECRET=your_session_secret
ALLOWED_ORIGINS=https://godivatech.vercel.app,https://www.godivatech.com
```

Replace the Firebase values with your actual Firebase service account credentials.

### Step 3: Deploy the Backend

Click "Create Web Service" and wait for the deployment to complete. Once deployed, note the URL of your backend (e.g., `https://godivatech-backend.onrender.com`).

## Part 2: Frontend Deployment on Vercel

### Step 1: Create a New Project on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" and select "Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Root Directory**: Select `/client` as the root directory
   - **Framework Preset**: Vite

### Step 2: Configure Environment Variables

Add the following environment variables in the Vercel dashboard:

```
VITE_SERVER_URL=https://godivatech-backend.onrender.com
```

Replace with your actual Render backend URL.

### Step 3: Configure Build Settings (if needed)

1. Ensure build settings are correct:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 4: Deploy the Frontend

Click "Deploy" and wait for the deployment to complete.

## Step 5: Test Your Split Deployment

1. Visit your Vercel frontend URL
2. Test all functionality to ensure the frontend is properly communicating with the backend
3. Check login/authentication, content creation, and other key features

## Troubleshooting

### Cross-Origin Issues
- Ensure the `ALLOWED_ORIGINS` on your backend includes your Vercel domain
- Check that the server has proper CORS configuration

### API Connection Issues
- Verify that `VITE_SERVER_URL` is correctly set on Vercel
- Check network requests in your browser's developer tools
- Ensure your backend is running and accessible

### Authentication Problems
- Verify Firebase configuration is correct
- Check that session secrets are properly set

## Next Steps

1. **Set up a custom domain**: Configure your custom domain in both Vercel and Render
2. **Configure SSL**: Ensure both services have SSL enabled
3. **Set up monitoring**: Consider adding monitoring services
4. **Configure CI/CD**: Set up continuous integration for automated deployments
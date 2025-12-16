# GodivaTech Deployment Guide

This guide explains how to deploy the GodivaTech website with Vercel (frontend) and Render (backend).

## Architecture Overview

- **Frontend**: React + Vite application deployed on Vercel
- **Backend**: Express.js API server deployed on Render
- **Database**: Firebase Firestore
- **Storage**: Cloudinary for images
- **Authentication**: Firebase Auth + Session-based auth

## Prerequisites

1. GitHub repository with your code
2. Vercel account (https://vercel.com)
3. Render account (https://render.com)
4. Firebase project with Firestore enabled
5. Cloudinary account for image storage

## Backend Deployment (Render)

### Step 1: Prepare Environment Variables

1. Copy `.env.example` to create your environment file
2. Fill in all required values:
   - `SESSION_SECRET`: Generate a secure random string
   - `CLOUDINARY_URL`: From your Cloudinary dashboard
   - Firebase credentials: From Firebase Console > Project Settings > Service Accounts

### Step 2: Deploy to Render

1. Push your code to GitHub
2. Go to https://render.com and create a new Web Service
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: godivatech-backend
   - **Environment**: Node
   - **Build Command**: `chmod +x build-server.sh && ./build-server.sh`
   - **Start Command**: `node dist/index.js`
   - **Health Check Path**: `/api/health`
5. Add environment variables from your `.env` file
6. Deploy!

### Step 3: Note Your Backend URL

After deployment, Render will provide a URL like: `https://godivatech-backend.onrender.com`
You'll need this for the frontend configuration.

## Frontend Deployment (Vercel)

### Step 1: Configure Environment Variables

1. Copy `client/.env.example` to create your environment file
2. Update the values:
   - `VITE_API_URL`: Your Render backend URL
   - `VITE_SERVER_URL`: Same as VITE_API_URL
   - Firebase configuration: From Firebase Console > Project Settings > General

### Step 2: Deploy to Vercel

1. Go to https://vercel.com and import your GitHub repository
2. Configure the build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `./vercel-build.sh`
   - **Output Directory**: `client/dist`
   - **Install Command**: `npm install`
3. Add environment variables from your `client/.env` file
4. Deploy!

### Step 3: Configure Domain (Optional)

1. In Vercel dashboard, go to Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Post-Deployment Checklist

### Backend Verification
- [ ] Health check endpoint responds: `https://your-backend.onrender.com/api/health`
- [ ] API endpoints work: `https://your-backend.onrender.com/api/services`
- [ ] CORS is properly configured for your frontend domain

### Frontend Verification
- [ ] Website loads without errors
- [ ] API calls to backend work properly
- [ ] Images load from Cloudinary
- [ ] Contact form submissions work
- [ ] Admin authentication works

### Security Checklist
- [ ] Environment variables are not exposed in code
- [ ] HTTPS is enabled on both frontend and backend
- [ ] Session cookies are secure and httpOnly
- [ ] CORS is restricted to your frontend domain

## Troubleshooting

### Common Issues

1. **"Permission denied" for vercel-build.sh**
   - The script already has execute permissions set
   - If still issues, Vercel will automatically handle it

2. **API calls failing from frontend**
   - Check VITE_API_URL is set correctly in Vercel
   - Verify CORS settings in backend
   - Check browser console for specific errors

3. **Firebase errors**
   - Ensure all Firebase environment variables are set
   - Check Firebase project settings and quotas
   - Verify service account credentials for backend

4. **Build failures**
   - Check build logs in Vercel/Render dashboards
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

### Environment Variables Reference

#### Backend (Render)
```
NODE_ENV=production
PORT=10000
SESSION_SECRET=<generate-secure-random-string>
CLOUDINARY_URL=cloudinary://...
FIREBASE_API_KEY=...
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FRONTEND_URL=https://your-vercel-app.vercel.app
```

#### Frontend (Vercel)
```
VITE_API_URL=https://your-render-backend.onrender.com
VITE_SERVER_URL=https://your-render-backend.onrender.com
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

## Monitoring & Maintenance

### Render (Backend)
- Monitor health checks in Render dashboard
- Set up alerts for downtime
- Check logs for errors
- Monitor resource usage

### Vercel (Frontend)
- Use Vercel Analytics for performance monitoring
- Check build logs for warnings
- Monitor Web Vitals scores
- Set up error tracking (e.g., Sentry)

## Updating Deployments

### Backend Updates
1. Push changes to GitHub
2. Render will automatically rebuild and deploy
3. Monitor deployment logs for issues

### Frontend Updates
1. Push changes to GitHub
2. Vercel will automatically rebuild and deploy
3. Preview deployments available for branches

## Support

For deployment issues:
- Vercel: https://vercel.com/support
- Render: https://render.com/docs
- Firebase: https://firebase.google.com/support
- Cloudinary: https://cloudinary.com/documentation
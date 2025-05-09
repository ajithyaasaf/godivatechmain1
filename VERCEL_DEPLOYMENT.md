# Vercel Deployment Guide for GodivaTech

This guide will help you deploy your GodivaTech website on Vercel successfully, avoiding common errors.

## Pre-Deployment Checklist

1. ✓ Frontend schema file created (`client/src/lib/schema.ts`)
2. ✓ Import paths updated to use the frontend schema
3. ✓ Vercel configuration updated to handle server-side dependencies

## Deployment Steps

### 1. Push Your Code to GitHub

Make sure your latest code is pushed to your GitHub repository.

### 2. Connect Your Repository to Vercel

1. Log in to your Vercel account
2. Click "Add New" and select "Project"
3. Import your GitHub repository
4. Configure the project settings:

### 3. Configure Build Settings

Use these settings for your Vercel project:

- **Framework Preset**: Select "Vite"
- **Build Command**: `cd client && npm install && npm run vercel-build`
- **Output Directory**: `client/dist`
- **Install Command**: `npm install`

### 4. Set Environment Variables

Add the following environment variables:

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

Add any other environment variables your project needs.

### 5. Deploy

Click "Deploy" and wait for the build to complete.

## Troubleshooting

If you encounter any deployment errors:

1. **Missing Dependencies**: Make sure all necessary dependencies are installed during build
2. **Server Dependencies in Client**: Check that server-side dependencies are externalized in `vite.config.vercel.ts`
3. **Build Errors**: Review the build logs for specific errors

## Backend Deployment

For backend deployment, you'll need a separate service like Render.com or Railway.app. Configure environment variables to point your frontend to the correct backend API URL.

## Helpful Tips

- Use `import.meta.env.VITE_API_URL || 'http://localhost:5000'` to dynamically set API URLs
- Keep your schema decoupled between frontend and backend to avoid build issues
- Consider using monorepo tools like Turborepo for better project organization in the future
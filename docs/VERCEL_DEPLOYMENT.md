# Deploying to Vercel

This guide will walk you through deploying the GodivaTech application to Vercel as a single application.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Firebase project with appropriate configuration
3. Git repository with your project code

## Firebase Configuration

Before deploying, ensure your Firebase configuration is properly set up:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Make sure the following services are enabled in your Firebase project:
   - Authentication (with your chosen methods)
   - Firestore Database
   - Storage (if using file uploads)

3. Add your production domain to the Firebase authorized domains list:
   - Go to Authentication > Settings > Authorized domains
   - Add your Vercel domain (e.g., `your-app.vercel.app`) and any custom domains

## Environment Variables

You'll need to set up the following environment variables in Vercel:

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# If using Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# For session handling
SESSION_SECRET=a_long_random_string
```

## Deployment Steps

### Option 1: Deploy from the Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to your Vercel dashboard
3. Click "New Project"
4. Import your Git repository
5. Configure project:
   - Framework Preset: Vite
   - **Build Command: `./vercel-build.sh`** (important to use our custom build script)
   - Output Directory: `dist`
   - Install Command: `npm install`
6. Add environment variables
7. Click "Deploy"

### Option 2: Deploy using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Log in to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from your project directory:
   ```bash
   vercel
   ```

4. Follow the interactive prompts
   - Set the build command to `./vercel-build.sh`
   - Set the output directory to `dist`
   - Configure your environment variables

5. For production deployment:
   ```bash
   vercel --prod
   ```

## Fixing 404 Errors on Page Refresh

The project includes specific configurations to prevent 404 errors when refreshing pages in your deployed app:

1. Custom Vercel configuration in `vercel.json` with proper route handling
2. Public folder with redirect rules for SPA navigation
3. Custom build script (`vercel-build.sh`) that copies necessary files

If you're still experiencing 404 errors on page refresh after deployment:

1. Verify that the `vercel.json` file is at the root of your repository
2. Check that the build process is using the custom build script
3. Verify environment variables are properly set
4. Check Vercel's deployment logs for any errors during the build process

## Post-Deployment Verification

After deployment, verify that:

1. The website loads correctly
2. Refreshing the page works at any route without 404 errors
3. Firebase authentication works properly
4. Data is being fetched correctly from Firestore
5. All API endpoints are working properly

## Troubleshooting

### 404 Errors on Client-Side Routes

If you're getting 404 errors when refreshing the page on client-side routes:

1. Verify that `vercel.json` has the correct routing configuration
2. Check that public/_redirects file exists and contains `/*  /index.html  200`
3. Ensure the build script copied the public directory contents to the dist folder
4. Try clearing your browser cache or testing in incognito mode

### Firebase Connectivity Issues

If Firebase connections fail:

1. Verify Firebase configuration in your environment variables
2. Check that your Firebase project has the correct security rules
3. Ensure that the deployed domain is added to Firebase authorized domains
4. Inspect browser console for any CORS errors

### API Endpoints Not Working

If API endpoints are failing:

1. Check the Vercel logs to see if the server is starting correctly
2. Verify that the API routes are correctly configured in `vercel.json`
3. Test the API endpoints with tools like Postman or cURL
4. Make sure environment variables for API services are properly set

## Custom Domains

To add a custom domain:

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow Vercel's instructions to configure DNS settings
5. **Important:** Add the custom domain to Firebase authorized domains list

## Monitoring and Maintenance

After successful deployment:

1. Set up [Vercel Analytics](https://vercel.com/analytics) to monitor performance
2. Configure alerts for failed deployments or performance issues
3. Regularly update dependencies to patch security vulnerabilities
4. Monitor Firestore usage and quotas
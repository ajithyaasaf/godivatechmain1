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
   - Build Command: `npm run build`
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
   - Set the build command to `npm run build`
   - Set the output directory to `dist`
   - Configure your environment variables

5. For production deployment:
   ```bash
   vercel --prod
   ```

## Post-Deployment Verification

After deployment, verify that:

1. The website loads correctly
2. Firebase authentication works
3. Data is being fetched correctly from Firestore
4. Any cloud functions or server-side API endpoints are working

## Troubleshooting

### Server-Side Rendering Issues

If you encounter issues with server-side rendering, ensure the server-side code is properly configured to run in a serverless environment:

1. Check for any file system operations that might not work in a serverless environment
2. Make sure API routes don't rely on long-running processes
3. Verify that environment variables are correctly set up

### Firebase Connectivity Issues

If Firebase connections fail:

1. Verify Firebase configuration in your environment variables
2. Check that your Firebase project has the correct security rules
3. Ensure that the deployed domain is added to Firebase authorized domains

### Cold Start Performance

If the application experiences slow cold starts:

1. Consider implementing lazy loading for non-critical components
2. Optimize bundle size by analyzing with tools like `vite-bundle-analyzer`
3. Use edge caching where possible

## Monitoring and Maintenance

After successful deployment:

1. Set up [Vercel Analytics](https://vercel.com/analytics) to monitor performance
2. Configure alerts for failed deployments or performance issues
3. Regularly update dependencies to patch security vulnerabilities

## Custom Domains

To add a custom domain:

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow Vercel's instructions to configure DNS settings
5. Add the custom domain to Firebase authorized domains list

## Continuous Deployment

To set up continuous deployment:

1. Configure your Git repository with appropriate branch protection rules
2. Vercel will automatically deploy changes when you push to your main branch
3. Consider setting up preview deployments for pull requests
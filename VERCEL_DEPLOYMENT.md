# Deploying GodivaTech to Vercel

This guide explains how to deploy the GodivaTech website to Vercel.

## Prerequisites

- A Vercel account
- Git repository with your code
- Firebase project (for authentication and database)
- Cloudinary account (for image uploads)

## Setup Options

You have two options for deploying to Vercel:

### Option 1: Deploy from Git repository (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your project in Vercel:
   - Log in to your Vercel account
   - Click "Add New" → "Project"
   - Import your Git repository
   - Use these project settings:
     - Framework Preset: "Other"
     - Build Command: `npm run build`
     - Output Directory: `client/dist`
     - Install Command: `npm install`

### Option 2: Deploy with vercel-deploy-config.json

For more control over the deployment configuration, you can use the provided `vercel-deploy-config.json` file:

1. Rename `vercel-deploy-config.json` to `vercel.json`
2. Deploy from CLI using:
   ```
   vercel
   ```

## Environment Variables

Set these environment variables in the Vercel project settings:

```
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

SESSION_SECRET=a_random_string_for_session_security

VITE_API_URL=/api
NODE_ENV=production
```

## Serverless Compatibility

This project has been specially configured for Vercel's serverless environment:

- `server/vercel.js` - Serverless entry point
- `server/vercel-websocket.js` - WebSocket implementation that adapts to serverless environment
- Special handling for static file serving in serverless context

## Post-Deployment Checklist

After deployment:

1. Test all functionality:
   - Firebase authentication
   - Contact form submissions
   - Newsletter subscriptions
   - Admin dashboard access
   - Image uploads via Cloudinary

2. Add your Vercel deployment URL to Firebase authorized domains

3. Set up a custom domain in Vercel if needed

## Troubleshooting

- **API Issues**: Ensure your Vercel routes are configured correctly
- **Authentication Problems**: Verify Firebase configuration and authorized domains
- **WebSocket Limitations**: In serverless environments, WebSockets have limited functionality
- **Image Upload Failures**: Verify Cloudinary credentials and CORS settings
- **Environment Variables**: Double-check that all required environment variables are set

## Notes

- Vercel automatically handles HTTPS, CDN distribution, and global scaling
- The Firebase configuration is particularly important; make sure all keys are correctly set
- For increased performance and reliability, consider upgrading your Vercel plan
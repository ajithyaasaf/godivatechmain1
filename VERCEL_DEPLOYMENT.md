# Deploying GodivaTech to Vercel

This guide explains how to deploy the GodivaTech website to Vercel.

## Prerequisites

- A Vercel account
- Git repository with your code
- Firebase project (for authentication and database)
- Cloudinary account (for image uploads)

## Setup Steps

### 1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

Make sure your latest code is pushed to a Git repository that Vercel can access.

### 2. Import your project in Vercel

1. Log in to your Vercel account
2. Click "Add New" → "Project"
3. Import your Git repository
4. Configure the project settings:
   - Set the Framework Preset to "Other"
   - Set the Build Command to `npm run build`
   - Set the Output Directory to `client/dist`

### 3. Set Environment Variables

Add the following environment variables in the Vercel project settings:

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

### 4. Deploy

Click "Deploy" and wait for the build to complete.

## Post-Deployment

After deployment:

1. Test all functionality, especially:
   - Firebase authentication
   - Contact form submissions
   - Newsletter subscriptions
   - Admin dashboard access
   - Image uploads via Cloudinary

2. Set up a custom domain in Vercel if needed

## Troubleshooting

- **API Issues**: Check that your API routes are correctly prefixed with `/api`
- **Authentication Problems**: Verify Firebase configuration and authorized domains
- **WebSocket Issues**: WebSocket connection might need additional configuration for Vercel
- **Image Upload Failures**: Verify Cloudinary credentials and CORS settings

## Notes

- Vercel automatically handles HTTPS and CDN distribution
- You may need to add your Vercel deployment URL to Firebase authorized domains
- For large traffic, consider upgrading your Vercel plan
# Deploying GodivaTech Frontend to Vercel

This guide explains how to deploy the GodivaTech frontend to Vercel.

## Prerequisites

- A Vercel account (https://vercel.com)
- Your GodivaTech codebase (this repository)
- Backend deployed to Render (follow RENDER_DEPLOYMENT.md first)

## Frontend Deployment Steps

### 1. Prepare Your Repository

Your code should be in a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Deploy Only the Frontend (client directory)

There are two approaches to deploy just the frontend:

#### Option A: Deploy from the Subfolder (Recommended)

1. Log in to your Vercel account
2. Click "Add New" → "Project"
3. Import your Git repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

#### Option B: Create a Separate Repository for Frontend

Alternatively, you can clone just the client folder to a new repository:

```bash
git clone <your-repo-url> godivatech-frontend
cd godivatech-frontend
# Move client to root and remove everything else
mv client/* .
rm -rf server shared drizzle.config.ts ... # Remove all non-client files
git add .
git commit -m "Setup frontend-only repository"
git push
```

Then deploy this repository to Vercel.

### 3. Set Environment Variables

In the Vercel project settings, add the following environment variables:

```
VITE_API_URL=https://your-backend-url.onrender.com
```

Replace "your-backend-url.onrender.com" with your actual Render backend URL.

### 4. Deploy

Click "Deploy" and wait for the build to complete.

## Important Configuration Notes

### Using Environment Variables

The frontend is configured to use the `VITE_API_URL` environment variable to determine where to send API requests:

- In development, it will use relative URLs (e.g., `/api/blog-posts`)
- In production, it will prefix URLs with the backend URL (e.g., `https://your-backend.onrender.com/api/blog-posts`)

This configuration is managed in `client/src/lib/queryClient.ts`.

### CORS Configuration

The backend is configured to accept requests from the following origins:
- https://godivatech.vercel.app
- https://godiva-tech.vercel.app
- Any *.vercel.app domain (for preview deployments)

If you use a different domain for your frontend, you'll need to update the CORS configuration in `server/index.ts`.

## Testing Your Deployment

After deployment:

1. Open your Vercel deployment URL
2. Verify that the frontend loads correctly
3. Check that data is loading from the backend
4. Test functionality like contact form submission and newsletter signup

## Troubleshooting

### API Connection Issues

If the frontend can't connect to the backend:
1. Check the Network tab in browser DevTools for CORS errors
2. Verify that you've set `VITE_API_URL` correctly in Vercel
3. Check that your backend is running on Render
4. Ensure your backend allows requests from your frontend domain

### 404 Errors for Routes

If navigating to routes directly (e.g., /about) gives 404 errors:
1. Make sure your vercel.json has the proper rewrites configuration
2. Check that the `client/vercel.json` file was properly deployed

### General Issues

- Check Vercel build logs for any errors during deployment
- Try a fresh deployment if you've made recent changes
- Remember that the free tier of Render may have cold starts, causing initial API requests to be slow
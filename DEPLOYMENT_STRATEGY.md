# GodivaTech Deployment Strategy

This document explains the current deployment strategy for the GodivaTech website.

## Frontend-First Approach

We're using a **frontend-first** deployment approach:

1. **Frontend Deployment on Vercel:**
   - The React frontend is deployed on Vercel
   - Static assets are served directly by Vercel's CDN
   - Simplified API endpoints are provided via Vercel functions

2. **Backend Options:**
   - **Option A:** Deploy the backend separately on Render
   - **Option B:** Use Firebase/Firestore directly from the frontend

## Current Implementation

We've simplified the Vercel deployment to focus on the frontend, with these key changes:

1. **Modified vercel.json:**
   - Uses a simpler build configuration
   - Only builds and deploys the client portion
   - Sets up minimal API routes in `/api` directory

2. **API Stubs:**
   - Simple API endpoints that can be extended to proxy to a real backend
   - Placeholder endpoints that return sample data

## Why This Approach?

- **Avoids Complexity:** Separates frontend and backend deployment concerns
- **Prevents Build Issues:** Eliminates problems with server dependencies in the frontend build
- **Works with Vercel's Model:** Aligns better with Vercel's serverless architecture
- **Gives Flexibility:** Allows connecting to various backend options

## Next Steps

- Once the frontend is successfully deployed on Vercel, you can:
  - Deploy the backend on Render following the instructions in RENDER_DEPLOYMENT.md
  - Update the API endpoints to proxy to your Render backend
  - Add the BACKEND_URL environment variable in Vercel

## Environment Variables

Make sure to set these in your Vercel project settings:

- `FIREBASE_API_KEY` - Firebase API key
- `FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `FIREBASE_PROJECT_ID` - Firebase project ID
- `BACKEND_URL` - URL of your backend if using the split deployment approach

## Using This Deployment

The Vercel deployment provides:
- The complete frontend application
- Basic API endpoints that can be extended
- Firebase integration for authentication and database

You can access API endpoints at `/api` and `/api/example` to verify deployment.
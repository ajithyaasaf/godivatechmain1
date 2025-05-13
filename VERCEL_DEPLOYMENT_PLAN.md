# Vercel Deployment Plan for GodivaTech Website

This document outlines the comprehensive plan for deploying the GodivaTech website to Vercel, addressing the specific issues with Firebase authentication and data fetching in the Vercel environment.

## Deployment Architecture

We are implementing a split deployment strategy:

1. **Frontend**: Deployed on Vercel for global CDN distribution and optimal performance
2. **Backend**: Deployed on Render.com as a Node.js service

## Environment Variables

The following environment variables must be set in the Vercel project settings:

```
VITE_SERVER_URL=https://godivatech-backend.onrender.com
VITE_FIREBASE_API_KEY=AIzaSyDzIqWI6AApvWSE22y1Ug7h-8MysAo2fNw
VITE_FIREBASE_AUTH_DOMAIN=godiva-tech.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=godiva-tech
VITE_FIREBASE_STORAGE_BUCKET=godiva-tech.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=649431193457
VITE_FIREBASE_APP_ID=1:649431193457:web:0a3c06d75961a4b90de6c0
VITE_FIREBASE_MEASUREMENT_ID=G-W4RC2KFNS6
```

## Deployment Files

The following files have been created/updated to support Vercel deployment:

1. `vercel.json`: Configuration for Vercel build and runtime
2. `vercel-build.sh`: Custom build script for Vercel
3. `client/vite.config.vercel.ts`: Vercel-specific Vite configuration
4. `client/vercel-tailwind.config.js`: Vercel-specific Tailwind configuration

## Firebase Authentication

Firebase authentication issues in Vercel environment have been addressed by:

1. Enhanced error logging in Firebase auth operations
2. Explicit handling of authentication state
3. Added diagnostic tool to identify authentication issues

## Cross-Origin Resource Sharing (CORS)

CORS issues between Vercel frontend and Render backend have been addressed by:

1. Updated API routes in `vercel.json` to properly route API requests
2. Enhanced CORS configuration in the backend:
   - Added explicit allowlist for production domains (`www.godivatech.com`, `godivatech.com`) 
   - Implemented a custom CORS middleware to ensure headers are always present
   - Added special handling for preflight OPTIONS requests
3. Used environment variables to ensure consistent API URL handling

### Backend CORS Configuration

The backend server now uses a two-layer approach to handle CORS:

1. Standard CORS middleware with the following origins allowed in production:
   ```javascript
   [
     'https://godivatech.vercel.app',
     'https://godiva-tech.vercel.app',
     'https://www.godivatech.com',
     'https://godivatech.com',
     /\.vercel\.app$/
   ]
   ```

2. Custom middleware that explicitly adds CORS headers to every response:
   ```javascript
   res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
   res.header('Access-Control-Allow-Credentials', 'true');
   ```

This ensures that even if the standard CORS middleware doesn't match a request, the headers will still be set appropriately.

## Deployment Steps

### 1. Prepare Backend Deployment on Render.com

1. Create a new Web Service in Render
2. Link to the GitHub repository 
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variables (same as `.env` file)
6. Deploy the backend

### 2. Deploy Frontend to Vercel

1. Create a new project in Vercel
2. Link to the GitHub repository
3. Set the following build configuration:
   - Framework Preset: Other
   - Build Command: `./vercel-build.sh`
   - Output Directory: `client/dist`
4. Add all required environment variables
5. Deploy the project

## Troubleshooting

### Deployment Diagnostic Tool

We've created a Deployment Diagnostic tool accessible at `/admin/dashboard` (in the "Deployment Diagnostic" tab) that can help identify common deployment issues:

- Firebase configuration issues
- Authentication status
- API connectivity
- Environment information

### Common Issues and Solutions

1. **Firebase Authentication Fails**
   - Verify Firebase configuration in Vercel environment variables
   - Ensure Firebase project allows the Vercel domain in Authentication settings

2. **API Requests Fail (CORS Errors)**
   - Error: "Access to fetch at 'https://godivatech-backend.onrender.com/api/user' from origin 'https://www.godivatech.com' has been blocked by CORS policy"
   - Check `VITE_SERVER_URL` is set correctly in Vercel environment variables
   - Verify backend CORS settings include your domain (update allowedOrigins in server/index.ts)
   - Check backend server logs for CORS-related messages
   - Ensure backend is deployed and running
   - For quick testing, temporarily set `ALLOWED_ORIGINS=*` in Render environment variables

3. **CSS Styling Issues**
   - Tailwind configuration is different between environments
   - Check for specific theme-related issues

4. **Images/Assets Not Loading**
   - Asset paths may be different in production
   - CDN URLs might need updating

5. **Dynamic Require Errors**
   - Vercel doesn't support dynamic `require()` calls in configuration files
   - Use static imports and configuration values instead
   - Avoid file system operations (`fs.readFile`, etc.) in build configurations

6. **MIME Type Errors**
   - Error: "Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of 'text/html'"
   - Solution: Updated `vercel.json` with proper content-type headers
   - Set explicit MIME types for all JavaScript and CSS files
   - Added proper rollupOptions in vite.config.vercel.ts to ensure consistent file extensions

7. **Build Script Fails**
   - Check the build logs for detailed error information
   - Ensure all required configuration files exist
   - Verify proper Node.js and npm versions are being used
   
8. **Troubleshooting Tools**
   - Use the `/mime-test.html` page to diagnose MIME type issues
   - This page tests different script loading strategies and provides browser information

## Additional Resources

- **Firebase Authentication**: [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- **Vercel Environment Variables**: [Vercel Docs](https://vercel.com/docs/concepts/projects/environment-variables)
- **CORS Configuration**: [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

## Post-Deployment Verification

After deploying, verify the following functionality:

1. Home page loads with proper styling
2. Navigation works correctly
3. Blog posts load successfully
4. Service information displays properly
5. Admin login works
6. Admin dashboard loads and displays data
7. Content management functions operate correctly

If issues persist after following this plan, check the Deployment Diagnostic tool for specific error information.
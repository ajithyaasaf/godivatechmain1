# Deployment Troubleshooting Guide

This guide provides solutions for common issues you might encounter when deploying the GodivaTech application with the split architecture (Vercel frontend, Render backend).

## Vercel Frontend Deployment Issues

### Build Failures

**Issue**: Build fails with "No Output Directory named 'dist' found"
**Solution**:
1. Check your Vercel project settings and ensure:
   - Root Directory is set to `client`
   - Output Directory is set to `dist`
   - Framework Preset is set to `Vite`
2. Make sure your client's vite.config.ts has the correct output directory:
   ```js
   build: {
     outDir: "dist",
     emptyOutDir: true,
   }
   ```

**Issue**: CSS or assets are not loading properly
**Solution**:
1. Verify all import paths are using the correct aliases (@, @shared, @assets)
2. Check for relative path issues in CSS files
3. Ensure Tailwind is configured correctly

### API Connection Issues

**Issue**: Frontend can't connect to backend API
**Solution**:
1. Verify the VITE_SERVER_URL environment variable is set correctly in Vercel
2. Check network tab for CORS errors
3. Ensure the backend has the correct ALLOWED_ORIGINS setting
4. Test API endpoints directly to confirm they're accessible

### Authentication Problems

**Issue**: Login doesn't work in production
**Solution**:
1. Verify Firebase configuration is correct in both frontend and backend
2. Check for cookie/session issues (may need SameSite=None, Secure, etc.)
3. Ensure credentials: "include" is set for all API requests
4. Check if Firebase service account is correctly configured

## Render Backend Deployment Issues

### Build Failures

**Issue**: Build script fails
**Solution**:
1. Verify render-build.sh is executable (chmod +x render-build.sh)
2. Check Render logs for specific Node.js or package installation errors
3. Try adding specific Node version to package.json:
   ```json
   "engines": {
     "node": ">=18.0.0"
   }
   ```

### Server Start Issues

**Issue**: Server starts but crashes immediately
**Solution**:
1. Check Render logs for error messages
2. Verify all required environment variables are set
3. Check that Firebase credentials are properly formatted
4. Try running the start script locally to debug

### Database/Storage Issues

**Issue**: Can't connect to Firebase in production
**Solution**:
1. Verify all Firebase environment variables are properly set
2. Check if private key formatting is preserved (may need quotes or escaped newlines)
3. Verify IP restrictions aren't blocking Render servers
4. Check Firestore rules to ensure they allow access from your backend service

### CORS Issues

**Issue**: API requests blocked by CORS
**Solution**:
1. Verify ALLOWED_ORIGINS includes your Vercel domain
2. Check for typos in domain names
3. Configure CORS to handle all methods and headers your frontend uses
4. Temporary solution: set `origin: '*'` for testing, then restrict properly

## Advanced Debugging

### Vercel Deployment

1. Use Vercel CLI for local testing:
   ```bash
   npm install -g vercel
   cd client
   vercel dev
   ```

2. Check build output locally:
   ```bash
   cd client
   npm run build
   ls -la dist
   ```

### Render Deployment

1. Test your application in a Docker container locally:
   ```bash
   docker run -it --rm -v $(pwd):/app -w /app node:18 bash
   chmod +x render-build.sh
   ./render-build.sh
   ./render-start.sh
   ```

2. Add more verbose logging to server/index.ts:
   ```ts
   console.log('Environment variables loaded:', {
     nodeEnv: process.env.NODE_ENV,
     hasFirebaseConfig: !!process.env.FIREBASE_PROJECT_ID,
     cloudinaryConfig: !!process.env.CLOUDINARY_CLOUD_NAME,
     allowedOrigins: process.env.ALLOWED_ORIGINS
   });
   ```

## Health Checks

When everything is deployed:

1. Backend API health check:
   ```bash
   curl https://godivatech-backend.onrender.com/api/health
   ```

2. Test cross-domain requests:
   ```bash
   curl -H "Origin: https://godivatech.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS --verbose \
     https://godivatech-backend.onrender.com/api/health
   ```

3. Verify environment variables are accessible:
   ```bash
   # Add a temporary debug endpoint to your server
   app.get('/api/debug', (_req, res) => {
     res.json({
       nodeEnv: process.env.NODE_ENV,
       hasFirebaseConfig: !!process.env.FIREBASE_PROJECT_ID,
       hasCloudinary: !!process.env.CLOUDINARY_CLOUD_NAME,
     });
   });
   ```
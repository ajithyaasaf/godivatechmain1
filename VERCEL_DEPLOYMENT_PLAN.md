# Vercel Deployment Plan for GodivaTech

This deployment plan addresses the specific issues encountered when deploying the GodivaTech application to Vercel, particularly focusing on Firestore data fetching and authentication functionality.

## Pre-Deployment Configuration

### 1. Vercel Project Setup

1. **Create a new Vercel project** by importing the GitHub repository
2. **Configure Build Settings**:
   - Framework Preset: Vite
   - Build Command: `cd client && npm install && npm run vercel-build`
   - Output Directory: `client/dist`
   - Install Command: `npm install`

### 2. Environment Variables Configuration

Add all Firebase environment variables to your Vercel project settings:

```
VITE_FIREBASE_API_KEY=AIzaSyDzIqWI6AApvWSE22y1Ug7h-8MysAo2fNw
VITE_FIREBASE_AUTH_DOMAIN=godiva-tech.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=godiva-tech
VITE_FIREBASE_STORAGE_BUCKET=godiva-tech.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=801444351245
VITE_FIREBASE_APP_ID=1:801444351245:web:f030b472d6fb7be3d4f444
VITE_FIREBASE_MEASUREMENT_ID=G-KHE7CZP6EZ
VITE_SERVER_URL=https://godivatech-backend.onrender.com
VITE_DEBUG_MODE=true
```

Add `VITE_DEBUG_MODE=true` temporarily to enable the Firebase configuration test in production.

### 3. Firebase Console Configuration

1. **Authentication Domain Authorization**:
   - Go to Firebase Console > Authentication > Settings
   - Add your Vercel domain (e.g., `your-app.vercel.app`) to the Authorized Domains list

2. **Firestore Security Rules**:
   - Go to Firebase Console > Firestore Database > Rules
   - Ensure rules allow read access to all collections
   - Example rules:
     ```
     service cloud.firestore {
       match /databases/{database}/documents {
         match /{document=**} {
           allow read;
           allow write: if request.auth != null;
         }
       }
     }
     ```

## Deployment Process

### 1. Backend Deployment (Render.com)

1. Ensure your backend server is deployed and accessible at `https://godivatech-backend.onrender.com`
2. Verify the backend has appropriate CORS configuration to accept requests from your Vercel domain:
   ```javascript
   app.use(cors({
     origin: ['https://your-app.vercel.app', 'http://localhost:5000'],
     credentials: true
   }));
   ```

### 2. Frontend Deployment (Vercel)

1. Push the latest code to GitHub
2. Connect your GitHub repository to Vercel
3. Configure environment variables as outlined above
4. Deploy the application

## Post-Deployment Verification

After deployment, use the following steps to verify everything is working correctly:

### 1. Firebase Configuration Verification

The enhanced code now includes a Firebase configuration test that will run when `VITE_DEBUG_MODE=true` is set. Check your browser console for output from this test, which will verify:

- Firebase app initialization
- Environment variables presence
- Firestore connection and read capabilities
- Authentication service availability
- API Base URL configuration

### 2. Functionality Testing

Systematically test the following functionality:

1. **Homepage and Navigation**: Verify all pages load correctly
2. **Data Fetching**: Check that all dynamic content loads (blog posts, services, projects)
3. **Authentication**: Test login functionality in the admin area
4. **Admin Operations**: Test CRUD operations if you have admin access

### 3. Error Diagnosis and Resolution

If any issues are encountered:

1. **Check Console Logs**: The enhanced error logging will provide detailed information about:
   - Firebase configuration issues
   - Authentication errors
   - Firestore data fetching problems
   - Environment-specific details

2. **API Connection Issues**:
   - Verify network requests in the browser's Network tab
   - Confirm CORS is properly configured
   - Check that API endpoints are correctly formatted with the base URL

3. **Authentication Issues**:
   - Verify token handling in the browser console
   - Check Firebase Authentication logs in the Firebase Console
   - Ensure the Vercel domain is authorized in Firebase

## Troubleshooting Common Issues

### 1. "Firebase is not initialized" or "App named '[DEFAULT]' already exists"

**Solution**: This typically indicates an issue with Firebase initialization timing.
- Check the console for detailed error messages from the Firebase config test
- Verify that Firebase is initialized only once in the application lifecycle

### 2. "Missing or insufficient permissions" in Firestore

**Solution**: This indicates security rules issues.
- Review Firestore security rules in Firebase Console
- Ensure the rules allow read access for collections being accessed
- Check authentication state if write operations are failing

### 3. Authentication Fails Only in Production

**Solution**: This often relates to domain authorization.
- Add the Vercel domain to Firebase Authentication Authorized Domains
- Check for any CORS issues in the browser console
- Verify that authentication tokens are being properly stored and transmitted

### 4. CORS Errors When Accessing Backend

**Solution**: Backend CORS configuration needs to be updated.
- Ensure the backend CORS settings include the Vercel domain
- Check that credentials are properly handled on both client and server

## Reverting to Development Mode

After confirming everything works correctly in production:

1. Set `VITE_DEBUG_MODE=false` or remove it in Vercel environment variables
2. Redeploy the application

This will disable the verbose debugging but maintain the enhanced error handling for future diagnostics.
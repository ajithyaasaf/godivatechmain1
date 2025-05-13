# Vercel Troubleshooting Guide for GodivaTech

This guide addresses specific issues that may occur when deploying the GodivaTech application on Vercel, especially problems with Firestore data fetching and authentication.

## Common Issues and Solutions

### 1. Firebase Authentication Not Working

**Symptoms:**
- Users cannot log in on the deployed Vercel site
- Admin page shows authentication errors
- Console errors related to Firebase authentication

**Solutions:**

1. **Verify Environment Variables:**
   ```
   VITE_FIREBASE_API_KEY
   VITE_FIREBASE_AUTH_DOMAIN
   VITE_FIREBASE_PROJECT_ID
   VITE_FIREBASE_STORAGE_BUCKET
   VITE_FIREBASE_MESSAGING_SENDER_ID
   VITE_FIREBASE_APP_ID
   VITE_FIREBASE_MEASUREMENT_ID
   ```
   
   Ensure these are correctly set in Vercel's project settings under the "Environment Variables" section.

2. **Check Firebase Authentication Settings:**
   - Go to your Firebase console > Authentication > Sign-in methods
   - Ensure Email/Password authentication is enabled
   - Under "Authorized domains," add your Vercel domain (e.g., `your-app.vercel.app`)

3. **CORS Configuration:**
   - Firebase authentication may fail due to CORS issues
   - In Firebase console, go to Authentication > Settings > Authorized domains
   - Add your Vercel domain (e.g., `your-app.vercel.app`)

### 2. Firestore Data Fetching Issues

**Symptoms:**
- Empty data on pages that should display content
- Console errors related to Firestore queries
- Data appears in Replit but not in Vercel deployment

**Solutions:**

1. **Verify Firebase Project Configuration:**
   - Ensure you're using the same Firebase project in both environments
   - Check if Firestore security rules allow read access:
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

2. **API Base URL Configuration:**
   - In `vercel.json`, ensure `VITE_SERVER_URL` points to your backend
   - Check the Render.com backend is properly configured and accessible

3. **Cross-Origin Requests:**
   - The backend needs to have proper CORS configuration for your Vercel domain
   - Ensure your backend allows requests from your Vercel domain

### 3. Mixed Environment Configuration

**Problem:**
Different environment variables between Replit and Vercel can cause inconsistent behavior.

**Solution:**
Create a `.env.example` file with all required variables and use it as a reference for both environments.

## Deployment Checklist

Before deploying to Vercel, complete this checklist:

1. ☐ All Firebase environment variables are properly configured
2. ☐ Backend URL (VITE_SERVER_URL) is correctly set in Vercel
3. ☐ Firebase project has the Vercel domain added to authorized domains
4. ☐ Firestore security rules allow appropriate access
5. ☐ Backend CORS settings allow requests from the Vercel domain

## Testing the Deployment

After deploying, systematically test:

1. ☐ Home page loads correctly with all content
2. ☐ Blog posts and other dynamic content appear
3. ☐ Authentication works (log in to admin area)
4. ☐ Admin functions (create/edit/delete content) work properly

## Getting Additional Help

If issues persist:

1. Check browser console for specific error messages
2. Review Vercel deployment logs for build errors
3. Verify Firebase console logs for authentication issues
4. Use development tools to inspect network requests and responses
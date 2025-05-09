# GodivaTech Deployment Checklist

Use this checklist to ensure a smooth deployment process for your GodivaTech website. Check off each item as you complete it.

## Pre-Deployment Tasks

### Account Setup
- [ ] Create a Vercel account (for frontend or full-stack deployment)
- [ ] Create a Render account (if using split deployment)
- [ ] Ensure your Firebase project is set up and ready
- [ ] Confirm your Cloudinary account is active

### Code Preparation
- [ ] Ensure all code changes are committed to your repository
- [ ] Run the application locally to confirm it works as expected
- [ ] Test all features, especially forms and dynamic content
- [ ] Check responsive design on mobile and tablet

### Environment Variables
- [ ] Copy `.env.example` to `.env` and fill in actual values
- [ ] Gather all Firebase project settings from Firebase Console
- [ ] Get Cloudinary credentials from Cloudinary Dashboard
- [ ] Generate a strong SESSION_SECRET (you can use an online generator)

## Deployment Process

### For Full-Stack Deployment on Vercel
- [ ] Push your code to a Git repository (GitHub/GitLab/Bitbucket)
- [ ] Import project in Vercel dashboard
- [ ] Configure build settings as specified in the deployment guide
- [ ] Add all environment variables
- [ ] Deploy the application
- [ ] Test the deployed application

### For Split Deployment (Backend on Render, Frontend on Vercel)
- [ ] Deploy backend to Render first
- [ ] Add backend environment variables to Render
- [ ] Test API endpoints from the deployed backend
- [ ] Note the backend URL for frontend configuration
- [ ] Update VITE_API_URL in frontend environment variables
- [ ] Deploy frontend to Vercel
- [ ] Add frontend environment variables to Vercel
- [ ] Test the complete application

## Post-Deployment Tasks

### Testing
- [ ] Test navigation across all pages
- [ ] Test contact form submission
- [ ] Test blog functionality
- [ ] Test admin login (if implemented)
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices

### Firebase Setup
- [ ] Add your deployment URL to Firebase authorized domains
- [ ] Check Firebase security rules for production use
- [ ] Test Firebase authentication on the deployed site

### Domain Setup (Optional)
- [ ] Configure custom domain in Vercel/Render
- [ ] Set up DNS records as instructed
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Update authorized domains in Firebase if using custom domain

### Monitoring
- [ ] Check error logs in Vercel/Render dashboards
- [ ] Set up uptime monitoring (optional)
- [ ] Share the application URL with stakeholders

## Troubleshooting Reference

If you encounter issues during deployment, refer to the `UPDATED_DEPLOYMENT_GUIDE.md` troubleshooting section for common problems and solutions.

## Notes:

* For firebase errors: Check that your Firebase configuration matches exactly what's shown in the Firebase Console
* For image issues: Verify Cloudinary settings and CORS configuration
* For API errors: Check server logs in Vercel/Render dashboard
# GodivaTech Deployment Guide

This README provides instructions for deploying the GodivaTech website. The application uses a **split architecture**:

- **Frontend**: React application deployed on Vercel
- **Backend**: Node.js/Express API deployed on Render

## Prerequisites

- GitHub repository with your code
- Vercel account
- Render account
- Firebase credentials
- Cloudinary account

## Deployment Options

There are two deployment approaches available:

1. **Monolithic Deployment** - Deploy both frontend and backend together
2. **Split Deployment** - Deploy frontend and backend separately (recommended)

## Option 1: Monolithic Deployment

For simpler deployment where both frontend and backend are deployed together:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel
4. Deploy

This option is simpler but less flexible.

## Option 2: Split Deployment (Recommended)

For more scalable and flexible deployment:

### Step 1: Backend Deployment on Render

Follow the instructions in [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) to deploy your backend API to Render.

### Step 2: Frontend Deployment on Vercel

Follow the instructions in [CLIENT_DEPLOYMENT.md](./CLIENT_DEPLOYMENT.md) to deploy your frontend to Vercel.

### Step 3: Connect Frontend and Backend

After deploying both services, ensure the frontend is properly connected to the backend by setting the `VITE_SERVER_URL` environment variable in Vercel to point to your Render backend URL.

## Important Configuration Files

- **render.yaml**: Render Blueprint configuration
- **vercel.json**: Vercel deployment configuration
- **client/vercel.json**: Frontend-specific Vercel configuration

## Environment Variables

### Backend (Render) Environment Variables

```
NODE_ENV=production
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_CERT_URL=your-client-cert-url
CLOUDINARY_CLOUD_NAME=doeodacsg
CLOUDINARY_API_KEY=269267633995791
CLOUDINARY_API_SECRET=wUw9Seu6drQEIbQ1tAvYeVyqHdU
SESSION_SECRET=your-session-secret
ALLOWED_ORIGINS=https://godivatech.vercel.app,https://www.godivatech.com
```

### Frontend (Vercel) Environment Variables

```
VITE_SERVER_URL=https://godivatech-backend.onrender.com
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
VITE_FIREBASE_APP_ID=your-firebase-app-id
```

## Troubleshooting

If you encounter issues during deployment, refer to [DEPLOYMENT_TROUBLESHOOTING.md](./DEPLOYMENT_TROUBLESHOOTING.md) for solutions to common problems.

## Development vs Production

The application automatically detects the environment and configures itself accordingly:

- **Development**: Uses local API endpoints
- **Production**: Uses the configured `VITE_SERVER_URL` for API requests

## Monitoring and Maintenance

- **Vercel**: Provides built-in analytics and monitoring
- **Render**: Offers logs and metrics for your backend service

## Security Considerations

- Ensure Firebase credentials are securely stored as environment variables
- CORS is configured to only allow requests from approved origins
- Session secrets should be strong, unique values

## Future Improvements

- Set up CI/CD pipelines for automated testing and deployment
- Configure custom domains for both frontend and backend
- Implement monitoring and alerting
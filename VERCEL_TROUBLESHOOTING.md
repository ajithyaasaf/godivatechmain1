# Vercel Deployment Troubleshooting

If you encounter errors during deployment to Vercel, here are some common issues and their solutions:

## Function Invocation Failed Error (500 Internal Server Error)

If you see an error message like this:
```
500: INTERNAL_SERVER_ERROR
Code: FUNCTION_INVOCATION_FAILED
```

Here are the most common causes and solutions:

### 1. Missing Environment Variables

This is the most common cause. Make sure you've set all required environment variables in the Vercel project settings:

Required variables:
- FIREBASE_API_KEY
- FIREBASE_AUTH_DOMAIN
- FIREBASE_PROJECT_ID
- FIREBASE_STORAGE_BUCKET
- FIREBASE_MESSAGING_SENDER_ID
- FIREBASE_APP_ID
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- SESSION_SECRET

### 2. Check Environment Variables

After deploying, check the environment by visiting:
```
https://your-vercel-deployment-url/api/check-env
```

This will show which environment variables are missing.

### 3. Memory/Size Limitations

Vercel has limits on function size and memory. Try these solutions:
- Use the simplified server (vercel-simplified.js)
- Disable the WebSocket server in production
- Split large functions into smaller ones

### 4. Node.js Version

Ensure you're using a compatible Node.js version:
- Go to Vercel Project Settings → General → Node.js Version
- Set it to 18.x or later

### 5. Deploy with Different Build Settings

Try using these manual build settings in Vercel:
- Build Command: `npm run build`
- Output Directory: `client/dist`
- Install Command: `npm install`

### 6. Check Logs in Vercel Dashboard

For detailed error messages:
1. Go to your Vercel dashboard
2. Select your project
3. Go to "Deployments" tab
4. Click on the latest deployment
5. Go to "Functions" tab
6. Click on the function with the error
7. Check the logs for specific error messages

### 7. Use the Vercel CLI for Local Testing

Install the Vercel CLI and test locally:
```
npm i -g vercel
vercel dev
```

This can help identify issues before deploying.
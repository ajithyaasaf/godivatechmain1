# GodivaTech Website

A modern, animated website for GodivaTech with SEO optimization, a CMS, and a blog system, built with React, Vite, and Firebase.

## Features

- 🔥 Firebase integration for authentication and data storage
- 📱 Responsive design for all devices
- ✨ Modern animations with Framer Motion
- 📊 Admin dashboard for content management
- 📝 Blog system with categories
- 🔐 Dual authentication system (traditional + Firebase)
- 📂 Project portfolio showcase
- 🧑‍💼 Team member profiles
- 📞 Contact form with message management

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up Firebase:
   - Create a Firebase project at [firebase.google.com](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password) and Firestore database
   - Create a `.env` file based on `.env.example` with your Firebase configuration
4. Start the development server: `npm run dev`

## Authentication Options

The website features a dual authentication system:

1. **Traditional Authentication**: Username/password authentication stored in your database
2. **Firebase Authentication**: Email/password authentication using Firebase's secure auth system

Both authentication methods allow access to the admin dashboard. The system automatically checks both methods, so users can use whichever they prefer.

### Setting Up Firebase Authentication

To use Firebase Authentication:

1. Go to the Firebase console, select your project
2. Go to Authentication > Sign-in methods
3. Enable Email/Password authentication
4. Add authorized domains for your application
5. Ensure your `.env` file contains the required Firebase configuration:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Project Structure

- `client/`: Frontend React application
  - `src/components/`: Reusable UI components
  - `src/pages/`: Page components
  - `src/hooks/`: Custom React hooks
  - `src/lib/`: Utility functions and configuration
- `server/`: Backend Express server
- `shared/`: Shared types and schemas

## Admin Dashboard

Access the admin dashboard at `/admin` after authenticating. From there, you can:

- Manage blog posts and categories
- Update services offered
- Edit team member information
- Manage projects in your portfolio
- View contact form submissions
- View newsletter subscribers
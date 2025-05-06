# GodivaTech Website Architecture

## Overview

The GodivaTech website is a modern, animated website built with React, Vite, and Firebase. It features a content management system (CMS), blog functionality, portfolio showcasing, and SEO optimization. The application uses a dual authentication system, allowing both traditional username/password login and Firebase authentication.

The architecture follows a full-stack JavaScript/TypeScript approach with a Vite-powered React frontend and a Node.js Express backend. Firebase is used as the primary data store, with Firestore handling document storage and Firebase Authentication providing user management capabilities.

## System Architecture

### Frontend Architecture

The frontend is built with React and uses Vite as the build tool and development server. The application follows a component-based architecture with the following organization:

- **Pages**: Represent different routes in the application
- **Components**: Reusable UI elements
- **Hooks**: Custom React hooks for shared functionality
- **Lib**: Utility functions and service integrations

The frontend uses the following key technologies:
- **React**: UI library
- **Framer Motion**: Animation library
- **Wouter**: Lightweight routing
- **TanStack Query**: Data fetching and state management
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/UI**: Component library built on Radix UI

### Backend Architecture

The backend is a Node.js Express server that serves the compiled frontend assets and provides API endpoints. The server is structured as follows:

- **API Routes**: Express routes for data access
- **Authentication**: User login and session management
- **Firestore Integration**: Data access layer for Firebase Firestore
- **Image Upload**: Integration with Cloudinary for image storage

### Data Storage

The application uses the following data storage solutions:

1. **Firebase Firestore**: Primary document database for storing structured content including:
   - Blog posts
   - Categories
   - Projects
   - Services
   - Team members
   - Testimonials
   - Contact messages
   - Subscribers

2. **Firebase Authentication**: User authentication and management

3. **Cloudinary**: Cloud-based image storage and transformation service

4. **Memory-based Session Store**: For traditional authentication sessions

## Key Components

### Frontend Components

1. **Pages**
   - Public-facing pages (Home, About, Services, Portfolio, Blog, Contact)
   - Admin dashboard and content management pages
   - Authentication pages

2. **Layout Components**
   - Header with navigation
   - Footer
   - Page transitions
   - Parallax sections

3. **UI Components**
   - Form elements
   - Cards
   - Buttons
   - Modals
   - Toast notifications

4. **Animation Components**
   - Page transitions
   - Parallax effects
   - Particle backgrounds

### Backend Components

1. **API Routes**
   - CRUD operations for all content types
   - Authentication endpoints
   - Image upload handling

2. **Authentication System**
   - Traditional username/password authentication with sessions
   - Firebase Authentication integration

3. **Storage Adapters**
   - Firestore adapter for document storage
   - Cloudinary adapter for image storage

## Data Flow

1. **Content Retrieval Flow**
   - Frontend requests data through React Query
   - Express server handles API requests
   - Server retrieves data from Firestore
   - Data is transformed and returned to the client
   - React Query caches the data on the client

2. **Content Management Flow**
   - Admin creates/updates content via admin interface
   - Form data is validated on the client
   - Data is sent to the server API
   - Server validates the data and updates Firestore
   - Frontend receives success/error response and updates UI

3. **Authentication Flow**
   - Dual authentication paths:
     - Traditional: Username/password sent to Express, validated against stored credentials
     - Firebase: Direct authentication through Firebase Authentication service
   - Session maintained for authenticated users
   - Protected routes check authentication status before rendering

4. **Image Upload Flow**
   - Images uploaded from the client (base64 or file)
   - Sent to the server
   - Server uploads to Cloudinary
   - Cloudinary URL returned and stored with content

## External Dependencies

### Firebase
- **Firestore**: Document database 
- **Firebase Authentication**: User authentication
- **Firebase Storage**: Object storage (optional)

### Cloudinary
- Image storage and transformation
- Used for optimizing and serving responsive images

### Replit Integration
- Configured for deployment on Replit's platform
- Using Replit's web and Node.js modules

## Database Schema

The application uses Firestore collections with the following structure:

1. **users**
   - id: unique identifier
   - username: unique username
   - password: hashed password

2. **categories**
   - id: unique identifier
   - name: category name
   - slug: URL-friendly name

3. **blog_posts**
   - id: unique identifier
   - title: post title
   - slug: URL-friendly title
   - excerpt: short description
   - content: main post content
   - published: boolean flag
   - authorName: name of the author
   - authorImage: URL to author image
   - coverImage: URL to cover image
   - publishedAt: timestamp
   - categoryId: reference to category

Similar schemas exist for projects, services, team members, testimonials, contact messages, and subscribers.

## Authentication and Authorization

The application uses a dual authentication system:

1. **Traditional Authentication**
   - Username/password stored in the database
   - Express sessions for maintaining login state
   - Passwords hashed using scrypt with salt

2. **Firebase Authentication**
   - Email/password authentication
   - Firebase handles credential storage and verification
   - Firebase Auth tokens for session management

Protected routes in both the frontend and backend check for authenticated sessions before allowing access.

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

1. **Development Environment**
   - Vite dev server with HMR for frontend
   - Express server with API endpoints
   - Local environment variables

2. **Production Build**
   - Vite builds the frontend assets
   - ESBuild bundles the server code
   - Assets served by Express static middleware

3. **Deployment Process**
   - Build command: `npm run build`
   - Start command: `npm run start`
   - Environment variables configured in Replit

The deployment uses Replit's autoscale features for handling traffic and Replit's persistent storage for the application.

## Design Patterns

The application follows several key design patterns:

1. **Component Composition**: UI built from nested, reusable components
2. **Custom Hooks**: Shared logic extracted into reusable hooks
3. **Context Providers**: Global state management with React Context
4. **Repository Pattern**: Data access abstracted behind repository interfaces
5. **Adapter Pattern**: Third-party services wrapped in adapter interfaces

## Future Considerations

1. **Database Migration**: Though Drizzle is configured, it's not actively used. The application is prepared for potential migration to PostgreSQL.

2. **Service Worker**: Adding offline capabilities could enhance the user experience.

3. **Serverless Functions**: Some API routes could be migrated to serverless functions for better scalability.

4. **SSR/SSG**: Implementing server-side rendering or static site generation could improve SEO and performance.
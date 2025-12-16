# GodivaTech Website

## Overview
GodivaTech is a modern, full-stack web application for a technology company, featuring a React frontend, a Node.js/Express backend, and Firebase for authentication and data storage. It includes both a public-facing website to showcase services, projects, and blog content, and an administrative dashboard for content management. The project aims to provide a robust online presence with a focus on performance, SEO, and secure content delivery.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, Radix UI, shadcn/ui
- **Animations**: Framer Motion
- **Routing**: Wouter
- **State Management**: TanStack Query (React Query)
- **Authentication**: Dual system (traditional + Firebase Auth)
- **Performance**: Code splitting, lazy loading, image optimization, SEO
- **UI/UX**: Emphasis on modern design, smooth transitions, and responsive layouts.

### Backend
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js
- **Database**: Drizzle ORM for PostgreSQL (with in-memory fallback)
- **Authentication**: Session-based with Firebase integration
- **File Storage**: Cloudinary for image management
- **Real-time**: WebSocket server for dynamic features

### Key Features
- **Public Website**: Homepage, About, Services, Portfolio, Blog, Contact pages.
- **Admin Dashboard**: Content (CRUD for posts, services, projects), User, and Media management.
- **SEO-Friendly Blog System**: 
  - Rich text editor with H1-H4 heading toolbar
  - SEO fields: meta title, meta description, focus keyword, image alt text, tags
  - Real-time SEO checklist with character counters and validation
  - Structured data (JSON-LD) for search engine optimization
- **Data Flow**: Frontend uses TanStack Query for API interactions; Backend handles routing, database, and authentication.

## External Dependencies

### Core Technologies
- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Radix UI, Framer Motion, Wouter, TanStack Query, React Hook Form, Zod.
- **Backend**: Express, Drizzle ORM, Node.js, CORS.

### Third-Party Services
- **Firebase**: Authentication, Firestore (database), hosting.
- **Cloudinary**: Image storage, transformation, CDN.
- **Neon Database**: PostgreSQL hosting (production).
- **Render**: Backend deployment.
- **Vercel**: Frontend deployment.

### Development Tools
- **TypeScript**: Type safety.
- **ESLint/Prettier**: Code quality and formatting.
- **PostCSS**: CSS processing.
- **Drizzle Kit**: Database schema management.
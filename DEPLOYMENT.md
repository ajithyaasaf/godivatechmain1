# GodivaTech Deployment Guide (Unified Vercel Serverless)

This guide explains how to deploy the GodivaTech website as a unified serverless application on **Vercel** (Frontend + Express API Serverless Functions).

## Architecture Overview

- **Frontend**: React + Vite SPA deployed on Vercel Global CDN
- **Backend API**: Express API hosted as Vercel Serverless Functions (`api/index.ts`)
- **Database**: Firebase Firestore (managed cloud NoSQL)
- **Media Storage**: Cloudinary (CDN image delivery)
- **Authentication**: Firebase Auth + Session-based admin auth

---

## Prerequisites

1. GitHub repository connected to Vercel
2. Vercel account (https://vercel.com)
3. Firebase project with Firestore enabled
4. Cloudinary account for media uploads

---

## Vercel Deployment Steps

### Step 1: Configure Environment Variables in Vercel

In your **Vercel Project Dashboard** > **Settings** > **Environment Variables**, add the following:

#### Core Firebase Configuration
- `FIREBASE_PROJECT_ID`: `godiva-tech`
- `FIREBASE_API_KEY`: *(Your Firebase API Key)*
- `FIREBASE_AUTH_DOMAIN`: `godiva-tech.firebaseapp.com`
- `FIREBASE_STORAGE_BUCKET`: `godiva-tech.appspot.com`
- `FIREBASE_MESSAGING_SENDER_ID`: *(Your Sender ID)*
- `FIREBASE_APP_ID`: *(Your Firebase App ID)*

#### Cloudinary Configuration
- `CLOUDINARY_CLOUD_NAME`: `doeodacsg`
- `CLOUDINARY_API_KEY`: *(Your Cloudinary API Key)*
- `CLOUDINARY_API_SECRET`: *(Your Cloudinary API Secret)*

#### Application Secrets
- `SESSION_SECRET`: *(A secure random 32+ character string)*
- `NODE_ENV`: `production`

---

### Step 2: Vercel Project Settings

- **Framework Preset**: Vite
- **Root Directory**: `./` (Project Root)
- **Build Command**: `npm run build:frontend` (or `vite build`)
- **Output Directory**: `dist/public`
- **Install Command**: `npm install`

---

### Step 3: Deploy

Push your code to GitHub `main` branch. Vercel will automatically build the frontend assets to `dist/public` and mount the Serverless API at `/api`.

---

## Post-Deployment Verification Checklist

- [ ] Homepage loads with high performance: `https://godivatech.com`
- [ ] Serverless Health Check returns OK: `https://godivatech.com/api/health`
- [ ] Services API responds: `https://godivatech.com/api/services`
- [ ] Projects API responds: `https://godivatech.com/api/projects`
- [ ] Blog API responds: `https://godivatech.com/api/blog-posts`
- [ ] Dynamic XML Sitemap works: `https://godivatech.com/sitemap.xml`
- [ ] Robots.txt works: `https://godivatech.com/robots.txt`
- [ ] Contact Form submission succeeds
- [ ] Privacy Policy (`/privacy`) and Terms (`/terms`) load without 404s
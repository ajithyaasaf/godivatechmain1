# Production Cleanup Plan for GodivaTech Website

This document identifies unnecessary files and components that can be safely removed from the codebase when preparing for production deployment. Removing these files will improve build times, reduce bundle size, and simplify maintenance.

## Redundant Performance Libraries

Several performance-related files have overlapping functionality:

- **To Remove**:
  - `client/src/lib/bundleOptimizer.ts` - Redundant with Vite's built-in optimizations
  - `client/src/lib/cssMinifier.ts` - Redundant with PostCSS/cssnano
  - `client/src/lib/jsOptimizer.ts` - Redundant with Vite's code splitting
  - `client/src/lib/fontOptimizer.ts` - Core functionality moved to performance.ts
  - `client/src/lib/imageLazyLoading.ts` - Moved to performance.ts

- **Keep**:
  - `client/src/lib/performance.ts` - Consolidated optimization utilities
  - `client/src/components/performance/OptimizedImage.tsx` - Core component for image optimization

## Duplicate Deployment Files

Multiple deployment files with similar or outdated information:

- **To Remove**:
  - `CLIENT_DEPLOYMENT.md` - Redundant with DEPLOYMENT_STRATEGY.md
  - `DEPLOYMENT.md` - Replaced by more specific guides
  - `DEPLOYMENT_CHECKLIST.md` - Keep this one for reference
  - `DEPLOYMENT_TROUBLESHOOTING.md` - Keep this one for reference
  - `UPDATED_DEPLOYMENT_GUIDE.md` - Redundant with newer guides
  - `VERCEL_DEPLOYMENT.md` - Redundant with DEPLOYMENT_STRATEGY.md
  - `VERCEL_DEPLOYMENT_PLAN.md` - Outdated
  - `VERCEL_TROUBLESHOOTING.md` - Merge useful content into DEPLOYMENT_TROUBLESHOOTING.md
  - `VERCEL_UI_DEPLOYMENT.md` - Redundant
  - `RENDER_DEPLOYMENT.md` - Keep if using Render for backend

- **Keep**:
  - `DEPLOYMENT_STRATEGY.md` - Current deployment strategy
  - `FULL_STACK_VERCEL_DEPLOYMENT.md` - Useful for full-stack deployment
  - `SPLIT_DEPLOYMENT_GUIDE.md` - Useful for split deployment approach

## Test Files

Testing files not needed in production:

- **To Remove**:
  - `server/api-test.ts` - Testing file
  - `server/check-env.js` - Development utility
  - `cloudinary-test.js` - Testing file
  - `cloudinary-verify.js` - Testing file
  - `verify-build.js` - Development utility
  - `client/src/lib/firebase-env-test.ts` - Testing file
  - `client/src/utils/cors-test.ts` - Testing file

## Duplicate Vercel Configuration Files

Multiple Vercel deployment files with overlapping functionality:

- **To Remove**:
  - `server/vercel-simplified.js` - Use vercel.js instead
  - `server/vercel-build-fix.ts` - Development utility
  - `server/vercel-websocket.js` - Not needed unless using WebSockets
  - `client/vite.config.vercel.ts` - Use main vite.config.ts
  - `client/vercel-tailwind.config.js` - Use main tailwind.config.js

- **Keep**:
  - `server/vercel.js` - Main Vercel handler
  - `vercel.json` - Main Vercel configuration

## Multiple Build Scripts

Redundant build scripts:

- **To Remove**:
  - `client-build.sh` - Redundant with build.sh
  - `vercel-build-simple.sh` - Redundant 
  - `vercel-build.sh` - Use single build script
  - `vercel-start.sh` - Development utility

- **Keep**:
  - `build.sh` - Main build script
  - `render-build.sh` - If using Render
  - `render-start.sh` - If using Render

## Duplicate Data/Schema Files

Redundant data handling files:

- **To Remove**:
  - `client/src/lib/sampleData.ts` - Development data only
  - `client/src/components/schema/index.ts` - If redundant with lib/schema.ts

## Other Unnecessary Files

- **To Remove**:
  - `client/src/pages/diagnostics.tsx` - Development/debugging page
  - `client/src/lib/mobileStructuredData.ts` - Merge with structuredData.ts
  - `client/src/lib/seoKeywords.ts` - Move to SEO.tsx component

## Implementation Plan

1. Create a backup of the entire codebase
2. Remove files in stages:
   - First test files and development utilities
   - Then redundant deployment files
   - Finally redundant optimization libraries
3. Test the application after each stage to ensure no regressions
4. Update import statements as needed
5. Run a production build to verify everything works

## Post-Cleanup Tasks

1. Audit bundle size using Vite's bundle analyzer
2. Run Lighthouse tests to confirm performance is maintained
3. Update documentation to reflect the streamlined codebase
4. Add comments to key remaining files explaining their purpose
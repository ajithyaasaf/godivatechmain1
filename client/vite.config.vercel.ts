import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// Remove Replit-specific plugin for Vercel build
// import themeJson from "@replit/vite-plugin-shadcn-theme-json";

// Special Vite config for Vercel deployment
export default defineConfig({
  plugins: [
    react(),
    // Remove Replit-specific plugin that might cause issues in Vercel
    // themeJson({
    //   themeJsonPath: path.resolve(process.cwd(), "theme.json"),
    // })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared"),
      // For Vercel, we need to use a different path to attached assets
      "@assets": path.resolve(__dirname, "public/assets"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      // Externalize server-side only dependencies
      external: [
        'drizzle-orm',
        'drizzle-orm/pg-core',
        'drizzle-zod',
        'express',
        'pg',
        'firebase-admin',
        'cloudinary'
      ]
    }
  },
});
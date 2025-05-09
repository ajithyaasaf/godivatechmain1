import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import themeJson from "@replit/vite-plugin-shadcn-theme-json";

// Special Vite config for Vercel deployment
export default defineConfig({
  plugins: [
    react(),
    themeJson({
      // This will use theme.json in the root directory
      themeJsonPath: path.resolve(process.cwd(), "../theme.json"),
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared"),
      "@assets": path.resolve(__dirname, "../attached_assets"),
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
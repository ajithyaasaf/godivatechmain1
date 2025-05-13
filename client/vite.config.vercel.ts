import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// Import these directly instead of using require()
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  css: {
    postcss: {
      plugins: [
        // Use direct function calls with the config path
        tailwindcss('./vercel-tailwind.config.js'),
        autoprefixer(),
      ],
    },
  },
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
    sourcemap: true,
    rollupOptions: {
      output: {
        // Ensure proper MIME types by using .js extension for all chunks
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Ensure proper module format
        format: 'es',
      }
    }
  },
});
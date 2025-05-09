import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    themePlugin()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared"),
      "@assets": path.resolve(__dirname, "../attached_assets"),
    },
  },
  build: {
    outDir: "dist", // This is the key change - output to ./dist
    emptyOutDir: true,
  },
});
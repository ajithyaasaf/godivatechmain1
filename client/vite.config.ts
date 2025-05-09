import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import themeJson from "@replit/vite-plugin-shadcn-theme-json";
import { cartographer } from "@replit/vite-plugin-cartographer";
import runtimeErrorPlugin from "@replit/vite-plugin-runtime-error-modal";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    themeJson(), // This will automatically use the theme.json in the root directory
    cartographer(),
    runtimeErrorPlugin()
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
  },
});
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    port: 5173,
    proxy: {
      // Any request starting with /api is forwarded to backend
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    // Production optimisations
    rollupOptions: {
      output: {
        manualChunks: {
          // React ecosystem
          "vendor-react": ["react", "react-dom", "react-router-dom"],

          // React Query
          "vendor-query": ["@tanstack/react-query"],

          // Redux
          "vendor-redux": ["@reduxjs/toolkit", "react-redux"],

          // Forms & validation
          "vendor-form": ["react-hook-form", "zod", "@hookform/resolvers"],
        },
      },
    },

    // Warn if any chunk exceeds 500kb
    chunkSizeWarningLimit: 500,
  },
});

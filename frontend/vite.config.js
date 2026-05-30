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
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("react-dom") ||
              id.includes("react-router-dom") ||
              id.includes("react/")
            ) {
              return "vendor-react";
            }
            if (id.includes("@tanstack/react-query")) {
              return "vendor-query";
            }
            if (id.includes("@reduxjs/toolkit") || id.includes("react-redux")) {
              return "vendor-redux";
            }
            if (
              id.includes("react-hook-form") ||
              id.includes("zod") ||
              id.includes("@hookform/resolvers")
            ) {
              return "vendor-form";
            }
            return "vendor";
          }
        },
      },
    },

    // Warn if any chunk exceeds 500kb
    chunkSizeWarningLimit: 500,
  },
});

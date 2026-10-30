import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  // Don't load the root .env: it belongs to the Express server and sets
  // NODE_ENV=development, which makes Vite bundle React's development build.
  // VITE_* variables are still read from the shell environment.
  envDir: false,
  build: {
    // The SSR bundle is only used to prerender; it doesn't need static assets.
    copyPublicDir: !isSsrBuild
  },
  server: {
    proxy: {
      "/api": "http://localhost:3000"
    }
  }
}));

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command, isSsrBuild }) => {
  // .env sets NODE_ENV=development for the Express server. Vite would pick
  // that up and bundle React's development build, so pin it for builds.
  if (command === "build") process.env.NODE_ENV = "production";

  return {
    plugins: [react()],
    build: {
      // The SSR bundle is only used to prerender; it doesn't need static assets.
      copyPublicDir: !isSsrBuild
    },
    server: {
      proxy: {
        "/api": "http://localhost:3000"
      }
    }
  };
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

export default defineConfig({
  plugins: [
    react(),
    // Do not fail the Vite dev server build on lint warnings
    eslint({ failOnError: true, failOnWarning: false }),
  ],
});

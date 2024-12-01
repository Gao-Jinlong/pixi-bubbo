import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import oxlintPlugin from "vite-plugin-oxlint";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), oxlintPlugin()],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
});

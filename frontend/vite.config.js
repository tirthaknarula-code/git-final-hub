import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  cacheDir: "C:/Users/tirth/AppData/Local/Temp/stationery-hub-vite-cache",
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": "http://localhost:3001",
      "/create-order": "http://localhost:3001",
    },
  },
});

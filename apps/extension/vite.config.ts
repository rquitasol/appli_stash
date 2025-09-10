import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import { resolve } from "path";
import manifest from "./src/manifest";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@applistash/shared": resolve(
        __dirname,
        "../../packages/shared/dist"
      ),
    },
  },
  plugins: [react(), crx({ manifest })],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(
          __dirname,
          "src/pages/popup/index.html"
        ),
        options: resolve(
          __dirname,
          "src/pages/options/index.html"
        ),
      },
    },
  },
});

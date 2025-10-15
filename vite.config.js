import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  base: "./",
test: {
globals: true,
environment: "jsdom",
setupFiles: "./tests/setup.js",
coverage: {
provider: "v8",
reporter: ["text", "html"],
},
},
});

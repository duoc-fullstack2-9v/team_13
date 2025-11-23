import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  define: {
    __DEV__: true
  },
  optimizeDeps: {
    exclude: ['firebase']
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      statements: 0.8,
      branches: 0.8,
      functions: 0.8,
      lines: 0.8,
      include: [
        'src/utils/**/*.js',
        'src/components/{CartIcon,LoginForm,RegisterForm}.jsx',
        'src/pages/{LandingPage,ContactoPage,ProductosPage}.jsx'
      ],
      exclude: [
        'src/main.jsx',
        'src/firebase/**',
        'src/styles/**',
        'src/assets/**',
        'src/components/admin/**',
        'src/pages/AdminDashboard.jsx',
        'src/pages/ProductManagerPage.jsx',
        'src/components/CartModal.jsx',
        'src/services/**',
        'src/contexts/**'
      ]
    }
  }
});

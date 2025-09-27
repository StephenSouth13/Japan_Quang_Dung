import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    exclude: ['tailwind-merge'],
    include: ['react', 'react-dom', 'react-router-dom']
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      external: ['tailwind-merge']
    }
  }
});

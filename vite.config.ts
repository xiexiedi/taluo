import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Configure static asset handling
  publicDir: 'public',
  assetsInclude: ['**/*.png'],
  // Add alias for tarot card images
  resolve: {
    alias: {
      '@tarot': '/home/project/塔罗牌库'
    }
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
  // Configure environment variables
  envDir: './',
  envPrefix: 'VITE_'
});
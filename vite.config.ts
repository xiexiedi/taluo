import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // Configure static asset handling
  publicDir: 'public',
  assetsInclude: ['**/*.png'],
  server: {
    watch: {
      usePolling: true,
    },
  },
  // Configure environment variables
  envDir: './',
  envPrefix: 'VITE_',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
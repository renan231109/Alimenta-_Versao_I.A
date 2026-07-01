import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 5174,

    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3333',
        changeOrigin: true,
      },

      '/assistente': {
        target: 'http://127.0.0.1:3333',
        changeOrigin: true,
      },

      '/uploads': {
        target: 'http://127.0.0.1:3333',
        changeOrigin: true,
      }
    }
  }
});
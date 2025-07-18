import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5050,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
  css: {
    postcss: './postcss.config.js',
  },
});
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/qr-code-checker/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  }
});
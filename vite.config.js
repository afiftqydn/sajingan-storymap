import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Kalau deploy ke GitHub Pages di sub-path (bukan domain root),
  // ganti base ke '/nama-repo/'. Kalau deploy ke Netlify/Vercel di root,
  // biarkan '/'.
  base: '/',
});

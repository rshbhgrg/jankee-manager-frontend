import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // Plugins: React for JSX/TSX support, Tailwind CSS v4 for styling
  plugins: [react(), tailwindcss()],

  // Path aliases for clean imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/stores': path.resolve(__dirname, './src/stores'),
      '@/config': path.resolve(__dirname, './src/config'),
    },
  },

  // Development server configuration
  server: {
    port: 5573,
    host: true,
    // No proxy needed - frontend calls backend API directly via VITE_API_BASE_URL
  },

  // Build optimizations
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react'],
        },
      },
    },
  },
});

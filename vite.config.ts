import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  return {
    // Plugins
    plugins: [react()],
    
    // Environment variables
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
    },
    
    // Path resolution
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    
    // Build optimizations
    build: {
      target: 'es2020',
      minify: 'terser',
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            gemini: ['@google/genai'],
            utils: ['zod'],
          },
        },
      },
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },
    },
    
    // Development server
    server: {
      port: 3000,
      open: true,
      cors: true,
    },
    
    // Preview server
    preview: {
      port: 4173,
      open: true,
    },
    
    // Optimizations
    optimizeDeps: {
      include: ['react', 'react-dom', '@google/genai', 'zod'],
    },
  };
});

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import apiPlugin from './vite-plugin-api.js'

export default defineConfig({
  plugins: [react(), apiPlugin()],
  
  // SSR configuration
  ssr: {
    noExternal: ['react-router-dom']
  },
  
  server: {
    host: '0.0.0.0',
    port: 3006,
    allowedHosts: [
      '.manusvm.computer',
      '.manus.computer',
      'localhost',
      '127.0.0.1'
    ],
    middlewareMode: false,
    cors: true
  },
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code into separate chunks for better caching
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion']
        }
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 500,
    // Minify for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})


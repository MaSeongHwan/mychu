import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],  server: {
    port: 5173,
    strictPort: true,
    host: '0.0.0.0',
    hmr: {
      overlay: true, // Enable HMR overlay for better error visibility
    },
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'http://fastapi:8000',
        changeOrigin: true,
      },
      '/recommendation': {
        target: 'http://fastapi:8000',
        changeOrigin: true,
      },
      '/recommendations': {
        target: 'http://fastapi:8000',
        changeOrigin: true,
      },
      '/search': {
        target: 'http://fastapi:8000',
        changeOrigin: true,
      },
      '/assets': {
        target: 'http://fastapi:8000',
        changeOrigin: true,
      },
      '/users': {
        target: 'http://fastapi:8000',
        changeOrigin: true,
      },
      '/logs': {
        target: 'http://fastapi:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1000,
    lib: {
      entry: {
        main: resolve(__dirname, 'src/main.jsx'),
        slider: resolve(__dirname, 'src/StandaloneSlider.jsx'),
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})

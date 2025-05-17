import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  server: {
    proxy: {
      '/mock': {
        target: 'https://sg-mock-api.lalamove.com', 
        changeOrigin: true,
      },
    },
  },
})

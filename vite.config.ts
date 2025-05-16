import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/mock': {
        target: 'https://sg-mock-api.lalamove.com', 
        changeOrigin: true,
      },
    },
  },
})

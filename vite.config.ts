import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  server: {
    host: true,
    allowedHosts: ["ascentrade.app", "demo.ascentrade.app"]
  },
  preview: {
    allowedHosts: ["ascentrade.app", "demo.ascentrade.app"]
  }
})

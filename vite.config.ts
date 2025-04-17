import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  base: "/",
  resolve: {
    alias: {
      crypto: 'crypto-js'
    }
  },
  define: {
    'process.env.NODE_DEBUG': 'false',
    'global': {}
  }
})
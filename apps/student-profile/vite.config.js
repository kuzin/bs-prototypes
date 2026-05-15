import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/bs-prototypes/student-profile/',
  resolve: {
    alias: [
      { find: '@bs/ui/css', replacement: resolve(__dirname, '../../packages/ui/BeanstackProfile.css') },
      { find: '@bs/ui',     replacement: resolve(__dirname, '../../packages/ui/index.jsx') },
    ],
  },
})

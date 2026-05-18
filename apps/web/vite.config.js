import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/bs-prototypes/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        studentProfile: resolve(__dirname, 'student-profile/index.html'),
      },
    },
  },
  resolve: {
    alias: [
      { find: '@bs/ui/css', replacement: resolve(__dirname, '../../packages/ui/BeanstackProfile.css') },
      { find: '@bs/ui',     replacement: resolve(__dirname, '../../packages/ui/index.jsx') },
    ],
  },
})

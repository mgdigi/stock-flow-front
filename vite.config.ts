import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        login: resolve(__dirname, 'accueil.html'),
        main: resolve(__dirname, 'index.html'),
      }
    }
  },
  server: {
    open: true,
    port: 3000
  },
  css: {
    postcss: './postcss.config.js',
  }
})

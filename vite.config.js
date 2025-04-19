// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'


export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        inputPage: resolve(__dirname, '1_input.html'),
        alertPage: resolve(__dirname, '2_alert.html'),
        imageUploadPage: resolve(__dirname,'personalProject/imageUpload.html'),
        gridPaintingPage: resolve(__dirname,'personalProject/gridPainting.html'),
      },
    },
  },
})

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
        modelViewerPage: resolve(__dirname,'personalProject/3dModelViewer.html'),
        basicChatbotPage: resolve(__dirname,'chatbotPrototype/basicChatbot.html'),
        chatbotWithRAGPage: resolve(__dirname,'chatbotPrototype/chatbotRAG.html'),
        perplexityBasic: resolve(__dirname,'perplexityPrototype/perplexityBasic.html'),
        perplexityWithYoutubAPI: resolve(__dirname,'perplexityPrototype/plxtyWithYtb.html'),
      },
    },
  },
})

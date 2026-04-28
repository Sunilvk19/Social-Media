import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
 server: {
  watch: {
    ignored: ['**/db.json']
  },
  proxy: {
    "/api/huggingface": {
      target: "https://huggingface.co",
      changeOrigin: true,
      rewrite: (path) =>
        path.replace(/^\/api\/huggingface/, ""),
      configure: (proxy) => {
        proxy.on("proxyReq", (proxyReq) => {
          if (process.env.HF_TOKEN) {
            proxyReq.setHeader(
              "Authorization",
              `Bearer ${process.env.HF_TOKEN}`
            );
          }
        });
      },
    },
  },
}
})

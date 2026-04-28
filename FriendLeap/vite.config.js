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
    rewrite: (path) => path.replace(/^\/api\/huggingface/, ""),
    headers: {
      'Accept': 'application/json',
    },
    configure: (proxy) => {
      proxy.on("proxyReq", (proxyReq, req) => {
        // Log to verify what's actually being requested
        console.log('[Proxy] Requesting:', proxyReq.path);
        if (process.env.HF_TOKEN) {
          proxyReq.setHeader("Authorization", `Bearer ${process.env.HF_TOKEN}`);
        }
      });
      proxy.on("proxyRes", (proxyRes, req) => {
        console.log('[Proxy] Response status:', proxyRes.statusCode, req.url);
      });
    },
  },
}
}
})

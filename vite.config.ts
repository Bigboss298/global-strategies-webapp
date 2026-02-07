import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_PROXY_TARGET || 'http://localhost:5194'
  const proxySecure = (env.VITE_PROXY_SECURE ?? 'true').toLowerCase() !== 'false'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: true,
      port: 3001,
      strictPort: true,
      proxy: {
        // REST API -> backend (local or Azure)
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: proxySecure,
        },
        // SignalR hub (WebSocket) -> backend
        '/hubs': {
          target: proxyTarget,
          ws: true,
          changeOrigin: true,
          secure: proxySecure,
        },
      },
    },
  }
})

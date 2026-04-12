import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '../../', '')
  return {
    plugins: [react()],
    server: {
      port: parseInt(env.ADMIN_PORT || '5174', 10),
      host: env.WEB_HOST || 'localhost',
    },
  }
})

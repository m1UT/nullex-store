import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '../../', '')

  const port = parseInt(env.WEB_PORT || '5173', 10)
  const host = env.WEB_HOST || 'localhost'
  const allowedHosts = env.WEB_ALLOWED_HOSTS
    ? env.WEB_ALLOWED_HOSTS.split(',').map((h) => h.trim())
    : []

  const tlsKey = env.WEB_TLS_KEY
  const tlsCert = env.WEB_TLS_CERT
  const https = tlsKey && tlsCert
    ? { key: fs.readFileSync(tlsKey), cert: fs.readFileSync(tlsCert) }
    : undefined

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port,
      host,
      https,
      allowedHosts: allowedHosts.length ? allowedHosts : undefined,
    },
  }
})

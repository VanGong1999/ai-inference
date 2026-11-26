import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Connect, Plugin } from 'vite'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const docsRoot = path.resolve(__dirname, '../docs')

function contentType(filePath: string): string {
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8'
  if (filePath.endsWith('.md')) return 'text/markdown; charset=utf-8'
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8'
  if (filePath.endsWith('.js')) return 'application/javascript; charset=utf-8'
  if (filePath.endsWith('.json')) return 'application/json; charset=utf-8'
  if (filePath.endsWith('.svg')) return 'image/svg+xml'
  if (filePath.endsWith('.png')) return 'image/png'
  if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) return 'image/jpeg'
  if (filePath.endsWith('.webp')) return 'image/webp'
  if (filePath.endsWith('.woff2')) return 'font/woff2'
  return 'application/octet-stream'
}

function serveDocsStatic(): Plugin {
  return {
    name: 'serve-docs-static',
    configureServer(server) {
      const handler: Connect.NextHandleFunction = (req, res, next) => {
        if (!req.url || req.method !== 'GET') return next()

        const raw = req.url.split('?')[0] ?? ''
        if (
          raw.startsWith('/@') ||
          raw.startsWith('/src') ||
          raw.startsWith('/node_modules') ||
          raw.startsWith('/portal-assets')
        ) {
          return next()
        }

        let rel = decodeURIComponent(raw)
        if (rel.startsWith('/ai-inference/')) rel = rel.slice('/ai-inference'.length)
        if (rel === '/' || rel === '') return next()
        if (
          rel === '/library' ||
          rel.startsWith('/library/') ||
          rel === '/lab' ||
          rel.startsWith('/lab/') ||
          rel === '/read' ||
          rel.startsWith('/read/')
        ) {
          return next()
        }

        const candidate = path.normalize(path.join(docsRoot, rel))
        if (!candidate.startsWith(docsRoot)) return next()

        let filePath = candidate
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
          filePath = path.join(filePath, 'index.html')
        }
        if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return next()

        res.statusCode = 200
        res.setHeader('Content-Type', contentType(filePath))
        fs.createReadStream(filePath).pipe(res)
      }

      server.middlewares.use(handler)
    },
  }
}

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss(), serveDocsStatic()],
  base: command === 'build' ? '/ai-inference/' : '/',
  build: {
    outDir: '../docs',
    emptyOutDir: false,
    assetsDir: 'portal-assets',
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname, '..')],
    },
  },
}))

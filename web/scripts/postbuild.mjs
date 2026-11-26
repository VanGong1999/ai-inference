import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const docs = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../docs')
const indexHtml = path.join(docs, 'index.html')
const notFound = path.join(docs, '404.html')
const assetsDir = path.join(docs, 'portal-assets')

if (!fs.existsSync(indexHtml)) {
  console.error('postbuild: docs/index.html missing — did Vite build succeed?')
  process.exit(1)
}

fs.copyFileSync(indexHtml, notFound)
console.log('postbuild: copied docs/index.html → docs/404.html')

const html = fs.readFileSync(indexHtml, 'utf8')
const referenced = new Set(
  [...html.matchAll(/portal-assets\/([^"'?\s]+)/g)].map((m) => m[1]),
)

if (fs.existsSync(assetsDir)) {
  for (const name of fs.readdirSync(assetsDir)) {
    if (!referenced.has(name)) {
      fs.unlinkSync(path.join(assetsDir, name))
      console.log(`postbuild: removed stale ${name}`)
    }
  }
}

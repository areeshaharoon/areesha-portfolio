import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

function assetsPlugin() {
  return {
    name: 'serve-character-assets',
    configureServer(server) {
      server.middlewares.use('/assets', (req, res, next) => {
        const decodedUrl = decodeURIComponent(req.url.split('?')[0])
        const filePath = path.join(process.cwd(), 'assets', decodedUrl)
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
            res.setHeader('Content-Type', 'image/jpeg')
          } else if (filePath.endsWith('.png')) {
            res.setHeader('Content-Type', 'image/png')
          } else if (filePath.endsWith('.svg')) {
            res.setHeader('Content-Type', 'image/svg+xml')
          } else if (filePath.endsWith('.mp4')) {
            res.setHeader('Content-Type', 'video/mp4')
            res.setHeader('Accept-Ranges', 'bytes')
          } else if (filePath.endsWith('.webm')) {
            res.setHeader('Content-Type', 'video/webm')
            res.setHeader('Accept-Ranges', 'bytes')
          }
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
          return fs.createReadStream(filePath).pipe(res)
        }
        next()
      })
    },
    closeBundle() {
      const srcDir = path.join(process.cwd(), 'assets')
      const destDir = path.join(process.cwd(), 'dist', 'assets')
      if (fs.existsSync(srcDir)) {
        fs.mkdirSync(destDir, { recursive: true })
        copyRecursiveSync(srcDir, destDir)
      }
    }
  }
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src)
  const stats = exists && fs.statSync(src)
  const isDirectory = exists && stats.isDirectory()
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName))
    })
  } else if (exists) {
    fs.copyFileSync(src, dest)
  }
}

export default defineConfig({
  plugins: [react(), assetsPlugin()],
  server: {
    port: 3000,
    open: false,
    host: true
  }
})

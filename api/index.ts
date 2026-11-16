import app from '../src/server.js'

export default function handler(req: any, res: any) {
  const originalUrl = req.headers['x-vercel-original-url'] || req.headers['x-matched-path']
  if (originalUrl && (req.url === '/api/index' || req.url === '/api')) {
    req.url = originalUrl
  }
  return app(req, res)
}

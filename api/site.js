const key = 'hala:site:v1'
const respond = (res, status, data) => res.status(status).json(data)
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return respond(res, 503, { error: 'Shared storage is not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.' })
  if (!['GET', 'PUT'].includes(req.method)) return respond(res, 405, { error: 'Method not allowed' })
  if (req.method === 'PUT') {
    if (!process.env.SITE_ADMIN_PASSWORD) return respond(res, 503, { error: 'Set SITE_ADMIN_PASSWORD to enable publishing.' })
    if (req.headers.authorization !== `Bearer ${process.env.SITE_ADMIN_PASSWORD}`) return respond(res, 401, { error: 'Invalid administrator password.' })
    const body = req.body
    if (!body || typeof body !== 'object' || JSON.stringify(body).length > 30000) return respond(res, 400, { error: 'Invalid content.' })
    const result = await fetch(`${url}/set/${encodeURIComponent(key)}`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (!result.ok) return respond(res, 502, { error: 'Storage unavailable.' })
    return respond(res, 200, { ok: true })
  }
  const result = await fetch(`${url}/get/${encodeURIComponent(key)}`, { headers: { Authorization: `Bearer ${token}` } })
  if (!result.ok) return respond(res, 502, { error: 'Storage unavailable.' })
  const data = await result.json()
  try { return respond(res, 200, data.result ? JSON.parse(data.result) : {}) }
  catch { return respond(res, 502, { error: 'Invalid stored content.' }) }
}

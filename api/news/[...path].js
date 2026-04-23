module.exports = async function handler(req, res) {
  try {
    const pathParts = req.query.path
    const joinedPath = Array.isArray(pathParts) ? pathParts.join('/') : pathParts || ''

    const query = new URLSearchParams(req.query)
    query.delete('path')

    const upstreamUrl = `https://api.gdeltproject.org/${joinedPath}${query.toString() ? `?${query}` : ''}`
    const upstream = await fetch(upstreamUrl, {
      method: req.method,
      headers: {
        accept: req.headers.accept || '*/*',
      },
    })

    const contentType = upstream.headers.get('content-type') || 'text/plain; charset=utf-8'
    const text = await upstream.text()

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', contentType)
    res.status(upstream.status).send(text)
  } catch (error) {
    res.status(502).json({ error: 'News upstream unavailable', detail: String(error) })
  }
}

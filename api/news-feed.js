module.exports = async function handler(req, res) {
  try {
    const query = String(req.query.query || '')
    const upstreamUrl = `https://api.gdeltproject.org/api/v2/doc/doc?query=${query}&mode=ArtList&format=json&maxrecords=8&sort=datedesc`
    const upstream = await fetch(upstreamUrl)
    const text = await upstream.text()
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json; charset=utf-8')
    res.status(upstream.status).send(text)
  } catch (error) {
    res.status(502).json({ error: 'GDELT upstream unavailable', detail: String(error) })
  }
}

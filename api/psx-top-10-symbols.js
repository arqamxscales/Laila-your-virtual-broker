module.exports = async function handler(_req, res) {
  try {
    const upstream = await fetch('https://dps.psx.com.pk/data/top-10-symbols')
    const text = await upstream.text()
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json; charset=utf-8')
    res.status(upstream.status).send(text)
  } catch (error) {
    res.status(502).json({ error: 'PSX top symbols upstream unavailable', detail: String(error) })
  }
}

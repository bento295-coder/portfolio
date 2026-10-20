import express from 'express'

const app = express()
const PORT = process.env.API_PORT || 3001

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.listen(PORT, () => {
  console.log(`API em http://localhost:${PORT}`)
})

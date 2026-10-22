// Login do painel (/admin) com o GitHub, passo 2: o GitHub volta para cá com
// um código; trocamos pelo token e entregamos ao painel pela janela que abriu
// o login (protocolo de mensagens do Decap CMS), só para a origem do site.
// texto seguro dentro de <script> (sem "<" que feche a tag)
const js = (value) => JSON.stringify(value).replace(/</g, '\\u003c')

const page = (origin, status, payload) => `<!doctype html>
<meta charset="utf-8" />
<title>Login</title>
<p>${status === 'success' ? 'Pronto, pode fechar esta janela.' : 'Não foi possível entrar.'}</p>
<script>
  (function () {
    var origin = ${js(origin)}
    var message = 'authorization:github:${status}:' + ${js(JSON.stringify(payload))}
    function receive(e) {
      if (e.origin !== origin) return
      window.removeEventListener('message', receive)
      window.opener.postMessage(message, origin)
    }
    window.addEventListener('message', receive)
    window.opener && window.opener.postMessage('authorizing:github', origin)
  })()
</script>`

export default async function handler(req, res) {
  const origin = `https://${req.headers.host}`
  const { code, state } = req.query
  const cookieState = /(?:^|;\s*)oauth_state=([^;]+)/.exec(req.headers.cookie || '')?.[1]
  res.setHeader('Set-Cookie', 'oauth_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0')
  res.setHeader('Content-Type', 'text/html; charset=utf-8')

  if (!code || !state || state !== cookieState) {
    return res.status(400).send(page(origin, 'error', { message: 'Login inválido ou expirado. Tente de novo.' }))
  }

  try {
    const r = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.OAUTH_GITHUB_CLIENT_ID,
        client_secret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
        code,
      }),
    })
    const data = await r.json()
    if (!data.access_token) throw new Error(data.error_description || 'sem token')
    res.send(page(origin, 'success', { token: data.access_token, provider: 'github' }))
  } catch (err) {
    res.status(500).send(page(origin, 'error', { message: String(err.message || err) }))
  }
}

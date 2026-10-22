// Login do painel (/admin) com o GitHub, passo 1: manda para a tela de
// autorização do GitHub. Variáveis na Vercel: OAUTH_GITHUB_CLIENT_ID e
// OAUTH_GITHUB_CLIENT_SECRET (do OAuth App criado no GitHub).
// O `state` aleatório vai num cookie e é conferido na volta (/api/callback).
import { randomBytes } from 'node:crypto'

export default function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID
  if (!clientId) return res.status(500).send('OAUTH_GITHUB_CLIENT_ID não configurado na Vercel.')

  const state = randomBytes(16).toString('hex')
  const url = new URL('https://github.com/login/oauth/authorize')
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', `https://${req.headers.host}/api/callback`)
  // repositório público: só precisa escrever em repositórios públicos
  url.searchParams.set('scope', 'public_repo')
  url.searchParams.set('state', state)

  res.setHeader('Set-Cookie', `oauth_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`)
  res.redirect(302, url.toString())
}

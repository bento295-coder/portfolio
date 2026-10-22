// Plugin do Vite que deixa o site legível para o Google e para as IAs.
//
// O site é montado por JavaScript no navegador; robôs que não executam JS
// (os das IAs: ChatGPT, Claude, Perplexity…) veriam uma página vazia. Então:
//  - no <head> de cada página: título, descrição, canonical, Open Graph e
//    dados estruturados (JSON-LD: Person, WebSite, ProfilePage, CreativeWork);
//  - dentro do #root: o mesmo conteúdo do site em HTML puro (o React troca
//    pelo site de verdade ao carregar, então quem vê é igual);
//  - no build: uma página HTML por projeto (dist/projetos/<id>/index.html),
//    sitemap.xml e llms.txt, tudo gerado a partir do conteúdo.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// JSON dentro de <script>: impede que um "</script>" no texto feche a tag.
const jsonLd = (data) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`

async function loadContent(root) {
  const imp = (file) => import(`${pathToFileURL(path.join(root, file)).href}?t=${Date.now()}`)
  const { seo, SITE_URL } = await imp('src/content/seo.js')
  const { getInfo } = await imp('src/content/info.js')
  const { home } = await imp('src/content/home.js')

  const dir = path.join(root, 'src/content/projects')
  const projects = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({ id: f.replace(/\.json$/, ''), ...JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) }))
    .filter((p) => p.published !== false)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))

  // Projetos de teste (arquivo teste-*.json) aparecem no site, mas ficam fora
  // dos buscadores: noindex na página e fora do sitemap, llms.txt e JSON-LD.
  const isTest = (p) => p.id.startsWith('teste-')
  return { seo, SITE_URL, info: getInfo('pt'), home, projects: projects.filter((p) => !isTest(p)), tests: projects.filter(isTest) }
}

function person({ seo, SITE_URL, info }) {
  return {
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: seo.name,
    alternateName: seo.alternateName,
    jobTitle: seo.jobTitle.pt,
    description: info.about,
    image: SITE_URL + seo.portrait,
    url: `${SITE_URL}/`,
    email: `mailto:${info.contact.email}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: seo.locality,
      addressRegion: seo.region,
      addressCountry: seo.country,
    },
    knowsAbout: info.proficiencies,
    sameAs: info.social.map((s) => s.href),
  }
}

function headTags({ title, description, url, image, type, structured, siteName, noindex = false }) {
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}" />`,
    `<meta property="og:site_name" content="${esc(siteName)}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:locale:alternate" content="en_US" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<link rel="alternate" type="text/plain" href="/llms.txt" title="Resumo para IAs" />`,
    jsonLd(structured),
  ].join('\n    ')
}

function homeHead(c) {
  const { seo, SITE_URL } = c
  const url = `${SITE_URL}/`
  return headTags({
    title: seo.title,
    description: seo.description,
    url,
    image: SITE_URL + seo.shareImage,
    type: 'profile',
    siteName: seo.name,
    structured: {
      '@context': 'https://schema.org',
      '@graph': [
        person(c),
        {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          name: seo.name,
          alternateName: seo.alternateName,
          url,
          inLanguage: ['pt-BR', 'en'],
          publisher: { '@id': `${SITE_URL}/#person` },
        },
        {
          '@type': 'ProfilePage',
          '@id': `${SITE_URL}/#profile`,
          url,
          name: seo.title,
          dateModified: new Date().toISOString(),
          mainEntity: { '@id': `${SITE_URL}/#person` },
          hasPart: c.projects.map((p) => ({ '@id': `${SITE_URL}/projetos/${p.id}#work` })),
        },
      ],
    },
  })
}

const projectDescription = (p) =>
  `${p.title} — ${[p.service, p.client, p.year].filter(Boolean).join(', ')}. ${p.description?.pt ?? ''}`.trim()

function projectHead(c, p, noindex = false) {
  const { seo, SITE_URL } = c
  const url = `${SITE_URL}/projetos/${p.id}`
  // imagem de compartilhamento precisa ser imagem (thumb em vídeo usa a padrão)
  const image =
    p.thumb && !/\.(mp4|webm|mov|m4v)$/i.test(p.thumb) ? SITE_URL + p.thumb : SITE_URL + seo.shareImage
  return headTags({
    noindex,
    title: `${p.title} — ${seo.name}`,
    description: projectDescription(p).slice(0, 300),
    url,
    image,
    type: 'article',
    siteName: seo.name,
    structured: {
      '@context': 'https://schema.org',
      '@graph': [
        person(c),
        {
          '@type': 'CreativeWork',
          '@id': `${url}#work`,
          name: p.title,
          description: p.description?.pt,
          url,
          image: [p.thumb, ...(p.images ?? []).map((i) => i.src)]
            .filter((src) => src && !/\.(mp4|webm|mov|m4v)$/i.test(src))
            .map((src) => SITE_URL + src),
          dateCreated: p.year || undefined,
          genre: p.service || undefined,
          keywords: [p.service, p.client].filter(Boolean),
          creator: { '@id': `${SITE_URL}/#person` },
          inLanguage: 'pt-BR',
        },
      ],
    },
  })
}

// Conteúdo em HTML puro (o mesmo que o site mostra). Só aparece se o JS não
// rodar: o React substitui ao carregar, e o CSS o esconde no primeiro instante
// para não piscar.
function homeBody({ seo, info, home, projects }) {
  const list = (items) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`
  return `<main class="prerender">
      <h1>${esc(home.intro.pt)}</h1>
      <h2>${esc(seo.name)} — ${esc(seo.jobTitle.pt)}</h2>
      <p>${esc(info.about)}</p>
      <h2>${esc(info.labels.proficiencies)}</h2>${list(info.proficiencies)}
      <h2>Projetos</h2>
      <ul>${projects
        .map(
          (p) =>
            `<li><a href="/projetos/${esc(p.id)}">${esc(p.title)}</a> — ${esc(
              [p.service, p.client, p.year].filter(Boolean).join(', '),
            )}</li>`,
        )
        .join('')}</ul>
      <h2>${esc(info.labels.clients)}</h2>${list(info.clients)}
      <h2>${esc(info.labels.collaborators)}</h2>${list(info.collaborators)}
      <h2>${esc(info.labels.contact)}</h2>
      <p><a href="mailto:${esc(info.contact.email)}">${esc(info.contact.email)}</a> · ${esc(info.contact.phone)} · ${esc(
        info.contact.city,
      )}, ${esc(info.contact.country)}</p>
      <p>${info.social.map((s) => `<a href="${esc(s.href)}">${esc(s.label)}</a>`).join(' · ')}</p>
    </main>`
}

function projectBody({ seo }, p) {
  const meta = [
    ['Ano', p.year],
    ['Serviço', p.service],
    ['Cliente', p.client],
    ['Colaboração', p.collaboration],
  ].filter(([, v]) => v)
  return `<main class="prerender">
      <h1>${esc(p.title)}</h1>
      <p>${esc(p.description?.pt ?? '')}</p>
      <dl>${meta.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
      <p>Projeto de <a href="/">${esc(seo.name)}</a>, ${esc(seo.jobTitle.pt.toLowerCase())}.</p>
    </main>`
}

function sitemap({ SITE_URL, projects }) {
  const today = new Date().toISOString().slice(0, 10)
  const urls = ['/', ...projects.map((p) => `/projetos/${p.id}`)]
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE_URL}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`
}

// Liberado para todos, citando os robôs de IA para não haver dúvida.
const AI_BOTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
]

function robotsTxt({ SITE_URL }) {
  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

${AI_BOTS.map((b) => `User-agent: ${b}\nAllow: /`).join('\n\n')}

Sitemap: ${SITE_URL}/sitemap.xml
`
}

// Resumo para IAs (proposta llms.txt: https://llmstxt.org).
function llmsTxt({ seo, SITE_URL, info, projects }) {
  return `# ${seo.name}

> ${seo.description}

${info.about}

- Também conhecido como: ${seo.alternateName.join(', ')}
- Profissão: ${seo.jobTitle.pt} (${seo.jobTitle.en})
- Base: ${seo.locality}, ${seo.region}, Brasil
- Formação: Design Gráfico, ${seo.education} (em conclusão)
- Proficiências: ${info.proficiencies.join(', ')}
- Clientes: ${info.clients.join(', ')}
- Colaborações: ${info.collaborators.join(', ')}

## Projetos

${projects
  .map(
    (p) =>
      `- [${p.title}](${SITE_URL}/projetos/${p.id}): ${[p.service, p.client, p.year].filter(Boolean).join(', ')}. ${
        p.description?.pt ?? ''
      }`,
  )
  .join('\n')}

## Contato

- [E-mail](mailto:${info.contact.email})
${info.social.map((s) => `- [${s.label}](${s.href})`).join('\n')}
- [Site](${SITE_URL}/)
`
}

export default function seoPlugin() {
  let root
  let outDir

  return {
    name: 'bento-seo',

    configResolved(config) {
      root = config.root
      outDir = path.resolve(config.root, config.build.outDir)
    },

    // home (dev e build): preenche os marcadores do index.html
    async transformIndexHtml(html) {
      const c = await loadContent(root)
      return html.replace('<!--seo:head-->', homeHead(c)).replace('<!--seo:body-->', homeBody(c))
    },

    // build: páginas dos projetos, sitemap.xml e llms.txt
    async closeBundle() {
      if (!fs.existsSync(path.join(outDir, 'index.html'))) return
      const c = await loadContent(root)
      const base = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')
      const headStart = base.indexOf('<title>')
      const headEnd = base.indexOf('</script>', base.indexOf('application/ld+json')) + '</script>'.length

      const pages = [...c.projects.map((p) => [p, false]), ...c.tests.map((p) => [p, true])]
      for (const [p, noindex] of pages) {
        const html = (base.slice(0, headStart) + projectHead(c, p, noindex) + base.slice(headEnd)).replace(
          /<div id="root">[\s\S]*?<\/main>/,
          `<div id="root">${projectBody(c, p)}`,
        )
        const dir = path.join(outDir, 'projetos', p.id)
        fs.mkdirSync(dir, { recursive: true })
        fs.writeFileSync(path.join(dir, 'index.html'), html)
      }

      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap(c))
      fs.writeFileSync(path.join(outDir, 'robots.txt'), robotsTxt(c))
      fs.writeFileSync(path.join(outDir, 'llms.txt'), llmsTxt(c))
    },
  }
}

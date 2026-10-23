// Conteúdo da tela Info. Os textos ficam em info.json, editado pelo painel
// (/admin › Info › Página Info); aqui só convertemos para o formato que os
// componentes usam. Os títulos das seções (`labels`) ficam no código.
import data from './info.json' with { type: 'json' }

const names = (list = []) => list.map((item) => item.name).filter(Boolean)

const shared = {
  // retrato do Info (só a tinta; ver .navbar__photo-ink)
  photo: data.photo,
  proficiencies: names(data.proficiencies),
  contact: data.contact,
  social: (data.social ?? []).map((s) => ({ label: s.label, href: s.url })),
  clients: names(data.clients),
  collaborators: names(data.collaborators),
  credits: [data.credits?.line1 ?? '', data.credits?.line2 ?? ''],
}

const labels = {
  pt: {
    about: 'About',
    proficiencies: 'Proficiências',
    contact: 'Contato',
    clients: 'Clientes',
    collaborators: 'Colaborações',
    credits: 'Créditos',
  },
  en: {
    about: 'About',
    proficiencies: 'Proficiencies',
    contact: 'Contact',
    clients: 'Clients',
    collaborators: 'Collaborations',
    credits: 'Credits',
  },
}

// `aboutParts`: frase de abertura (no desktop sai da coluna, para a esquerda)
// + parágrafos; `about`: tudo junto, em texto corrido.
export const getInfo = (lang) => {
  const about = data.about[lang]
  const aboutParts = [about.lead, ...about.paragraphs.map((p) => p.text)].filter(Boolean)
  return {
    ...shared,
    aboutParts,
    about: aboutParts.join(' '),
    labels: { ...labels[lang], cta: data.cta[lang] },
  }
}

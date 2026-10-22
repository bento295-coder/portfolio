// Projetos: um arquivo JSON por projeto em ./projects/, editados pelo painel
// (Decap CMS em /admin). O nome do arquivo é o endereço: sim-sao-paulo.json
// → /projetos/sim-sao-paulo.
//
// Cada projeto aparece em dois lugares: no card da home (thumb 16:9) e na
// página do projeto (textos + galeria, sem thumb). A thumb tem proporção fixa
// (preenche e corta o excesso); a galeria usa a proporção natural de cada
// arquivo (largura/altura lidas no build por scripts/media-size-plugin.js).
// Qualquer mídia pode ser imagem ou vídeo (.mp4/.webm: loop, sem som).
const files = import.meta.glob('./projects/*.json', { eager: true, import: 'default' })

// Converte o formato do painel para o que os componentes usam.
const normalize = (path, data) => ({
  id: path.split('/').pop().replace(/\.json$/, ''),
  title: data.title,
  order: data.order ?? 999,
  description: data.description ?? { pt: '', en: '' },
  year: data.year ?? '',
  service: data.service ?? '',
  client: data.client ?? '',
  collaboration: data.collaboration ?? '',
  thumb: { src: data.thumb || null, ratio: '16:9' },
  images: (data.images ?? []).map((img) => ({
    src: img.src || null,
    width: img.width,
    height: img.height,
  })),
  published: data.published !== false,
})

export const projects = Object.entries(files)
  .map(([path, data]) => normalize(path, data))
  .filter((p) => p.published)
  .sort((a, b) => a.order - b.order)

export const getProject = (id) => projects.find((p) => p.id === id)

export const projectPath = (id) => `/projetos/${id}`

export const projectLabels = {
  pt: { year: 'Ano', service: 'Serviço', client: 'Cliente', collaboration: 'Colaboração' },
  en: { year: 'Year', service: 'Service', client: 'Client', collaboration: 'Collaboration' },
}

// Projetos, na ordem de exibição da home.
//
// Mídia: { src, ratio }. src é um caminho em frontend/public
// (ex.: '/projects/sim-sp/thumb.jpg'); null mostra o placeholder.
// ratio: '16:9' para imagens que funcionam melhor na horizontal,
//        '3:4' para as que funcionam melhor na vertical.
// A thumb é 16:9 no card da home. Na página do projeto ela aparece em 3:4
// (recortada); para usar uma imagem própria ali, adicione pageThumb: { src, ratio }.
// description: por idioma.
export const projects = [
  {
    id: 'sim-sao-paulo',
    title: 'bgReal & Cavaca Records - SIM São Paulo',
    thumb: { src: '/projects/sim-sao-paulo/thumb.png', ratio: '16:9' },
    pageThumb: { src: '/projects/sim-sao-paulo/page-thumb.png', ratio: '3:4' },
    images: [
      { src: null, ratio: '16:9' },
      { src: null, ratio: '3:4' },
    ],
    description: {
      pt: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966,",
      en: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966,",
    },
    year: '2026',
    role: 'Poster',
    client: 'bgReal & Cavaca Records',
  },
  // TODO: projetos reais. Abaixo, placeholders para ver a lista.
  {
    id: 'projeto-2',
    title: 'Projeto 2 - Placeholder',
    thumb: { src: null, ratio: '16:9' },
    images: [
      { src: null, ratio: '3:4' },
      { src: null, ratio: '16:9' },
      { src: null, ratio: '16:9' },
    ],
    description: {
      pt: 'Descrição do projeto.',
      en: 'Project description.',
    },
    year: '2025',
    role: 'Brand Design',
    client: 'Cliente',
  },
  {
    id: 'projeto-3',
    title: 'Projeto 3 - Placeholder',
    thumb: { src: null, ratio: '16:9' },
    images: [{ src: null, ratio: '16:9' }],
    description: {
      pt: 'Descrição do projeto.',
      en: 'Project description.',
    },
    year: '2025',
    role: 'Web Development',
    client: 'Cliente',
  },
  {
    id: 'projeto-4',
    title: 'Projeto 4 - Placeholder',
    // Teste: reusa a imagem do SIM para ver o vidro da nav ao rolar.
    thumb: { src: '/projects/sim-sao-paulo/thumb.png', ratio: '16:9' },
    images: [
      { src: null, ratio: '16:9' },
      { src: null, ratio: '3:4' },
    ],
    description: {
      pt: 'Descrição do projeto.',
      en: 'Project description.',
    },
    year: '2024',
    role: 'Type Design',
    client: 'Cliente',
  },
]

export const getProject = (id) => projects.find((p) => p.id === id)

export const projectPath = (id) => `/projetos/${id}`

export const projectLabels = {
  pt: { year: 'Ano', role: 'Role', client: 'Cliente' },
  en: { year: 'Year', role: 'Role', client: 'Client' },
}

// Conteúdo da tela Info. Editar textos aqui, sem tocar no layout.
// `shared` vale para os dois idiomas; `labels` muda com o idioma.
const shared = {
  about:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software like Aldus PageMaker and Microsoft Word including versions of Lorem Ipsum.",

  proficiencies: [
    'Animation & 3D',
    'Brand Design',
    'Creative Direction',
    'Creative Production',
    'Digital Design',
    'Type Design',
    'Web Development',
  ],

  contact: {
    email: 'bento295@gmail.com',
    country: 'BR',
    phone: '+55 21 985538535',
    city: 'Rio de Janeiro',
  },

  // TODO: links reais
  social: [
    { label: 'Instagram', href: '#' },
    { label: 'Linkedin', href: '#' },
  ],

  // Cada lista é distribuída nas duas colunas.
  clients: [
    ['CCBB', 'Valor Economico'],
    ['Galeria Refresco', 'Cavaca Records', 'bg Real', 'Trauma'],
  ],

  collaborators: [
    ['Roma Joana', 'Augusto Erthal'],
    ['Vitor Vigo', 'Rafaella Meigger', 'Tiago Ak'],
  ],
}

const labels = {
  pt: {
    about: 'About',
    cta: 'Entre em contato para colaborarmos.',
    proficiencies: 'Proficiências',
    contact: 'Contato',
    clients: 'Clientes',
    collaborators: 'Colaborações',
  },
  en: {
    about: 'About',
    cta: "Get in touch and let's work together.",
    proficiencies: 'Proficiencies',
    contact: 'Contact',
    clients: 'Clients',
    collaborators: 'Collaborations',
  },
}

export const getInfo = (lang) => ({ ...shared, labels: labels[lang] })

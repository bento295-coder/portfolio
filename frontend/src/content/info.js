// Conteúdo da tela Info. Editar textos aqui, sem tocar no layout.
// `shared` vale para os dois idiomas (exceto `about`, que tem pt/en);
// `labels` muda com o idioma.
const shared = {
  about: {
    // 1º item: frase de abertura (no desktop sai da coluna, para a esquerda);
    // os demais são os parágrafos.
    pt: [
      'Bento Avellar, designer baseado em Niterói, RJ.',
      'Concluindo o curso de Design Gráfico na Universidade Veiga de Almeida. Suas soluções perpassam o desenvolvimento de sistemas visuais adaptáveis, muitas vezes guiados pela tipografia e pelas novas tecnologias.',
      'Fora da tela, vive os sons: produz eventos, músicas e oficinas que têm como eixo central a cena cultural niteroiense.',
    ],
    en: [
      'Bento Avellar, a designer based in Niterói, RJ.',
      'Completing a degree in Graphic Design at Universidade Veiga de Almeida. The work runs through the development of adaptable visual systems, often guided by typography and new technologies.',
      "Away from the screen, Bento lives through sound: producing events, music and workshops centered on Niterói's cultural scene.",
    ],
  },

  proficiencies: [
    'Motion',
    'Brand Design',
    'Creative Direction',
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

  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/_avllr_/' },
    { label: 'Linkedin', href: 'https://www.linkedin.com/in/bento-avellar-040666195/' },
  ],

  clients: ['CCBB', 'Valor Economico', 'Galeria Refresco', 'Cavaca Records', 'bg Real', 'Jungle Discos'],

  collaborators: ['Roma Joana', 'Augusto Erthal', 'Vitor Vigo', 'Rafaella Meigger', 'Tiago Ak'],

  credits: ['Site Design & Code by', 'Bento Avellar'],
}

const labels = {
  pt: {
    about: 'About',
    cta: 'Entre em contato para colaborarmos.',
    proficiencies: 'Proficiências',
    contact: 'Contato',
    clients: 'Clientes',
    collaborators: 'Colaborações',
    credits: 'Créditos',
  },
  en: {
    about: 'About',
    cta: "Get in touch and let's work together.",
    proficiencies: 'Proficiencies',
    contact: 'Contact',
    clients: 'Clients',
    collaborators: 'Collaborations',
    credits: 'Credits',
  },
}

// `aboutParts`: frase de abertura + parágrafos; `about`: tudo junto, em texto corrido.
export const getInfo = (lang) => ({
  ...shared,
  aboutParts: shared.about[lang],
  about: shared.about[lang].join(' '),
  labels: labels[lang],
})

// Conteúdo da tela Info. Editar textos aqui, sem tocar no layout.
// `shared` vale para os dois idiomas (exceto `about`, que tem pt/en);
// `labels` muda com o idioma.
const shared = {
  about: {
    pt: 'Bento Avellar é designer baseado em Niterói e cria desde 2019. Está concluindo Design Gráfico na Universidade Veiga de Almeida. Gosta de desenvolver sistemas visuais adaptáveis, muitas vezes guiados pela tipografia e pelas novas tecnologias. Fora da tela, vive de música e produz eventos que movimentam a cena cultural da cidade.',
    en: "Bento Avellar is a designer based in Niterói, creating since 2019. Currently completing a degree in Graphic Design at Universidade Veiga de Almeida. Drawn to building adaptable visual systems, often guided by typography and new technologies. Away from the screen, Bento lives for music and produces events that move the city's cultural scene.",
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

  clients: ['CCBB', 'Valor Economico', 'Galeria Refresco', 'Cavaca Records', 'bg Real', 'Trauma'],

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

export const getInfo = (lang) => ({ ...shared, about: shared.about[lang], labels: labels[lang] })

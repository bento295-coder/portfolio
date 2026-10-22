// Textos da interface (nav e menu) por idioma.
export const ui = {
  pt: {
    home: 'Bento Avellar, início',
    contact: 'Contato',
    open: 'ABRA',
    switchLang: 'Mudar o site para inglês',
    themeDark: 'Ativar tema escuro',
    themeLight: 'Ativar tema claro',
  },
  en: {
    home: 'Bento Avellar, home',
    contact: 'Contact',
    open: 'OPEN',
    switchLang: 'Switch site to Portuguese',
    themeDark: 'Switch to dark theme',
    themeLight: 'Switch to light theme',
  },
}

// O botão de idioma mostra o idioma para o qual o site vai trocar.
export const otherLangLabel = (lang) => (lang === 'pt' ? 'En' : 'Pt')

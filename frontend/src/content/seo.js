// Dados para busca (Google, IAs) e compartilhamento. Usado no navegador
// (título por página) e no build (scripts/seo-plugin.js gera o HTML estático,
// sitemap.xml e llms.txt). Sem imports: o build lê este arquivo direto no Node.

// Endereço público do site. Trocar aqui se mudar para um domínio próprio.
export const SITE_URL = 'https://portfolio-bento24.vercel.app'

export const seo = {
  name: 'Bento Avellar',
  alternateName: ['B-Av', 'Bento Avellar Design'],
  jobTitle: { pt: 'Designer gráfico', en: 'Graphic designer' },
  title: 'Bento Avellar — Designer gráfico',
  description:
    'Bento Avellar (B-Av) é designer gráfico baseado em Niterói, Rio de Janeiro, e cria desde 2019. Brand design, direção criativa, motion, type design e web: sistemas visuais adaptáveis guiados pela tipografia e pelas novas tecnologias.',
  locality: 'Niterói',
  region: 'Rio de Janeiro',
  country: 'BR',
  education: 'Universidade Veiga de Almeida',
  // imagem de compartilhamento (WhatsApp, LinkedIn, Google…) e retrato
  shareImage: '/projects/sim-sao-paulo/thumb.png',
  portrait: '/info/bento.webp',
}

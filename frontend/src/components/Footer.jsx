import { getInfo } from '../content/info.js'

// Footer da home e das páginas de projeto (fica de fora do Info):
// "B-Av" horizontal ao fundo; nome no topo e contato no pé da coluna 1;
// redes e © no topo da coluna 2.
export default function Footer({ lang }) {
  const { contact, social } = getInfo(lang)

  return (
    <footer className="footer">
      <div className="footer__logo" aria-hidden="true" />

      {/* Coluna 1: nome no topo, contato no pé. */}
      <div className="footer__col">
        <p>Bento Avellar</p>
        <div>
          <a className="footer__link" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
          <address className="footer__address">
            {contact.country}
            <br />
            <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
            <br />
            {contact.city}
          </address>
        </div>
      </div>

      {/* Coluna 2: redes à esquerda e © à direita, ambos no topo. */}
      <div className="footer__col footer__col--2">
        <ul className="footer__social">
          {social.map((s) => (
            <li key={s.label}>
              <a className="footer__link" href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p>© {new Date().getFullYear()}</p>
      </div>
    </footer>
  )
}

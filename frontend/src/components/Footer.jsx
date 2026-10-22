import { getInfo } from '../content/info.js'

// Footer da home e das páginas de projeto (fica de fora do Info):
// "B-Av" horizontal ao fundo; por cima, um pouco abaixo do topo do logo,
// nome e contato (coluna 1) e redes + ano (coluna 2). Embaixo, os direitos.
export default function Footer({ lang }) {
  const { contact, social } = getInfo(lang)

  return (
    <footer className="footer">
      <div className="footer__logo" aria-hidden="true" />

      {/* Coluna 1: nome, e-mail e endereço, separados por uma linha em branco. */}
      <div className="footer__col">
        <p>Bento Avellar</p>
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

      {/* Coluna 2: redes à esquerda e ano à direita, na linha do nome. */}
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
        <p>{new Date().getFullYear()}</p>
      </div>

      <p className="footer__rights">All rights reserved © Bento Avellar</p>
    </footer>
  )
}

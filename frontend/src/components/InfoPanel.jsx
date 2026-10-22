import { useLayoutEffect, useRef } from 'react'
import { getInfo } from '../content/info.js'

// No celular o Info cabe inteiro na tela, sem rolagem: a foto da nav fica
// com a altura que sobra (medida aqui, em --photo-max). 31px = o que fica
// acima do Info além da foto (nav e respiros, já descontado o recuo do
// rótulo "About"). Recalcula ao trocar idioma (ResizeObserver) e ao girar
// ou a barra do navegador mudar de tamanho.
const ABOVE_INFO = 31

function usePhotoFit(ref) {
  useLayoutEffect(() => {
    const info = ref.current
    const root = document.documentElement
    const mq = window.matchMedia('(max-width: 899px)')
    const fit = () => {
      if (!mq.matches) return root.style.removeProperty('--photo-max')
      // altura visível de fato (a menor entre as medidas do navegador)
      const screen = Math.min(window.innerHeight, root.clientHeight, window.visualViewport?.height ?? Infinity)
      const room = screen - ABOVE_INFO - info.offsetHeight
      root.style.setProperty('--photo-max', `${Math.max(80, Math.floor(room))}px`)
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(info)
    window.addEventListener('resize', fit)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [ref])
}

function Label({ children }) {
  return <h2 className="info__label">{children}</h2>
}

// Links para outros sites abrem em nova aba, para o portfólio continuar aberto.
function ExternalLink({ href, children }) {
  const external = /^https?:\/\//.test(href)
  return (
    <a href={href} {...(external && { target: '_blank', rel: 'noopener noreferrer' })}>
      {children}
    </a>
  )
}

function List({ items, className = '' }) {
  return (
    <ul className={`info__list ${className}`}>
      {items.map((item) => (
        <li key={item.label ?? item}>
          {item.href ? <ExternalLink href={item.href}>{item.label}</ExternalLink> : item}
        </li>
      ))}
    </ul>
  )
}

// Célula do grid de 2 colunas abaixo do About: rótulo + conteúdo.
function Cell({ label, index, className = '', children }) {
  return (
    <div className={`info__block info__cell ${className}`} style={{ '--i': index }}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

export default function InfoPanel({ lang, leaving }) {
  const info = getInfo(lang)
  const { contact, labels } = info
  const ref = useRef(null)
  usePhotoFit(ref)
  // A frase de abertura é um bloco à parte: no desktop ela sai da coluna,
  // para a esquerda (ver .info__lead no CSS); no celular abre o 1º parágrafo.
  const [lead, first, ...more] = info.aboutParts

  return (
    <section ref={ref} id="info" className={`info${leaving ? ' is-leaving' : ''}`} aria-label="Info">
      <div className="info__block info__span info__about" style={{ '--i': 0 }}>
        <Label>{labels.about}</Label>
        <p className="info__text">
          <span className="info__lead">{lead}</span> {first}
        </p>
        {more.map((text) => (
          <p key={text} className="info__text">
            {text}
          </p>
        ))}
      </div>

      <p className="info__block info__col2 info__cta" style={{ '--i': 1 }}>
        {labels.cta}
      </p>

      <div className="info__grid">
        <Cell label={labels.proficiencies} index={2}>
          <List items={info.proficiencies} />
        </Cell>

        <Cell label={labels.contact} index={2}>
          <a className="info__link" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
          <address className="info__address">
            {contact.country}
            <br />
            <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
            <br />
            {contact.city}
          </address>
          <List items={info.social} className="info__social" />
        </Cell>

        <Cell label={labels.clients} index={3}>
          <List items={info.clients} className="info__list--loose" />
        </Cell>

        <Cell label={labels.collaborators} index={3}>
          <List items={info.collaborators} className="info__list--loose" />
        </Cell>

        <Cell label={labels.credits} index={4} className="info__cell--col2">
          <p>
            {info.credits[0]}
            <br />
            {info.credits[1]}
          </p>
        </Cell>
      </div>
    </section>
  )
}

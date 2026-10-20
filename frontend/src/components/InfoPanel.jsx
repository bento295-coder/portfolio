import { getInfo } from '../content/info.js'

function Label({ children }) {
  return <h2 className="info__label">{children}</h2>
}

function List({ items, className = '' }) {
  return (
    <ul className={`info__list ${className}`}>
      {items.map((item) => (
        <li key={item.label ?? item}>
          {item.href ? <a href={item.href}>{item.label}</a> : item}
        </li>
      ))}
    </ul>
  )
}

// Célula do grid de 2 colunas abaixo do About: rótulo + conteúdo.
function Cell({ label, index, children }) {
  return (
    <div className="info__block info__cell" style={{ '--i': index }}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

export default function InfoPanel({ lang, leaving }) {
  const info = getInfo(lang)
  const { contact, labels } = info

  return (
    <section id="info" className={`info${leaving ? ' is-leaving' : ''}`} aria-label="Info">
      <div className="info__block info__span info__about" style={{ '--i': 0 }}>
        <Label>{labels.about}</Label>
        <p>{info.about}</p>
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

        <Cell label={labels.untitled} index={4} />

        <Cell label={labels.credits} index={4}>
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

import { getInfo } from '../content/info.js'

function Label({ children }) {
  return <h2 className="info__label">{children}</h2>
}

function List({ items }) {
  return (
    <ul className="info__list">
      {items.map((item) => (
        <li key={item.label ?? item}>
          {item.href ? <a href={item.href}>{item.label}</a> : item}
        </li>
      ))}
    </ul>
  )
}

// Bloco com rótulo e lista distribuída nas duas colunas do grid.
function SplitList({ label, columns, index }) {
  return (
    <div className="info__block info__span info__split" style={{ '--i': index }}>
      <Label>{label}</Label>
      <div className="info__cols">
        {columns.map((col, i) => (
          <List key={i} items={col} />
        ))}
      </div>
    </div>
  )
}

export default function InfoPanel({ lang, leaving }) {
  const info = getInfo(lang)
  const { contact, labels } = info

  return (
    <section id="info" className={`info${leaving ? ' is-leaving' : ''}`} aria-label="Info">
      <div className="info__block info__span" style={{ '--i': 0 }}>
        <Label>{labels.about}</Label>
        <p>{info.about}</p>
      </div>

      <p className="info__block info__col2 info__cta" style={{ '--i': 1 }}>
        {labels.cta}
      </p>

      <div className="info__block info__section" style={{ '--i': 2 }}>
        <Label>{labels.proficiencies}</Label>
        <List items={info.proficiencies} />
      </div>

      <div className="info__block info__section" style={{ '--i': 3 }}>
        <Label>{labels.contact}</Label>
        <a className="info__email" href={`mailto:${contact.email}`}>
          {contact.email}
        </a>
        <address className="info__address">
          {contact.country}
          <br />
          <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
          <br />
          {contact.city}
        </address>
        <div className="info__social">
          <List items={info.social} />
        </div>
      </div>

      <SplitList label={labels.clients} columns={info.clients} index={4} />
      <SplitList label={labels.collaborators} columns={info.collaborators} index={5} />
    </section>
  )
}

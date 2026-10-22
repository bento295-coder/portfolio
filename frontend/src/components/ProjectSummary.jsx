import { useState } from 'react'
import { Link } from 'react-router-dom'
import { projectLabels } from '../content/projects.js'

function Meta({ label, value }) {
  if (!value) return null
  return (
    <div className="project__meta-item">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

// Ano / Serviço / Cliente / Colaboração, em 2 colunas (campos vazios somem).
export function ProjectMeta({ project, lang }) {
  const labels = projectLabels[lang]
  return (
    <dl className="project__meta">
      <Meta label={labels.year} value={project.year} />
      <Meta label={labels.service} value={project.service} />
      <Meta label={labels.client} value={project.client} />
      <Meta label={labels.collaboration} value={project.collaboration} />
    </dl>
  )
}

// Barra "título | + info" e os detalhes que abrem embaixo.
// Usada no card da home.
export default function ProjectSummary({ project, lang, titleTo, titleAs: Title = 'h2' }) {
  const [open, setOpen] = useState(false)
  const detailsId = `project-details-${project.id}`

  return (
    <div className={`project__summary${open ? ' is-open' : ''}`}>
      <div className="project__bar">
        <Title className="project__title">
          {titleTo ? <Link to={titleTo}>{project.title}</Link> : project.title}
        </Title>
        <button
          type="button"
          className="project__toggle"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={detailsId}
        >
          <span className="project__sign" aria-hidden="true" />
          info
        </button>
      </div>

      <div id={detailsId} className="project__details" inert={open ? undefined : ''}>
        <div className="project__details-clip">
          <div className="project__details-inner">
            <p className="project__desc">{project.description[lang]}</p>
            <ProjectMeta project={project} lang={lang} />
          </div>
        </div>
      </div>
    </div>
  )
}

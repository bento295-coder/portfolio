import { useState } from 'react'
import { Link } from 'react-router-dom'
import { projectLabels } from '../content/projects.js'

function Meta({ label, value }) {
  return (
    <div className="project__meta-item">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

// Barra "título | + info" e os detalhes que abrem embaixo.
// Usada no card da home e no topo da página do projeto.
export default function ProjectSummary({ project, lang, titleTo, titleAs: Title = 'h2' }) {
  const [open, setOpen] = useState(false)
  const labels = projectLabels[lang]
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
            <dl className="project__meta">
              <Meta label={labels.year} value={project.year} />
              <Meta label={labels.service} value={project.service} />
              <Meta label={labels.client} value={project.client} />
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

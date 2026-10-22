import { Navigate, useParams } from 'react-router-dom'
import { getProject } from '../content/projects.js'
import Media from './Media.jsx'
import { ProjectMeta } from './ProjectSummary.jsx'

// Página do projeto: sem thumb. Abre com a primeira imagem da galeria; logo
// depois vêm os detalhes (o que na home é o "+ info"), fixos e abertos:
// título grande, texto, dados; e então o resto da galeria.
export default function ProjectPage({ lang }) {
  const { id } = useParams()
  const project = getProject(id)

  if (!project) return <Navigate to="/" replace />

  const [first, ...rest] = project.images
  const image = (media, i) => (
    <Media
      key={i}
      media={media}
      alt={`${project.title}, imagem ${i + 1}`}
      className="project-page__image"
      eager={i === 0}
    />
  )

  return (
    <article className="project-page" key={project.id}>
      {first && image(first, 0)}

      <header className="project-page__head">
        <h1 className="project-page__title">{project.title}</h1>
        <p className="project-page__desc">{project.description[lang]}</p>
        <ProjectMeta project={project} lang={lang} />
      </header>

      {rest.length > 0 && (
        <div className="project-page__gallery">{rest.map((media, i) => image(media, i + 1))}</div>
      )}
    </article>
  )
}

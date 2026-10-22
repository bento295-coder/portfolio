import { Navigate, useParams } from 'react-router-dom'
import { getProject } from '../content/projects.js'
import Media from './Media.jsx'
import { ProjectMeta } from './ProjectSummary.jsx'

// Página do projeto: sem thumb. Abre direto com os detalhes (o que na home
// é o "+ info"), fixos e abertos: título grande, texto, dados; depois a galeria.
export default function ProjectPage({ lang }) {
  const { id } = useParams()
  const project = getProject(id)

  if (!project) return <Navigate to="/" replace />

  return (
    <article className="project-page" key={project.id}>
      <header className="project-page__head">
        <h1 className="project-page__title">{project.title}</h1>
        <p className="project-page__desc">{project.description[lang]}</p>
        <ProjectMeta project={project} lang={lang} />
      </header>

      <div className="project-page__gallery">
        {project.images.map((media, i) => (
          <Media
            key={i}
            media={media}
            alt={`${project.title}, imagem ${i + 1}`}
            className="project-page__image"
            eager={i === 0}
          />
        ))}
      </div>
    </article>
  )
}

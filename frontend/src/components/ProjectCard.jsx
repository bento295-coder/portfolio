import { Link } from 'react-router-dom'
import { projectPath } from '../content/projects.js'
import Media from './Media.jsx'
import ProjectSummary from './ProjectSummary.jsx'

// Card da home: a imagem e o título levam à página do projeto; "+ info" abre os detalhes ali mesmo.
export default function ProjectCard({ project, lang, index }) {
  const to = projectPath(project.id)

  return (
    <article className="project" style={{ '--i': index }}>
      <Link to={to} className="project__media-link" tabIndex={-1} aria-hidden="true">
        <Media media={project.thumb} className="project__media" />
      </Link>
      <ProjectSummary project={project} lang={lang} titleTo={to} />
    </article>
  )
}

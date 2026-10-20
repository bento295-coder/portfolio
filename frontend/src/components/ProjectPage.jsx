import { Navigate, useParams } from 'react-router-dom'
import { getProject } from '../content/projects.js'
import Media from './Media.jsx'
import ProjectSummary from './ProjectSummary.jsx'

// Na página, a thumb é mais alta que na home (16:9) para ocupar mais área
// vertical e deixar "título | + info" perto do meio da tela ao abrir.
// 3:4 no frame de 402px = 536px de altura.
const PAGE_THUMB_RATIO = '3:4'

// Página do projeto: thumb sangrando no topo (a nav fica por cima),
// barra "título | + info" e as fotos do projeto.
export default function ProjectPage({ lang, onThumbRevealed }) {
  const { id } = useParams()
  const project = getProject(id)

  if (!project) return <Navigate to="/" replace />

  // pageThumb (opcional) permite uma imagem própria para a página; senão recorta a thumb.
  const thumb = project.pageThumb ?? { ...project.thumb, ratio: PAGE_THUMB_RATIO }

  return (
    <article className="project-page" key={project.id}>
      <Media
        media={thumb}
        alt={project.title}
        className="project-page__thumb"
        eager
        // avisa quando a thumb termina de se revelar (a nav entra depois)
        onAnimationEnd={(e) => e.animationName === 'reveal-down' && onThumbRevealed?.()}
      />

      <div className="project-page__body">
        <ProjectSummary project={project} lang={lang} titleAs="h1" />

        <div className="project-page__gallery">
          {project.images.map((media, i) => (
            <Media
              key={i}
              media={media}
              alt={`${project.title}, imagem ${i + 1}`}
              className="project-page__image"
            />
          ))}
        </div>
      </div>
    </article>
  )
}

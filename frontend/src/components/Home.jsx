import { projects } from '../content/projects.js'
import ProjectCard from './ProjectCard.jsx'

export default function Home({ lang }) {
  return (
    <section id="projetos" className="home" aria-label="Projetos">
      {projects.map((project, i) => (
        <ProjectCard key={project.id} project={project} lang={lang} index={i} />
      ))}
    </section>
  )
}

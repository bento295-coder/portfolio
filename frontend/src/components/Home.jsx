import { home } from '../content/home.js'
import { projects } from '../content/projects.js'
import ProjectCard from './ProjectCard.jsx'

export default function Home({ lang }) {
  return (
    <div className="home">
      {/* Abertura: ocupa a primeira tela. O "B-Av" é uma camada de vidro
          (tinta translúcida + desfoque) por cima da frase. */}
      <section className="hero">
        <h1 className="hero__intro">{home.intro[lang]}</h1>
        <div className="hero__logo" aria-hidden="true" />
      </section>

      <section id="projetos" className="home__projects" aria-label="Projetos">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} lang={lang} index={i} />
        ))}
      </section>
    </div>
  )
}

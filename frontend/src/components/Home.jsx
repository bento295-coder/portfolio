import { home } from '../content/home.js'
import { projects } from '../content/projects.js'
import ProjectCard from './ProjectCard.jsx'
import Typewriter from './Typewriter.jsx'

export default function Home({ lang, onIntroDone }) {
  return (
    <div className="home">
      {/* Abertura: ocupa a primeira tela. O "B-Av" é uma camada de vidro
          (tinta translúcida + desfoque) por cima da frase. */}
      <section className="hero">
        {/* key: troca de idioma reinicia a escrita */}
        <Typewriter
          key={lang}
          as="h1"
          className="hero__intro"
          text={home.intro[lang]}
          onDone={onIntroDone}
        />
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

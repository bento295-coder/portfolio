import { useEffect, useState } from 'react'
import { home } from '../content/home.js'
import { projects } from '../content/projects.js'
import ProjectCard from './ProjectCard.jsx'
import Typewriter from './Typewriter.jsx'

// Abertura do celular: a frase é escrita → a nav entra → a frase se apaga de
// trás para frente e o "B-Av" some de cima para baixo (o inverso da entrada)
// → a abertura sai e os projetos aparecem.
// Roda uma vez por visita; voltando à home, os projetos vêm direto. No desktop
// (≥ 900px) a abertura é a DesktopIntro; com movimento reduzido, não há.
const ERASE_AFTER_MS = 600 // depois que a nav começa a entrar
const LOGO_OUT_MS = 1100 // igual ao CSS (.hero.is-leaving .hero__logo)

let heroPlayed = false

const skipHero = () =>
  heroPlayed ||
  window.matchMedia('(min-width: 900px)').matches ||
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Home({ lang, onIntroDone }) {
  // typing → leaving → done
  const [phase, setPhase] = useState(() => (skipHero() ? 'done' : 'typing'))
  const [erased, setErased] = useState(false)
  const [logoOut, setLogoOut] = useState(false)

  useEffect(() => {
    // sem abertura, a nav não espera
    if (phase === 'done') onIntroDone?.()
  }, [phase, onIntroDone])

  useEffect(() => {
    if (phase !== 'leaving') return
    const t = setTimeout(() => setLogoOut(true), LOGO_OUT_MS)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (erased && logoOut) {
      heroPlayed = true
      window.scrollTo(0, 0)
      setPhase('done')
    }
  }, [erased, logoOut])

  const onTyped = () => {
    onIntroDone?.()
    setTimeout(() => setPhase((p) => (p === 'typing' ? 'leaving' : p)), ERASE_AFTER_MS)
  }

  return (
    <div className={`home${phase === 'done' ? '' : ' is-intro'}`}>
      {/* Abertura: ocupa a primeira tela. O "B-Av" é uma camada de vidro
          (tinta translúcida + desfoque) por cima da frase. */}
      {phase !== 'done' && (
        <section className={`hero${phase === 'leaving' ? ' is-leaving' : ''}`}>
          {/* key: troca de idioma reinicia a escrita */}
          <Typewriter
            key={lang}
            as="h1"
            className="hero__intro"
            text={home.intro[lang]}
            onDone={onTyped}
            erasing={phase === 'leaving'}
            onErased={() => setErased(true)}
          />
          <div className="hero__logo" aria-hidden="true" />
        </section>
      )}
      {phase === 'done' && <h1 className="sr-only">{home.intro[lang]}</h1>}

      <section id="projetos" className="home__projects" aria-label="Projetos">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} lang={lang} index={i} />
        ))}
      </section>
    </div>
  )
}

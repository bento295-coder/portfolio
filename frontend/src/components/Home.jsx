import { useEffect, useState } from 'react'
import { home } from '../content/home.js'
import { projects } from '../content/projects.js'
import ProjectCard from './ProjectCard.jsx'
import Typewriter from './Typewriter.jsx'

// Abertura do celular: a frase é escrita → a nav entra → ~2s para ler →
// o "B-Av" some de cima para baixo (o inverso da entrada) → depois a frase se
// apaga de trás para frente → a abertura sai e os projetos aparecem.
// Roda uma vez por visita; voltando à home, os projetos vêm direto. No desktop
// (≥ 900px) a abertura é a DesktopIntro; com movimento reduzido, não há.
const READ_MS = 2000 // pausa para ler, depois da última letra
const LOGO_OUT_MS = 1100 // igual ao CSS (.hero.is-leaving .hero__logo)

let heroPlayed = false

const skipHero = () =>
  heroPlayed ||
  window.matchMedia('(min-width: 900px)').matches ||
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Home({ lang, onIntroDone }) {
  // typing → logo-out → erasing → done
  const [phase, setPhase] = useState(() => (skipHero() ? 'done' : 'typing'))

  useEffect(() => {
    // sem abertura, a nav não espera
    if (phase === 'done') onIntroDone?.()
  }, [phase, onIntroDone])

  useEffect(() => {
    if (phase !== 'logo-out') return
    const t = setTimeout(() => setPhase('erasing'), LOGO_OUT_MS)
    return () => clearTimeout(t)
  }, [phase])

  const onTyped = () => {
    onIntroDone?.()
    setTimeout(() => setPhase((p) => (p === 'typing' ? 'logo-out' : p)), READ_MS)
  }

  const onErased = () => {
    heroPlayed = true
    window.scrollTo(0, 0)
    setPhase('done')
  }

  return (
    <div className={`home${phase === 'done' ? '' : ' is-intro'}`}>
      {/* Abertura: ocupa a primeira tela. O "B-Av" é uma camada de vidro
          (tinta translúcida + desfoque) por cima da frase. */}
      {phase !== 'done' && (
        <section className={`hero${phase === 'typing' ? '' : ' is-leaving'}`}>
          {/* key: troca de idioma reinicia a escrita */}
          <Typewriter
            key={lang}
            as="h1"
            className="hero__intro"
            text={home.intro[lang]}
            onDone={onTyped}
            erasing={phase === 'erasing'}
            onErased={onErased}
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

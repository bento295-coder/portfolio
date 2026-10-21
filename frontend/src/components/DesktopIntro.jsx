import { useEffect, useState } from 'react'
import { home } from '../content/home.js'
import Typewriter from './Typewriter.jsx'

// Abertura do desktop (≥ 900px, só na primeira entrada pela home):
// fundo cinza → frase escrita letra a letra → "B-Av" horizontal entra por
// cima, em vidro branco → pausa → a abertura sai e revela a home.
// Clique ou tecla pulam. No celular a abertura é o hero da Home.
const LOGO_DELAY_MS = 150 // depois da última letra
const HOLD_MS = 1900 // revelação do logo (900ms) + ~1s parado antes de sair
const EXIT_MS = 800 // duração da saída (igual ao CSS)

export default function DesktopIntro({ lang, onDone }) {
  // typing → logo → leaving
  const [phase, setPhase] = useState('typing')

  useEffect(() => {
    if (phase === 'logo') {
      const t = setTimeout(() => setPhase('leaving'), HOLD_MS)
      return () => clearTimeout(t)
    }
    if (phase === 'leaving') {
      const t = setTimeout(onDone, EXIT_MS)
      return () => clearTimeout(t)
    }
  }, [phase, onDone])

  // pular: qualquer clique ou tecla
  useEffect(() => {
    const skip = () => setPhase((p) => (p === 'leaving' ? p : 'leaving'))
    window.addEventListener('pointerdown', skip)
    window.addEventListener('keydown', skip)
    return () => {
      window.removeEventListener('pointerdown', skip)
      window.removeEventListener('keydown', skip)
    }
  }, [])

  return (
    <div className={`d-intro is-${phase}`} aria-hidden="true">
      <Typewriter
        className="d-intro__text"
        text={home.intro[lang]}
        onDone={() => setTimeout(() => setPhase((p) => (p === 'typing' ? 'logo' : p)), LOGO_DELAY_MS)}
      />
      <div className="d-intro__logo" />
    </div>
  )
}

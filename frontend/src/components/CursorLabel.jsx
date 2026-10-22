import { useEffect, useRef, useState } from 'react'

// Rótulo que acompanha o mouse sobre elementos com `data-cursor` (ex.: as
// thumbs da home → "Abra"/"Open"): texto branco, sem fundo, no lugar da seta.
// Só no desktop (≥ 900px, com mouse).
const QUERY = '(min-width: 900px) and (hover: hover) and (pointer: fine)'

export default function CursorLabel({ label }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [enabled, setEnabled] = useState(() => window.matchMedia(QUERY).matches)

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const onChange = () => setEnabled(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!enabled) return
    let x = -1
    let y = -1
    const check = (target) => setVisible(!!target?.closest?.('[data-cursor]'))
    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      // posição direto no estilo, sem re-render a cada movimento
      ref.current?.style.setProperty('translate', `${x}px ${y}px`)
      check(e.target)
    }
    // ao rolar, o que está sob o mouse muda sem o mouse se mexer
    const onScroll = () => x >= 0 && check(document.elementFromPoint(x, y))
    const onLeave = () => setVisible(false)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <div ref={ref} className={`cursor-label${visible ? ' is-visible' : ''}`} aria-hidden="true">
      <span>{label}</span>
    </div>
  )
}

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ui } from '../content/ui.js'

// Troca de rótulo com crossfade: os dois textos ficam empilhados e só um aparece.
function SwapLabel({ from, to, swapped, toRef }) {
  return (
    <span className="swap" data-swapped={swapped}>
      <span className="swap__from" aria-hidden={swapped}>{from}</span>
      <span className="swap__to" aria-hidden={!swapped} ref={toRef}>{to}</span>
    </span>
  )
}

// Rótulo do botão de idioma: mostra o idioma para o qual o site vai trocar.
function LangLabel({ lang }) {
  return <SwapLabel from="Pt" to="En" swapped={lang === 'pt'} />
}

// Mede a largura final do botão da direita (rótulo + padding) e expõe como
// --extra-open, para a animação terminar exatamente nela em vez de ser
// cortada pelo min-content no meio da curva.
function useOpenWidth(navRef, labelRef) {
  useLayoutEffect(() => {
    const label = labelRef.current
    const nav = navRef.current
    if (!label || !nav) return

    const update = () => {
      const btn = label.closest('.navbar__btn')
      const s = getComputedStyle(btn)
      const w = label.offsetWidth + parseFloat(s.paddingLeft) + parseFloat(s.paddingRight)
      // na raiz: o Info no desktop também se alinha por essa medida
      document.documentElement.style.setProperty('--extra-open', `${Math.ceil(w)}px`)
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(label)
    return () => ro.disconnect()
  }, [navRef, labelRef])
}

// Fecha o menu com clique fora ou Esc. O Esc é capturado antes do listener
// do Info, para fechar só o menu quando ele estiver aberto.
function useDismiss(open, ref, close) {
  useEffect(() => {
    if (!open) return
    const onPointer = (e) => !ref.current?.contains(e.target) && close()
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      e.stopPropagation()
      close()
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey, true)
    }
  }, [open, ref, close])
}

// Esconde ao rolar para baixo e volta ao rolar para cima (só onde `enabled`).
// Perto do topo fica sempre visível; ignora tremidas menores que 4px.
function useHideOnScroll(enabled) {
  const [tucked, setTucked] = useState(false)

  useEffect(() => {
    setTucked(false)
    if (!enabled) return
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      const delta = y - last
      if (Math.abs(delta) < 4) return
      setTucked(delta > 0 && y > 80)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [enabled])

  return tucked
}

// O menu abre na própria linha da nav. O botão "Menu" encolhe da
// direita para a esquerda e as ações surgem da esquerda para a direita, no
// mesmo espaço (CSS: .is-inline-open). Sem interação por IDLE_MS, fecha
// fazendo o caminho inverso.
const IDLE_MS = 4000

// Fecha depois de IDLE_MS sem interação; `poke` recomeça a contagem.
function useIdleClose(open, close) {
  const timer = useRef(null)
  const poke = () => {
    clearTimeout(timer.current)
    if (open) timer.current = setTimeout(close, IDLE_MS)
  }
  useEffect(() => {
    poke()
    return () => clearTimeout(timer.current)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps
  return poke
}

function InlineMenu({ open, lang, onToggleLang, theme, onToggleTheme, email, onClose }) {
  const t = ui[lang]
  const dark = theme === 'dark'

  return (
    <div id="nav-menu" className="navinline" inert={open ? undefined : ''}>
      <a className="navbar__btn" href={`mailto:${email}`} onClick={onClose} style={{ '--i': 0 }}>
        <SwapLabel from="Contato" to="Contact" swapped={lang === 'en'} />
      </a>
      <button
        type="button"
        className="navbar__btn navinline__lang"
        onClick={onToggleLang}
        aria-label={t.switchLang}
        style={{ '--i': 1 }}
      >
        <LangLabel lang={lang} />
      </button>
      <button
        type="button"
        className="navmenu__theme"
        onClick={onToggleTheme}
        aria-pressed={dark}
        aria-label={dark ? t.themeLight : t.themeDark}
        style={{ '--i': 2 }}
      >
        <span className="navmenu__knob" />
      </button>
    </div>
  )
}

export default function NavBar({
  hidden,
  hideOnScroll,
  infoOpen,
  onHome,
  onToggleInfo,
  lang,
  onToggleLang,
  theme,
  onToggleTheme,
  email,
  photoSrc,
}) {
  const navRef = useRef(null)
  const extraLabelRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const t = ui[lang]
  const inlineOpen = menuOpen && !infoOpen
  const pokeIdle = useIdleClose(inlineOpen, () => setMenuOpen(false))

  useOpenWidth(navRef, extraLabelRef)
  useDismiss(menuOpen, navRef, () => setMenuOpen(false))
  // Com Menu ou Info abertos, a nav não se esconde.
  const tucked = useHideOnScroll(hideOnScroll) && !menuOpen && !infoOpen

  const closeMenuAnd = (fn) => () => {
    setMenuOpen(false)
    fn()
  }

  return (
    <nav
      ref={navRef}
      className={`navbar${infoOpen ? ' is-info' : ''}${hidden ? ' is-intro' : ''}${tucked ? ' is-tucked' : ''}`}
      aria-label="Principal"
      inert={hidden ? '' : undefined}
    >
      <div className="navbar__cell navbar__cell--home">
        <button type="button" className="navbar__btn" onClick={closeMenuAnd(onHome)} aria-label={t.home}>
          <SwapLabel from="Bento Avellar" to="B - Av" swapped={infoOpen} />
        </button>
      </div>

      <div className="navbar__cell navbar__cell--info">
        <button
          type="button"
          className="navbar__btn"
          onClick={closeMenuAnd(onToggleInfo)}
          aria-expanded={infoOpen}
          aria-controls="info-photo"
        >
          Info
        </button>
        <div id="info-photo" className="navbar__photo" aria-hidden={!infoOpen}>
          <div className="navbar__photo-clip">
            <div className="navbar__photo-frame">
              {photoSrc && (
                <div
                  className="navbar__photo-ink"
                  role="img"
                  aria-label="Retrato de Bento Avellar"
                  style={{ '--photo': `url(${photoSrc})` }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Na home é o "Menu"; com o Info aberto vira o botão de idioma. */}
      <div
        className={`navbar__cell navbar__cell--extra${inlineOpen ? ' is-inline-open' : ''}`}
        onPointerMove={inlineOpen ? pokeIdle : undefined}
        onFocus={inlineOpen ? pokeIdle : undefined}
        onClick={inlineOpen ? pokeIdle : undefined}
      >
        <button
          type="button"
          className="navbar__btn"
          inert={inlineOpen ? '' : undefined}
          onClick={infoOpen ? onToggleLang : () => setMenuOpen((open) => !open)}
          aria-expanded={infoOpen ? undefined : menuOpen}
          aria-controls={infoOpen ? undefined : 'nav-menu'}
          aria-label={infoOpen ? t.switchLang : undefined}
        >
          <SwapLabel from="Menu" to={<LangLabel lang={lang} />} swapped={infoOpen} toRef={extraLabelRef} />
        </button>
        <InlineMenu
          open={inlineOpen}
          lang={lang}
          onToggleLang={onToggleLang}
          theme={theme}
          onToggleTheme={onToggleTheme}
          email={email}
          onClose={() => setMenuOpen(false)}
        />
      </div>
    </nav>
  )
}

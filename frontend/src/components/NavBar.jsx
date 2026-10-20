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
      nav.style.setProperty('--extra-open', `${Math.ceil(w)}px`)
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

function Menu({ open, lang, onToggleLang, theme, onToggleTheme, email, onClose }) {
  const t = ui[lang]
  const dark = theme === 'dark'

  return (
    <div id="nav-menu" className={`navmenu${open ? ' is-open' : ''}`} inert={open ? undefined : ''}>
      <div className="navmenu__row" style={{ '--i': 0 }}>
        <button type="button" className="navbar__btn" onClick={onToggleLang} aria-label={t.switchLang}>
          <LangLabel lang={lang} />
        </button>
        <button
          type="button"
          className="navmenu__theme"
          onClick={onToggleTheme}
          aria-pressed={dark}
          aria-label={dark ? t.themeLight : t.themeDark}
        >
          <span className="navmenu__knob" />
        </button>
      </div>
      <a className="navbar__btn" href={`mailto:${email}`} onClick={onClose} style={{ '--i': 1 }}>
        <SwapLabel from="Contato" to="Contact" swapped={lang === 'en'} />
      </a>
    </div>
  )
}

export default function NavBar({
  hidden,
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

  useOpenWidth(navRef, extraLabelRef)
  useDismiss(menuOpen, navRef, () => setMenuOpen(false))

  const closeMenuAnd = (fn) => () => {
    setMenuOpen(false)
    fn()
  }

  return (
    <nav
      ref={navRef}
      className={`navbar${infoOpen ? ' is-info' : ''}${hidden ? ' is-intro' : ''}`}
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
              {photoSrc && <img src={photoSrc} alt="Retrato de Bento Avellar" />}
            </div>
          </div>
        </div>
      </div>

      {/* Na home é o "Menu"; com o Info aberto vira o botão de idioma. */}
      <div className="navbar__cell navbar__cell--extra">
        <button
          type="button"
          className="navbar__btn"
          onClick={infoOpen ? onToggleLang : () => setMenuOpen((open) => !open)}
          aria-expanded={infoOpen ? undefined : menuOpen}
          aria-controls={infoOpen ? undefined : 'nav-menu'}
          aria-label={infoOpen ? t.switchLang : undefined}
        >
          <SwapLabel from="Menu" to={<LangLabel lang={lang} />} swapped={infoOpen} toRef={extraLabelRef} />
        </button>
        <Menu
          open={menuOpen && !infoOpen}
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

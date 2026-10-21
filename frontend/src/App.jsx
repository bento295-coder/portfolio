import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import InfoPanel from './components/InfoPanel.jsx'
import Home from './components/Home.jsx'
import ProjectPage from './components/ProjectPage.jsx'
import Footer from './components/Footer.jsx'
import { getInfo } from './content/info.js'

const INFO_EXIT_MS = 250
// No modo camada, a página só volta depois que a foto da nav recolhe (450ms),
// senão o conteúdo pularia enquanto a nav encolhe.
const INFO_EXIT_OVERLAY_MS = 500

// Como o Info aparece (em teste, decisão do usuário):
//   'overlay' → camada translúcida por cima da página atual
//   'page'    → substitui a página (versão anterior)
const INFO_MODE = 'overlay'

// Mantém o componente montado durante a animação de saída.
function usePresence(open, exitMs) {
  const [mounted, setMounted] = useState(open)

  useEffect(() => {
    if (open) {
      setMounted(true)
      return
    }
    const t = setTimeout(() => setMounted(false), exitMs)
    return () => clearTimeout(t)
  }, [open, exitMs])

  return mounted
}

// Estado lembrado entre visitas. localStorage pode falhar (aba privada etc.).
function useStoredState(key, getDefault) {
  const [value, setValue] = useState(() => {
    try {
      return localStorage.getItem(key) ?? getDefault()
    } catch {
      return getDefault()
    }
  })

  const set = (next) => {
    setValue(next)
    try {
      localStorage.setItem(key, next)
    } catch {}
  }

  return [value, set]
}

const browserLang = () => (navigator.language?.toLowerCase().startsWith('pt') ? 'pt' : 'en')

// No desktop quem rola é o frame (.screen); no mobile, a janela.
function scrollToTop(screenRef) {
  screenRef.current?.scrollTo(0, 0)
  window.scrollTo(0, 0)
}

// Volta ao topo ao trocar de página e ao abrir o Info (com o Info aberto a nav
// deixa de ser fixa e precisa estar visível). Fechar o Info não mexe na rolagem.
function useScrollTop(screenRef, infoOpen) {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    scrollToTop(screenRef)
  }, [pathname, screenRef])

  useLayoutEffect(() => {
    if (infoOpen) scrollToTop(screenRef)
  }, [infoOpen, screenRef])
}

// Na primeira entrada pela home, a nav só aparece quando a abertura termina
// (fim da escrita da frase). Entrando direto num projeto, ou com movimento
// reduzido, aparece na hora. Trava de segurança: 4s.
function useIntroGate() {
  const [done, setDone] = useState(
    () =>
      window.location.pathname !== '/' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (done) return
    const t = setTimeout(() => setDone(true), 4000)
    return () => clearTimeout(t)
  }, [done])

  return [done, () => setDone(true)]
}

const NAV_AFTER_THUMB_MS = 300

// Na página do projeto, a nav sai de cena até a thumb terminar de se revelar
// (+ um instante), para a thumb ser vista inteira. Trava de segurança: 2,5s
// (ex.: movimento reduzido, quando a animação da thumb não roda).
function useProjectNavHold(isProject) {
  const [hold, setHold] = useState(false)
  const { pathname } = useLocation()

  // layout effect: esconde antes da nova página aparecer na tela
  useLayoutEffect(() => {
    setHold(isProject && !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [pathname, isProject])

  useEffect(() => {
    if (!hold) return
    const t = setTimeout(() => setHold(false), 2500)
    return () => clearTimeout(t)
  }, [hold])

  const release = () => setTimeout(() => setHold(false), NAV_AFTER_THUMB_MS)
  return [hold, release]
}

export default function App() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const screenRef = useRef(null)
  const isProject = pathname.startsWith('/projetos/')
  const [introDone, finishIntro] = useIntroGate()
  const [navHold, releaseNav] = useProjectNavHold(isProject)

  const [infoOpen, setInfoOpen] = useState(false)
  useScrollTop(screenRef, infoOpen)
  const infoMounted = usePresence(infoOpen, INFO_MODE === 'overlay' ? INFO_EXIT_OVERLAY_MS : INFO_EXIT_MS)
  const overlay = INFO_MODE === 'overlay'

  // Modo camada: a página fica congelada atrás do Info, na posição em que
  // estava; ao fechar, a rolagem volta exatamente para esse ponto.
  const savedScroll = useRef(0)
  const pageRef = useRef(null)
  const frozenTop = useRef(0)
  const toggleInfo = () => {
    if (!infoOpen) {
      savedScroll.current = window.scrollY
      // posição da página na tela agora (ela começa abaixo da nav)
      frozenTop.current = pageRef.current.getBoundingClientRect().top
    }
    setInfoOpen((open) => !open)
  }
  useLayoutEffect(() => {
    if (overlay && !infoMounted && savedScroll.current) {
      window.scrollTo(0, savedScroll.current)
      savedScroll.current = 0
    }
  }, [overlay, infoMounted])
  const [lang, setLang] = useStoredState('lang', browserLang)
  const [theme, setTheme] = useStoredState('theme', () => 'light')

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
  }, [lang])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    if (!infoOpen) return
    const onKey = (e) => e.key === 'Escape' && setInfoOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [infoOpen])

  return (
    <div className="stage">
      <main ref={screenRef} className="screen">
        <NavBar
          hidden={!introDone || navHold}
          hideOnScroll={isProject}
          infoOpen={infoOpen}
          onHome={() => {
            setInfoOpen(false)
            if (pathname !== '/') {
              savedScroll.current = 0
              navigate('/')
            }
          }}
          onToggleInfo={toggleInfo}
          lang={lang}
          onToggleLang={() => setLang(lang === 'pt' ? 'en' : 'pt')}
          theme={theme}
          onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          email={getInfo(lang).contact.email}
          photoSrc="/info/bento.webp"
        />
        {/* A página continua montada (mantém cards abertos etc.). Com o Info:
            modo "page" esconde; modo "overlay" congela atrás da camada. */}
        <div
          ref={pageRef}
          className={`page${infoMounted ? (overlay ? ' is-behind' : ' is-hidden') : ''}`}
          style={overlay && infoMounted ? { top: frozenTop.current } : undefined}
        >
          <Routes>
            <Route path="/" element={<Home lang={lang} onIntroDone={finishIntro} />} />
            <Route
              path="/projetos/:id"
              element={<ProjectPage lang={lang} onThumbRevealed={releaseNav} />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          {/* Dentro da .page: aparece na home e nos projetos, some com o Info. */}
          <Footer lang={lang} />
        </div>
        {overlay && infoMounted && (
          <div className={`info-backdrop${infoOpen ? '' : ' is-leaving'}`} aria-hidden="true" />
        )}
        {infoMounted && <InfoPanel lang={lang} leaving={!infoOpen} />}
      </main>
    </div>
  )
}

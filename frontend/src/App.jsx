import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import InfoPanel from './components/InfoPanel.jsx'
import Home from './components/Home.jsx'
import ProjectPage from './components/ProjectPage.jsx'
import Footer from './components/Footer.jsx'
import DesktopIntro from './components/DesktopIntro.jsx'
import CursorLabel from './components/CursorLabel.jsx'
import { getInfo } from './content/info.js'
import { getProject } from './content/projects.js'
import { seo } from './content/seo.js'
import { ui } from './content/ui.js'

// Título e descrição da aba acompanham a página (o build já entrega certo no
// primeiro carregamento; isto cobre a navegação dentro do site).
function useDocumentMeta(pathname) {
  useEffect(() => {
    const id = pathname.match(/^\/projetos\/([^/]+)/)?.[1]
    const project = id && getProject(id)
    document.title = project ? `${project.title} — ${seo.name}` : seo.title
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.content = project ? `${project.title} — ${project.description.pt}` : seo.description
  }, [pathname])
}

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
// (fim da escrita da frase no celular; fim da DesktopIntro no desktop).
// Entrando direto num projeto, ou com movimento reduzido, aparece na hora.
// Trava de segurança: 6s.
function useIntroGate() {
  const [done, setDone] = useState(
    () =>
      window.location.pathname !== '/' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (done) return
    const t = setTimeout(() => setDone(true), 6000)
    return () => clearTimeout(t)
  }, [done])

  return [done, useCallback(() => setDone(true), [])]
}

// Abertura própria do desktop (DesktopIntro): só na primeira entrada pela
// home, em tela ≥ 900px e sem movimento reduzido. Decidido uma vez, ao abrir.
const useDesktopIntro = () =>
  useState(
    () =>
      window.location.pathname === '/' &&
      window.matchMedia('(min-width: 900px)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

export default function App() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const screenRef = useRef(null)
  const isProject = pathname.startsWith('/projetos/')
  useDocumentMeta(pathname)
  const [introDone, finishIntro] = useIntroGate()
  const [desktopIntro, setDesktopIntro] = useDesktopIntro()
  const endDesktopIntro = useCallback(() => {
    setDesktopIntro(false)
    finishIntro()
  }, [setDesktopIntro, finishIntro])

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
          hidden={!introDone}
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
            <Route
              path="/"
              element={<Home lang={lang} onIntroDone={desktopIntro ? undefined : finishIntro} />}
            />
            <Route
              path="/projetos/:id"
              element={<ProjectPage lang={lang} />}
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
        {desktopIntro && <DesktopIntro lang={lang} onDone={endDesktopIntro} />}
        <CursorLabel label={ui[lang].open} />
      </main>
    </div>
  )
}

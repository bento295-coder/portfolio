import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import InfoPanel from './components/InfoPanel.jsx'
import Home from './components/Home.jsx'
import ProjectPage from './components/ProjectPage.jsx'
import { getInfo } from './content/info.js'

const INFO_EXIT_MS = 250

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

export default function App() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const screenRef = useRef(null)

  const [infoOpen, setInfoOpen] = useState(false)
  useScrollTop(screenRef, infoOpen)
  const infoMounted = usePresence(infoOpen, INFO_EXIT_MS)
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
          infoOpen={infoOpen}
          onHome={() => {
            setInfoOpen(false)
            if (pathname !== '/') navigate('/')
          }}
          onToggleInfo={() => setInfoOpen((open) => !open)}
          lang={lang}
          onToggleLang={() => setLang(lang === 'pt' ? 'en' : 'pt')}
          theme={theme}
          onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          email={getInfo(lang).contact.email}
          photoSrc="/info/bento.webp"
        />
        {/* A página continua montada (mantém cards abertos etc.), só escondida enquanto o Info aparece. */}
        <div className={`page${infoMounted ? ' is-hidden' : ''}`}>
          <Routes>
            <Route path="/" element={<Home lang={lang} />} />
            <Route path="/projetos/:id" element={<ProjectPage lang={lang} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        {infoMounted && <InfoPanel lang={lang} leaving={!infoOpen} />}
      </main>
    </div>
  )
}

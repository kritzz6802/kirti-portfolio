import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Mode = 'light' | 'dark'

export interface AccentOption {
  id: string
  label: string
  /** RGB triplet string, e.g. "99 102 241" */
  rgb: string
}

export const ACCENTS: AccentOption[] = [
  { id: 'indigo', label: 'Indigo', rgb: '99 102 241' },
  { id: 'blue', label: 'Ocean', rgb: '56 132 255' },
  { id: 'emerald', label: 'Emerald', rgb: '16 185 129' },
  { id: 'violet', label: 'Violet', rgb: '139 92 246' },
  { id: 'rose', label: 'Rose', rgb: '244 63 94' },
  { id: 'amber', label: 'Amber', rgb: '245 158 11' },
  { id: 'cyan', label: 'Cyan', rgb: '6 182 212' },
]

const MODE_KEY = 'portfolio-theme'
const ACCENT_KEY = 'portfolio-accent'

interface ThemeContextValue {
  mode: Mode
  accent: string // rgb triplet
  toggleMode: () => void
  setMode: (m: Mode) => void
  setAccent: (rgb: string) => void
  accents: AccentOption[]
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readMode(): Mode {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem(MODE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  // Default first impression is light; visitors can toggle to dark.
  return 'light'
}

function readAccent(): string {
  if (typeof window === 'undefined') return ACCENTS[0].rgb
  return localStorage.getItem(ACCENT_KEY) || ACCENTS[0].rgb
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>(readMode)
  const [accent, setAccentState] = useState<string>(readAccent)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', mode === 'dark')
    localStorage.setItem(MODE_KEY, mode)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', mode === 'dark' ? '#080b12' : '#f8f9fc')
  }, [mode])

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent)
    localStorage.setItem(ACCENT_KEY, accent)
  }, [accent])

  const setMode = useCallback((m: Mode) => setModeState(m), [])
  const toggleMode = useCallback(
    () => setModeState((prev) => (prev === 'dark' ? 'light' : 'dark')),
    [],
  )
  const setAccent = useCallback((rgb: string) => setAccentState(rgb), [])

  const value = useMemo(
    () => ({ mode, accent, toggleMode, setMode, setAccent, accents: ACCENTS }),
    [mode, accent, toggleMode, setMode, setAccent],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}

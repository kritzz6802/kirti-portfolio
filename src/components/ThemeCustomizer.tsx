import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from '../theme/ThemeProvider'
import { CheckIcon, MoonIcon, PaletteIcon, SunIcon } from './Icons'

export function ThemeCustomizer() {
  const { mode, toggleMode, accent, setAccent, accents } = useTheme()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div ref={panelRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="glass w-64 rounded-2xl border p-4 shadow-card"
            role="dialog"
            aria-label="Theme customizer"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-sm font-semibold">Appearance</p>
              <button
                onClick={toggleMode}
                className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors hover:border-accent hover:text-accent"
                aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
              >
                {mode === 'dark' ? <SunIcon width={14} height={14} /> : <MoonIcon width={14} height={14} />}
                {mode === 'dark' ? 'Light' : 'Dark'}
              </button>
            </div>

            <p className="mb-2 text-xs font-medium text-faint">Accent color</p>
            <div className="grid grid-cols-7 gap-2">
              {accents.map((a) => {
                const active = a.rgb === accent
                return (
                  <button
                    key={a.id}
                    onClick={() => setAccent(a.rgb)}
                    className="relative flex h-7 w-7 items-center justify-center rounded-full ring-offset-2 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2"
                    style={{
                      background: `rgb(${a.rgb})`,
                      // @ts-expect-error CSS custom prop
                      '--tw-ring-color': `rgb(${a.rgb})`,
                      '--tw-ring-offset-color': 'rgb(var(--bg-elevated))',
                    }}
                    title={a.label}
                    aria-label={`${a.label} accent${active ? ' (selected)' : ''}`}
                    aria-pressed={active}
                  >
                    {active && <CheckIcon width={14} height={14} className="text-white" />}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((o) => !o)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-glow"
        aria-label="Open theme customizer"
        aria-expanded={open}
      >
        <PaletteIcon />
      </motion.button>
    </div>
  )
}

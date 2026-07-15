import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border glass text-soft transition-colors hover:border-accent hover:text-accent"
          aria-label="Scroll to top"
        >
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m18 15-6-6-6 6" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

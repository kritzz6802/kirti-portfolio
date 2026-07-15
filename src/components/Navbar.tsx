import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { profile } from '../data/portfolio'
import { DownloadIcon } from './Icons'

const links = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('#about')
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector(l.href))
      .filter(Boolean) as Element[]
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-40"
    >
      <div
        className={`transition-all duration-300 ${
          scrolled ? 'glass border-b shadow-card' : 'border-b border-transparent'
        }`}
      >
        <nav className="container-px mx-auto flex h-16 max-w-6xl items-center justify-between">
          <a href="#top" className="group flex items-center gap-2 font-display text-lg font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white shadow-glow transition-transform group-hover:rotate-6">
              K
            </span>
            <span className="hidden sm:block">
              Kirti<span className="text-accent">.</span>
            </span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active === l.href ? 'text-accent' : 'text-soft hover:text-accent'
                }`}
              >
                {l.label}
                {active === l.href && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-accent"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={profile.resumeUrl}
              download
              className="hidden items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5 sm:flex"
            >
              <DownloadIcon width={16} height={16} />
              Resume
            </a>

            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl border md:hidden"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <div className="space-y-1.5">
                <span
                  className={`block h-0.5 w-5 bg-current transition-transform ${menuOpen ? 'translate-y-2 rotate-45' : ''}`}
                />
                <span className={`block h-0.5 w-5 bg-current transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
                <span
                  className={`block h-0.5 w-5 bg-current transition-transform ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`}
                />
              </div>
            </button>
          </div>
        </nav>

        {/* Scroll progress bar */}
        <motion.div
          className="h-0.5 origin-left bg-accent"
          style={{ scaleX: progress }}
        />
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="glass overflow-hidden border-b md:hidden"
          >
            <div className="container-px mx-auto flex max-w-6xl flex-col py-3">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-soft hover:bg-accent-soft hover:text-accent"
                >
                  {l.label}
                </a>
              ))}
              <a
                href={profile.resumeUrl}
                download
                onClick={() => setMenuOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white"
              >
                <DownloadIcon width={16} height={16} />
                Download Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { profile, socials, stats } from '../data/portfolio'
import { ArrowIcon, DownloadIcon, socialIcons } from './Icons'

const roles = ['Frontend Developer', 'React Engineer', 'Vue Specialist', 'UI Craftsman']

function useTypewriter(words: string[], speed = 90, pause = 1600) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[index % words.length]
    let timeout: number

    if (!deleting && text === current) {
      timeout = window.setTimeout(() => setDeleting(true), pause)
    } else if (deleting && text === '') {
      setDeleting(false)
      setIndex((i) => i + 1)
    } else {
      timeout = window.setTimeout(
        () => {
          setText((prev) =>
            deleting ? current.slice(0, prev.length - 1) : current.slice(0, prev.length + 1),
          )
        },
        deleting ? speed / 2 : speed,
      )
    }
    return () => window.clearTimeout(timeout)
  }, [text, deleting, index, words, speed, pause])

  return text
}

export function Hero() {
  const typed = useTypewriter(roles)

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid" />
        <motion.div
          className="absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-accent/25 blur-[120px]"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-32 right-1/4 h-96 w-96 rounded-full bg-accent/15 blur-[120px]"
          animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="container-px mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border bg-accent-soft px-4 py-1.5 text-sm font-medium text-accent"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {profile.availability}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl"
          >
            Hi, I'm <span className="accent-gradient-text animate-gradient-shift">{profile.firstName}</span>
            <br />
            <span className="text-soft">{profile.role}</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-5 flex h-8 items-center font-mono text-lg text-accent sm:text-xl"
          >
            <span className="text-faint">&lt;</span>
            <span className="mx-1">{typed}</span>
            <span className="animate-pulse">|</span>
            <span className="text-faint">/&gt;</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-soft"
          >
            {profile.tagline} With {profile.yearsExperience} years turning ambitious designs into
            fast, accessible products using React, Vue &amp; TypeScript.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
          >
            <a
              href="#projects"
              className="group flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5"
            >
              View my work
              <ArrowIcon className="transition-transform group-hover:translate-x-1" width={18} height={18} />
            </a>
            <a
              href={profile.resumeUrl}
              download
              className="flex items-center gap-2 rounded-xl border px-6 py-3 font-semibold transition-colors hover:border-accent hover:text-accent"
            >
              <DownloadIcon width={18} height={18} />
              Download CV
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.36 }}
            className="mt-8 flex items-center gap-3"
          >
            {socials.map((s) => {
              const Icon = socialIcons[s.icon]
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border text-soft transition-all hover:-translate-y-1 hover:border-accent hover:text-accent"
                >
                  <Icon />
                </a>
              )
            })}
          </motion.div>
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.44 }}
          className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border sm:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="surface p-5 text-center">
              <div className="font-display text-3xl font-bold text-accent">{s.value}</div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wider text-faint">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

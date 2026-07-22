import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SectionHeading } from './SectionHeading'
import { allProjects, type Project } from '../data/portfolio'
import { ArrowIcon, CheckIcon, ExternalIcon } from './Icons'

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`card-hover surface group relative flex flex-col overflow-hidden rounded-2xl border p-6 ${
        project.featured ? 'gradient-border' : ''
      }`}
    >
      {/* accent glow on hover */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* editorial index number */}
      <span className="pointer-events-none absolute right-5 top-4 font-display text-5xl font-bold leading-none text-accent/[0.07] transition-colors duration-500 group-hover:text-accent/[0.14]">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-2xl ring-1 ring-inset ring-accent/10">
          {project.glyph}
        </div>
        {project.featured && (
          <span className="relative rounded-full border border-accent/40 bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent">
            Featured
          </span>
        )}
      </div>

      <h3 className="mt-4 font-display text-xl font-bold">{project.name}</h3>
      <p className="text-xs font-medium uppercase tracking-wider text-faint">{project.company}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-soft">{project.description}</p>

      {project.highlights.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {project.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-sm text-soft">
              <CheckIcon width={15} height={15} className="mt-0.5 shrink-0 text-accent" />
              {h}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.stack.map((t) => (
          <span key={t} className="rounded-md bg-accent-soft px-2 py-1 font-mono text-xs text-accent">
            {t}
          </span>
        ))}
      </div>

      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent"
        >
          Visit project <ExternalIcon width={15} height={15} />
        </a>
      )}
    </motion.article>
  )
}

export function Projects() {
  // Build the filter list in the order companies first appear (newest first).
  const companies = useMemo(() => {
    const seen: string[] = []
    for (const p of allProjects) if (!seen.includes(p.company)) seen.push(p.company)
    return seen
  }, [])

  const [filter, setFilter] = useState<string>('All')

  const visible = useMemo(
    () => (filter === 'All' ? allProjects : allProjects.filter((p) => p.company === filter)),
    [filter],
  )

  const filters = ['All', ...companies]

  return (
    <section id="projects" className="scroll-mt-24 py-24">
      <div className="container-px mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Portfolio"
          title="Selected projects"
          description="Products I've designed and built across fintech compliance, AI, trading, CMS and disability services — from data-dense dashboards to cross-platform mobile apps."
        />

        {/* Category filter */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          {filters.map((f) => {
            const count = f === 'All' ? allProjects.length : allProjects.filter((p) => p.company === f).length
            const isActive = filter === f
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`relative rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-soft hover:border-accent hover:text-accent'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="project-filter-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-accent shadow-glow"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                {f === '9 Series Pvt Ltd' ? '9 Series' : f}
                <span className={`ml-1.5 text-xs ${isActive ? 'text-white/70' : 'text-faint'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <motion.div layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <ProjectCard key={`${p.company}-${p.name}`} project={p} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-14 text-center">
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 font-semibold text-accent"
          >
            Have a project in mind? Let's talk
            <ArrowIcon className="transition-transform group-hover:translate-x-1" width={18} height={18} />
          </a>
        </div>
      </div>
    </section>
  )
}

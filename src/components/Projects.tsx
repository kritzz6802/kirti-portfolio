import { motion } from 'framer-motion'
import { StaggerGroup, staggerItem } from './Reveal'
import { SectionHeading } from './SectionHeading'
import { allProjects, type Project } from '../data/portfolio'
import { ArrowIcon, CheckIcon, ExternalIcon } from './Icons'

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article
      variants={staggerItem}
      className={`card-hover surface group relative flex flex-col overflow-hidden rounded-2xl border p-6 ${
        project.featured ? 'sm:col-span-2' : ''
      }`}
    >
      {/* accent glow on hover */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />

      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-2xl">
          {project.glyph}
        </div>
        {project.featured && (
          <span className="rounded-full border border-accent/40 bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent">
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
  return (
    <section id="projects" className="scroll-mt-24 py-24">
      <div className="container-px mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Portfolio"
          title="Selected projects"
          description="A selection of products I've helped design and build across trading, CMS, construction and fintech."
        />

        <StaggerGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {allProjects.map((p) => (
            <ProjectCard key={`${p.company}-${p.name}`} project={p} />
          ))}
        </StaggerGroup>

        <div className="mt-12 text-center">
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

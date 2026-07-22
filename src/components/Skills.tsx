import { motion } from 'framer-motion'
import { StaggerGroup, staggerItem } from './Reveal'
import { SectionHeading } from './SectionHeading'
import { skills } from '../data/portfolio'

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-24 py-24">
      <div className="container-px mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Skills"
          title="Technologies I work with"
          description="A modern frontend toolkit spanning two major framework ecosystems, AI-powered products, styling, data and end-to-end testing."
        />

        <StaggerGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group) => (
            <motion.div
              key={group.category}
              variants={staggerItem}
              className={`card-hover surface group relative overflow-hidden rounded-2xl border p-6 ${
                group.featured ? 'gradient-border' : ''
              }`}
            >
              <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-accent/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-xl ring-1 ring-inset ring-accent/10">
                  {group.icon}
                </span>
                <h3 className="font-display font-semibold">{group.category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-lg border bg-accent-soft px-3 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}

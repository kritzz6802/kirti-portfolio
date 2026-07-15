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
          description="A modern frontend toolkit spanning two major framework ecosystems, styling, data and end-to-end testing."
        />

        <StaggerGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group) => (
            <motion.div
              key={group.category}
              variants={staggerItem}
              className="card-hover surface rounded-2xl border p-6"
            >
              <div className="mb-4 flex items-center gap-2">
                <span className="h-1.5 w-6 rounded-full bg-accent" />
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

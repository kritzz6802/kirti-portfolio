import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import { experience } from '../data/portfolio'

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-24 py-24">
      <div className="container-px mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Career"
          title="Where I've worked"
          description="Three-plus years shipping products across trading, CMS, construction and fintech domains."
        />

        <div className="relative mt-16">
          {/* vertical line */}
          <div className="absolute left-4 top-2 h-full w-px bg-border sm:left-1/2" aria-hidden />

          <div className="space-y-12">
            {experience.map((job, i) => (
              <Reveal key={job.company} delay={i * 0.05}>
                <div
                  className={`relative flex flex-col gap-4 pl-12 sm:pl-0 ${
                    i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  }`}
                >
                  {/* node */}
                  <span
                    className={`absolute left-4 top-2 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border-2 border-accent bg-[rgb(var(--bg))] sm:left-1/2 ${
                      job.current ? 'shadow-glow' : ''
                    }`}
                    aria-hidden
                  >
                    {job.current && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                  </span>

                  {/* spacer for the opposite column on desktop */}
                  <div className="hidden flex-1 sm:block" />

                  <div className="flex-1">
                    <div className="card-hover surface rounded-2xl border p-6">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-display text-lg font-bold">{job.company}</h3>
                        {job.current && (
                          <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-white">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                        <span className="font-medium text-accent">{job.role}</span>
                        <span className="text-faint">·</span>
                        <span className="font-mono text-xs text-faint">{job.period}</span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-soft">{job.summary}</p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {job.projects.map((p) => (
                          <span
                            key={p.name}
                            className="rounded-md border px-2 py-1 text-xs text-faint"
                          >
                            {p.glyph} {p.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

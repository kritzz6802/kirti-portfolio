import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import { education, languages, profile } from '../data/portfolio'

export function About() {
  return (
    <section id="about" className="scroll-mt-24 py-24">
      <div className="container-px mx-auto max-w-6xl">
        <SectionHeading eyebrow="About" title="A little about me" />

        <div className="mt-14 grid gap-8 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <div className="surface h-full rounded-2xl border p-8">
              <p className="text-lg leading-relaxed text-soft">{profile.bio}</p>
              <p className="mt-4 leading-relaxed text-soft">{profile.objective}</p>

              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                  ['Location', profile.location],
                  ['Experience', `${profile.yearsExperience} years`],
                  ['Focus', 'Frontend'],
                  ['Email', profile.email],
                  ['Phone', profile.phone],
                  ['Status', 'Available'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-medium uppercase tracking-wider text-faint">
                      {label}
                    </dt>
                    <dd className="mt-1 truncate text-sm font-medium">{value}</dd>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col gap-8 lg:col-span-2">
            <Reveal delay={0.1}>
              <div className="surface rounded-2xl border p-6">
                <h3 className="font-display text-lg font-semibold">Education</h3>
                {education.map((e) => (
                  <div key={e.degree} className="mt-4 border-l-2 border-accent pl-4">
                    <div className="font-medium">{e.degree}</div>
                    <div className="text-sm text-soft">{e.school}</div>
                    <div className="mt-1 font-mono text-xs text-accent">
                      {e.period} · {e.detail}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="surface rounded-2xl border p-6">
                <h3 className="font-display text-lg font-semibold">Languages</h3>
                <div className="mt-4 space-y-4">
                  {languages.map((l) => (
                    <div key={l.name}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="font-medium">{l.name}</span>
                        <span className="text-faint">{l.level}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-accent-soft">
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{ width: `${l.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

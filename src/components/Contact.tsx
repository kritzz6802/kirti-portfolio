import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import { profile, socials } from '../data/portfolio'
import { ArrowIcon, socialIcons } from './Icons'

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 py-24">
      <div className="container-px mx-auto max-w-4xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border p-8 text-center sm:p-14">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-60" />
            <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-accent/20 blur-[100px]" />

            <SectionHeading
              eyebrow="Contact"
              title="Let's build something great"
              description="I'm currently open to new opportunities and freelance work. Whether you have a role, a project, or just want to say hi — my inbox is always open."
            />

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={`mailto:${profile.email}`}
                className="group flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5"
              >
                Say hello
                <ArrowIcon className="transition-transform group-hover:translate-x-1" width={18} height={18} />
              </a>
              <a
                href={profile.resumeUrl}
                download
                className="rounded-xl border px-6 py-3 font-semibold transition-colors hover:border-accent hover:text-accent"
              >
                Download Resume
              </a>
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
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
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

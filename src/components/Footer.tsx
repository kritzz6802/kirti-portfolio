import { profile, socials } from '../data/portfolio'
import { socialIcons } from './Icons'

export function Footer() {
  const year = 2026 // static to keep builds deterministic; update as needed

  return (
    <footer className="border-t py-10">
      <div className="container-px mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-sm font-bold text-white">
            K
          </span>
          <div>
            <p className="font-display text-sm font-semibold">{profile.name}</p>
            <p className="text-xs text-faint">{profile.role}</p>
          </div>
        </div>

        <p className="order-last text-center text-xs text-faint sm:order-none">
          © {year} {profile.name}. Designed &amp; built with React, TypeScript &amp; Tailwind CSS.
        </p>

        <div className="flex items-center gap-2">
          {socials.map((s) => {
            const Icon = socialIcons[s.icon]
            return (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-faint transition-colors hover:text-accent"
              >
                <Icon width={18} height={18} />
              </a>
            )
          })}
        </div>
      </div>
    </footer>
  )
}

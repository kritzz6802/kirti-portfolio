import { Reveal } from './Reveal'

interface Props {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export function SectionHeading({ eyebrow, title, description, align = 'center' }: Props) {
  return (
    <Reveal className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3 py-1 font-mono text-xs uppercase tracking-widest text-accent">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        {eyebrow}
      </span>
      <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {description && <p className="mt-4 text-soft">{description}</p>}
    </Reveal>
  )
}

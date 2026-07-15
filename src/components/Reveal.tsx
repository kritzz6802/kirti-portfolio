import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  as?: 'div' | 'section' | 'li' | 'span'
}

const makeVariants = (y: number, delay: number): Variants => ({
  hidden: { opacity: 0, y },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  },
})

/** Fade + rise into view once, when scrolled into the viewport. */
export function Reveal({ children, className, delay = 0, y = 24 }: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={makeVariants(y, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
    >
      {children}
    </motion.div>
  )
}

/** Container that staggers its Reveal-like children. */
export function StaggerGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode
  className?: string
  stagger?: number
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  )
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

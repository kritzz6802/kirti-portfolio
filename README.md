# Kirti Koyani — Developer Portfolio

A premium, fully responsive developer portfolio built with **React, TypeScript, Tailwind CSS and Framer Motion**. Designed to impress recruiters, hiring managers and international clients with a clean, elegant UI, smooth micro-interactions and fast performance.

## ✨ Features

- **Strong hero** with animated gradient background, typewriter role effect and live stats
- **Premium project cards** with hover glow, tech-stack chips and highlights
- **Timeline-based experience** with a zig-zag layout on desktop
- **Attractive skills section** grouped by ecosystem
- **Theme customization** — dark / light mode **plus 7 switchable accent colors**, remembered across visits via `localStorage`
- **Resume download** button in the navbar, hero and contact sections
- **Social & GitHub links** throughout
- **SEO-friendly** — meta tags, Open Graph, Twitter cards and JSON-LD structured data
- **Accessible** — semantic HTML, skip link, focus states, `prefers-reduced-motion` support, ARIA labels
- **Performance** — code-split motion chunk, no runtime CSS-in-JS, fonts preconnected

## 🛠 Tech Stack

| Area       | Tech                          |
| ---------- | ----------------------------- |
| Framework  | React 18 + Vite               |
| Language   | TypeScript (strict)           |
| Styling    | Tailwind CSS 3                 |
| Animation  | Framer Motion 11              |

## 🚀 Getting Started

```bash
npm install
npm run dev        # start dev server
npm run build      # type-check + production build → dist/
npm run preview    # preview the production build
```

## ✏️ Customize your content

All content lives in one place: [`src/data/portfolio.ts`](src/data/portfolio.ts).

1. **Add your real GitHub URL** — update the `github` entry in `socials`.
2. **Drop your resume PDF** at `public/kirti-koyani-resume.pdf` (the download buttons point to `profile.resumeUrl`).
3. **Fill in the 9 Series Pvt Ltd project** — replace the placeholder in the first `experience` entry with the project name, description, highlights and stack. It will automatically appear in the timeline **and** the Projects grid.

## 🎨 Theming

- Accent colors are driven by a single CSS variable (`--accent`, an RGB triplet) consumed by Tailwind as `bg-accent`, `text-accent`, etc.
- Add or edit palettes in the `ACCENTS` array in [`src/theme/ThemeProvider.tsx`](src/theme/ThemeProvider.tsx).
- The selected mode + accent are persisted and applied before first paint (see the inline script in `index.html`) to avoid a flash.

## 📁 Structure

```
src/
├── data/portfolio.ts        # ← all your content
├── theme/ThemeProvider.tsx  # dark/light + accent context
├── components/
│   ├── Navbar.tsx           # sticky nav + scroll progress + mobile menu
│   ├── Hero.tsx             # hero with typewriter + stats
│   ├── About.tsx            # bio, education, languages
│   ├── Skills.tsx           # grouped skill cards
│   ├── Experience.tsx       # timeline
│   ├── Projects.tsx         # premium project cards
│   ├── Contact.tsx          # CTA section
│   ├── Footer.tsx
│   ├── ThemeCustomizer.tsx  # floating theme panel
│   └── ...
└── App.tsx
```

---

Built with ❤️ by Kirti Koyani.

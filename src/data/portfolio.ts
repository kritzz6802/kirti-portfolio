export interface Social {
  label: string
  href: string
  handle: string
  icon: 'github' | 'linkedin' | 'mail' | 'phone'
}

export interface SkillGroup {
  category: string
  items: string[]
  /** Emoji / short glyph used as the card's visual token */
  icon: string
  featured?: boolean
}

export interface Project {
  name: string
  company: string
  description: string
  highlights: string[]
  stack: string[]
  /** Optional link — leave undefined to hide the CTA */
  link?: string
  /** Emoji / short glyph used as the card's visual token */
  glyph: string
  featured?: boolean
}

export interface ExperienceItem {
  company: string
  role: string
  period: string
  location?: string
  summary: string
  projects: Project[]
  current?: boolean
}

export const profile = {
  name: 'Kirti Koyani',
  firstName: 'Kirti',
  role: 'Frontend Developer',
  location: 'Ahmedabad, India',
  yearsExperience: '3+',
  tagline: 'I build fast, elegant web & mobile experiences.',
  bio: `Frontend Developer with ${'3+'} years of experience crafting complex, high-performance web and mobile applications with React.js, Vue.js and the modern JavaScript ecosystem. From enterprise fintech-compliance platforms to AI document pipelines and cross-platform mobile apps, I turn ambitious designs into efficient, reusable component architectures and partner with cross-functional teams to ship polished products on time.`,
  objective: `To leverage my expertise in React.js, Vue.js and modern frontend technologies to build innovative, high-performance web applications while contributing to the success of a dynamic, growth-oriented organization.`,
  email: 'kirtikkoyani6802@gmail.com',
  phone: '+91 97243 67532',
  // Update this once the file is placed in /public
  resumeUrl: '/kirti-koyani-resume.pdf',
  availability: 'Open to new opportunities',
}

export const socials: Social[] = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/kirti-koyani',
    handle: 'in/kirti-koyani',
    icon: 'linkedin',
  },
  {
    label: 'GitHub',
    // TODO: replace with your real GitHub username
    href: 'https://github.com/kirti-koyani',
    handle: 'kirti-koyani',
    icon: 'github',
  },
  {
    label: 'Email',
    href: 'mailto:kirtikkoyani6802@gmail.com',
    handle: 'kirtikkoyani6802@gmail.com',
    icon: 'mail',
  },
  {
    label: 'Phone',
    href: 'tel:+919724367532',
    handle: '+91 97243 67532',
    icon: 'phone',
  },
]

export const stats = [
  { value: '3+', label: 'Years experience' },
  { value: '10+', label: 'Products shipped' },
  { value: '3', label: 'Companies' },
  { value: '2', label: 'Core frameworks' },
]

export const skills: SkillGroup[] = [
  {
    category: 'Languages & Core',
    items: ['JavaScript', 'TypeScript', 'HTML5', 'CSS3'],
    icon: '⌨️',
  },
  {
    category: 'AI & Machine Learning',
    items: [
      'RAG Pipelines',
      'LLM Integration',
      'Vector Search (pgvector)',
      'Prompt Engineering',
      'AI Agents & Tool-calling',
      'Document AI / OCR (Gemini)',
    ],
    icon: '🧠',
    featured: true,
  },
  {
    category: 'React Ecosystem',
    items: ['React.js', 'Next.js', 'Redux Toolkit', 'Gatsby'],
    icon: '⚛️',
  },
  {
    category: 'Vue Ecosystem',
    items: ['Vue.js', 'Nuxt.js', 'Vuetify', 'Pinia', 'Vuex', 'Ionic'],
    icon: '🟢',
  },
  {
    category: 'Styling & Data',
    items: ['Tailwind CSS', 'Node.js', 'GraphQL', 'REST APIs', 'WebSockets'],
    icon: '🎨',
  },
  {
    category: 'Testing & QA',
    items: ['Cypress', 'Jest', 'Playwright'],
    icon: '🧪',
  },
]

export const experience: ExperienceItem[] = [
  {
    company: '9 Series Pvt Ltd',
    role: 'Frontend Developer',
    period: 'Present',
    current: true,
    summary:
      'Building enterprise SaaS across AI knowledge platforms, document verification and disability services — from RAG chat UIs and dashboards to cross-platform mobile apps.',
    projects: [
      {
        name: 'AI Zone',
        company: '9 Series Pvt Ltd',
        description:
          'An AI-powered document-verification platform with batch ingestion and role-based access, where Gemini / Vertex-AI OCR classifies documents and extracts fields for human verifiers.',
        highlights: [
          'AI OCR classification & field extraction (Gemini / Vertex AI)',
          'Role-based access — Super Admin, Admin & Verifier',
          'Live work-queue updates over WebSockets, Microsoft SSO',
        ],
        stack: ['React 19', 'TypeScript', 'Vite', 'Redux Toolkit', 'MUI'],
        glyph: '🤖',
        featured: true,
      },
      {
        name: 'AbleFinder',
        company: '9 Series Pvt Ltd',
        description:
          'A mobile marketplace connecting disability-support participants with service providers — provider discovery, service agreements, subscriptions and push notifications.',
        highlights: [
          'Participant ↔ provider matching & service agreements',
          'Stripe subscriptions & Firebase push notifications',
          'React Native (Expo) app on a Next.js + PostgreSQL backend',
        ],
        stack: ['React Native', 'Expo', 'Next.js', 'Drizzle', 'Stripe'],
        glyph: '🧩',
        featured: true,
      },
      {
        name: 'Enterprise Knowledge Assistant',
        company: '9 Series Pvt Ltd',
        description:
          'A multi-tenant SaaS where organizations upload their internal documents and ask questions in natural language — answers are generated only from their own data with inline source citations through a full RAG pipeline.',
        highlights: [
          'Retrieval-augmented chat with cited, streaming answers (SSE)',
          'Multi-format ingestion — PDF, Word, Excel, web & more',
          'Multi-tenant workspaces with role-based access',
        ],
        stack: ['Next.js 15', 'React 19', 'TypeScript', 'TanStack Query', 'Zustand'],
        glyph: '🧠',
        featured: true,
      },
    ],
  },
  {
    company: 'Vedlogic Solutions Pvt Ltd',
    role: 'Frontend Developer',
    period: 'Feb 2024 – Present',
    summary:
      'Developing real-time trading interfaces and enterprise compliance platforms for international clients.',
    projects: [
      {
        name: 'Tread Aries',
        company: 'Vedlogic Solutions',
        description:
          'A stock-trading platform for US markets supporting equities and futures/options trading, powered by real-time streaming price data.',
        highlights: [
          'Real-time price streaming over WebSockets',
          'Equities and futures/options trading flows',
          'Responsive, data-dense trading dashboards',
        ],
        stack: ['Vue.js', 'WebSockets', 'Streaming', 'Vuex'],
        glyph: '📈',
        featured: true,
      },
      {
        name: 'iBanq Sentinel',
        company: 'Vedlogic Solutions',
        description:
          'A compliance and client-onboarding platform for financial services — multi-tier onboarding/offboarding workflows, document management, real-time chat and embedded analytics.',
        highlights: [
          'Multi-step onboarding, KYC & document workflows',
          'Real-time chat & notifications over WebSockets',
          'Embedded Superset analytics with role-based access',
        ],
        stack: ['React', 'TypeScript', 'Redux Toolkit', 'MUI', 'Tailwind CSS'],
        glyph: '🛡️',
        featured: true,
      },
    ],
  },
  {
    company: 'Nesoi Technology',
    role: 'Frontend Developer',
    period: 'Jun 2022 – Feb 2024',
    summary:
      'Delivered products across the full modern JS stack — from React CMS platforms to large-scale Vue-to-Nuxt migrations and cross-platform mobile apps.',
    projects: [
      {
        name: 'Omni-Cloud',
        company: 'Nesoi Technology',
        description:
          'A CMS for web-building software management. Built the platform UI with React and Tailwind CSS, integrating RESTful APIs and reusable hook-based components.',
        highlights: [
          'Reusable hook-based component library',
          'REST API integration across the platform',
        ],
        stack: ['React.js', 'Tailwind CSS', 'React Hooks', 'REST APIs'],
        glyph: '☁️',
        featured: true,
      },
      {
        name: 'Monotype',
        company: 'Nesoi Technology',
        description:
          'A leading provider of fonts and creative technologies. Migrated their India project from a Vue 2 codebase to Nuxt 3, using GraphQL APIs to fetch and render data.',
        highlights: [
          'Led Vue 2 → Nuxt 3 migration',
          'GraphQL-powered data layer',
          'Unit tested with Jest',
        ],
        stack: ['Vue 3', 'Nuxt 3', 'GraphQL', 'Pinia', 'Jest'],
        glyph: '🔤',
      },
      {
        name: 'Planfred',
        company: 'Nesoi Technology',
        description:
          'A construction project-management platform for organizing plans, documents and to-dos across teams. Shipped new mobile-app features and authored comprehensive E2E test suites.',
        highlights: [
          'New mobile features with Vue & Ionic',
          'Fixed Vue 3 web-app bugs',
          'Comprehensive Cypress E2E coverage',
        ],
        stack: ['Vue.js', 'Ionic', 'Nuxt', 'Cypress'],
        glyph: '🏗️',
      },
      {
        name: 'Sopra',
        company: 'Nesoi Technology',
        description:
          'An Irish PWA where dealers create loans and stock-list loans, and users apply for car loans and buy stocks. Built with a Redux Toolkit state layer.',
        highlights: [
          'Progressive Web App architecture',
          'Redux Toolkit state management',
        ],
        stack: ['React', 'Redux Toolkit', 'TypeScript', 'React Router'],
        glyph: '🚗',
      },
    ],
  },
]

export const education = [
  {
    degree: 'B.E. Computer Science & Engineering',
    school: 'Gujarat Technological University',
    period: '2019 – 2022',
    detail: 'CGPA 9.09',
  },
]

export const languages = [
  { name: 'English', level: 'Professional', value: 90 },
  { name: 'Hindi', level: 'Fluent', value: 95 },
  { name: 'Gujarati', level: 'Native', value: 100 },
]

// Flattened list of every project for the Projects grid
export const allProjects: Project[] = experience.flatMap((e) => e.projects)

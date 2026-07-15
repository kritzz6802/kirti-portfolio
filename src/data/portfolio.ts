export interface Social {
  label: string
  href: string
  handle: string
  icon: 'github' | 'linkedin' | 'mail' | 'phone'
}

export interface SkillGroup {
  category: string
  items: string[]
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
  bio: `Frontend Developer with ${'3+'} years of experience crafting complex, high-performance web and mobile applications with React.js, Vue.js and the modern JavaScript ecosystem. I turn ambitious designs into efficient, reusable component architectures and partner with cross-functional teams to ship polished products on time.`,
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
  { value: '8+', label: 'Products shipped' },
  { value: '4', label: 'Companies' },
  { value: '2', label: 'Core frameworks' },
]

export const skills: SkillGroup[] = [
  {
    category: 'Languages & Core',
    items: ['JavaScript', 'TypeScript', 'HTML5', 'CSS3'],
  },
  {
    category: 'React Ecosystem',
    items: ['React.js', 'Next.js', 'Redux Toolkit', 'Gatsby'],
  },
  {
    category: 'Vue Ecosystem',
    items: ['Vue.js', 'Nuxt.js', 'Vuetify', 'Pinia', 'Vuex', 'Ionic'],
  },
  {
    category: 'Styling & Data',
    items: ['Tailwind CSS', 'Node.js', 'GraphQL', 'REST APIs', 'WebSockets'],
  },
  {
    category: 'Testing & QA',
    items: ['Cypress', 'Jest', 'Playwright'],
  },
]

export const experience: ExperienceItem[] = [
  {
    company: '9 Series Pvt Ltd',
    role: 'Frontend Developer',
    period: 'Present',
    current: true,
    summary:
      'Building modern, scalable frontend products. Project details to be added — share the name, description and stack and it will appear here.',
    projects: [
      {
        name: 'Project coming soon',
        company: '9 Series Pvt Ltd',
        description:
          'Placeholder for your current 9 Series project. Provide the project name, a short description and the tech stack, and it will be dropped in with the same polished card treatment.',
        highlights: [],
        stack: ['React'],
        glyph: '✦',
        featured: true,
      },
    ],
  },
  {
    company: 'Vedlogic Solutions Pvt Ltd',
    role: 'Frontend Developer',
    period: 'Feb 2024 – Present',
    summary:
      'Developing real-time trading interfaces and high-performance marketing sites for international clients.',
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
        name: 'Static Landing Pages',
        company: 'Vedlogic Solutions',
        description:
          'High-performance static marketing and landing pages built with the Gatsby React framework, optimized for speed and SEO.',
        highlights: [
          'Blazing-fast static generation with Gatsby',
          'SEO-first architecture and Lighthouse tuning',
        ],
        stack: ['Gatsby', 'React', 'GraphQL'],
        glyph: '🚀',
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

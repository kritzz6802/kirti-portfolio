import { ThemeProvider } from './theme/ThemeProvider'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Skills } from './components/Skills'
import { Experience } from './components/Experience'
import { Projects } from './components/Projects'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { ThemeCustomizer } from './components/ThemeCustomizer'
import { ScrollToTop } from './components/ScrollToTop'

export default function App() {
  return (
    <ThemeProvider>
      {/* Skip link for keyboard / screen-reader users */}
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />

      <ThemeCustomizer />
      <ScrollToTop />
    </ThemeProvider>
  )
}

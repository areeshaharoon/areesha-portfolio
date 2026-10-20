import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'

function App() {
  return (
    <main>
      <Hero />
      <About />
      {/* Work / Projects Section */}
      <div id="work" tabIndex="-1" />
      <Projects />
      {/* Skills & Toolkit Section */}
      <Skills />
      {/* Contact & Footer Section */}
      <Contact />
    </main>
  )
}

export default App

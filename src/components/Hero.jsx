import { useRef, useState, useCallback, useEffect } from 'react'
import { useCanvasCharacterAnimation } from '../hooks/useCanvasCharacterAnimation'
import { useZoneDetection } from '../hooks/useZoneDetection'
import ContextualMessage from './ContextualMessage'
import styles from './Hero.module.css'

export default function Hero() {
  const canvasRef = useRef(null)
  const [activeZone, setActiveZone] = useState('none')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Detect scroll — make navbar opaque only after scrolling past hero
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Smooth canvas animation engine
  const {
    triggerLeft,
    triggerRight,
    triggerCenter,
    triggerCenterDwell,
  } = useCanvasCharacterAnimation(canvasRef)

  const onLeft = useCallback(() => {
    setActiveZone('left')
    triggerLeft()
  }, [triggerLeft])

  const onRight = useCallback(() => {
    setActiveZone('right')
    triggerRight()
  }, [triggerRight])

  const onCenter = useCallback(() => {
    setActiveZone('center')
    triggerCenter()
  }, [triggerCenter])

  const onCenterDwell = useCallback(() => {
    setActiveZone('center')
    triggerCenterDwell()
  }, [triggerCenterDwell])

  const onLeave = useCallback(() => {
    setActiveZone('none')
    triggerCenter()
  }, [triggerCenter])

  const { handleMouseMove, handleMouseLeave, heroRef } = useZoneDetection({
    onLeft,
    onRight,
    onCenter,
    onCenterDwell,
    onLeave,
  })

  return (
    <section
      id="hero"
      ref={heroRef}
      className={styles.hero}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Areesha Haroon — Vibe Coder Portfolio"
    >
      {/* Background Gradient */}
      <div className={styles.bgGradient} aria-hidden="true" />

      {/* FULL HERO CANVAS: Crisp, high-definition full-screen render */}
      <canvas
        ref={canvasRef}
        className={styles.heroCanvas}
        aria-label="Areesha Haroon interactive character"
      />

      {/* Top Navbar — transparent on hero, frosted-glass when scrolled */}
      <header className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
        <div className={styles.navContainer}>

          {/* Brand — logo + name */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); setMenuOpen(false) }}
            className={styles.navBrand}
            aria-label="Areesha Haroon — back to top"
          >
            <img
              src="/assets/logo-dustyrose.png"
              alt="Areesha Haroon logo"
              className={styles.navLogoImg}
            />
            Areesha Haroon
          </a>

          {/* Desktop navigation links — right side */}
          <nav className={styles.navLinks} aria-label="Primary navigation">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className={styles.navLink}
            >Home</a>
            <a href="#about" className={styles.navLink}>About</a>
            <a href="#projects" className={styles.navLink}>Projects</a>
            <a href="#skills" className={styles.navLink}>Skills</a>
            <a href="#contact" className={styles.navLink}>Contact</a>
          </nav>

          {/* Hamburger button — visible on mobile only */}
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </button>
        </div>

        {/* Mobile slide-down menu */}
        <nav
          id="mobile-nav"
          className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}
          aria-label="Mobile navigation"
          aria-hidden={!menuOpen}
        >
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); setMenuOpen(false) }}
            className={styles.mobileLink}
          >Home</a>
          <a href="#about" onClick={() => setMenuOpen(false)} className={styles.mobileLink}>About</a>
          <a href="#projects" onClick={() => setMenuOpen(false)} className={styles.mobileLink}>Projects</a>
          <a href="#skills" onClick={() => setMenuOpen(false)} className={styles.mobileLink}>Skills</a>
          <a href="#contact" onClick={() => setMenuOpen(false)} className={styles.mobileLink}>Contact</a>
        </nav>
      </header>

      {/* Contextual speech/reaction bubble */}
      <ContextualMessage zone={activeZone} />

      {/* Left-Side Pure Typography: Positioned in upper-left quadrant */}
      <div className={styles.heroOverlay}>
        <div className={styles.leftContent}>
          <div className={styles.badgeRow}>
            <span className={styles.vibeCoderBadge}>
              <span className={styles.statusDot} />
              VIBE CODER
            </span>
          </div>

          <h1 className={styles.boldHeroName}>
            AREESHA<br />
            HAROON
          </h1>
        </div>
      </div>
    </section>
  )
}

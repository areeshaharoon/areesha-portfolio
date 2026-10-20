import { useEffect, useRef, useState } from 'react'
import styles from './About.module.css'

export default function About() {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  // IntersectionObserver for entrance reveal
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleCtaClick = (e) => {
    e.preventDefault()
    const target = document.getElementById('projects')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`${styles.aboutSection} ${isVisible ? styles.visible : ''}`}
      aria-label="About Areesha Haroon"
    >
      {/* Soft feather transition from Hero bottom into white */}
      <div className={styles.heroTransitionGradient} aria-hidden="true" />

      <div className={styles.container}>
        {/* LEFT COLUMN: Photo (~40%) */}
        <div className={styles.leftCol}>
          <div className={styles.photoWrapper}>
            {/* Soft dusty-rose background glow blob */}
            <div className={styles.photoGlow} aria-hidden="true" />

            {/* Arch-framed photo */}
            <div className={styles.photoFrame}>
              <img
                src="/assets/about-me-photo/areesha.jpg.png"
                alt="Areesha Haroon — Web Developer & Vibe Coder"
                className={styles.photoImg}
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Editorial Content (~60%) */}
        <div className={styles.rightCol}>
          {/* 1. Small label with dusty-rose line */}
          <div className={`${styles.revealItem} ${styles.delay1}`}>
            <div className={styles.labelRow}>
              <span className={styles.labelLine} aria-hidden="true" />
              <span className={styles.label}>ABOUT ME</span>
            </div>
          </div>

          {/* 2. Heading */}
          <h2 className={`${styles.heading} ${styles.revealItem} ${styles.delay2}`}>
            Hi, I'm Areesha Haroon<span className={styles.headingDot}>.</span>
          </h2>

          {/* 3. Tagline */}
          <p className={`${styles.tagline} ${styles.revealItem} ${styles.delay3}`}>
            A <span className={styles.taglineAccent}>Vibe Coder</span> turning ideas into interactive, modern digital experiences.
          </p>

          {/* 4. Paragraph */}
          <p className={`${styles.bioParagraph} ${styles.revealItem} ${styles.delay4}`}>
            I'm a web developer in the making, passionate about building creative websites and web apps that feel as good as they look. I blend AI tools with vibe coding to move fast, experiment boldly, and turn rough ideas into polished interfaces. For me, a great UI isn't just functional, it should make people stop and say "wow."
          </p>

          {/* 5. Quick Facts (Clean line icons, no emojis) */}
          <div className={`${styles.factsGrid} ${styles.revealItem} ${styles.delay5}`}>
            {/* Fact 1: Karachi, Pakistan */}
            <div className={styles.factCard}>
              <div className={styles.factIconWrapper}>
                <svg
                  className={styles.factIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <span className={styles.factText}>Based in Karachi, Pakistan</span>
            </div>

            {/* Fact 2: Creative web design */}
            <div className={styles.factCard}>
              <div className={styles.factIconWrapper}>
                <svg
                  className={styles.factIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
                  <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
                  <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
                  <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2Z" />
                </svg>
              </div>
              <span className={styles.factText}>Creative web design & interactive UI</span>
            </div>

            {/* Fact 3: Vibe coding + AI tools */}
            <div className={styles.factCard}>
              <div className={styles.factIconWrapper}>
                <svg
                  className={styles.factIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                  <line x1="14" y1="4" x2="10" y2="20" />
                </svg>
              </div>
              <span className={styles.factText}>Vibe coding + AI tools workflow</span>
            </div>

            {/* Fact 4: Open to freelance */}
            <div className={styles.factCard}>
              <div className={styles.factIconWrapper}>
                <svg
                  className={styles.factIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="20" height="14" x="2" y="7" rx="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <span className={styles.factText}>Open to freelance projects</span>
            </div>
          </div>

          {/* 6. Stats Row */}
          <div className={`${styles.statsRow} ${styles.revealItem} ${styles.delay6}`}>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>4</span>
              <span className={styles.statLabel}>Projects built</span>
            </div>
            <div className={styles.statDivider} aria-hidden="true" />
            <div className={styles.statCard}>
              <span className={styles.statTech}>HTML · CSS · JS</span>
              <span className={styles.statLabel}>Core stack</span>
            </div>
            <div className={styles.statDivider} aria-hidden="true" />
            <div className={styles.statCard}>
              <span className={styles.statBadge}>AI-Powered</span>
              <span className={styles.statLabel}>Workflow</span>
            </div>
          </div>

          {/* 7. CTA Button with animated down arrow */}
          <div className={`${styles.ctaRow} ${styles.revealItem} ${styles.delay7}`}>
            <a
              href="#projects"
              onClick={handleCtaClick}
              className={styles.ctaBtn}
              aria-label="See what I've built - scroll to projects"
            >
              <span>See what I've built</span>
              <span className={styles.ctaArrow} aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

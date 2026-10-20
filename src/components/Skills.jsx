import { useEffect, useRef, useState } from 'react'
import styles from './Skills.module.css'

const SKILL_CATEGORIES = [
  {
    id: 'frontend',
    number: '01',
    title: 'Frontend Development',
    eyebrow: 'USER INTERFACE & WEB STANDARDS',
    description:
      'Building performant, accessible, and responsive client-side applications with modern standards and fluid layout systems.',
    skills: [
      { name: 'HTML5', detail: 'Semantic & SEO-Friendly' },
      { name: 'CSS3', detail: 'Modern Layouts & Glassmorphism' },
      { name: 'JavaScript (ES6+)', detail: 'Async Logic & DOM Engine' },
      { name: 'React', detail: 'Hooks & Component Architecture' },
      { name: 'Responsive Web Design', detail: 'Fluid Clamp & Multi-device' },
    ],
  },
  {
    id: 'backend',
    number: '02',
    title: 'Backend & Data',
    eyebrow: 'SERVICES, LOGIC & STORAGE',
    description:
      'Connecting frontend interfaces with server runtimes, cloud databases, and authenticated application services.',
    skills: [
      { name: 'Node.js', detail: 'Server Runtimes & REST APIs' },
      { name: 'Supabase', detail: 'PostgreSQL & Realtime Data' },
      { name: 'REST APIs & Integration', detail: 'Endpoint Consumption & JSON' },
      { name: 'Authentication Workflows', detail: 'User Sessions & Secure Access' },
    ],
  },
  {
    id: 'design',
    number: '03',
    title: 'Design & Interaction',
    eyebrow: 'AESTHETICS & MICRO-INTERACTIONS',
    description:
      'Designing tactile, expressive interfaces where aesthetic refinement meets frictionless usability and animation.',
    skills: [
      { name: 'UI/UX Design', detail: 'Typography & Spatial Systems' },
      { name: 'CSS Animations', detail: 'Keyframes & GPU Transitions' },
      { name: 'Interactive Web Experiences', detail: 'Cursor & Canvas Dynamics' },
      { name: 'Design Systems', detail: 'Design Tokens & Atomic Components' },
    ],
  },
  {
    id: 'ai-vibe',
    number: '04',
    title: 'AI & Vibe Coding',
    eyebrow: 'NEXT-GEN DEVELOPMENT VELOCITY',
    description:
      'Synthesizing creative ambition with AI-assisted tooling to prototype at lightning speed, iterate boldly, and ship polished work.',
    skills: [
      { name: 'AI-Assisted Development', detail: 'Rapid Prototyping & Code Synthesis' },
      { name: 'Antigravity', detail: 'Agentic Coding & Multi-step Execution' },
      { name: 'Google Flow', detail: 'AI Video & Visual Generation Workflows' },
      { name: 'Vibe Coding Workflow', detail: 'Idea-to-Product Acceleration' },
    ],
  },
]

export default function Skills() {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  // IntersectionObserver to reveal section content smoothly on scroll
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
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="skills"
      ref={sectionRef}
      className={`${styles.skillsSection} ${isVisible ? styles.visible : ''}`}
      aria-label="Skills and Toolkit"
    >
      {/* Seamless Transition from Dark Projects into Warm Off-White */}
      <div className={styles.transitionMask} aria-hidden="true" />

      <div className={styles.container}>
        {/* ================= SECTION HEADER ================= */}
        <header className={styles.sectionHeader}>
          <div className={styles.headerLabelRow}>
            <span className={styles.headerDot} aria-hidden="true" />
            <span className={styles.headerLabel}>03 / SKILLS &amp; TECHNOLOGIES</span>
          </div>

          <h2 className={styles.mainHeading}>MY TOOLKIT</h2>

          <p className={styles.supportingText}>
            The technologies and creative tools I use to turn ideas into digital experiences.
          </p>
        </header>

        {/* ================= 4 EDITORIAL SKILL CARDS ================= */}
        <div className={styles.categoriesGrid}>
          {SKILL_CATEGORIES.map((cat, idx) => (
            <article
              key={cat.id}
              className={`${styles.categoryCard} ${styles[`delay${idx + 1}`]}`}
            >
              {/* Card top banner: number + category eyebrow */}
              <div className={styles.cardHeader}>
                <span className={styles.cardNumber}>{cat.number}</span>
                <span className={styles.cardEyebrow}>{cat.eyebrow}</span>
              </div>

              {/* Category Title */}
              <h3 className={styles.categoryTitle}>{cat.title}</h3>

              {/* Category Description */}
              <p className={styles.categoryDesc}>{cat.description}</p>

              {/* Skills list items */}
              <ul className={styles.skillsList} aria-label={`${cat.title} skills`}>
                {cat.skills.map((skill) => (
                  <li key={skill.name} className={styles.skillItem}>
                    <div className={styles.skillBullet} aria-hidden="true">
                      <span className={styles.bulletDot} />
                    </div>
                    <div className={styles.skillContent}>
                      <span className={styles.skillName}>{skill.name}</span>
                      <span className={styles.skillDetail}>{skill.detail}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* ================= EDITORIAL PHILOSOPHY BANNER ================= */}
        <div className={styles.philosophyBanner}>
          <div className={styles.bannerLeft}>
            <span className={styles.bannerIcon} aria-hidden="true">✦</span>
            <div className={styles.bannerText}>
              <h4 className={styles.bannerHeading}>The Vibe Coding Philosophy</h4>
              <p className={styles.bannerSubtext}>
                From raw concepts to deployed interactive applications — built with modern code,
                aesthetic obsession, and AI velocity.
              </p>
            </div>
          </div>
          <div className={styles.bannerBadge}>
            <span>Areesha Haroon · Developer &amp; Vibe Coder</span>
          </div>
        </div>
      </div>
    </section>
  )
}

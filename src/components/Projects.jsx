import { useEffect, useRef, useState, useCallback } from 'react'
import styles from './Projects.module.css'

const PROJECTS_DATA = [
  {
    id: '01',
    number: '01',
    badge: 'FINANCIAL WEB APPLICATION',
    title: 'BudgetSplit',
    subtitle: 'Smart Expense Splitting & Finance Tracking',
    description:
      'A modern budgeting and expense-management web application engineered to simplify personal and shared finances. Features real-time expense calculations, dynamic budget categorization, and intuitive financial clarity with an effortless, responsive interface.',
    url: 'https://budgetsplit-webapp.vercel.app/',
    domain: 'budgetsplit-webapp.vercel.app',
    video: '/assets/projects-videos/project-1.mp4',
    tags: ['React', 'JavaScript', 'Responsive CSS3', 'UI/UX Design', 'Vibe Coding'],
    accentColor: '#c78d89',
  },
  {
    id: '02',
    number: '02',
    badge: 'BESPOKE DIGITAL EXPERIENCE',
    title: 'Ishaan & Anaya',
    subtitle: 'Interactive Wedding Invitation',
    description:
      'An elegant, bespoke digital wedding invitation crafted to tell a romantic story. Combines cinematic typography, seamless music and event timeline navigation, RSVP interaction, and warm, delicate aesthetic details.',
    url: 'https://customize-wedding.netlify.app/',
    domain: 'customize-wedding.netlify.app',
    video: '/assets/projects-videos/project-2.mp4',
    tags: ['React', 'JavaScript', 'Interactive UI', 'HTML5 / CSS3', 'UI/UX Design'],
    accentColor: '#d49b97',
  },
  {
    id: '03',
    number: '03',
    badge: 'ATMOSPHERIC E-COMMERCE & SHOWCASE',
    title: 'Artisanal Coffee Co.',
    subtitle: 'Coffee Experience Website',
    description:
      'A rich, coffee-themed digital storefront and browsing journey highlighting premium roast selections. Features sensory visual storytelling, interactive flavor profiles, fluid micro-interactions, and artisanal aesthetic polish.',
    url: 'https://animated-coffee-alpha.vercel.app/',
    domain: 'animated-coffee-alpha.vercel.app',
    video: '/assets/projects-videos/project-3.mp4',
    tags: ['JavaScript', 'CSS3 Animations', 'Responsive Design', 'HTML5', 'Vibe Coding'],
    accentColor: '#b87c78',
  },
  {
    id: '04',
    number: '04',
    badge: 'INTERACTIVE BRAND SHOWCASE',
    title: 'Scoop & Swirl',
    subtitle: 'Ice Cream Website',
    description:
      'A vibrant, delightful brand showcase built around artisanal frozen treats. Designed with appetizing visual hierarchy, playful flavor navigation, fluid interactions, and crisp responsive styling.',
    url: 'https://ice-cream-websites.netlify.app/',
    domain: 'ice-cream-websites.netlify.app',
    video: '/assets/projects-videos/project-4.mp4',
    tags: ['JavaScript', 'CSS Animations', 'UI/UX Design', 'Responsive Layouts', 'Vibe Coding'],
    accentColor: '#cf9490',
  },
]

function ProjectCard({ project, isActive }) {
  const videoRef = useRef(null)
  const [videoError, setVideoError] = useState(false)

  // Play video only when this project card is currently visible / active
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isActive) {
      video.play().catch(() => {
        // Autoplay policy or video not ready
      })
    } else {
      video.pause()
    }
  }, [isActive])

  return (
    <article
      className={`${styles.projectCard} ${isActive ? styles.projectCardActive : ''}`}
      id={`project-${project.id}`}
    >
      <div className={styles.cardGlow} aria-hidden="true" />

      <div className={styles.cardGrid}>
        {/* ================= LEFT COLUMN: Project Details ================= */}
        <div className={styles.infoCol}>
          {/* Top metadata row: number + category badge */}
          <div className={styles.metaRow}>
            <span className={styles.projectNumber}>{project.number}</span>
            <span className={styles.metaSeparator} aria-hidden="true" />
            <span className={styles.badge}>{project.badge}</span>
          </div>

          {/* Project Main Title */}
          <h3 className={styles.projectTitle}>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.titleLink}
            >
              {project.title}
            </a>
          </h3>

          {/* Subtitle / Role Tag */}
          <p className={styles.projectSubtitle}>{project.subtitle}</p>

          {/* Description */}
          <p className={styles.description}>{project.description}</p>

          {/* Tech Tags */}
          <div className={styles.techTags} aria-label="Technologies used">
            {project.tags.map((tag) => (
              <span key={tag} className={styles.techTag}>
                {tag}
              </span>
            ))}
          </div>

          {/* Actions: View Live CTA Button */}
          <div className={styles.actionRow}>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.viewLiveBtn}
              aria-label={`View live website for ${project.title}`}
            >
              <span>View Live</span>
              <span className={styles.btnArrow} aria-hidden="true">
                ↗
              </span>
            </a>

            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.domainIndicator}
            >
              <span className={styles.livePulse} aria-hidden="true" />
              <span className={styles.domainText}>{project.domain}</span>
            </a>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: Interactive Browser Preview ================= */}
        <div className={styles.previewCol}>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.browserFrame}
            aria-label={`Open ${project.title} live website in new tab`}
          >
            {/* Browser chrome mockup bar */}
            <div className={styles.browserHeader} aria-hidden="true">
              <div className={styles.windowDots}>
                <span className={`${styles.dot} ${styles.dotRed}`} />
                <span className={`${styles.dot} ${styles.dotYellow}`} />
                <span className={`${styles.dot} ${styles.dotGreen}`} />
              </div>
              <div className={styles.addressBar}>
                <svg
                  className={styles.lockIcon}
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span className={styles.addressText}>{project.domain}</span>
              </div>
              <div className={styles.headerRight}>
                <span className={styles.liveBadge}>LIVE</span>
              </div>
            </div>

            {/* Video container */}
            <div className={styles.videoContainer}>
              {!videoError ? (
                <video
                  ref={videoRef}
                  className={styles.previewVideo}
                  src={project.video}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onError={() => setVideoError(true)}
                  aria-label={`${project.title} video demonstration`}
                />
              ) : (
                <div className={styles.videoFallback}>
                  <div className={styles.fallbackContent}>
                    <span className={styles.fallbackIcon}>✦</span>
                    <h4>{project.title}</h4>
                    <p>Click to open live application</p>
                  </div>
                </div>
              )}

              <div className={styles.videoBottomGradient} aria-hidden="true" />

              {/* Hover overlay hint */}
              <div className={styles.hoverOverlay} aria-hidden="true">
                <div className={styles.hoverPill}>
                  <span>Open Live Project</span>
                  <span className={styles.pillArrow}>↗</span>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </article>
  )
}

export default function Projects() {
  const containerRef = useRef(null)
  const trackRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [progressPercent, setProgressPercent] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Scroll-driven horizontal translation calculation
  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let rafId = null

    const updateSlider = () => {
      const rect = container.getBoundingClientRect()
      const windowH = window.innerHeight
      const windowW = window.innerWidth
      const totalScrollable = rect.height - windowH

      if (totalScrollable <= 0) return

      // Scrolled distance inside the container (0 at top, 1 at bottom)
      const scrolled = -rect.top
      const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1)
      setScrollProgress(progress)

      // Keyframes / Waypoints:
      // progress = 0: Project 01 is OFF-SCREEN TO THE RIGHT (+windowW)
      // progress = 0.20: Project 01 is CENTERED
      // progress = 0.46: Project 02 is CENTERED
      // progress = 0.72: Project 03 is CENTERED
      // progress = 1.00: Project 04 is CENTERED

      // Measure card width and gap dynamically
      const firstCard = track.children[0]
      const cardWidth = firstCard ? firstCard.offsetWidth : Math.min(windowW * 0.82, 1220)
      const gap = windowW < 768 ? 32 : windowW < 1024 ? 48 : 72

      // Offsets to center each project in the viewport:
      // Initially, paddingLeft centers Card 0 when track transform is 0.
      // So at translate = 0, Card 0 is centered.
      // At translate = -(cardWidth + gap), Card 1 is centered.
      // At translate = -2 * (cardWidth + gap), Card 2 is centered.
      // At translate = -3 * (cardWidth + gap), Card 3 is centered.
      // Before scroll (progress = 0), we want Card 0 to be off-screen to the right:
      // startOffset = windowW * 0.95
      const startOffset = windowW * 0.92
      const step = cardWidth + gap
      const endOffset = -3 * step

      let currentTranslate = 0
      let currentActive = 0

      if (progress <= 0.20) {
        // Phase 1: Card 0 enters from the right (+startOffset) into center (0)
        const p1 = progress / 0.20
        currentTranslate = startOffset * (1 - p1)
        currentActive = 0
      } else if (progress <= 0.46) {
        // Phase 2: Card 0 moves left, Card 1 centers
        const p2 = (progress - 0.20) / 0.26
        currentTranslate = -(p2 * step)
        currentActive = p2 > 0.5 ? 1 : 0
      } else if (progress <= 0.72) {
        // Phase 3: Card 1 moves left, Card 2 centers
        const p3 = (progress - 0.46) / 0.26
        currentTranslate = -(step + p3 * step)
        currentActive = p3 > 0.5 ? 2 : 1
      } else {
        // Phase 4: Card 2 moves left, Card 3 centers
        const p4 = (progress - 0.72) / 0.28
        currentTranslate = -(2 * step + p4 * step)
        currentActive = p4 > 0.5 ? 3 : 2
      }

      track.style.transform = `translate3d(${currentTranslate.toFixed(1)}px, 0, 0)`
      setActiveIdx(currentActive)
      setProgressPercent(Math.round(progress * 100))
    }

    const onScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          updateSlider()
          rafId = null
        })
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    // Initial run
    updateSlider()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  // Quick navigation to a project
  const scrollToProject = useCallback((index) => {
    const container = containerRef.current
    if (!container) return

    const containerTop = container.offsetTop
    const totalScrollable = container.offsetHeight - window.innerHeight

    // Map index to progress waypoints
    const waypoints = [0.20, 0.46, 0.72, 1.00]
    const targetProgress = waypoints[index] || 0
    const targetScroll = containerTop + targetProgress * totalScrollable

    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    })
  }, [])

  return (
    <section id="projects" ref={containerRef} className={styles.scrollSectionWrapper}>
      {/* Pinned Sticky Viewport Window */}
      <div className={styles.stickyViewport}>
        {/* Ambient atmospheric lighting & transparent background layers */}
        <div className={styles.ambientAtmosphere} aria-hidden="true">
          {/* Subtle silhouette peeking through the translucent dark glass like the screenshot */}
          <div className={styles.behindSilhouette} />
          {/* Diagonal hatching texture from screenshot */}
          <div className={styles.diagonalTexture} />
          <div className={styles.ambientGlowRight} />
          <div className={styles.ambientGlowLeft} />
        </div>

        {/* Top Control & Status Header */}
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <span className={styles.worksBrand}>Works</span>
            <span className={styles.tagDivider} aria-hidden="true" />
            <span className={styles.headerTag}>02 / SELECTED</span>
            <span className={styles.tagDivider} aria-hidden="true" />
            <h2 className={styles.sectionHeading}>
              Crafted with Vision <span className={styles.headingAccent}>&amp; Code.</span>
            </h2>
          </div>

          <div className={styles.topBarRight}>
            <span className={styles.counterCurrent}>0{activeIdx + 1}</span>
            <span className={styles.counterSlash}>/</span>
            <span className={styles.counterTotal}>0{PROJECTS_DATA.length}</span>
            <div className={styles.progressBarWrapper} aria-hidden="true">
              <div
                className={styles.progressBarFill}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Intro prompt shown only before scrolling when projects are still off-screen to the right */}
        {scrollProgress < 0.15 && (
          <div
            className={styles.introPrompt}
            style={{
              opacity: Math.max(0, 1 - scrollProgress / 0.12),
              transform: `translate(calc(-50% - ${scrollProgress * 200}px), -50%)`,
            }}
            aria-hidden={scrollProgress >= 0.12}
          >
            <span className={styles.introEyebrow}>02 / SELECTED WORKS</span>
            <h3 className={styles.introTitle}>Featured Projects</h3>
            <p className={styles.introSubtitle}>
              Scroll down to slide through live interactive web applications
            </p>
            <div className={styles.introPill}>
              <span>Scroll to slide</span>
              <span className={styles.introArrow}>→</span>
            </div>
          </div>
        )}

        {/* The Horizontal Sliding Track */}
        <div className={styles.trackContainer}>
          <div ref={trackRef} className={styles.horizontalTrack}>
            {PROJECTS_DATA.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                isActive={index === activeIdx}
              />
            ))}
          </div>
        </div>

        {/* Bottom Interactive Navigation & Scroll Hint Bar */}
        <div className={styles.bottomBar}>
          {/* Quick Nav Pills */}
          <nav className={styles.navPills} aria-label="Quick jump to project">
            {PROJECTS_DATA.map((proj, idx) => (
              <button
                key={proj.id}
                type="button"
                onClick={() => scrollToProject(idx)}
                className={`${styles.navPill} ${idx === activeIdx ? styles.navPillActive : ''}`}
                aria-label={`Jump to project ${proj.number}: ${proj.title}`}
              >
                <span className={styles.pillNum}>{proj.number}</span>
                <span className={styles.pillTitle}>{proj.title}</span>
              </button>
            ))}
          </nav>

          {/* Scroll instruction hint */}
          <div className={styles.scrollHint} aria-hidden="true">
            <span className={styles.scrollHintText}>KEEP SCROLLING</span>
            <div className={styles.scrollHintArrow}>
              <span>→</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { useEffect, useRef, useState } from 'react'
import styles from './Contact.module.css'

const CONTACT_OPTIONS = [
  {
    id: 'email',
    title: 'Direct Email',
    value: 'areeshaharoon05@gmail.com',
    href: 'mailto:areeshaharoon05@gmail.com',
    actionText: 'Open Mail App',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    id: 'github',
    title: 'GitHub',
    value: 'github.com/areeshaharoon',
    href: 'https://github.com/areeshaharoon',
    actionText: 'View Repositories',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </svg>
    ),
  },
  {
    id: 'linkedin',
    title: 'LinkedIn',
    value: 'linkedin.com/in/areesha-haroon',
    href: 'https://linkedin.com/in/areesha-haroon',
    actionText: 'Connect on LinkedIn',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
]

export default function Contact() {
  const sectionRef = useRef(null)
  const formRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const currentYear = new Date().getFullYear()

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [formStatus, setFormStatus] = useState('idle') // 'idle' | 'submitting' | 'success' | 'error'
  const [statusMessage, setStatusMessage] = useState('')

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
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormStatus('error')
      setStatusMessage('Please fill in your name, email, and message before sending.')
      return
    }

    setFormStatus('submitting')
    setStatusMessage('Sending your message...')

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: '9b5ae4d4-2f31-4a3e-9f50-a028cdf4255b',
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          subject: `Portfolio Inquiry from ${formData.name.trim()}`,
          from_name: formData.name.trim(),
        }),
      })

      const data = await response.json()

      if (data.success) {
        setFormStatus('success')
        setStatusMessage(
          `Thank you, ${formData.name.trim()}! Your message has been sent directly to my inbox. I'll get back to you shortly.`
        )
        setFormData({ name: '', email: '', message: '' })
      } else {
        setFormStatus('error')
        setStatusMessage(data.message || 'Something went wrong. Please try again or email areeshaharoon05@gmail.com directly.')
      }
    } catch (err) {
      setFormStatus('error')
      setStatusMessage('Network error. Please try again or email areeshaharoon05@gmail.com directly.')
    }
  }

  const handleBackToTop = (e) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleScrollToForm = (e) => {
    e.preventDefault()
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const firstInput = formRef.current.querySelector('input')
      if (firstInput) firstInput.focus()
    }
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className={`${styles.contactSection} ${isVisible ? styles.visible : ''}`}
      aria-label="Contact and Footer"
    >
      {/* Smooth transition from Skills (Off-White) into Dark Contact */}
      <div className={styles.transitionMask} aria-hidden="true" />

      {/* Ambient background atmosphere & grid */}
      <div className={styles.ambientAtmosphere} aria-hidden="true">
        <div className={styles.ambientGlowCenter} />
        <div className={styles.subtleGrid} />
      </div>

      <div className={styles.container}>
        {/* ================= TWO-COLUMN HERO & INTERACTIVE FORM ================= */}
        <div className={styles.contactLayout}>
          {/* LEFT COLUMN: Headings, Copy & Social Cards */}
          <div className={styles.leftCol}>
            <div className={styles.eyebrowRow}>
              <span className={styles.eyebrowDot} aria-hidden="true" />
              <span className={styles.eyebrowText}>04 / GET IN TOUCH</span>
            </div>

            <h2 className={styles.mainHeadline}>
              <span>HAVE AN IDEA?</span>
              <span className={styles.accentHeadline}>LET&apos;S BUILD IT.</span>
            </h2>

            <p className={styles.supportingCopy}>
              I&apos;m always interested in creative ideas, meaningful collaborations, and building digital experiences that stand out. Send a message below or connect directly.
            </p>

            <div className={styles.quickCtaRow}>
              <button
                type="button"
                onClick={handleScrollToForm}
                className={styles.quickCtaBtn}
                aria-label="Scroll to contact form"
              >
                <span>Let&apos;s Talk</span>
                <span className={styles.ctaArrow} aria-hidden="true">↓</span>
              </button>

              <div className={styles.statusPill}>
                <span className={styles.statusPulse} aria-hidden="true" />
                <span className={styles.statusText}>Open to freelance &amp; creative projects</span>
              </div>
            </div>

            {/* Direct Contact Cards */}
            <div className={styles.contactCardsList}>
              {CONTACT_OPTIONS.map((opt) => (
                <a
                  key={opt.id}
                  href={opt.href}
                  target={opt.id === 'email' ? '_self' : '_blank'}
                  rel={opt.id === 'email' ? undefined : 'noopener noreferrer'}
                  className={styles.miniCard}
                  aria-label={`${opt.title}: ${opt.value}`}
                >
                  <div className={styles.miniIconWrapper} aria-hidden="true">
                    {opt.icon}
                  </div>
                  <div className={styles.miniCardBody}>
                    <span className={styles.miniCardTitle}>{opt.title}</span>
                    <span className={styles.miniCardValue}>{opt.value}</span>
                  </div>
                  <span className={styles.miniCardArrow} aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Glassmorphism Contact Form */}
          <div ref={formRef} className={styles.rightCol}>
            <div className={styles.formCard}>
              <div className={styles.formHeader}>
                <div className={styles.formHeaderDots} aria-hidden="true">
                  <span className={`${styles.dot} ${styles.dotRed}`} />
                  <span className={`${styles.dot} ${styles.dotYellow}`} />
                  <span className={`${styles.dot} ${styles.dotGreen}`} />
                </div>
                <span className={styles.formBadge}>DIRECT INBOX</span>
              </div>

              <div className={styles.formTitleRow}>
                <h3 className={styles.formTitle}>Send a Message</h3>
                <p className={styles.formSubtitle}>
                  Fill out the details below and your note will be sent straight to Areesha.
                </p>
              </div>

              {formStatus === 'success' ? (
                <div className={styles.successState} role="status">
                  <div className={styles.successIconWrapper}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <h4 className={styles.successTitle}>Message Sent Successfully!</h4>
                  <p className={styles.successText}>{statusMessage}</p>

                  <button
                    type="button"
                    onClick={() => {
                      setFormStatus('idle')
                      setFormData({ name: '', email: '', message: '' })
                    }}
                    className={styles.resetBtn}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.contactForm} noValidate>
                  {formStatus === 'error' && (
                    <div className={styles.errorMessage} role="alert">
                      {statusMessage}
                    </div>
                  )}

                  {/* Name field */}
                  <div className={styles.inputGroup}>
                    <label htmlFor="contact-name" className={styles.inputLabel}>
                      Your Name <span className={styles.requiredMark}>*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Alex Morgan"
                      required
                      className={styles.textInput}
                    />
                  </div>

                  {/* Email field */}
                  <div className={styles.inputGroup}>
                    <label htmlFor="contact-email" className={styles.inputLabel}>
                      Your Email Address <span className={styles.requiredMark}>*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. alex@example.com"
                      required
                      className={styles.textInput}
                    />
                  </div>

                  {/* Message field */}
                  <div className={styles.inputGroup}>
                    <label htmlFor="contact-message" className={styles.inputLabel}>
                      Project Details / Message <span className={styles.requiredMark}>*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell me about your idea, timeline, or whatever is on your mind..."
                      required
                      className={styles.textareaInput}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className={styles.submitBtn}
                    aria-label="Submit contact message"
                  >
                    <span>{formStatus === 'submitting' ? 'Sending Message...' : 'Send Message'}</span>
                    <span className={styles.submitArrow} aria-hidden="true">
                      {formStatus === 'submitting' ? '⏳' : '↗'}
                    </span>
                  </button>

                  <p className={styles.directNote}>
                    Prefer email directly? Write to{' '}
                    <a href="mailto:areeshaharoon05@gmail.com" className={styles.directLink}>
                      areeshaharoon05@gmail.com
                    </a>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ================= INTEGRATED MINIMAL FOOTER ================= */}
        <footer className={styles.footer}>
          <div className={styles.footerLeft}>
            <a
              href="#"
              onClick={handleBackToTop}
              className={styles.footerBrand}
              aria-label="Areesha Haroon - scroll to top"
            >
              Areesha Haroon
            </a>
            <span className={styles.footerTagline}>Vibe Coder · Karachi, Pakistan</span>
          </div>

          <div className={styles.footerCenter}>
            <p className={styles.copyrightText}>
              &copy; {currentYear} Areesha Haroon. Crafted with vision &amp; code.
            </p>
          </div>

          <div className={styles.footerRight}>
            <button
              type="button"
              onClick={handleBackToTop}
              className={styles.backToTopBtn}
              aria-label="Back to top of page"
            >
              <span>Back to Top</span>
              <span className={styles.backToTopArrow} aria-hidden="true">↑</span>
            </button>
          </div>
        </footer>
      </div>
    </section>
  )
}

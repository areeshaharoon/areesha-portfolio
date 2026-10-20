import { useState, useEffect, useRef } from 'react'
import styles from './ContextualMessage.module.css'

const MESSAGES = {
  left: ["Anyone here on the left?"],
  right: ["Anyone here on the right?"],
  center: ["Hey, it's you!", "Hiiii!", "Check out the portfolio"],
}

export default function ContextualMessage({ zone }) {
  const [visible, setVisible] = useState(false)
  const [text, setText] = useState('')
  const timerRef = useRef(null)

  useEffect(() => {
    clearTimeout(timerRef.current)

    if (!zone || zone === 'none') {
      setVisible(false)
      return
    }

    const msgs = MESSAGES[zone]
    if (!msgs || msgs.length === 0) {
      setVisible(false)
      return
    }

    if (zone === 'center') {
      // Step through greeting messages in order
      setText(msgs[0])
      setVisible(true)

      const scheduleStep = (index) => {
        if (index >= msgs.length) return
        timerRef.current = setTimeout(() => {
          setText(msgs[index])
          scheduleStep(index + 1)
        }, 1600)
      }

      scheduleStep(1)
    } else {
      setText(msgs[0])
      setVisible(true)
    }

    return () => clearTimeout(timerRef.current)
  }, [zone])

  if (!visible || !text) return null

  return (
    <div className={`${styles.bubble} ${styles[zone] || ''}`} key={text} aria-live="polite">
      <span className={styles.dot} />
      <span className={styles.text}>{text}</span>
    </div>
  )
}

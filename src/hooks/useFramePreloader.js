import { useEffect, useState } from 'react'
import { ALL_FRAMES } from '../config/frames'

/**
 * useFramePreloader
 *
 * Preloads all 50 animation frames into browser memory so interaction is 100% instant
 * without frame lag or white flickers.
 */
export function useFramePreloader() {
  const [loadedCount, setLoadedCount] = useState(0)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let count = 0
    const total = ALL_FRAMES.length

    ALL_FRAMES.forEach((src) => {
      const img = new Image()
      img.src = src
      img.onload = () => {
        count += 1
        setLoadedCount(count)
        if (count >= total) {
          setIsReady(true)
        }
      }
      img.onerror = () => {
        count += 1
        setLoadedCount(count)
        if (count >= total) {
          setIsReady(true)
        }
      }
    })
  }, [])

  return { isReady, progress: Math.round((loadedCount / ALL_FRAMES.length) * 100) }
}

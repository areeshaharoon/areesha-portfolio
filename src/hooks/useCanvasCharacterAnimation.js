import { useRef, useEffect, useCallback } from 'react'
import { ALL_FRAMES, TOTAL_FRAMES } from '../config/frames'

/**
 * useCanvasCharacterAnimation — v7 (Authentic Frame Sequences)
 *
 * Direct frame mapping from original animation (NO mirroring, NO flips):
 *   01 – 15 : Working / typing loop (looking down at laptop)
 *   16 – 23 : Turn LEFT (22-23 peak look left)
 *   24 – 32 : Return from LEFT to center/typing
 *   33 – 39 : Turn RIGHT (38-39 peak look right)
 *   40 – 45 : Return from RIGHT to center/typing
 *   46 – 55 : Look FRONT / camera (notices visitor)
 *   56 – 65 : Headset removal
 *   66 – 80 : Greet & point down to portfolio
 *
 * Characteristics:
 *   - Character position, chair, desk stay 100% FIXED in place (Zero canvas flip)
 *   - Smooth transitions between Left, Right, Center
 *   - Frame 80 finishes -> immediately returns to typing (0 sec pause)
 *   - Crystal clear rendering at full resolution
 */
export function useCanvasCharacterAnimation(canvasRef) {
  const imagesRef = useRef([])
  const isLoadedRef = useRef(false)

  // States:
  // 'typing'
  // 'turn_left' | 'hold_left' | 'return_left'
  // 'turn_right' | 'hold_right' | 'return_right'
  // 'greeting'
  const stateRef = useRef('typing')
  const currentFrameRef = useRef(1)
  const holdStartRef = useRef(0)
  const pendingTargetRef = useRef(null)
  const activeZoneRef = useRef('center')

  const lastTimeRef = useRef(0)
  const rafRef = useRef(null)
  const lastRenderedFrameRef = useRef(-1)

  // ── Preload all 80 frames into memory ──────────────────────────────────────
  useEffect(() => {
    let loaded = 0
    const total = ALL_FRAMES.length
    const imgs = new Array(TOTAL_FRAMES + 1)

    ALL_FRAMES.forEach((src, idx) => {
      const frameNum = idx + 1
      const img = new Image()
      img.src = src
      img.onload = () => {
        imgs[frameNum] = img
        loaded += 1
        if (loaded >= total) {
          imagesRef.current = imgs
          isLoadedRef.current = true
          lastRenderedFrameRef.current = -1
          renderFrame(1)
        }
      }
      img.onerror = () => {
        imgs[frameNum] = img
        loaded += 1
        if (loaded >= total) {
          imagesRef.current = imgs
          isLoadedRef.current = true
        }
      }
    })

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Render Frame on Canvas (Centered, Crisp, Zero distortion) ─────────────
  const renderFrame = useCallback((frameNum) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const fn = Math.min(Math.max(Math.round(frameNum), 1), TOTAL_FRAMES)
    if (fn === lastRenderedFrameRef.current) return
    lastRenderedFrameRef.current = fn

    const img = imagesRef.current[fn]
    if (!img || !img.complete || !img.naturalWidth) return

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const dw = canvas.clientWidth
    const dh = canvas.clientHeight
    const tw = Math.round(dw * dpr)
    const th = Math.round(dh * dpr)

    if (canvas.width !== tw || canvas.height !== th) {
      canvas.width = tw
      canvas.height = th
    }

    const iw = img.naturalWidth || 1280
    const ih = img.naturalHeight || 720
    const scale = Math.max(dw / iw, dh / ih)
    const drawW = iw * scale
    const drawH = ih * scale
    const drawX = (dw - drawW) / 2
    const drawY = dh - drawH // desk sits naturally at the bottom

    ctx.save()
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, dw, dh)
    ctx.drawImage(img, drawX, drawY, drawW, drawH)
    ctx.restore()
  }, [canvasRef])

  // ── Resize handler ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => {
      lastRenderedFrameRef.current = -1
      renderFrame(currentFrameRef.current)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [renderFrame])

  // ── Main Animation Loop ────────────────────────────────────────────────────
  const tick = useCallback((timestamp) => {
    if (!isLoadedRef.current) {
      rafRef.current = requestAnimationFrame(tick)
      return
    }

    const state = stateRef.current
    const pending = pendingTargetRef.current

    // Cadence timing for fluid, natural animation:
    let interval = 85 // standard typing cadence
    if (state === 'turn_left' || state === 'turn_right') {
      interval = 60 // snappy awareness turn
    } else if (state === 'return_left' || state === 'return_right') {
      interval = pending ? 35 : 55 // fast return if switching to another target
    } else if (state === 'greeting') {
      interval = 68 // lively greeting pacing
    } else if (state === 'hold_left' || state === 'hold_right') {
      interval = 70 // check hold timer
    }

    if (timestamp - lastTimeRef.current >= interval) {
      lastTimeRef.current = timestamp
      let curr = currentFrameRef.current

      switch (state) {

        // ── 1. WORKING / TYPING (frames 1 to 15) ───────────────────────────
        case 'typing': {
          const p = pendingTargetRef.current
          if (p === 'left') {
            pendingTargetRef.current = null
            stateRef.current = 'turn_left'
            curr = 16
          } else if (p === 'right') {
            pendingTargetRef.current = null
            stateRef.current = 'turn_right'
            curr = 33
          } else if (p === 'center_greet') {
            pendingTargetRef.current = null
            stateRef.current = 'greeting'
            curr = 46
          } else {
            // Typing loop 1 -> 15
            curr = curr >= 15 ? 1 : curr + 1
          }
          break
        }

        // ── 2. TURN LEFT (frames 16 to 23) ─────────────────────────────────
        case 'turn_left': {
          if (curr < 23) {
            curr += 1
          } else {
            stateRef.current = 'hold_left'
            curr = 23
            holdStartRef.current = timestamp
          }
          break
        }

        // ── 3. HOLD LEFT (frame 23 still) ──────────────────────────────────
        case 'hold_left': {
          const p = pendingTargetRef.current
          if (p === 'right' || p === 'center_greet') {
            // Immediately start return toward next target
            stateRef.current = 'return_left'
            curr = 24
            break
          }
          // Hold for ~1.8s while in left zone, or return when cursor leaves
          if (activeZoneRef.current !== 'left' || timestamp - holdStartRef.current > 1800) {
            stateRef.current = 'return_left'
            curr = 24
          }
          break
        }

        // ── 4. RETURN FROM LEFT (frames 24 to 32) ──────────────────────────
        case 'return_left': {
          if (curr < 32) {
            curr += 1
          } else {
            // Finished returning to center
            const next = pendingTargetRef.current
            pendingTargetRef.current = null
            if (next === 'right') {
              stateRef.current = 'turn_right'
              curr = 33
            } else if (next === 'center_greet') {
              stateRef.current = 'greeting'
              curr = 46
            } else if (next === 'left' && activeZoneRef.current === 'left') {
              stateRef.current = 'turn_left'
              curr = 16
            } else {
              stateRef.current = 'typing'
              curr = 1
            }
          }
          break
        }

        // ── 5. TURN RIGHT (frames 33 to 39) ────────────────────────────────
        case 'turn_right': {
          if (curr < 39) {
            curr += 1
          } else {
            stateRef.current = 'hold_right'
            curr = 39
            holdStartRef.current = timestamp
          }
          break
        }

        // ── 6. HOLD RIGHT (frame 39 still) ─────────────────────────────────
        case 'hold_right': {
          const p = pendingTargetRef.current
          if (p === 'left' || p === 'center_greet') {
            stateRef.current = 'return_right'
            curr = 40
            break
          }
          // Hold for ~1.8s while in right zone, or return when cursor leaves
          if (activeZoneRef.current !== 'right' || timestamp - holdStartRef.current > 1800) {
            stateRef.current = 'return_right'
            curr = 40
          }
          break
        }

        // ── 7. RETURN FROM RIGHT (frames 40 to 45) ─────────────────────────
        case 'return_right': {
          if (curr < 45) {
            curr += 1
          } else {
            // Finished returning to center
            const next = pendingTargetRef.current
            pendingTargetRef.current = null
            if (next === 'left') {
              stateRef.current = 'turn_left'
              curr = 16
            } else if (next === 'center_greet') {
              stateRef.current = 'greeting'
              curr = 46
            } else if (next === 'right' && activeZoneRef.current === 'right') {
              stateRef.current = 'turn_right'
              curr = 33
            } else {
              stateRef.current = 'typing'
              curr = 1
            }
          }
          break
        }

        // ── 8. GREETING (frames 46 to 80) ──────────────────────────────────
        // Notices visitor (46-55) -> removes headset (56-65) -> waves & points (66-80)
        case 'greeting': {
          if (curr < 80) {
            curr += 1
          } else {
            // As user requested: "last jaise hii khtm hoo ruke nhi forn wapis shuru hojaye frames 1 sec bhi na rukee"
            // Instantly transition back to typing with 0 second delay!
            const next = pendingTargetRef.current
            pendingTargetRef.current = null
            if (next === 'left') {
              stateRef.current = 'turn_left'
              curr = 16
            } else if (next === 'right') {
              stateRef.current = 'turn_right'
              curr = 33
            } else {
              stateRef.current = 'typing'
              curr = 1
            }
          }
          break
        }

        default:
          stateRef.current = 'typing'
          curr = 1
      }

      currentFrameRef.current = curr
      renderFrame(curr)
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [renderFrame])

  // ── Public Triggers ────────────────────────────────────────────────────────

  const triggerLeft = useCallback(() => {
    activeZoneRef.current = 'left'
    const s = stateRef.current

    if (s === 'turn_left' || s === 'hold_left') return

    if (s === 'typing') {
      stateRef.current = 'turn_left'
      currentFrameRef.current = 16
    } else if (s === 'return_left') {
      // Re-trigger turn left
      stateRef.current = 'turn_left'
    } else if (s === 'turn_right' || s === 'hold_right') {
      // Smoothly reverse through return_right then go left
      pendingTargetRef.current = 'left'
      stateRef.current = 'return_right'
      if (currentFrameRef.current < 40) currentFrameRef.current = 40
    } else if (s === 'return_right') {
      pendingTargetRef.current = 'left'
    } else if (s === 'greeting') {
      pendingTargetRef.current = 'left'
    }
  }, [])

  const triggerRight = useCallback(() => {
    activeZoneRef.current = 'right'
    const s = stateRef.current

    if (s === 'turn_right' || s === 'hold_right') return

    if (s === 'typing') {
      stateRef.current = 'turn_right'
      currentFrameRef.current = 33
    } else if (s === 'return_right') {
      stateRef.current = 'turn_right'
    } else if (s === 'turn_left' || s === 'hold_left') {
      // Smoothly reverse through return_left then go right
      pendingTargetRef.current = 'right'
      stateRef.current = 'return_left'
      if (currentFrameRef.current < 24) currentFrameRef.current = 24
    } else if (s === 'return_left') {
      pendingTargetRef.current = 'right'
    } else if (s === 'greeting') {
      pendingTargetRef.current = 'right'
    }
  }, [])

  const triggerCenterDwell = useCallback(() => {
    activeZoneRef.current = 'center'
    const s = stateRef.current

    if (s === 'greeting') return

    if (s === 'typing') {
      stateRef.current = 'greeting'
      currentFrameRef.current = 46
    } else if (s === 'turn_left' || s === 'hold_left') {
      pendingTargetRef.current = 'center_greet'
      stateRef.current = 'return_left'
      if (currentFrameRef.current < 24) currentFrameRef.current = 24
    } else if (s === 'turn_right' || s === 'hold_right') {
      pendingTargetRef.current = 'center_greet'
      stateRef.current = 'return_right'
      if (currentFrameRef.current < 40) currentFrameRef.current = 40
    } else if (s === 'return_left' || s === 'return_right') {
      pendingTargetRef.current = 'center_greet'
    }
  }, [])

  const triggerCenter = useCallback(() => {
    activeZoneRef.current = 'center'
  }, [])

  // ── Start RAF loop on mount ────────────────────────────────────────────────
  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [tick])

  return {
    triggerLeft,
    triggerRight,
    triggerCenter,
    triggerCenterDwell,
  }
}

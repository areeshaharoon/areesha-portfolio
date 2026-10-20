import { useRef, useEffect, useCallback } from 'react'
import { FRAMES, FRAME_RATES, HOLD_DURATIONS } from '../config/frames'

/**
 * useCharacterAnimation
 *
 * Implements the imperative RAF animation loop directly on the <img> DOM element.
 * Produces ZERO React component re-renders while animating frames.
 *
 * State Machine:
 * - 'working' (phase: 'loop') -> cycles frames 1-12
 * - 'left'    (phase: 'react') -> plays frames 13-17
 *             (phase: 'hold')  -> holds frame 17 for ~2.5s
 *             (phase: 'return')-> plays frames 18-22 -> back to 'working'
 * - 'right'   (phase: 'react') -> plays frames 23-26
 *             (phase: 'hold')  -> holds frame 26 for ~2.5s
 *             (phase: 'return')-> plays frames 27-31 -> back to 'working'
 * - 'center'  (phase: 'react') -> plays frames 32-50 without interruption
 *             (phase: 'hold')  -> holds frame 50 pointing downward
 *             (phase: 'return')-> smoothly returns to 'working'
 */
export function useCharacterAnimation(imgRef) {
  const stateRef = useRef('working')
  const phaseRef = useRef('loop')
  const frameIdxRef = useRef(0)
  const lastTimeRef = useRef(0)
  const rafRef = useRef(null)
  const holdTimerRef = useRef(null)
  const centerInProgressRef = useRef(false)
  const lastReactionZoneRef = useRef(null)

  // Returns the active frame sequence, fps, and whether it loops
  const getCurrentSequence = useCallback(() => {
    const state = stateRef.current
    const phase = phaseRef.current

    switch (state) {
      case 'working':
        return { seq: FRAMES.working, fps: FRAME_RATES.working, loop: true }
      case 'left':
        if (phase === 'react') return { seq: FRAMES.leftReaction, fps: FRAME_RATES.leftReaction, loop: false }
        if (phase === 'hold') return { seq: [FRAMES.holdLeft], fps: 1, loop: false }
        if (phase === 'return') return { seq: FRAMES.leftReturn, fps: FRAME_RATES.leftReturn, loop: false }
        return { seq: FRAMES.working, fps: FRAME_RATES.working, loop: true }
      case 'right':
        if (phase === 'react') return { seq: FRAMES.rightReaction, fps: FRAME_RATES.rightReaction, loop: false }
        if (phase === 'hold') return { seq: [FRAMES.holdRight], fps: 1, loop: false }
        if (phase === 'return') return { seq: FRAMES.rightReturn, fps: FRAME_RATES.rightReturn, loop: false }
        return { seq: FRAMES.working, fps: FRAME_RATES.working, loop: true }
      case 'center':
        if (phase === 'react') return { seq: FRAMES.centerGreeting, fps: FRAME_RATES.centerGreeting, loop: false }
        if (phase === 'hold') return { seq: [FRAMES.holdCenter], fps: 1, loop: false }
        return { seq: FRAMES.working, fps: FRAME_RATES.working, loop: true }
      default:
        return { seq: FRAMES.working, fps: FRAME_RATES.working, loop: true }
    }
  }, [])

  // Imperatively updates <img> source without triggering React re-render
  const setFrame = useCallback((src) => {
    if (imgRef.current && imgRef.current.src !== src) {
      imgRef.current.src = src
    }
  }, [imgRef])

  // Clear any existing hold timeout
  const clearHoldTimer = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }
  }, [])

  // Main animation frame tick
  const tick = useCallback((timestamp) => {
    const { seq, fps, loop } = getCurrentSequence()
    const interval = 1000 / fps

    if (timestamp - lastTimeRef.current >= interval) {
      lastTimeRef.current = timestamp
      const idx = frameIdxRef.current

      if (idx < seq.length) {
        setFrame(seq[idx])
        frameIdxRef.current = idx + 1
      } else {
        // End of current sequence
        if (loop) {
          frameIdxRef.current = 0
        } else {
          const state = stateRef.current
          const phase = phaseRef.current

          if (state === 'left' && phase === 'react') {
            // Enter LEFT hold phase
            phaseRef.current = 'hold'
            frameIdxRef.current = 0
            setFrame(FRAMES.holdLeft)
            clearHoldTimer()
            holdTimerRef.current = setTimeout(() => {
              stateRef.current = 'left'
              phaseRef.current = 'return'
              frameIdxRef.current = 0
            }, HOLD_DURATIONS.left)
          } else if (state === 'left' && phase === 'return') {
            // Finished left return -> back to normal working
            stateRef.current = 'working'
            phaseRef.current = 'loop'
            frameIdxRef.current = 0
          } else if (state === 'right' && phase === 'react') {
            // Enter RIGHT hold phase
            phaseRef.current = 'hold'
            frameIdxRef.current = 0
            setFrame(FRAMES.holdRight)
            clearHoldTimer()
            holdTimerRef.current = setTimeout(() => {
              stateRef.current = 'right'
              phaseRef.current = 'return'
              frameIdxRef.current = 0
            }, HOLD_DURATIONS.right)
          } else if (state === 'right' && phase === 'return') {
            // Finished right return -> back to normal working
            stateRef.current = 'working'
            phaseRef.current = 'loop'
            frameIdxRef.current = 0
          } else if (state === 'center' && phase === 'react') {
            // Enter CENTER hold phase (pointing down)
            centerInProgressRef.current = false
            phaseRef.current = 'hold'
            frameIdxRef.current = 0
            setFrame(FRAMES.holdCenter)
            clearHoldTimer()
            holdTimerRef.current = setTimeout(() => {
              stateRef.current = 'working'
              phaseRef.current = 'loop'
              frameIdxRef.current = 0
            }, HOLD_DURATIONS.center)
          }
        }
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [getCurrentSequence, setFrame, clearHoldTimer])

  // Zone triggers called by zone detector
  const triggerLeft = useCallback(() => {
    // If center sequence is actively greeting, don't abruptly cut it
    if (centerInProgressRef.current) return
    if (stateRef.current === 'left' && phaseRef.current === 'react') return

    clearHoldTimer()
    lastReactionZoneRef.current = 'left'
    stateRef.current = 'left'
    phaseRef.current = 'react'
    frameIdxRef.current = 0
  }, [clearHoldTimer])

  const triggerRight = useCallback(() => {
    if (centerInProgressRef.current) return
    if (stateRef.current === 'right' && phaseRef.current === 'react') return

    clearHoldTimer()
    lastReactionZoneRef.current = 'right'
    stateRef.current = 'right'
    phaseRef.current = 'react'
    frameIdxRef.current = 0
  }, [clearHoldTimer])

  const triggerCenter = useCallback(() => {
    // Center is the main greeting moment
    if (stateRef.current === 'center') return

    clearHoldTimer()
    centerInProgressRef.current = true
    lastReactionZoneRef.current = 'center'
    stateRef.current = 'center'
    phaseRef.current = 'react'
    frameIdxRef.current = 0
  }, [clearHoldTimer])

  const triggerWorking = useCallback(() => {
    if (centerInProgressRef.current) return
    clearHoldTimer()
    stateRef.current = 'working'
    phaseRef.current = 'loop'
    frameIdxRef.current = 0
  }, [clearHoldTimer])

  // Lifecycle: start RAF on mount, clean up on unmount
  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.src = FRAMES.working[0]
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      clearHoldTimer()
    }
  }, [tick, imgRef, clearHoldTimer])

  return {
    triggerLeft,
    triggerRight,
    triggerCenter,
    triggerWorking,
  }
}

import { useRef, useCallback } from 'react'

/**
 * useZoneDetection — v2 (Hysteresis + Stable Zones)
 *
 * Improvements:
 * 1. Hysteresis buffer: once in a zone, cursor must cross a wider threshold
 *    before zone changes — prevents jitter at zone boundaries.
 * 2. Dwell timer is cleared only when truly leaving center (not on every move).
 * 3. Mobile always triggers center dwell.
 *
 * Zone boundaries (entry):
 *   Left:   ratio < 0.35
 *   Right:  ratio > 0.65
 *   Center: 0.35 – 0.65
 *
 * Exit hysteresis (must cross further before switching):
 *   Left zone exit:    ratio > 0.42  (6% buffer before "entering center")
 *   Right zone exit:   ratio < 0.58  (6% buffer before "entering center")
 *   Center zone exit:  ratio < 0.30 for left, ratio > 0.70 for right
 */
export function useZoneDetection({ onLeft, onRight, onCenter, onCenterDwell, onLeave }) {
  const heroRef = useRef(null)
  const currentZoneRef = useRef('none')
  const dwellTimerRef = useRef(null)

  const getZone = useCallback((ratio, currentZone) => {
    // Apply hysteresis: need a bigger movement to leave current zone
    if (currentZone === 'left') {
      // Stay left until ratio > 0.42
      return ratio > 0.42 ? 'center' : 'left'
    }
    if (currentZone === 'right') {
      // Stay right until ratio < 0.58
      return ratio < 0.58 ? 'center' : 'right'
    }
    if (currentZone === 'center') {
      // Leave center only if cursor goes quite far left/right
      if (ratio < 0.30) return 'left'
      if (ratio > 0.70) return 'right'
      return 'center'
    }
    // First entry (zone === 'none')
    if (ratio < 0.35) return 'left'
    if (ratio > 0.65) return 'right'
    return 'center'
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (window.innerWidth < 768) {
      if (currentZoneRef.current !== 'center') {
        currentZoneRef.current = 'center'
        onCenterDwell?.()
      }
      return
    }

    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return

    const relX = e.clientX - rect.left
    const ratio = relX / rect.width

    const newZone = getZone(ratio, currentZoneRef.current)

    if (newZone === currentZoneRef.current) {
      // Still in same zone — only manage dwell timer for center
      if (newZone === 'center' && !dwellTimerRef.current) {
        dwellTimerRef.current = setTimeout(() => {
          dwellTimerRef.current = null
          onCenterDwell?.()
        }, 250)
      }
      return
    }

    // Zone changed — update and fire callbacks
    const prevZone = currentZoneRef.current
    currentZoneRef.current = newZone

    // Clear dwell timer when leaving center
    if (prevZone === 'center' && dwellTimerRef.current) {
      clearTimeout(dwellTimerRef.current)
      dwellTimerRef.current = null
    }

    if (newZone === 'left') {
      onLeft?.()
    } else if (newZone === 'right') {
      onRight?.()
    } else if (newZone === 'center') {
      onCenter?.()
      // Start dwell timer fresh
      if (!dwellTimerRef.current) {
        dwellTimerRef.current = setTimeout(() => {
          dwellTimerRef.current = null
          onCenterDwell?.()
        }, 250)
      }
    }
  }, [getZone, onLeft, onRight, onCenter, onCenterDwell])

  const handleMouseLeave = useCallback(() => {
    if (dwellTimerRef.current) {
      clearTimeout(dwellTimerRef.current)
      dwellTimerRef.current = null
    }
    currentZoneRef.current = 'none'
    onLeave?.()
  }, [onLeave])

  return { handleMouseMove, handleMouseLeave, heroRef }
}

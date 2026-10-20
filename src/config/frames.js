/**
 * Frame sequence configuration — 80 frames (/assets/hero-frames/)
 * Analyzed directly from original character animation:
 *
 * 001 – 015 : WORKING LOOP     — head down, typing at laptop, headset on
 * 016 – 023 : TURN LEFT        — smoothly turns head to the left (peak at 22-23)
 * 024 – 032 : RETURN FROM LEFT — smoothly turns head back down to laptop
 * 033 – 039 : TURN RIGHT       — smoothly turns head to the right (peak at 38-39)
 * 040 – 045 : RETURN FROM RIGHT— smoothly turns head back down to laptop
 * 046 – 055 : LOOK FRONT / UP  — notices visitor, looks directly at camera/front
 * 056 – 065 : REMOVE HEADSET   — hands up, pulls headset off around neck
 * 066 – 080 : GREET & POINT    — smiles warmly, points down to portfolio
 */

const f = (n) => `/assets/hero-frames/ezgif-frame-${String(n).padStart(3, '0')}.jpg`

const range = (start, end) => {
  const arr = []
  for (let i = start; i <= end; i++) arr.push(f(i))
  return arr
}

export const FRAMES = {
  working:         range(1, 15),
  turnLeft:        range(16, 23),
  holdLeft:        f(23),
  returnFromLeft:  range(24, 32),
  turnRight:       range(33, 39),
  holdRight:       f(39),
  returnFromRight: range(40, 45),
  lookFront:       range(46, 55),
  greeting:        range(46, 80),
}

// All frame paths for eager preloading (1 – 80)
export const ALL_FRAMES = range(1, 80)

export const TOTAL_FRAMES = 80

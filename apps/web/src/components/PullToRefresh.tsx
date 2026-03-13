import { useEffect, useRef } from 'react'

const MAX_PULL = 90   // max px of elastic stretch
const DAMPING  = 0.35 // resistance (lower = harder to pull)

function atTop()    { return window.scrollY <= 0 }
function atBottom() { return window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2 }

export default function ElasticScroll() {
  const startY    = useRef(0)
  const startX    = useRef(0)
  const dirLocked = useRef<'none' | 'h' | 'v'>('none')
  const pulling   = useRef(false)

  useEffect(() => {
    const root = document.getElementById('pull-content')
    if (!root) return

    const setOffset = (px: number, animate: boolean) => {
      root.style.transition = animate
        ? 'transform 0.55s cubic-bezier(0.34, 1.3, 0.64, 1)'
        : 'none'
      root.style.transform = px === 0 ? '' : `translateY(${px}px)`
    }

    const onStart = (e: TouchEvent) => {
      if ((e.target as HTMLElement).closest('[data-overlay]')) return
      // only activate at scroll boundaries
      if (!atTop() && !atBottom()) return
      startY.current    = e.touches[0].clientY
      startX.current    = e.touches[0].clientX
      dirLocked.current = 'none'
      pulling.current   = false
    }

    const onMove = (e: TouchEvent) => {
      if (document.querySelector('[data-overlay]')) return
      const dx = Math.abs(e.touches[0].clientX - startX.current)
      const dy = e.touches[0].clientY - startY.current

      if (dirLocked.current === 'none' && (dx > 5 || Math.abs(dy) > 5)) {
        dirLocked.current = dx > Math.abs(dy) ? 'h' : 'v'
      }
      if (dirLocked.current !== 'v') return

      const pullDown = dy > 0 && atTop()
      const pullUp   = dy < 0 && atBottom()
      if (!pullDown && !pullUp) return

      e.preventDefault()
      pulling.current = true
      const clamped = Math.max(-MAX_PULL, Math.min(MAX_PULL, dy * DAMPING))
      setOffset(clamped, false)
    }

    const onEnd = () => {
      if (!pulling.current) return
      pulling.current = false
      setOffset(0, true)
    }

    document.addEventListener('touchstart', onStart, { passive: true })
    document.addEventListener('touchmove',  onMove,  { passive: false })
    document.addEventListener('touchend',   onEnd,   { passive: true })
    return () => {
      document.removeEventListener('touchstart', onStart)
      document.removeEventListener('touchmove',  onMove)
      document.removeEventListener('touchend',   onEnd)
    }
  }, [])

  return null
}

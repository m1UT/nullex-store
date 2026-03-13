import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { RefreshCw } from 'lucide-react'

const MAX_PULL  = 110
const THRESHOLD = 65
const DAMPING   = 0.70

type Phase = 'idle' | 'pulling' | 'spinning' | 'exiting'

function isAnyParentScrolled(e: TouchEvent): boolean {
  if (window.scrollY > 0) return true
  let el = e.target as HTMLElement | null
  while (el && el !== document.documentElement) {
    if (el.scrollTop > 0) return true
    el = el.parentElement
  }
  return false
}

export default function PullToRefresh() {
  const [pull, setPull]   = useState(0)
  const [phase, setPhase] = useState<Phase>('idle')
  const startY = useRef(0)
  const startX = useRef(0)
  const dirLocked = useRef<'none' | 'h' | 'v'>('none')
  const active = useRef(false)
  // Read --safe-top set by initTelegram() or CSS env(safe-area-inset-top)
  const topInset = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--safe-top') || '0'
  ) || 0

  /* ── #root stretch transform ── */
  useEffect(() => {
    const root = document.getElementById('pull-content')
    if (!root) return

    if (phase === 'idle') {
      root.style.transform  = ''
      root.style.transition = ''
    } else if (phase === 'pulling') {
      root.style.transition = 'none'
      root.style.transform  = `translateY(${pull * DAMPING}px)`
    } else {
      root.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.45, 0.64, 1)'
      root.style.transform  = 'translateY(0)'
    }
  }, [pull, phase])

  /* ── touch listeners ── */
  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      if (isAnyParentScrolled(e)) return
      if ((e.target as HTMLElement).closest('[data-overlay]')) return
      startY.current = e.touches[0].clientY
      startX.current = e.touches[0].clientX
      dirLocked.current = 'none'
      active.current = true
    }

    const onMove = (e: TouchEvent) => {
      if (!active.current) return
      if (isAnyParentScrolled(e)) {
        active.current = false
        setPhase('idle')
        setPull(0)
        return
      }
      const dx = Math.abs(e.touches[0].clientX - startX.current)
      const dy = e.touches[0].clientY - startY.current
      // lock direction on first significant movement
      if (dirLocked.current === 'none' && (dx > 4 || Math.abs(dy) > 4)) {
        dirLocked.current = dx > Math.abs(dy) ? 'h' : 'v'
      }
      // horizontal gesture → abort pull-to-refresh entirely
      if (dirLocked.current === 'h') {
        active.current = false
        setPhase('idle')
        setPull(0)
        return
      }
      if (dy > 0) {
        setPhase('pulling')
        setPull(Math.min(dy, MAX_PULL))
      } else {
        active.current = false
        setPhase('idle')
        setPull(0)
      }
    }

    const onEnd = () => {
      if (!active.current) return
      active.current = false
      setPull(prev => {
        if (prev >= THRESHOLD) {
          // enough pull → spin then exit → reload
          setPhase('spinning')
          setTimeout(() => {
            setPhase('exiting')
            setTimeout(() => window.location.reload(), 250)
          }, 600)
        } else {
          // not enough → exit immediately
          setPhase('exiting')
          setTimeout(() => { setPhase('idle'); setPull(0) }, 250)
        }
        return prev
      })
    }

    document.addEventListener('touchstart', onStart, { passive: true })
    document.addEventListener('touchmove',  onMove,  { passive: true })
    document.addEventListener('touchend',   onEnd,   { passive: true })
    return () => {
      document.removeEventListener('touchstart', onStart)
      document.removeEventListener('touchmove',  onMove)
      document.removeEventListener('touchend',   onEnd)
    }
  }, [])

  if (phase === 'idle') return null

  const progress = Math.min(pull / MAX_PULL, 1)

  // indicator slides from above the screen top (-60px) to resting position
  // (just below the safe area). Container is at top:0 (physical screen edge).
  const restY = topInset + 14
  const indicatorY =
    phase === 'pulling'  ? -60 + progress * (restY + 60)
    : phase === 'spinning' ? restY
    : -70 // exiting — fly back above screen

  const indicatorTransition =
    phase === 'pulling'  ? 'none'                  // follows finger, no easing
    : phase === 'spinning' ? 'none'                // already in position
    : 'transform 0.22s ease-in'                   // fast exit upward

  const indicator = (
    <div
      style={{
        position:       'fixed',
        top:            0,
        left:           0,
        right:          0,
        zIndex:         9999,
        display:        'flex',
        justifyContent: 'center',
        pointerEvents:  'none',
        transform:      `translateY(${indicatorY}px)`,
        transition:     indicatorTransition,
      }}
    >
      <div
        style={{
          width:           40,
          height:          40,
          borderRadius:    '50%',
          backgroundColor: 'rgba(18, 18, 31, 0.97)',
          border:          '1.5px solid rgba(168, 255, 62, 0.28)',
          boxShadow:       '0 4px 24px rgba(0,0,0,0.65)',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
        }}
      >
        <RefreshCw
          size={18}
          color="#A8FF3E"
          style={{
            // slow rotation while pulling (1.5° per px)
            transform: phase === 'pulling' ? `rotate(${pull * 1.5}deg)` : undefined,
            // fast spin on release
            animation: phase === 'spinning' ? 'ptr-spin 0.45s linear infinite' : 'none',
          }}
        />
      </div>
    </div>
  )

  return createPortal(indicator, document.body)
}

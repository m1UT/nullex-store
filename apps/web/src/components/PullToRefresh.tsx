import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { RefreshCw } from 'lucide-react'
import { getTopInset } from '../lib/telegram'

const THRESHOLD  = 70
const MAX_PULL   = 110
const DAMPING    = 0.42
const SNAP_EASE  = 'cubic-bezier(0.34, 1.45, 0.64, 1)'

type Phase = 'idle' | 'pulling' | 'refreshing' | 'releasing'

/** Returns true if any scrollable ancestor of the touch target is not at the top */
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
  const active = useRef(false)
  const topInset = getTopInset()

  /* ── apply transform to #root so entire UI moves ── */
  useEffect(() => {
    const root = document.getElementById('root')
    if (!root) return

    if (phase === 'idle') {
      root.style.transform  = ''
      root.style.transition = ''
    } else if (phase === 'pulling') {
      root.style.transition = 'none'
      root.style.transform  = `translateY(${pull * DAMPING}px)`
    } else {
      root.style.transition = `transform 0.52s ${SNAP_EASE}`
      root.style.transform  = 'translateY(0)'
    }
  }, [pull, phase])

  /* ── touch listeners ── */
  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      if (isAnyParentScrolled(e)) return
      startY.current = e.touches[0].clientY
      active.current = true
    }

    const onMove = (e: TouchEvent) => {
      if (!active.current) return
      // cancel if user scrolled down since touch started
      if (isAnyParentScrolled(e)) {
        active.current = false
        setPhase('idle')
        setPull(0)
        return
      }
      const dy = e.touches[0].clientY - startY.current
      if (dy > 0) {
        if (phase !== 'pulling') setPhase('pulling')
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
          setPhase('refreshing')
          setTimeout(() => window.location.reload(), 900)
        } else {
          setPhase('releasing')
          setTimeout(() => { setPhase('idle'); setPull(0) }, 520)
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
  }, [phase])

  if (phase === 'idle') return null

  /* ── indicator position ── */
  const progress = Math.min(pull / MAX_PULL, 1)
  // slides in from -56px to 0 as you pull
  const indicatorY = phase === 'pulling'
    ? -56 + progress * 56
    : phase === 'refreshing' ? 0 : -56

  const isPulling    = phase === 'pulling'
  const isRefreshing = phase === 'refreshing'

  const indicator = (
    <div
      style={{
        position:       'fixed',
        top:            topInset + 14,
        left:           0,
        right:          0,
        zIndex:         9999,
        display:        'flex',
        justifyContent: 'center',
        pointerEvents:  'none',
        transform:      `translateY(${indicatorY}px)`,
        transition:     isPulling ? 'none' : `transform 0.52s ${SNAP_EASE}`,
      }}
    >
      <div
        style={{
          width:           38,
          height:          38,
          borderRadius:    '50%',
          backgroundColor: 'rgba(18, 18, 31, 0.97)',
          border:          '1.5px solid rgba(168, 255, 62, 0.28)',
          boxShadow:       '0 4px 24px rgba(0,0,0,0.65)',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          opacity:         progress,
          transform:       `scale(${0.55 + progress * 0.45})`,
          transition:      isPulling ? 'none' : `opacity 0.3s ease, transform 0.52s ${SNAP_EASE}`,
        }}
      >
        <RefreshCw
          size={18}
          color="#A8FF3E"
          style={{
            transform:  isPulling ? `rotate(${pull * 3}deg)` : undefined,
            animation:  isRefreshing ? 'ptr-spin 0.65s linear infinite' : 'none',
            transition: isPulling ? 'none' : 'transform 0.3s ease',
          }}
        />
      </div>
    </div>
  )

  // portal keeps indicator outside #root so it stays viewport-fixed
  // even when #root has a CSS transform applied
  return createPortal(indicator, document.body)
}

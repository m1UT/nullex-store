import { useState, useEffect, useRef } from 'react'
import { RefreshCw } from 'lucide-react'

const THRESHOLD = 65
const MAX_PULL = 80

export default function PullToRefresh() {
  const [pullY, setPullY] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const startY = useRef(0)
  const active = useRef(false)

  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      if (window.scrollY > 0) return
      startY.current = e.touches[0].clientY
      active.current = true
    }

    const onMove = (e: TouchEvent) => {
      if (!active.current) return
      const dy = e.touches[0].clientY - startY.current
      if (dy > 0) {
        setPullY(Math.min(dy * 0.5, MAX_PULL))
      } else {
        setPullY(0)
        active.current = false
      }
    }

    const onEnd = () => {
      if (!active.current) return
      active.current = false
      setPullY(prev => {
        if (prev >= THRESHOLD) {
          setRefreshing(true)
          setTimeout(() => window.location.reload(), 600)
          return prev
        }
        return 0
      })
    }

    document.addEventListener('touchstart', onStart, { passive: true })
    document.addEventListener('touchmove', onMove, { passive: true })
    document.addEventListener('touchend', onEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', onStart)
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onEnd)
    }
  }, [])

  if (pullY === 0 && !refreshing) return null

  const progress = Math.min(pullY / MAX_PULL, 1)

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        display: 'flex',
        justifyContent: 'center',
        paddingTop: pullY + 16,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          backgroundColor: '#1A1A2E',
          border: '1.5px solid rgba(168,255,62,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: progress,
          transform: `scale(${0.5 + progress * 0.5})`,
          transition: refreshing ? 'none' : 'transform 0.05s',
          boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
        }}
      >
        <RefreshCw
          size={18}
          color="#A8FF3E"
          style={{
            transform: refreshing ? undefined : `rotate(${pullY * 4}deg)`,
            animation: refreshing ? 'ptr-spin 0.6s linear infinite' : 'none',
          }}
        />
      </div>
    </div>
  )
}

import { useEffect } from 'react'

export function usePullToRefresh(threshold = 80) {
  useEffect(() => {
    let startY = 0

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY
    }

    const onTouchEnd = (e: TouchEvent) => {
      const delta = e.changedTouches[0].clientY - startY
      if (delta > threshold && window.scrollY === 0) {
        window.location.reload()
      }
    }

    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchend', onTouchEnd)
    }
  }, [threshold])
}

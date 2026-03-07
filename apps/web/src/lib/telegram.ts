declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

interface SafeAreaInset {
  top: number
  bottom: number
  left: number
  right: number
}

interface TelegramWebApp {
  ready: () => void
  expand: () => void
  close: () => void
  disableVerticalSwipes: () => void
  requestFullscreen: () => void
  setBackgroundColor: (color: string) => void
  setHeaderColor: (color: string) => void
  onEvent: (eventType: string, handler: () => void) => void
  platform: string
  safeAreaInset: SafeAreaInset
  contentSafeAreaInset: SafeAreaInset
  initDataUnsafe: {
    user?: {
      id: number
      first_name: string
      last_name?: string
      username?: string
      photo_url?: string
    }
  }
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void
    selectionChanged: () => void
  }
  MainButton: {
    text: string
    show: () => void
    hide: () => void
    onClick: (fn: () => void) => void
  }
  themeParams: Record<string, string>
}

function applySafeTop(): void {
  const tg = window.Telegram?.WebApp
  if (!tg) return
  const safeTop = (tg.safeAreaInset?.top ?? 0) + (tg.contentSafeAreaInset?.top ?? 0)
  if (safeTop > 0) {
    document.documentElement.style.setProperty('--safe-top', `${safeTop}px`)
  }
}

export function initTelegram(): void {
  const tg = window.Telegram?.WebApp
  if (!tg) return

  tg.ready()
  tg.expand()
  tg.disableVerticalSwipes?.()
  tg.setBackgroundColor?.('#0D0D14')
  tg.setHeaderColor?.('#0D0D14')

  // Apply immediately, then re-apply whenever Telegram updates safe areas
  // (values differ between Menu Button and Main App launch contexts)
  applySafeTop()
  tg.onEvent?.('safeAreaChanged', applySafeTop)
  tg.onEvent?.('contentSafeAreaChanged', applySafeTop)
}

export function getTelegramUser() {
  return window.Telegram?.WebApp?.initDataUnsafe?.user ?? null
}

export const tg = (): TelegramWebApp | undefined => window.Telegram?.WebApp

export function hapticSelection(): void {
  window.Telegram?.WebApp?.HapticFeedback?.selectionChanged()
}

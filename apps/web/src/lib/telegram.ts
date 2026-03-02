declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

interface TelegramWebApp {
  ready: () => void
  expand: () => void
  close: () => void
  disableVerticalSwipes: () => void
  requestFullscreen: () => void
  setBackgroundColor: (color: string) => void
  setHeaderColor: (color: string) => void
  platform: string
  initDataUnsafe: {
    user?: {
      id: number
      first_name: string
      last_name?: string
      username?: string
      photo_url?: string
    }
  }
  MainButton: {
    text: string
    show: () => void
    hide: () => void
    onClick: (fn: () => void) => void
  }
  themeParams: Record<string, string>
}

export function initTelegram(): void {
  const tg = window.Telegram?.WebApp
  if (!tg) return
  tg.ready()
  tg.expand()
  tg.requestFullscreen?.()
  tg.disableVerticalSwipes?.()
  tg.setBackgroundColor?.('#0D0D14')
  tg.setHeaderColor?.('#0D0D14')
}

export function getTelegramUser() {
  return window.Telegram?.WebApp?.initDataUnsafe?.user ?? null
}

export function isIOS(): boolean {
  const platform = window.Telegram?.WebApp?.platform
  if (platform) return platform === 'ios'
  // Fallback for browser outside TMA
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

export function getTopInset(): number {
  return isIOS() ? 100 : 0
}

export const tg = (): TelegramWebApp | undefined => window.Telegram?.WebApp

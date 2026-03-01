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
  requestFullscreen?: () => void
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

const MOBILE_PLATFORMS = ['ios', 'android', 'android_x']

export function initTelegram(): void {
  const tg = window.Telegram?.WebApp
  if (!tg) return
  tg.ready()
  tg.expand()
  if (MOBILE_PLATFORMS.includes(tg.platform)) {
    try { tg.requestFullscreen?.() } catch {}
  }
}

export function getTelegramUser() {
  return window.Telegram?.WebApp?.initDataUnsafe?.user ?? null
}

export const tg = (): TelegramWebApp | undefined => window.Telegram?.WebApp

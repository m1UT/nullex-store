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
}

export function getTelegramUser() {
  return window.Telegram?.WebApp?.initDataUnsafe?.user ?? null
}

export const tg = (): TelegramWebApp | undefined => window.Telegram?.WebApp

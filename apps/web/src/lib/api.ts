import { Gamepad2, Code2, PlayCircle } from 'lucide-react'
import type { Product } from '../data/products'

// ── API product types ─────────────────────────────────────────────────────────

export interface ApiProduct {
  id: number
  name: string
  description: string | null
  category: 'GAMES' | 'SOFTWARE' | 'SUBSCRIPTIONS'
  price: string
  stock: number
  thumbnailUrl: string | null
}

export interface BackendUser {
  id: number
  telegramId: string
  username: string | null
  balance: string
}

export interface CartItemRaw {
  userId: number
  productId: number
  product: ApiProduct
}

export interface CartItem {
  productId: number
  product: Product
}

export interface OrderItem {
  id: number
  productId: number
  price: string
  product: ApiProduct
}

export interface Order {
  id: number
  total: string
  status: string
  createdAt: string
  items: OrderItem[]
}

// ── Visual mapping ────────────────────────────────────────────────────────────

export const CATEGORY_VISUALS = {
  GAMES: {
    label: 'Games',
    meta: 'Игры',
    Icon: Gamepad2,
    iconColor: '#9B5CF6',
    bg: 'linear-gradient(135deg, #1B0A3A 0%, #0A1A4A 100%)',
    glow: 'radial-gradient(ellipse at center, rgba(155,92,246,0.42) 0%, transparent 70%)',
  },
  SOFTWARE: {
    label: 'Software',
    meta: 'ПО',
    Icon: Code2,
    iconColor: '#4F6EF7',
    bg: 'linear-gradient(135deg, #1A0A0A 0%, #2A1060 100%)',
    glow: 'radial-gradient(ellipse at center, rgba(79,110,247,0.35) 0%, transparent 70%)',
  },
  SUBSCRIPTIONS: {
    label: 'Subscriptions',
    meta: 'Подписка',
    Icon: PlayCircle,
    iconColor: '#FF6BF8',
    bg: 'linear-gradient(135deg, #0A1A2A 0%, #2A0A30 100%)',
    glow: 'radial-gradient(ellipse at center, rgba(255,107,248,0.30) 0%, transparent 70%)',
  },
} as const

export function mapApiProduct(p: ApiProduct): Product {
  const vis = CATEGORY_VISUALS[p.category] ?? CATEGORY_VISUALS.GAMES
  return {
    id: String(p.id),
    name: p.name,
    description: p.description ?? '',
    category: vis.label,
    meta: `${vis.meta} · ${p.name}`,
    cardMeta: vis.meta,
    price: `$${parseFloat(p.price).toFixed(2)}`,
    stock: p.stock,
    Icon: vis.Icon,
    iconColor: vis.iconColor,
    bg: vis.bg,
    glow: vis.glow,
    tags: [],
  }
}

// ── Auth fetch ────────────────────────────────────────────────────────────────

function getInitData(): string {
  return (window as Window & { Telegram?: { WebApp?: { initData?: string } } })
    .Telegram?.WebApp?.initData ?? ''
}

async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const initData = getInitData()
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(initData ? { 'X-Telegram-Init-Data': initData } : {}),
      ...(options.headers as Record<string, string> ?? {}),
    },
  })
}

// ── Public endpoints ──────────────────────────────────────────────────────────

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch('/products')
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data: ApiProduct[] = await res.json()
  return data.map(mapApiProduct)
}

// ── /me endpoints ─────────────────────────────────────────────────────────────

export async function fetchMe(): Promise<BackendUser | null> {
  try {
    const res = await authFetch('/me')
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

export async function fetchLikes(): Promise<Product[]> {
  try {
    const res = await authFetch('/me/likes')
    if (!res.ok) return []
    const data: ApiProduct[] = await res.json()
    return data.map(mapApiProduct)
  } catch { return [] }
}

export async function toggleLike(productId: number): Promise<{ liked: boolean } | null> {
  try {
    const res = await authFetch(`/me/likes/${productId}`, { method: 'POST' })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

export async function fetchCart(): Promise<CartItem[]> {
  try {
    const res = await authFetch('/me/cart')
    if (!res.ok) return []
    const data: CartItemRaw[] = await res.json()
    return data.map((item) => ({ productId: item.productId, product: mapApiProduct(item.product) }))
  } catch { return [] }
}

export async function addToCart(productId: number): Promise<boolean> {
  try {
    const res = await authFetch(`/me/cart/${productId}`, { method: 'POST' })
    return res.ok
  } catch { return false }
}

export async function removeFromCart(productId: number): Promise<boolean> {
  try {
    const res = await authFetch(`/me/cart/${productId}`, { method: 'DELETE' })
    return res.ok || res.status === 204
  } catch { return false }
}

export async function clearCart(): Promise<boolean> {
  try {
    const res = await authFetch('/me/cart', { method: 'DELETE' })
    return res.ok || res.status === 204
  } catch { return false }
}

export async function fetchOrders(): Promise<Order[]> {
  try {
    const res = await authFetch('/me/orders')
    if (!res.ok) return []
    return res.json()
  } catch { return [] }
}

export async function placeOrder(): Promise<{ ok: true; orders: Order[] } | { ok: false; error: string }> {
  try {
    const res = await authFetch('/me/orders', { method: 'POST' })
    if (res.ok) return { ok: true, orders: await res.json() }
    // Parse body to detect specific errors regardless of exact status code
    let body: Record<string, unknown> = {}
    try { body = await res.json() } catch { /* ignore */ }
    const msg = String(body.message ?? '').toLowerCase()
    if (res.status === 402 || msg.includes('balance')) return { ok: false, error: 'insufficient_balance' }
    if (res.status === 409 || msg.includes('stock')) return { ok: false, error: 'out_of_stock' }
    return { ok: false, error: 'unknown' }
  } catch { return { ok: false, error: 'network' } }
}

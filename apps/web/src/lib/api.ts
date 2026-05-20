import { Gamepad2, Code2, PlayCircle } from 'lucide-react'
import type { Product } from '../data/products'

interface ApiProduct {
  id: number
  name: string
  description: string | null
  category: 'GAMES' | 'SOFTWARE' | 'SUBSCRIPTIONS'
  price: string
  stock: number
  thumbnailUrl: string | null
}

const CATEGORY_VISUALS = {
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
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch('/products')
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data: ApiProduct[] = await res.json()
  return data.map((p) => {
    const vis = CATEGORY_VISUALS[p.category]
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
  })
}

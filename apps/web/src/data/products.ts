import { Gamepad2, Type, Box, Music2, Sword, Brush } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface Product {
  id: string
  name: string
  meta: string
  cardMeta: string
  price: string
  Icon: LucideIcon
  iconColor: string
  bg: string
  glow: string
  tags: string[]
  description: string
}

export const PRODUCTS: Product[] = [
  {
    id: 'neon-racer-pro',
    name: 'Neon Racer Pro',
    meta: 'Game · Indie · Action',
    cardMeta: 'Game · Indie',
    price: '$24.99',
    Icon: Gamepad2,
    iconColor: '#9B5CF6',
    bg: 'linear-gradient(135deg, #1B0A3A 0%, #0A1A4A 100%)',
    glow: 'radial-gradient(ellipse at center, rgba(155,92,246,0.42) 0%, transparent 70%)',
    tags: ['Racing', 'Action', 'Indie'],
    description:
      'A blazing neon racing experience with 60fps gameplay, procedural tracks, and chiptune soundtrack. Instant download.',
  },
  {
    id: 'grotesk-variable',
    name: 'Grotesk Variable',
    meta: 'Font · Display',
    cardMeta: 'Font · Display',
    price: '$19.00',
    Icon: Type,
    iconColor: '#A8FF3E',
    bg: 'linear-gradient(135deg, #0A2A1A 0%, #1A0A3A 100%)',
    glow: 'radial-gradient(ellipse at center, rgba(168,255,62,0.30) 0%, transparent 70%)',
    tags: ['Variable', 'Display', 'Sans-serif'],
    description:
      'A modern variable typeface with 9 weights and optical sizing. Perfect for headlines, interfaces, and branding.',
  },
  {
    id: 'scifi-asset-pack',
    name: 'SciFi Asset Pack',
    meta: '3D Assets · Sci-fi',
    cardMeta: '3D Assets · Sci-fi',
    price: '$49.00',
    Icon: Box,
    iconColor: '#4F6EF7',
    bg: 'linear-gradient(135deg, #1A0A0A 0%, #2A1060 100%)',
    glow: 'radial-gradient(ellipse at center, rgba(79,110,247,0.35) 0%, transparent 70%)',
    tags: ['3D', 'Sci-fi', 'Game Ready'],
    description:
      '200+ high-quality sci-fi 3D assets optimised for real-time engines. Includes spaceships, props, and environments.',
  },
  {
    id: 'lofi-beats-vol3',
    name: 'Lo-Fi Beats Vol.3',
    meta: 'Music · Ambient',
    cardMeta: 'Music · Ambient',
    price: '$12.00',
    Icon: Music2,
    iconColor: '#FF6BF8',
    bg: 'linear-gradient(135deg, #0A1A2A 0%, #2A0A30 100%)',
    glow: 'radial-gradient(ellipse at center, rgba(255,107,248,0.30) 0%, transparent 70%)',
    tags: ['Lo-Fi', 'Ambient', 'WAV+STEMS'],
    description:
      '20 royalty-free lo-fi tracks with full WAV and stems included. Great for content creation, games, and study sessions.',
  },
  {
    id: 'pixel-dungeon-kit',
    name: 'Pixel Dungeon Kit',
    meta: 'Game · RPG',
    cardMeta: 'Game · RPG',
    price: '$34.99',
    Icon: Sword,
    iconColor: '#A8FF3E',
    bg: 'linear-gradient(135deg, #0A1A0A 0%, #1A0A2A 100%)',
    glow: 'radial-gradient(ellipse at center, rgba(168,255,62,0.28) 0%, transparent 70%)',
    tags: ['Pixel Art', 'RPG', 'Tilemap'],
    description:
      'Complete pixel art dungeon kit with 500+ tiles, characters, enemies, and animated FX. Royalty-free forever.',
  },
  {
    id: 'neon-brush-pack',
    name: 'Neon Brush Pack',
    meta: 'Design · Tools',
    cardMeta: 'Design · Tools',
    price: '$9.00',
    Icon: Brush,
    iconColor: '#FF6BF8',
    bg: 'linear-gradient(135deg, #1A0A1A 0%, #0A1A2A 100%)',
    glow: 'radial-gradient(ellipse at center, rgba(255,107,248,0.28) 0%, transparent 70%)',
    tags: ['Procreate', 'Photoshop', 'Brushes'],
    description:
      '60 neon-style brushes for Procreate and Photoshop. Achieve glowing, cyberpunk aesthetics in seconds.',
  },
]

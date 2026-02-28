import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Wallet,
  Search,
  SlidersHorizontal,
  Zap,
  Gamepad2,
  Type,
  Box,
  Music2,
  LayoutGrid,
  Signal,
  Wifi,
  Battery,
  Sparkles,
} from 'lucide-react'
import { PRODUCTS } from '../data/products'
import type { Product } from '../data/products'

const CATEGORIES = [
  { label: 'All', Icon: LayoutGrid },
  { label: 'Games', Icon: Gamepad2 },
  { label: 'Fonts', Icon: Type },
  { label: '3D Assets', Icon: Box },
  { label: 'Music', Icon: Music2 },
]

interface HomeProps {
  onProductClick: (product: Product) => void
}

export default function Home({ onProductClick }: HomeProps) {
  const [activeCategory, setActiveCategory] = useState(1)

  return (
    <main
      style={{
        backgroundColor: '#0D0D14',
        minHeight: '100dvh',
        paddingBottom: 96,
        overflowX: 'hidden',
      }}
    >
      {/* Status Bar */}
      <div
        style={{
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
        }}
      >
        <span style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 600 }}>9:41</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Signal size={16} color="#FFFFFF" />
          <Wifi size={16} color="#FFFFFF" />
          <Battery size={16} color="#FFFFFF" style={{ width: 20 }} />
        </div>
      </div>

      {/* Header */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
        }}
      >
        {/* Left: greeting + title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ color: '#71717A', fontSize: 13 }}>Good morning 👋</span>
          <span style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700 }}>Nullex Store</span>
        </div>

        {/* Right: balance pill only */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Balance pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: '#1A1A2E',
              height: 40,
              borderRadius: 20,
              padding: '0 12px',
            }}
          >
            <Wallet size={15} color="#A8FF3E" />
            <span style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600 }}>$1,240</span>
          </div>
        </div>
      </div>

      {/* Search row */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 12,
          marginTop: 16,
          marginBottom: 16,
          padding: '0 20px',
        }}
      >
        {/* Search bar */}
        <div
          style={{
            flex: 1,
            height: 48,
            backgroundColor: '#1A1A2E',
            borderRadius: 24,
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            border: '1px solid rgba(255,255,255,0.118)',
          }}
        >
          <Search size={18} color="#71717A" />
          <span style={{ color: '#52525B', fontSize: 14 }}>
            Search games, fonts, templates...
          </span>
        </div>

        {/* Filter button */}
        <motion.div
          whileTap={{ scale: 0.92 }}
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            background: 'linear-gradient(135deg, #4F6EF7 0%, #9B5CF6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <SlidersHorizontal size={18} color="#FFFFFF" />
        </motion.div>
      </div>

      {/* Promo Banner */}
      <div
        style={{
          margin: '0 20px 16px',
          background: 'linear-gradient(135deg, #3B1FA3 0%, #1B3FA8 50%, #0D0D4A 100%)',
          borderRadius: 28,
          height: 130,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          position: 'relative',
        }}
      >
        {/* Orbs */}
        <div
          style={{
            position: 'absolute',
            width: 200,
            height: 200,
            background: 'radial-gradient(ellipse at center, rgba(155,92,246,0.376) 0%, transparent 70%)',
            borderRadius: '50%',
            right: -20,
            top: -40,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 140,
            height: 140,
            background: 'radial-gradient(ellipse at center, rgba(79,110,247,0.251) 0%, transparent 70%)',
            borderRadius: '50%',
            left: -40,
            top: 40,
            pointerEvents: 'none',
          }}
        />

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, position: 'relative', zIndex: 1 }}>
          {/* LIMITED OFFER tag */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: 'rgba(255,255,255,0.094)',
              borderRadius: 999,
              padding: '4px 10px',
              alignSelf: 'flex-start',
            }}
          >
            <Zap size={12} color="#A8FF3E" fill="#A8FF3E" />
            <span style={{ color: '#A8FF3E', fontSize: 10, fontWeight: 700 }}>LIMITED OFFER</span>
          </div>

          {/* Main headline */}
          <div
            style={{
              color: '#FFFFFF',
              fontSize: 20,
              fontWeight: 700,
              lineHeight: 1.2,
              whiteSpace: 'pre-line',
            }}
          >
            {'20% Off Your\nFirst Order'}
          </div>

          {/* Sub text */}
          <span style={{ color: 'rgba(255,255,255,0.627)', fontSize: 12 }}>
            On all digital goods today
          </span>
        </div>

        {/* Right column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Glyph box */}
          <div
            style={{
              width: 70,
              height: 70,
              backgroundColor: 'rgba(255,255,255,0.082)',
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={32} color="#A8FF3E" />
          </div>

          {/* Shop Now button */}
          <motion.div
            whileTap={{ scale: 0.94 }}
            style={{
              backgroundColor: '#A8FF3E',
              borderRadius: 999,
              padding: '8px 16px',
              cursor: 'pointer',
            }}
          >
            <span style={{ color: '#0D0D14', fontSize: 12, fontWeight: 700 }}>Shop Now</span>
          </motion.div>
        </div>
      </div>

      {/* Categories section */}
      <div style={{ margin: '0 0 16px', padding: '0 20px' }}>
        <span style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 700, display: 'block', marginBottom: 10 }}>
          Categories
        </span>

        {/* Chips row */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'nowrap',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {CATEGORIES.map((cat, i) => {
            const isActive = i === activeCategory
            return (
              <motion.div
                key={cat.label}
                whileTap={{ scale: 0.94 }}
                onClick={() => setActiveCategory(i)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  flexShrink: 0,
                  borderRadius: 999,
                  padding: '8px 14px',
                  cursor: 'pointer',
                  background: isActive
                    ? 'linear-gradient(135deg, #4F6EF7 0%, #9B5CF6 100%)'
                    : 'transparent',
                  backgroundColor: isActive ? undefined : '#1A1A2E',
                  border: isActive ? 'none' : '1px solid rgba(255,255,255,0.125)',
                }}
              >
                <cat.Icon size={14} color={isActive ? '#FFFFFF' : '#A1A1AA'} />
                <span
                  style={{
                    color: isActive ? '#FFFFFF' : '#A1A1AA',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {cat.label}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Product grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          padding: '0 20px',
        }}
      >
        {PRODUCTS.map((product) => (
          <motion.div
            key={product.name}
            whileTap={{ scale: 0.97 }}
            onClick={() => onProductClick(product)}
            style={{
              borderRadius: 24,
              backgroundColor: '#12121F',
              border: '1px solid rgba(255,255,255,0.071)',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            {/* Thumbnail */}
            <div
              style={{
                height: 130,
                background: product.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {/* Glow ellipse */}
              <div
                style={{
                  position: 'absolute',
                  width: 100,
                  height: 100,
                  background: product.glow,
                  borderRadius: '50%',
                }}
              />
              <product.Icon size={52} color={product.iconColor} style={{ position: 'relative', zIndex: 1 }} />
            </div>

            {/* Info */}
            <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 700 }}>{product.name}</span>
              <span style={{ color: '#71717A', fontSize: 11 }}>{product.cardMeta}</span>
              <span style={{ color: '#A8FF3E', fontSize: 14, fontWeight: 700 }}>{product.price}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  )
}

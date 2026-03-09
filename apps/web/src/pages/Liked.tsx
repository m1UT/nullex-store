import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, Heart, LayoutGrid, Gamepad2, Type, Box, Music2 } from 'lucide-react'
import { PRODUCTS } from '../data/products'
import type { Product } from '../data/products'

const FILTER_CHIPS = [
  { label: 'All',       Icon: LayoutGrid },
  { label: 'Games',     Icon: Gamepad2 },
  { label: 'Fonts',     Icon: Type },
  { label: '3D Assets', Icon: Box },
  { label: 'Music',     Icon: Music2 },
]

const LIKED_PRODUCTS = PRODUCTS.slice(0, 4)

interface LikedProps {
  onProductClick: (product: Product) => void
}

export default function Liked({ onProductClick }: LikedProps) {
  const [activeFilter, setActiveFilter] = useState(0)

  return (
    <main
      style={{
        backgroundColor: '#0D0D14',
        minHeight: '100dvh',
        paddingTop: 'var(--safe-top)',
        paddingBottom: 96,
      }}
    >
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
        <span style={{ color: '#FFFFFF', fontSize: 26, fontWeight: 700 }}>Избранное</span>

        {/* Right: balance pill only (no bell — matches concept) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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

      {/* Filter chips */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          flexWrap: 'nowrap',
          marginBottom: 16,
          padding: '0 20px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {FILTER_CHIPS.map(({ label, Icon }, i) => {
          const isActive = i === activeFilter
          return (
            <motion.div
              key={label}
              whileTap={{ scale: 0.93 }}
              onClick={() => setActiveFilter(i)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                flexShrink: 0,
                borderRadius: 999,
                padding: '8px 14px',
                cursor: 'pointer',
                background: isActive ? 'linear-gradient(135deg, #4F6EF7 0%, #9B5CF6 100%)' : 'rgba(255,255,255,0.06)',
                backdropFilter: isActive ? undefined : 'blur(12px)',
                WebkitBackdropFilter: isActive ? undefined : 'blur(12px)',
                border: isActive ? 'none' : '1px solid rgba(255,255,255,0.09)',
              }}
            >
              <Icon size={14} color={isActive ? '#FFFFFF' : '#A1A1AA'} />
              <span style={{ color: isActive ? '#FFFFFF' : '#A1A1AA', fontSize: 12, fontWeight: 600 }}>
                {label}
              </span>
            </motion.div>
          )
        })}
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
        {LIKED_PRODUCTS.map((product) => (
          <motion.div
            key={product.name}
            whileTap={{ scale: 0.97 }}
            onClick={() => onProductClick(product)}
            style={{
              borderRadius: 24,
              backgroundColor: '#12121F',
              border: '1px solid rgba(255,255,255,0.071)',
              height: 220,
              overflow: 'hidden',
              position: 'relative',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Thumbnail */}
            <div
              style={{
                flex: 1,
                background: product.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {/* Glow */}
              <div
                style={{
                  position: 'absolute',
                  width: 80,
                  height: 80,
                  background: product.glow,
                  borderRadius: '50%',
                }}
              />
              <product.Icon
                size={44}
                color={product.iconColor}
                style={{ position: 'relative', zIndex: 1 }}
              />

              {/* Heart button */}
              <motion.div
                whileTap={{ scale: 0.88 }}
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: 'rgba(255,59,48,0.125)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 2,
                }}
              >
                <Heart size={14} color="#FF6B6B" fill="#FF6B6B" />
              </motion.div>
            </div>

            {/* Info */}
            <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 700 }}>{product.name}</span>
              <span style={{ color: '#71717A', fontSize: 11 }}>{product.cardMeta}</span>

              {/* Bottom row: price + cart button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
                <span style={{ color: '#A8FF3E', fontSize: 13, fontWeight: 700 }}>{product.price}</span>
                <motion.div
                  whileTap={{ scale: 0.92 }}
                  style={{
                    backgroundColor: '#A8FF3E',
                    borderRadius: 999,
                    padding: '6px 12px',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ color: '#0D0D14', fontSize: 11, fontWeight: 700 }}>В корзину</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  )
}

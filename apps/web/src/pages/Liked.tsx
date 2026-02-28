import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, Heart, Signal, Wifi, Battery } from 'lucide-react'
import { PRODUCTS } from '../data/products'
import type { Product } from '../data/products'

const FILTER_CHIPS = ['All', 'Games', 'Fonts', '3D']

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
        paddingBottom: 96,
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
        <span style={{ color: '#FFFFFF', fontSize: 26, fontWeight: 700 }}>Liked</span>

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
        {FILTER_CHIPS.map((chip, i) => {
          const isActive = i === activeFilter
          return (
            <motion.div
              key={chip}
              whileTap={{ scale: 0.93 }}
              onClick={() => setActiveFilter(i)}
              style={{
                flexShrink: 0,
                borderRadius: 999,
                padding: '8px 18px',
                cursor: 'pointer',
                background: isActive
                  ? 'linear-gradient(135deg, #4F6EF7 0%, #9B5CF6 100%)'
                  : 'transparent',
                backgroundColor: isActive ? undefined : '#1A1A2E',
                border: isActive ? 'none' : '1px solid rgba(255,255,255,0.125)',
              }}
            >
              <span
                style={{
                  color: isActive ? '#FFFFFF' : '#71717A',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {chip}
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
                  <span style={{ color: '#0D0D14', fontSize: 11, fontWeight: 700 }}>+ Cart</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  )
}

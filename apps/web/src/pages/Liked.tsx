import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, Heart, LayoutGrid, Gamepad2, Code2, PlayCircle } from 'lucide-react'
import { useStore } from '../lib/store'
import type { Product } from '../data/products'

const FILTER_CHIPS = [
  { label: 'All',           Icon: LayoutGrid },
  { label: 'Games',         Icon: Gamepad2 },
  { label: 'Software',      Icon: Code2 },
  { label: 'Subscriptions', Icon: PlayCircle },
]

interface LikedProps {
  onProductClick: (product: Product) => void
}

export default function Liked({ onProductClick }: LikedProps) {
  const { user, likedProducts, toggleLike } = useStore()
  const [activeFilter, setActiveFilter] = useState(0)

  const filtered = likedProducts.filter(
    (p) => activeFilter === 0 || p.category === FILTER_CHIPS[activeFilter].label,
  )

  const balanceStr = user ? `$${parseFloat(user.balance).toFixed(2)}` : '$0.00'

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
          <span style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600 }}>{balanceStr}</span>
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
                background: isActive
                  ? 'linear-gradient(135deg, #4F6EF7 0%, #9B5CF6 100%)'
                  : 'rgba(255,255,255,0.06)',
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

      {/* Product grid or empty state */}
      {filtered.length === 0 ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 200,
          }}
        >
          <span style={{ color: '#71717A', fontSize: 14 }}>
            {likedProducts.length === 0
              ? 'Нет избранных товаров'
              : 'Нет товаров в данной категории'}
          </span>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            padding: '0 20px',
          }}
        >
          {filtered.map((product) => (
            <motion.div
              key={product.id}
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
                  overflow: 'hidden',
                }}
              >
                {product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt=""
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <>
                    <div style={{ position: 'absolute', width: 80, height: 80, background: product.glow, borderRadius: '50%' }} />
                    <product.Icon size={44} color={product.iconColor} style={{ position: 'relative', zIndex: 1 }} />
                  </>
                )}

                {/* Heart — all items here are liked; tap to unlike */}
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  onClick={(e) => { e.stopPropagation(); toggleLike(Number(product.id)) }}
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

                <span style={{ color: '#A8FF3E', fontSize: 13, fontWeight: 700, marginTop: 2 }}>{product.price}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  )
}

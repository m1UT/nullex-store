import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Wallet,
  Search,
  SlidersHorizontal,
  Zap,
  Gamepad2,
  Code2,
  Crown,
  Coins,
  GraduationCap,
  LayoutGrid,
  Sparkles,
} from 'lucide-react'
import { PRODUCTS } from '../data/products'
import type { Product } from '../data/products'

const CATEGORIES = [
  { label: 'Все',       Icon: LayoutGrid },
  { label: 'Игры',      Icon: Gamepad2 },
  { label: 'ПО',        Icon: Code2 },
  { label: 'Подписки',  Icon: Crown },
  { label: 'Валюты',    Icon: Coins },
  { label: 'Курсы',     Icon: GraduationCap },
]

interface HomeProps {
  onProductClick: (product: Product) => void
}

export default function Home({ onProductClick }: HomeProps) {
  const [activeCategory, setActiveCategory] = useState(1)
  const [isSticky, setIsSticky] = useState(false)
  const [fadeOpacity, setFadeOpacity] = useState(0)
  const [chipsH, setChipsH] = useState(52)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const chipsWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chipsWrapRef.current) setChipsH(chipsWrapRef.current.offsetHeight)
  }, [])

  useEffect(() => {
    const FADE_RANGE = 60

    const update = () => {
      if (!sentinelRef.current) return
      const top = sentinelRef.current.getBoundingClientRect().top
      setIsSticky(top <= 0)
      // fade starts FADE_RANGE px before chips hit the top, fully opaque when stuck
      setFadeOpacity(Math.max(0, Math.min(1, (FADE_RANGE - top) / FADE_RANGE)))
    }

    window.addEventListener('scroll',    update, { passive: true })
    window.addEventListener('touchmove', update, { passive: true })
    document.addEventListener('scroll',  update, { passive: true })
    return () => {
      window.removeEventListener('scroll',    update)
      window.removeEventListener('touchmove', update)
      document.removeEventListener('scroll',  update)
    }
  }, [])

  const renderChips = useCallback(() => CATEGORIES.map((cat, i) => {
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
          background: isActive ? 'linear-gradient(135deg, #4F6EF7 0%, #9B5CF6 100%)' : 'transparent',
          backgroundColor: isActive ? undefined : '#1A1A2E',
          border: isActive ? 'none' : '1px solid rgba(255,255,255,0.125)',
        }}
      >
        <cat.Icon size={14} color={isActive ? '#FFFFFF' : '#A1A1AA'} />
        <span style={{ color: isActive ? '#FFFFFF' : '#A1A1AA', fontSize: 12, fontWeight: 600 }}>
          {cat.label}
        </span>
      </motion.div>
    )
  }), [activeCategory])

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
        <span style={{ color: '#FFFFFF', fontSize: 26, fontWeight: 700 }}>Nullex Store</span>

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
            Поиск игр, ПО, подписок...
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
            <span style={{ color: '#A8FF3E', fontSize: 10, fontWeight: 700 }}>СПЕЦПРЕДЛОЖЕНИЕ</span>
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
            {'−20% на\nпервый заказ'}
          </div>

          {/* Sub text */}
          <span style={{ color: 'rgba(255,255,255,0.627)', fontSize: 12 }}>
            На всё цифровое ПО сегодня
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
            <span style={{ color: '#0D0D14', fontSize: 12, fontWeight: 700 }}>Купить</span>
          </motion.div>
        </div>
      </div>

      {/* Categories label — scrolls away normally */}
      <div style={{ padding: '0 20px 10px' }}>
        <span style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 700 }}>Категории</span>
      </div>

      {/* Sentinel — position in document where chips sit */}
      <div ref={sentinelRef} style={{ height: 0 }} />

      {/* Safe-area background fill — fixed, covers notch when chips are stuck */}
      {isSticky && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'min(100vw, 480px)',
            height: 'var(--safe-top, 0px)',
            backgroundColor: '#0D0D14',
            zIndex: 11,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Spacer — keeps layout height while chips are fixed */}
      {isSticky && <div style={{ height: chipsH }} />}

      {/* Chips container — switches to fixed when stuck */}
      <div
        ref={chipsWrapRef}
        style={isSticky ? {
          position: 'fixed',
          top: 'var(--safe-top, 0px)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(100vw, 480px)',
          zIndex: 10,
          backgroundColor: '#0D0D14',
          paddingBottom: 12,
          overflow: 'visible',
        } : {
          position: 'relative',
          paddingBottom: 12,
        }}
      >
        {/* Chips row */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'nowrap', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', touchAction: 'pan-x', padding: '10px 20px 0' }}>
          {renderChips()}
        </div>

        {/* Bottom gradient — fades in as chips approach top */}
        <div style={{
          position: 'absolute',
          bottom: -20, left: 0, right: 0, height: 20,
          background: 'linear-gradient(to bottom, #0D0D14, transparent)',
          opacity: fadeOpacity,
          pointerEvents: 'none',
        }} />
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

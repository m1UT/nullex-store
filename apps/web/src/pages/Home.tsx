import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wallet,
  Search,
  SlidersHorizontal,
  Zap,
  Gamepad2,
  Code2,
  PlayCircle,
  LayoutGrid,
  Sparkles,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  PackageCheck,
} from 'lucide-react'
import { PRODUCTS } from '../data/products'
import type { Product } from '../data/products'
import { fetchProducts } from '../lib/api'
import { useStore } from '../lib/store'
import { Heart } from 'lucide-react'

const CATEGORIES = [
  { label: 'All',           Icon: LayoutGrid },
  { label: 'Games',         Icon: Gamepad2 },
  { label: 'Software',      Icon: Code2 },
  { label: 'Subscriptions', Icon: PlayCircle },
]

interface HomeProps {
  onProductClick: (product: Product) => void
}

const SORT_OPTIONS = [
  { label: 'По умолчанию', value: 'default',    Icon: ArrowUpDown },
  { label: 'Дешевле',      value: 'price-asc',   Icon: ArrowUp },
  { label: 'Дороже',       value: 'price-desc',  Icon: ArrowDown },
]

export default function Home({ onProductClick }: HomeProps) {
  const { user, likedIds, toggleLike } = useStore()
  const [products, setProducts] = useState<Product[]>(PRODUCTS)
  const [activeCategory, setActiveCategory] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [showSort, setShowSort] = useState(false)
  const [sortBtnRect, setSortBtnRect] = useState<DOMRect | null>(null)
  const [isSticky, setIsSticky] = useState(false)
  const [stickyH, setStickyH] = useState(140)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const stickyWrapRef = useRef<HTMLDivElement>(null)
  const sortBtnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => {})
    const interval = setInterval(() => {
      fetchProducts().then(setProducts).catch(() => {})
    }, 30_000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (stickyWrapRef.current) setStickyH(stickyWrapRef.current.offsetHeight)
  }, [])

  useEffect(() => {
    const safeTop = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--safe-top') || '0'
    ) || 0

    const update = () => {
      if (!sentinelRef.current) return
      const top = sentinelRef.current.getBoundingClientRect().top
      setIsSticky(top <= safeTop)
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
          background: isActive ? 'linear-gradient(135deg, #4F6EF7 0%, #9B5CF6 100%)' : 'rgba(255,255,255,0.06)',
          backdropFilter: isActive ? undefined : 'blur(12px)',
          WebkitBackdropFilter: isActive ? undefined : 'blur(12px)',
          border: isActive ? 'none' : '1px solid rgba(255,255,255,0.09)',
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
    <>
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
            <span style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600 }}>
              ${user ? parseFloat(user.balance).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) : '0'}
            </span>
          </div>
        </div>
      </div>

      {/* Promo Banner */}
      <div
        style={{
          margin: '8px 20px 16px',
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

      {/* Sentinel — placed before search+chips, triggers sticky */}
      <div ref={sentinelRef} style={{ height: 0 }} />

      {/* Spacer — preserves layout height when search+chips are fixed */}
      {isSticky && <div style={{ height: stickyH }} />}

      {/* Sticky wrapper: portal when sticky to escape #pull-content transform context */}
      {(() => {
        const wrap = (
          <div
            ref={stickyWrapRef}
            style={isSticky ? {
              position: 'fixed',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'min(100vw, 480px)',
              paddingTop: 'var(--safe-top, 0px)',
              zIndex: 10,
              overflow: 'visible',
            } : {
              position: 'relative',
            }}
          >
        {/* Glass background — extends below wrapper and fades via mask so blur itself dissolves */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 'calc(100% + 32px)',
            backgroundColor: 'rgba(13,13,20,0.55)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
            opacity: isSticky ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Search row */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 12,
            padding: '8px 20px 8px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 48,
              backgroundColor: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: 24,
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              border: '1px solid rgba(255,255,255,0.09)',
            }}
          >
            <Search size={18} color="#71717A" style={{ flexShrink: 0 }} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск игр, ПО, подписок..."
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                outline: 'none',
                color: '#FFFFFF',
                fontSize: 14,
                fontFamily: 'inherit',
              }}
            />
            {searchQuery && (
              <motion.div
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearchQuery('')}
                style={{ cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center' }}
              >
                <X size={16} color="#71717A" />
              </motion.div>
            )}
          </div>

          <div style={{ position: 'relative', flexShrink: 0 }}>
            <motion.div
              ref={sortBtnRef}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                const rect = sortBtnRef.current?.getBoundingClientRect() ?? null
                setSortBtnRect(rect)
                setShowSort((v) => !v)
              }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                background: 'linear-gradient(135deg, #4F6EF7 0%, #9B5CF6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <SlidersHorizontal size={18} color="#FFFFFF" />
            </motion.div>
            {(sortBy !== 'default' || inStockOnly) && (
              <div style={{
                position: 'absolute',
                top: -2, right: -2,
                width: 18, height: 18,
                borderRadius: '50%',
                backgroundColor: '#A8FF3E',
                border: '2px solid #0D0D14',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}>
                <span style={{ color: '#0D0D14', fontSize: 10, fontWeight: 700, lineHeight: 1 }}>
                  {(sortBy !== 'default' ? 1 : 0) + (inStockOnly ? 1 : 0)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Chips row */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'nowrap',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            touchAction: 'pan-x',
            padding: '4px 20px 12px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {renderChips()}
        </div>

          </div>
        )
        return isSticky ? createPortal(wrap, document.body) : wrap
      })()}

      {/* Product grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          padding: '0 20px',
        }}
      >
        {products.filter((p) => {
          const q = searchQuery.trim().toLowerCase()
          const matchSearch = !q || p.name.toLowerCase().includes(q) || p.meta.toLowerCase().includes(q)
          const matchCategory = activeCategory === 0 || p.category === CATEGORIES[activeCategory].label
          const matchStock = !inStockOnly || p.stock > 0
          return matchSearch && matchCategory && matchStock
        }).sort((a, b) => {
          if (sortBy === 'price-asc')  return parseFloat(a.price.slice(1)) - parseFloat(b.price.slice(1))
          if (sortBy === 'price-desc') return parseFloat(b.price.slice(1)) - parseFloat(a.price.slice(1))
          return 0
        }).map((product) => (
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
              {product.images[0] ? (
                <img src={product.images[0]} alt={product.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <>
                  <div style={{ position: 'absolute', width: 100, height: 100, background: product.glow, borderRadius: '50%' }} />
                  <product.Icon size={52} color={product.iconColor} style={{ position: 'relative', zIndex: 1 }} />
                </>
              )}
              <motion.div
                whileTap={{ scale: 0.85 }}
                onClick={(e) => { e.stopPropagation(); toggleLike(Number(product.id)) }}
                style={{
                  position: 'absolute', top: 8, right: 8, zIndex: 2,
                  width: 28, height: 28, borderRadius: 14,
                  backgroundColor: likedIds.has(Number(product.id)) ? 'rgba(255,59,48,0.2)' : 'rgba(0,0,0,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Heart
                  size={14}
                  color="#FF6B6B"
                  fill={likedIds.has(Number(product.id)) ? '#FF6B6B' : 'none'}
                />
              </motion.div>
            </div>

            {/* Info */}
            <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 700 }}>{product.name}</span>
              <span style={{ color: '#71717A', fontSize: 11 }}>{product.cardMeta}</span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
                <span style={{ color: '#A8FF3E', fontSize: 14, fontWeight: 700 }}>{product.price}</span>
                {product.stock > 0
                  ? <span style={{ color: '#A8FF3E', fontSize: 10, fontWeight: 600 }}>{product.stock} шт.</span>
                  : <span style={{ color: '#FF3B30', fontSize: 10, fontWeight: 600 }}>Нет в наличии</span>
                }
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </main>

    {/* Sort dropdown — rendered via portal to escape any stacking context */}
    {createPortal(
      <AnimatePresence>
        {showSort && sortBtnRect && (
          <>
            <div
              key="backdrop"
              onClick={() => setShowSort(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 900 }}
            />
            <motion.div
              key="dropdown"
              initial={{ opacity: 0, scale: 0.92, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -8 }}
              transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
              style={{
                position: 'fixed',
                top: sortBtnRect.bottom + 8,
                right: window.innerWidth - sortBtnRect.right,
                zIndex: 901,
                backgroundColor: '#1A1A2E',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 18,
                overflow: 'hidden',
                minWidth: 170,
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}
            >
              {SORT_OPTIONS.map(({ label, value, Icon }) => {
                const isActive = sortBy === value
                return (
                  <motion.div
                    key={value}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setSortBy(value); setShowSort(false) }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '12px 16px',
                      cursor: 'pointer',
                      backgroundColor: isActive ? 'rgba(79,110,247,0.15)' : 'transparent',
                    }}
                  >
                    <Icon size={15} color={isActive ? '#4F6EF7' : '#A1A1AA'} />
                    <span style={{ color: isActive ? '#FFFFFF' : '#A1A1AA', fontSize: 13, fontWeight: isActive ? 700 : 400 }}>
                      {label}
                    </span>
                  </motion.div>
                )
              })}
              <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.071)', margin: '0 12px' }} />
              <motion.div
                whileTap={{ scale: 0.97 }}
                onClick={() => { setInStockOnly((v) => !v); setShowSort(false) }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  padding: '12px 16px',
                  cursor: 'pointer',
                  backgroundColor: inStockOnly ? 'rgba(168,255,62,0.10)' : 'transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <PackageCheck size={15} color={inStockOnly ? '#A8FF3E' : '#A1A1AA'} />
                  <span style={{ color: inStockOnly ? '#A8FF3E' : '#A1A1AA', fontSize: 13, fontWeight: inStockOnly ? 700 : 400 }}>
                    Только в наличии
                  </span>
                </div>
                <div style={{
                  width: 36, height: 20, borderRadius: 10,
                  backgroundColor: inStockOnly ? '#A8FF3E' : 'rgba(255,255,255,0.12)',
                  position: 'relative',
                  transition: 'background-color 0.2s',
                  flexShrink: 0,
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 2, left: inStockOnly ? 18 : 2,
                    width: 16, height: 16, borderRadius: '50%',
                    backgroundColor: inStockOnly ? '#0D0D14' : '#71717A',
                    transition: 'left 0.2s',
                  }} />
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body
    )}
    </>
  )
}

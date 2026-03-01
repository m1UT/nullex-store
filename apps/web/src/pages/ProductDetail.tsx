import { motion } from 'framer-motion'
import { ArrowLeft, Share2, Heart, Star, ShoppingCart } from 'lucide-react'
import type { Product } from '../data/products'

interface ProductDetailProps {
  product: Product
  onBack: () => void
}

const TAG_COLORS: Record<string, { text: string; border: string }> = {
  Racing:     { text: '#4F6EF7', border: 'rgba(79,110,247,0.25)' },
  Action:     { text: '#9B5CF6', border: 'rgba(155,92,246,0.25)' },
  Indie:      { text: '#A8FF3E', border: 'rgba(168,255,62,0.25)' },
  Variable:   { text: '#A8FF3E', border: 'rgba(168,255,62,0.25)' },
  Display:    { text: '#4F6EF7', border: 'rgba(79,110,247,0.25)' },
  'Sans-serif':{ text: '#9B5CF6', border: 'rgba(155,92,246,0.25)' },
  '3D':       { text: '#4F6EF7', border: 'rgba(79,110,247,0.25)' },
  'Sci-fi':   { text: '#9B5CF6', border: 'rgba(155,92,246,0.25)' },
  'Game Ready':{ text: '#A8FF3E', border: 'rgba(168,255,62,0.25)' },
  'Lo-Fi':    { text: '#FF6BF8', border: 'rgba(255,107,248,0.25)' },
  Ambient:    { text: '#9B5CF6', border: 'rgba(155,92,246,0.25)' },
  'WAV+STEMS':{ text: '#A8FF3E', border: 'rgba(168,255,62,0.25)' },
  'Pixel Art':{ text: '#A8FF3E', border: 'rgba(168,255,62,0.25)' },
  RPG:        { text: '#4F6EF7', border: 'rgba(79,110,247,0.25)' },
  Tilemap:    { text: '#9B5CF6', border: 'rgba(155,92,246,0.25)' },
  Procreate:  { text: '#FF6BF8', border: 'rgba(255,107,248,0.25)' },
  Photoshop:  { text: '#4F6EF7', border: 'rgba(79,110,247,0.25)' },
  Brushes:    { text: '#A8FF3E', border: 'rgba(168,255,62,0.25)' },
}

export default function ProductDetail({ product, onBack }: ProductDetailProps) {
  return (
    <main
      style={{
        backgroundColor: '#0D0D14',
        minHeight: '100dvh',
        paddingTop: 100,
        paddingBottom: 96,
        position: 'relative',
      }}
    >
      {/* Detail Nav */}
      <div
        style={{
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
        }}
      >
        <motion.div
          whileTap={{ scale: 0.92 }}
          onClick={onBack}
          style={{
            width: 40, height: 40, borderRadius: 20,
            backgroundColor: '#1A1A2E',
            border: '1px solid rgba(255,255,255,0.094)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={18} color="#FFFFFF" />
        </motion.div>

        <span style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 700 }}>Product Detail</span>

        <motion.div
          whileTap={{ scale: 0.92 }}
          style={{
            width: 40, height: 40, borderRadius: 20,
            backgroundColor: '#1A1A2E',
            border: '1px solid rgba(255,255,255,0.094)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Share2 size={18} color="#FFFFFF" />
        </motion.div>
      </div>

      {/* Hero Image */}
      <div
        style={{
          width: '100%', height: 300,
          background: product.bg,
          position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            width: 240, height: 240,
            background: product.glow,
            borderRadius: '50%',
          }}
        />

        {/* Icon frame */}
        <div
          style={{
            width: 150, height: 150, borderRadius: 32,
            background: 'linear-gradient(135deg, rgba(79,110,247,0.188) 0%, rgba(155,92,246,0.188) 100%)',
            border: `1px solid ${product.iconColor}50`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', zIndex: 1,
          }}
        >
          <product.Icon size={80} color={product.iconColor} />
        </div>

        {/* Dot pagination */}
        <div
          style={{
            position: 'absolute', bottom: 20,
            left: 0, right: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          <div style={{ width: 24, height: 6, borderRadius: 3, backgroundColor: product.iconColor }} />
          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.25)' }} />
          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.25)' }} />
        </div>
      </div>

      {/* Detail Info */}
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700 }}>{product.name}</span>
            <span style={{ color: '#71717A', fontSize: 13 }}>{product.meta}</span>
          </div>
          <motion.div
            whileTap={{ scale: 0.9 }}
            style={{
              width: 44, height: 44, borderRadius: 22,
              backgroundColor: '#1A1A2E',
              border: '1px solid rgba(255,255,255,0.094)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            <Heart size={20} color="#9B5CF6" />
          </motion.div>
        </div>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {[1, 2, 3, 4].map((i) => <Star key={i} size={14} color="#A8FF3E" fill="#A8FF3E" />)}
            <Star size={14} color="#71717A" fill="#71717A" />
          </div>
          <span style={{ color: '#A1A1AA', fontSize: 13 }}>4.8&nbsp;&nbsp;(2,341 reviews)</span>
        </div>

        {/* Description */}
        <p style={{ color: '#A1A1AA', fontSize: 13, lineHeight: 1.5 }}>
          {product.description}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {product.tags.map((tag) => {
            const colors = TAG_COLORS[tag] ?? { text: '#A1A1AA', border: 'rgba(255,255,255,0.15)' }
            return (
              <div
                key={tag}
                style={{
                  backgroundColor: '#1A1A2E', borderRadius: 999,
                  padding: '6px 12px',
                  border: `1px solid ${colors.border}`,
                }}
              >
                <span style={{ color: colors.text, fontSize: 11, fontWeight: 600 }}>{tag}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, height: 82,
          backgroundColor: 'rgba(10,10,20,0.878)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.071)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px', zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ color: '#71717A', fontSize: 12 }}>Price</span>
          <span style={{ color: '#FFFFFF', fontSize: 26, fontWeight: 700 }}>{product.price}</span>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            backgroundColor: '#A8FF3E', borderRadius: 999,
            padding: '16px 28px', border: 'none', cursor: 'pointer',
          }}
        >
          <ShoppingCart size={18} color="#0D0D14" />
          <span style={{ color: '#0D0D14', fontSize: 15, fontWeight: 700 }}>Add to Cart</span>
        </motion.button>
      </div>
    </main>
  )
}

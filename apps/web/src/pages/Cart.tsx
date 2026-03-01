import { motion } from 'framer-motion'
import {
  Trash2,
  Gamepad2,
  Type,
  Music2,
  Lock,
  Minus,
  Plus,
  Wallet,
} from 'lucide-react'

const CART_ITEMS = [
  {
    name: 'Neon Racer Pro',
    sub: 'Game · Digital Download',
    price: '$24.99',
    qty: 1,
    Icon: Gamepad2,
    iconColor: '#9B5CF6',
    thumbBg: 'linear-gradient(135deg, #1B0A3A 0%, #0A1A4A 100%)',
  },
  {
    name: 'Grotesk Variable',
    sub: 'Font · Commercial License',
    price: '$19.00',
    qty: 2,
    Icon: Type,
    iconColor: '#A8FF3E',
    thumbBg: 'linear-gradient(135deg, #0A2A1A 0%, #1A0A3A 100%)',
  },
  {
    name: 'Lo-Fi Beats Vol.3',
    sub: 'Music · WAV + STEMS',
    price: '$12.00',
    qty: 1,
    Icon: Music2,
    iconColor: '#FF6BF8',
    thumbBg: 'linear-gradient(135deg, #0A1A2A 0%, #2A0A30 100%)',
  },
]

export default function Cart() {
  return (
    <main
      style={{
        backgroundColor: '#0D0D14',
        minHeight: '100dvh',
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
        <span style={{ color: '#FFFFFF', fontSize: 26, fontWeight: 700 }}>My Cart</span>

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

      {/* Cart list */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Items */}
        {CART_ITEMS.map((item, idx) => (
          <div key={item.name}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px 20px',
              }}
            >
              {/* Thumbnail */}
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 18,
                  background: item.thumbBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <item.Icon size={32} color={item.iconColor} />
              </div>

              {/* Details */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 700 }}>{item.name}</span>
                <span style={{ color: '#71717A', fontSize: 12 }}>{item.sub}</span>

                {/* Bottom row: price + stepper */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: '#A8FF3E', fontSize: 15, fontWeight: 700 }}>{item.price}</span>

                  {/* Quantity stepper */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#1A1A2E',
                      borderRadius: 999,
                      border: '1px solid rgba(255,255,255,0.094)',
                      padding: 4,
                    }}
                  >
                    <motion.div
                      whileTap={{ scale: 0.88 }}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Minus size={14} color="#A1A1AA" />
                    </motion.div>

                    <span
                      style={{
                        color: '#FFFFFF',
                        fontSize: 13,
                        fontWeight: 600,
                        width: 24,
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {item.qty}
                    </span>

                    <motion.div
                      whileTap={{ scale: 0.88 }}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 999,
                        background: 'linear-gradient(135deg, #4F6EF7 0%, #9B5CF6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Plus size={14} color="#FFFFFF" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {idx < CART_ITEMS.length - 1 && (
              <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.071)', margin: '0 20px' }} />
            )}
          </div>
        ))}

        {/* Divider after items */}
        <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.071)', marginTop: 4 }} />

        {/* Badge + Clear row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 8,
            padding: '12px 20px',
          }}
        >
          {/* Count badge */}
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 12,
              backgroundColor: '#4F6EF7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: '#FFFFFF', fontSize: 16 }}>{CART_ITEMS.length + 1}</span>
          </div>

          {/* Clear button */}
          <motion.div
            whileTap={{ scale: 0.93 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              backgroundColor: 'rgba(255,59,48,0.125)',
              borderRadius: 999,
              padding: '8px 12px',
              cursor: 'pointer',
            }}
          >
            <Trash2 size={14} color="#FF3B30" />
            <span style={{ color: '#FF3B30', fontSize: 13, fontWeight: 600 }}>Clear</span>
          </motion.div>
        </div>
      </div>

      {/* Order Summary */}
      <div
        style={{
          margin: '0 20px',
          borderRadius: 24,
          backgroundColor: '#12121F',
          border: '1px solid rgba(255,255,255,0.071)',
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#A1A1AA', fontSize: 14 }}>Subtotal</span>
          <span style={{ color: '#FFFFFF', fontSize: 14 }}>$55.99</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#A1A1AA', fontSize: 14 }}>Discount (20%)</span>
          <span style={{ color: '#A8FF3E', fontSize: 14 }}>−$11.20</span>
        </div>

        <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.094)' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 700 }}>Total</span>
          <span style={{ color: '#A8FF3E', fontSize: 18, fontWeight: 700 }}>$44.79</span>
        </div>
      </div>

      {/* Checkout Button */}
      <div style={{ padding: '16px 20px 0' }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          style={{
            width: '100%',
            height: 54,
            backgroundColor: '#A8FF3E',
            borderRadius: 999,
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            cursor: 'pointer',
          }}
        >
          <Lock size={18} color="#0D0D14" />
          <span style={{ color: '#0D0D14', fontSize: 16, fontWeight: 700 }}>Checkout Securely</span>
        </motion.button>
      </div>
    </main>
  )
}

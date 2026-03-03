import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wallet,
  Package,
  ReceiptText,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Gamepad2,
  Type,
  Box,
  Music,
} from 'lucide-react'
import { getTelegramUser } from '../lib/telegram'

const INVENTORY_ITEMS = [
  { id: 1, name: 'Neon Racer Pro',    Icon: Gamepad2, iconColor: '#A8FF3E', iconBg: 'linear-gradient(135deg, #1A3A1A 0%, #0D2A14 100%)' },
  { id: 2, name: 'Grotesk Variable',  Icon: Type,     iconColor: '#FF6BF8', iconBg: 'linear-gradient(135deg, #2A1A0A 0%, #1A0A00 100%)' },
  { id: 3, name: 'SciFi Asset Pack',  Icon: Box,      iconColor: '#4F6EF7', iconBg: 'linear-gradient(135deg, #1A1A3A 0%, #0A0A2E 100%)' },
  { id: 4, name: 'Lo-Fi Beats Vol.3', Icon: Music,    iconColor: '#9B5CF6', iconBg: 'linear-gradient(135deg, #2A0A1A 0%, #1A0010 100%)' },
]

const HISTORY_ITEMS = [
  { id: 1, name: 'Neon Racer Pro',      Icon: Gamepad2, iconColor: '#A8FF3E', iconBg: '#1A3A1A', date: 'Feb 28, 2026', amount: '−$24.99',  positive: false },
  { id: 2, name: 'Grotesk Variable',    Icon: Type,     iconColor: '#FF6BF8', iconBg: '#1A0A2E', date: 'Feb 14, 2026', amount: '−$19.00',  positive: false },
  { id: 3, name: 'SciFi Asset Pack',    Icon: Box,      iconColor: '#4F6EF7', iconBg: '#1A1A3A', date: 'Jan 03, 2026', amount: '−$49.00',  positive: false },
  { id: 4, name: 'Пополнение баланса',  Icon: Wallet,   iconColor: '#A8FF3E', iconBg: '#0A2A1A', date: 'Mar 01, 2026', amount: '+$50.00',  positive: true  },
  { id: 5, name: 'Пополнение баланса',  Icon: Wallet,   iconColor: '#A8FF3E', iconBg: '#0A2A1A', date: 'Feb 10, 2026', amount: '+$100.00', positive: true  },
]

type Section = 'inventory' | 'history'

export default function Profile() {
  const user = getTelegramUser()
  const [open, setOpen] = useState<Section | null>(null)

  const toggle = (section: Section) =>
    setOpen(prev => (prev === section ? null : section))

  const username = user?.username ?? 'm1UTlucky'
  const avatarLetter = (user?.first_name ?? username).slice(0, 1).toUpperCase()

  // chevron-right when nothing open; chevron-up when this section open; chevron-down when other open
  const arrowFor = (section: Section) => {
    if (open === section) return ChevronUp
    if (open !== null) return ChevronDown
    return ChevronRight
  }
  const ArrowInventory = arrowFor('inventory')
  const ArrowHistory = arrowFor('history')

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
        <span style={{ color: '#FFFFFF', fontSize: 26, fontWeight: 700 }}>Profile</span>
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

      {/* Profile section: 3aZ0g overlaps nDCNK by 33px (y:211 − y:164 = 47px offset, card height 80px) */}
      <div style={{ margin: '0 20px' }}>

        {/* 3aZ0g — profileCard: z:2, sits on top */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            borderRadius: 24,
            backgroundColor: '#12121F',
            border: '1px solid rgba(255,255,255,0.071)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '16px 18px',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              background: 'linear-gradient(135deg, #4F6EF7 0%, #9B5CF6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700 }}>{avatarLetter}</span>
          </div>
          <span style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 700 }}>{username}</span>
        </div>

        {/* nDCNK — Stats Row: z:1, marginTop:-33 прячет верхние 33px за profileCard */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            marginTop: -33,
            height: 82,
            borderRadius: '0 0 24px 24px',
            backgroundColor: '#1A1A2E',
            border: '1px solid rgba(255,255,255,0.071)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '40px 24px 0',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
            <span style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 700 }}>24</span>
            <span style={{ color: '#71717A', fontSize: 10 }}>Purchases</span>
          </div>
          <div style={{ width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.094)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
            <span style={{ color: '#A8FF3E', fontSize: 16, fontWeight: 700 }}>12</span>
            <span style={{ color: '#71717A', fontSize: 10 }}>Liked</span>
          </div>
          <div style={{ width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.094)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
            <span style={{ color: '#9B5CF6', fontSize: 16, fontWeight: 700 }}>$248</span>
            <span style={{ color: '#71717A', fontSize: 10 }}>Spent</span>
          </div>
        </div>

      </div>

      {/* Menu List */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          padding: '10px 20px 0',
        }}
      >
        {/* ── Инвентарь button — z:2 ── */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => toggle('inventory')}
          style={{
            position: 'relative',
            zIndex: 2,
            height: 64,
            borderRadius: 20,
            backgroundColor: '#12121F',
            border: '1px solid rgba(255,255,255,0.063)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 18px',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: '#0D2A14',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Package size={20} color="#A8FF3E" />
            </div>
            <span style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 700 }}>Инвентарь</span>
          </div>
          <ArrowInventory size={18} color="#52525B" />
        </motion.div>

        {/* ── Inventory list — z:1, marginTop:-42 (gap:10 + overlap:32), paddingTop:32 ── */}
        <AnimatePresence initial={false}>
          {open === 'inventory' && (
            <motion.div
              key="inv-list"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              style={{
                overflow: 'hidden',
                position: 'relative',
                zIndex: 1,
                marginTop: -42,
                borderRadius: 16,
                backgroundColor: '#1A1A2E',
                border: '1px solid rgba(255,255,255,0.063)',
                paddingTop: 32,
              }}
            >
              {INVENTORY_ITEMS.map((item, i) => (
                <div key={item.id}>
                  <div
                    style={{
                      height: 72,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          background: item.iconBg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <item.Icon size={20} color={item.iconColor} />
                      </div>
                      <span style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 700 }}>{item.name}</span>
                    </div>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        backgroundColor: 'rgba(155,92,246,0.102)',
                        border: '1px solid rgba(155,92,246,0.251)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <ExternalLink size={16} color="#9B5CF6" />
                    </div>
                  </div>
                  {i < INVENTORY_ITEMS.length - 1 && (
                    <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.063)' }} />
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── История активности button — z:2 ── */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => toggle('history')}
          style={{
            position: 'relative',
            zIndex: 2,
            height: 64,
            borderRadius: 20,
            backgroundColor: '#12121F',
            border: '1px solid rgba(255,255,255,0.063)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 18px',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: '#0A1A2E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ReceiptText size={20} color="#4F6EF7" />
            </div>
            <span style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 700 }}>История активности</span>
          </div>
          <ArrowHistory size={18} color="#52525B" />
        </motion.div>

        {/* ── History list — z:1, marginTop:-42 (gap:10 + overlap:32), paddingTop:32 ── */}
        <AnimatePresence initial={false}>
          {open === 'history' && (
            <motion.div
              key="hist-list"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              style={{
                overflow: 'hidden',
                position: 'relative',
                zIndex: 1,
                marginTop: -42,
                borderRadius: 16,
                backgroundColor: '#1A1A2E',
                border: '1px solid rgba(255,255,255,0.063)',
                paddingTop: 32,
              }}
            >
              {HISTORY_ITEMS.map((item, i) => (
                <div key={item.id}>
                  <div
                    style={{
                      height: 64,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 12,
                          backgroundColor: item.iconBg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <item.Icon size={18} color={item.iconColor} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <span style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 700 }}>{item.name}</span>
                        <span style={{ color: '#71717A', fontSize: 11 }}>{item.date}</span>
                      </div>
                    </div>
                    <span
                      style={{
                        color: item.positive ? '#A8FF3E' : '#FF4444',
                        fontSize: 13,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {item.amount}
                    </span>
                  </div>
                  {i < HISTORY_ITEMS.length - 1 && (
                    <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.063)' }} />
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

import { motion } from 'framer-motion'
import {
  Wallet,
  Download,
  Receipt,
  CreditCard,
  ChevronRight,
} from 'lucide-react'
import { getTelegramUser } from '../lib/telegram'

export default function Profile() {
  const user = getTelegramUser()

  const displayName = user
    ? `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}`
    : 'Jordan Davis'
  const displayEmail = user?.username ? `@${user.username}` : 'jordan@example.com'
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const MENU_ROWS = [
    { label: 'My Downloads',     Icon: Download,    iconColor: '#4F6EF7', iconBg: '#1E1E3A' },
    { label: 'Order History',    Icon: Receipt,     iconColor: '#A8FF3E', iconBg: '#1A2A1A' },
    { label: 'Payment Methods',  Icon: CreditCard,  iconColor: '#9B5CF6', iconBg: '#1E1A2E' },
  ]

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

      {/* Profile Hero — avatar + name overlaid inside (concept layout) */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        {/* Background gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(160deg, #1B0A3A 0%, #0A1A4A 50%, #0D0D14 100%)',
          }}
        />

        {/* Purple orb — x:60, y:-60 */}
        <div
          style={{
            position: 'absolute',
            width: 240,
            height: 240,
            background: 'radial-gradient(ellipse at center, rgba(155,92,246,0.251) 0%, transparent 70%)',
            borderRadius: '50%',
            top: -60,
            left: 60,
            pointerEvents: 'none',
          }}
        />
        {/* Blue orb — x:220, y:40 */}
        <div
          style={{
            position: 'absolute',
            width: 180,
            height: 180,
            background: 'radial-gradient(ellipse at center, rgba(79,110,247,0.188) 0%, transparent 70%)',
            borderRadius: '50%',
            top: 40,
            left: 220,
            pointerEvents: 'none',
          }}
        />

        {/* Avatar Ring — centered horizontally, top: 60 (y:216 – y:156) */}
        <div
          style={{
            position: 'absolute',
            top: 60,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 80,
            height: 80,
            borderRadius: 40,
            background: 'linear-gradient(135deg, #4F6EF7 0%, #9B5CF6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: '#1A1A2E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: '#FFFFFF', fontSize: 26, fontWeight: 700 }}>{initials}</span>
          </div>
        </div>

        {/* Name Block — top: 140 (avatar bottom = 60+80), height: 56 */}
        <div
          style={{
            position: 'absolute',
            top: 140,
            left: 0,
            right: 0,
            height: 56,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          <span style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 700 }}>{displayName}</span>
          <span style={{ color: '#71717A', fontSize: 13 }}>{displayEmail}</span>
        </div>
      </div>

      {/* Stats Row — marginTop: 20 (y:376 – y:356) */}
      <div
        style={{
          margin: '20px 20px 0',
          height: 80,
          borderRadius: 24,
          backgroundColor: '#12121F',
          border: '1px solid rgba(255,255,255,0.071)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700 }}>24</span>
          <span style={{ color: '#71717A', fontSize: 11 }}>Purchases</span>
        </div>

        <div style={{ width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.094)' }} />

        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#A8FF3E', fontSize: 22, fontWeight: 700 }}>12</span>
          <span style={{ color: '#71717A', fontSize: 11 }}>Liked</span>
        </div>

        <div style={{ width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.094)' }} />

        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#9B5CF6', fontSize: 22, fontWeight: 700 }}>$248</span>
          <span style={{ color: '#71717A', fontSize: 11 }}>Spent</span>
        </div>
      </div>

      {/* Menu List — marginTop: 16 (y:472 – y:456) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          padding: '16px 20px 0',
        }}
      >
        {MENU_ROWS.map((row) => (
          <motion.div
            key={row.label}
            whileTap={{ scale: 0.98 }}
            style={{
              height: 56,
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
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  backgroundColor: row.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <row.Icon size={16} color={row.iconColor} />
              </div>
              <span style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 600 }}>{row.label}</span>
            </div>
            <ChevronRight size={16} color="#52525B" />
          </motion.div>
        ))}
      </div>
    </main>
  )
}

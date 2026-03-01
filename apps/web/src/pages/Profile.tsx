import { motion } from 'framer-motion'
import {
  Wallet,
  Check,
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
    {
      label: 'My Downloads',
      Icon: Download,
      iconColor: '#4F6EF7',
      iconBg: '#1E1E3A',
    },
    {
      label: 'Order History',
      Icon: Receipt,
      iconColor: '#A8FF3E',
      iconBg: '#1A2A1A',
    },
    {
      label: 'Payment Methods',
      Icon: CreditCard,
      iconColor: '#9B5CF6',
      iconBg: '#1E1A2E',
    },
  ]

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
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
        }}
      >
        <span style={{ color: '#FFFFFF', fontSize: 26, fontWeight: 700 }}>Profile</span>

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

      {/* Profile Hero */}
      <div
        style={{
          width: '100%',
          height: 200,
          background: 'linear-gradient(160deg, #1B0A3A 0%, #0A1A4A 50%, #0D0D14 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Purple orb */}
        <div
          style={{
            position: 'absolute',
            width: 240,
            height: 240,
            background: 'radial-gradient(ellipse at center, rgba(155,92,246,0.251) 0%, transparent 70%)',
            borderRadius: '50%',
            top: -60,
            left: 60,
          }}
        />
        {/* Blue orb */}
        <div
          style={{
            position: 'absolute',
            width: 180,
            height: 180,
            background: 'radial-gradient(ellipse at center, rgba(79,110,247,0.188) 0%, transparent 70%)',
            borderRadius: '50%',
            top: 40,
            left: 220,
          }}
        />
      </div>

      {/* Avatar area */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: -40,
          position: 'relative',
        }}
      >
        {/* Avatar ring */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            background: 'linear-gradient(135deg, #4F6EF7 0%, #9B5CF6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Inner circle */}
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

          {/* Pro badge */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: '#A8FF3E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Check size={12} color="#0D0D14" strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* Name block */}
      <div
        style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          marginTop: 8,
          padding: '0 20px',
        }}
      >
        <span style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 700 }}>{displayName}</span>
        <span style={{ color: '#71717A', fontSize: 13 }}>{displayEmail}</span>
      </div>

      {/* Stats row */}
      <div
        style={{
          margin: '16px 20px',
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
        {/* Stat 1 */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700 }}>24</span>
          <span style={{ color: '#71717A', fontSize: 11 }}>Purchases</span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.094)' }} />

        {/* Stat 2 */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#A8FF3E', fontSize: 22, fontWeight: 700 }}>12</span>
          <span style={{ color: '#71717A', fontSize: 11 }}>Liked</span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.094)' }} />

        {/* Stat 3 */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#9B5CF6', fontSize: 22, fontWeight: 700 }}>$248</span>
          <span style={{ color: '#71717A', fontSize: 11 }}>Spent</span>
        </div>
      </div>

      {/* Menu list */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          padding: '0 20px',
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
            {/* Left: icon + label */}
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

            {/* Right: chevron */}
            <ChevronRight size={16} color="#52525B" />
          </motion.div>
        ))}
      </div>
    </main>
  )
}

import { motion } from 'framer-motion'
import type { Tab } from '../../App'

interface NavPillProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'home',    label: 'Home',    icon: '⌂' },
  { id: 'liked',   label: 'Liked',   icon: '♡' },
  { id: 'cart',    label: 'Cart',    icon: '⊡' },
  { id: 'profile', label: 'Profile', icon: '◯' },
]

export default function NavPill({ activeTab, onTabChange }: NavPillProps) {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(26, 26, 46, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '32px',
        padding: '8px 12px',
        display: 'flex',
        gap: '4px',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        zIndex: 100,
      }}
    >
      {TABS.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            whileTap={{ scale: 0.9 }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: isActive ? '8px 16px' : '8px 12px',
              borderRadius: '24px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: isActive ? 'var(--green)' : 'transparent',
              color: isActive ? '#000' : 'var(--muted2)',
              fontWeight: isActive ? 700 : 500,
              fontSize: '13px',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: '16px' }}>{tab.icon}</span>
            {isActive && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
              >
                {tab.label}
              </motion.span>
            )}
          </motion.button>
        )
      })}
    </nav>
  )
}

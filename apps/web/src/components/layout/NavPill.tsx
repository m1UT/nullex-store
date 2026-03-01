import { motion } from 'framer-motion'
import { House, Heart, ShoppingCart, UserRound } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Tab } from '../../App'
import { getTelegramUser } from '../../lib/telegram'

interface NavPillProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const MAIN_TABS: { id: Tab; label: string; Icon: LucideIcon }[] = [
  { id: 'home',  label: 'HOME',  Icon: House },
  { id: 'liked', label: 'LIKED', Icon: Heart },
  { id: 'cart',  label: 'CART',  Icon: ShoppingCart },
]

export default function NavPill({ activeTab, onTabChange }: NavPillProps) {
  const isProfileActive = activeTab === 'profile'
  const photoUrl = getTelegramUser()?.photo_url

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '15px',
        left: '12px',
        right: '12px',
        display: 'flex',
        gap: '8px',
        zIndex: 100,
        alignItems: 'stretch',
      }}
    >
      {/* 3-tab pill */}
      <nav
        style={{
          flex: 1,
          height: '56px',
          display: 'flex',
          padding: '4px',
          borderRadius: '36px',
          backgroundColor: 'rgba(255,255,255,0.039)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.133)',
        }}
      >
        {MAIN_TABS.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              whileTap={{ scale: 0.93 }}
              style={{
                flex: 1,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                borderRadius: '26px',
                border: 'none',
                cursor: 'pointer',
                background: 'transparent',
              }}
            >
              {/* Sliding indicator */}
              {isActive && (
                <motion.div
                  layoutId="navIndicator"
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '26px',
                    background: 'linear-gradient(135deg, #4F6EF7 0%, #9B5CF6 100%)',
                  }}
                />
              )}

              <tab.Icon
                size={18}
                color={isActive ? '#FFFFFF' : '#52525B'}
                style={{ position: 'relative', zIndex: 1 }}
              />
              <span
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '9px',
                  fontWeight: 600,
                  color: isActive ? '#FFFFFF' : '#52525B',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {tab.label}
              </span>
            </motion.button>
          )
        })}
      </nav>

      {/* Separate Profile button */}
      <motion.button
        onClick={() => onTabChange('profile')}
        whileTap={{ scale: 0.93 }}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '28px',
          background: isProfileActive
            ? 'linear-gradient(135deg, #4F6EF7 0%, #9B5CF6 100%)'
            : 'linear-gradient(135deg, #1E1E3A 0%, #1A1A2E 100%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.133)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'background 0.3s ease',
        }}
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="profile"
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              objectFit: 'cover',
              border: isProfileActive ? '2px solid rgba(255,255,255,0.4)' : 'none',
            }}
          />
        ) : (
          <UserRound size={22} color="#FFFFFF" />
        )}
      </motion.button>
    </div>
  )
}

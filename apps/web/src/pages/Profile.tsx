import { useState } from 'react'
import { Wallet, Gamepad2, Type, Box, Music, ExternalLink, UserRound } from 'lucide-react'
import { getTelegramUser } from '../lib/telegram'

const INVENTORY_ITEMS = [
  { id: 1, name: 'Neon Racer Pro',    tag: 'Game · Indie',       Icon: Gamepad2, iconColor: '#A8FF3E', iconBg: 'linear-gradient(135deg, #1A3A1A 0%, #0D2A14 100%)' },
  { id: 2, name: 'Grotesk Variable',  tag: 'Font · Display',     Icon: Type,     iconColor: '#FF6BF8', iconBg: 'linear-gradient(135deg, #2A1A0A 0%, #1A0A00 100%)' },
  { id: 3, name: 'SciFi Asset Pack',  tag: '3D Assets · Sci-fi', Icon: Box,      iconColor: '#4F6EF7', iconBg: 'linear-gradient(135deg, #1A1A3A 0%, #0A0A2E 100%)' },
  { id: 4, name: 'Lo-Fi Beats Vol.3', tag: 'Music · Ambient',    Icon: Music,    iconColor: '#9B5CF6', iconBg: 'linear-gradient(135deg, #2A0A1A 0%, #1A0010 100%)' },
  { id: 5, name: 'Pixel Dungeon X',   tag: 'Game · Roguelike',   Icon: Gamepad2, iconColor: '#A8FF3E', iconBg: 'linear-gradient(135deg, #1A3A1A 0%, #0D2A14 100%)' },
  { id: 6, name: 'Mono Display Pro',  tag: 'Font · Monospace',   Icon: Type,     iconColor: '#FF6BF8', iconBg: 'linear-gradient(135deg, #2A1A0A 0%, #1A0A00 100%)' },
]

const TX_ITEMS = [
  { id: 1, name: 'Пополнение баланса', Icon: Wallet,   iconColor: '#A8FF3E', iconBg: '#0A2A1A', date: 'Mar 01, 2026', amount: '+$50.00',  positive: true  },
  { id: 2, name: 'Neon Racer Pro',     Icon: Gamepad2, iconColor: '#A8FF3E', iconBg: '#1A3A1A', date: 'Feb 28, 2026', amount: '−$24.99',  positive: false },
  { id: 3, name: 'Grotesk Variable',   Icon: Type,     iconColor: '#FF6BF8', iconBg: '#2A1A0A', date: 'Feb 14, 2026', amount: '−$19.00',  positive: false },
  { id: 4, name: 'Пополнение баланса', Icon: Wallet,   iconColor: '#A8FF3E', iconBg: '#0A2A1A', date: 'Feb 10, 2026', amount: '+$100.00', positive: true  },
  { id: 5, name: 'SciFi Asset Pack',   Icon: Box,      iconColor: '#4F6EF7', iconBg: '#1A1A3A', date: 'Jan 03, 2026', amount: '−$49.00',  positive: false },
  { id: 6, name: 'Pixel Dungeon X',   Icon: Gamepad2, iconColor: '#A8FF3E', iconBg: '#1A3A1A', date: 'Dec 22, 2025', amount: '−$18.00',  positive: false },
  { id: 7, name: 'Пополнение баланса', Icon: Wallet,   iconColor: '#A8FF3E', iconBg: '#0A2A1A', date: 'Dec 15, 2025', amount: '+$200.00', positive: true  },
]

export default function Profile() {
  const user = getTelegramUser()
  const displayName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(' ')
    : 'm1UTlucky'
  const userHandle = user?.username ? `@${user.username}` : '@m1utlucky'
  const photoUrl = user?.photo_url ?? null
  const [showAllInv, setShowAllInv] = useState(false)
  const [showAllTx, setShowAllTx] = useState(false)

  const visibleInv = showAllInv ? INVENTORY_ITEMS : INVENTORY_ITEMS.slice(0, 4)
  const visibleTx  = showAllTx  ? TX_ITEMS         : TX_ITEMS.slice(0, 4)

  return (
    <main
      style={{
        backgroundColor: '#0D0D14',
        minHeight: '100dvh',
        paddingBottom: 96,
        overflowX: 'hidden',
      }}
    >
      {/* ── Hero ── */}
      <div
        style={{
          position: 'relative',
          height: 280,
          overflow: 'hidden',
          background: 'linear-gradient(160deg, #1A0A2E 0%, #0A1A2E 50%, #0D0D14 100%)',
          paddingTop: 'var(--safe-top, 0px)',
        }}
      >
        {/* Purple glow — top-right */}
        <div
          style={{
            position: 'absolute',
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #9B5CF640 0%, transparent 100%)',
            left: 280,
            top: -40,
            pointerEvents: 'none',
          }}
        />
        {/* Blue glow — bottom-left */}
        <div
          style={{
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #4F6EF730 0%, transparent 100%)',
            left: -60,
            top: 100,
            pointerEvents: 'none',
          }}
        />

        {/* Avatar ring */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: 100,
            width: 84,
            height: 84,
            borderRadius: 42,
            background: 'linear-gradient(135deg, #A8FF3E 0%, #4F6EF7 50%, #9B5CF6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 38,
              backgroundColor: '#1A1A2E',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <UserRound size={36} color="#FFFFFF" />
            )}
          </div>
        </div>

        {/* Username */}
        <div
          style={{
            position: 'absolute',
            top: 196,
            left: 0,
            width: '100%',
            textAlign: 'center',
            color: '#F5F5F0',
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          {displayName}
        </div>

        {/* Handle */}
        <div
          style={{
            position: 'absolute',
            top: 224,
            left: 0,
            width: '100%',
            textAlign: 'center',
            color: '#6E6E70',
            fontSize: 13,
          }}
        >
          {userHandle}
        </div>
      </div>

      {/* ── Balance card ── */}
      <div style={{ padding: '20px 20px 0' }}>
        <div
          style={{
            height: 80,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #0D2A14 0%, #0A1A0D 100%)',
            border: '1px solid #A8FF3E30',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span
              style={{
                color: '#A8FF3E70',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: 2,
              }}
            >
              BALANCE
            </span>
            <span style={{ color: '#F5F5F0', fontSize: 22, fontWeight: 700 }}>
              $1,240.00
            </span>
          </div>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: '#A8FF3E15',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Wallet size={22} color="#A8FF3E" />
          </div>
        </div>
      </div>

      {/* ── Inventory ── */}
      <div style={{ padding: '15px 20px 0' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <span style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700 }}>Инвентарь</span>
          <span
            onClick={() => setShowAllInv(true)}
            style={{ color: '#4F6EF7', fontSize: 13, cursor: 'pointer', display: showAllInv ? 'none' : undefined }}
          >
            Показать все
          </span>
        </div>
        <div
          style={{
            borderRadius: 16,
            backgroundColor: '#12121F',
            border: '1px solid #FFFFFF10',
            overflow: 'hidden',
          }}
        >
          {visibleInv.map((item, i) => (
            <div key={item.id}>
              <div
                style={{
                  height: 68,
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
                      background: item.iconBg,
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
                    <span style={{ color: '#71717A', fontSize: 11 }}>{item.tag}</span>
                  </div>
                </div>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: '#9B5CF61A',
                    border: '1px solid #9B5CF640',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <ExternalLink size={16} color="#9B5CF6" />
                </div>
              </div>
              {i < visibleInv.length - 1 && (
                <div style={{ height: 1, backgroundColor: '#FFFFFF10' }} />
              )}
            </div>
          ))}
          {showAllInv && (
            <>
              <div style={{ height: 1, backgroundColor: '#FFFFFF10' }} />
              <div
                onClick={() => setShowAllInv(false)}
                style={{
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <span style={{ color: '#4F6EF7', fontSize: 13 }}>Скрыть</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Transaction History ── */}
      <div style={{ padding: '20px 20px 0' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <span style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700 }}>История транзакций</span>
          <span
            onClick={() => setShowAllTx(true)}
            style={{ color: '#4F6EF7', fontSize: 13, cursor: 'pointer', display: showAllTx ? 'none' : undefined }}
          >
            Показать все
          </span>
        </div>
        <div
          style={{
            borderRadius: 16,
            backgroundColor: '#12121F',
            border: '1px solid #FFFFFF10',
            overflow: 'hidden',
          }}
        >
          {visibleTx.map((item, i) => (
            <div key={item.id}>
              <div
                style={{
                  height: 68,
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
              {i < visibleTx.length - 1 && (
                <div style={{ height: 1, backgroundColor: '#FFFFFF10' }} />
              )}
            </div>
          ))}
          {showAllTx && (
            <>
              <div style={{ height: 1, backgroundColor: '#FFFFFF10' }} />
              <div
                onClick={() => setShowAllTx(false)}
                style={{
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <span style={{ color: '#4F6EF7', fontSize: 13 }}>Скрыть</span>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

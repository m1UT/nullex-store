import { useState } from 'react'
import { Wallet, Gamepad2, Sword, Code2, Shield, PlayCircle, Cloud, ExternalLink, UserRound } from 'lucide-react'
import { getTelegramUser } from '../lib/telegram'

const INVENTORY_ITEMS = [
  { id: 1, name: 'Neon Arena',     tag: 'Игры · Шутер',        Icon: Gamepad2,   iconColor: '#9B5CF6', iconBg: 'linear-gradient(135deg, #1B0A3A 0%, #0A1A4A 100%)' },
  { id: 2, name: 'Shadow Tactics', tag: 'Игры · Стратегия',    Icon: Sword,      iconColor: '#A8FF3E', iconBg: 'linear-gradient(135deg, #0A2A1A 0%, #1A0A3A 100%)' },
  { id: 3, name: 'DevKit Pro',     tag: 'ПО · Разработка',     Icon: Code2,      iconColor: '#4F6EF7', iconBg: 'linear-gradient(135deg, #1A0A0A 0%, #2A1060 100%)' },
  { id: 4, name: 'VaultGuard',     tag: 'ПО · Безопасность',   Icon: Shield,     iconColor: '#A8FF3E', iconBg: 'linear-gradient(135deg, #0A1A0A 0%, #1A0A2A 100%)' },
  { id: 5, name: 'StreamPass',     tag: 'Подписка · Стриминг', Icon: PlayCircle, iconColor: '#FF6BF8', iconBg: 'linear-gradient(135deg, #0A1A2A 0%, #2A0A30 100%)' },
  { id: 6, name: 'CloudMax',       tag: 'Подписка · Хранилище',Icon: Cloud,      iconColor: '#4F6EF7', iconBg: 'linear-gradient(135deg, #1A0A1A 0%, #0A1A2A 100%)' },
]

const TX_ITEMS = [
  { id: 1, name: 'Пополнение баланса', Icon: Wallet,     iconColor: '#A8FF3E', iconBg: '#0A2A1A', date: '01 мар 2026', amount: '+$50.00',  positive: true  },
  { id: 2, name: 'Neon Arena',         Icon: Gamepad2,   iconColor: '#9B5CF6', iconBg: '#1B0A3A', date: '28 фев 2026', amount: '−$24.99',  positive: false },
  { id: 3, name: 'DevKit Pro',         Icon: Code2,      iconColor: '#4F6EF7', iconBg: '#1A0A0A', date: '14 фев 2026', amount: '−$49.99',  positive: false },
  { id: 4, name: 'Пополнение баланса', Icon: Wallet,     iconColor: '#A8FF3E', iconBg: '#0A2A1A', date: '10 фев 2026', amount: '+$100.00', positive: true  },
  { id: 5, name: 'StreamPass',         Icon: PlayCircle, iconColor: '#FF6BF8', iconBg: '#0A1A2A', date: '20 янв 2026', amount: '−$9.99',   positive: false },
  { id: 6, name: 'Shadow Tactics',     Icon: Sword,      iconColor: '#A8FF3E', iconBg: '#0A2A1A', date: '22 дек 2025', amount: '−$19.99',  positive: false },
  { id: 7, name: 'Пополнение баланса', Icon: Wallet,     iconColor: '#A8FF3E', iconBg: '#0A2A1A', date: '15 дек 2025', amount: '+$200.00', positive: true  },
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

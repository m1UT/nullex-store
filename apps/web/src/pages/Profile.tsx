import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, ExternalLink, X, Copy, Check } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { getTelegramUser } from '../lib/telegram'
import { useStore } from '../lib/store'
import { CATEGORY_VISUALS } from '../lib/api'

interface InventoryItem {
  id: number
  name: string
  tag: string
  Icon: LucideIcon
  iconColor: string
  iconBg: string
  imageUrl: string | null
  code: string
}

interface TxItem {
  id: number
  name: string
  Icon: LucideIcon
  iconColor: string
  iconBg: string
  imageUrl: string | null
  date: string
  amount: string
  positive: boolean
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
  return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`
}

export default function Profile() {
  const tgUser = getTelegramUser()
  const { user, photoUrl, orders } = useStore()

  const displayName = tgUser
    ? [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ')
    : (user?.username ?? 'Пользователь')
  const userHandle = tgUser?.username
    ? `@${tgUser.username}`
    : user?.username
    ? `@${user.username}`
    : null
  const initials = displayName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

  const balanceStr = user ? `$${parseFloat(user.balance).toFixed(2)}` : '$0.00'

  const inventoryItems: InventoryItem[] = orders.flatMap((order) =>
    order.items.map((item) => {
      const vis = CATEGORY_VISUALS[item.product.category] ?? CATEGORY_VISUALS.GAMES
      return {
        id: item.id,
        name: item.product.name,
        tag: vis.meta,
        Icon: vis.Icon,
        iconColor: vis.iconColor,
        iconBg: vis.bg,
        imageUrl: item.product.imageUrl1 ?? null,
        code: `ITEM-${String(item.id).padStart(6, '0')}`,
      }
    }),
  )

  const txItems: TxItem[] = orders.map((order) => {
    const firstItem = order.items[0]
    const vis = firstItem
      ? (CATEGORY_VISUALS[firstItem.product.category] ?? CATEGORY_VISUALS.GAMES)
      : CATEGORY_VISUALS.GAMES
    const name =
      order.items.length === 1
        ? (firstItem?.product.name ?? 'Заказ')
        : `Заказ #${order.id} (${order.items.length} товара)`
    return {
      id: order.id,
      name,
      Icon: vis.Icon,
      iconColor: vis.iconColor,
      iconBg: vis.bg,
      imageUrl: firstItem?.product.imageUrl1 ?? null,
      date: formatDate(order.createdAt),
      amount: `−$${Number(order.total).toFixed(2)}`,
      positive: false,
    }
  })

  const [showAllInv, setShowAllInv] = useState(false)
  const [showAllTx, setShowAllTx] = useState(false)
  const [activationItem, setActivationItem] = useState<InventoryItem | null>(null)
  const [copied, setCopied] = useState(false)

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const visibleInv = showAllInv ? inventoryItems : inventoryItems.slice(0, 4)
  const visibleTx  = showAllTx  ? txItems         : txItems.slice(0, 4)

  return (
    <>
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
              background: photoUrl ? '#1A1A2E' : 'linear-gradient(135deg, #9B5CF6 0%, #4F6EF7 100%)',
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
              <span style={{ color: '#FFFFFF', fontSize: 26, fontWeight: 700, letterSpacing: -0.5 }}>{initials}</span>
            )}
          </div>
        </div>

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

        {userHandle && (
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
        )}
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
            <span style={{ color: '#A8FF3E70', fontSize: 10, fontWeight: 600, letterSpacing: 2 }}>
              BALANCE
            </span>
            <span style={{ color: '#F5F5F0', fontSize: 22, fontWeight: 700 }}>{balanceStr}</span>
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
          {!showAllInv && inventoryItems.length > 4 && (
            <span
              onClick={() => setShowAllInv(true)}
              style={{ color: '#4F6EF7', fontSize: 13, cursor: 'pointer' }}
            >
              Показать все
            </span>
          )}
        </div>

        {inventoryItems.length === 0 ? (
          <div
            style={{
              borderRadius: 16,
              backgroundColor: '#12121F',
              border: '1px solid #FFFFFF10',
              height: 68,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: '#71717A', fontSize: 13 }}>Нет купленных товаров</span>
          </div>
        ) : (
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
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <item.Icon size={18} color={item.iconColor} />
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <span style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 700 }}>{item.name}</span>
                      <span style={{ color: '#71717A', fontSize: 11 }}>{item.tag}</span>
                    </div>
                  </div>
                  <motion.div
                    whileTap={{ scale: 0.92 }}
                    onClick={() => { setActivationItem(item); setCopied(false) }}
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
                      cursor: 'pointer',
                    }}
                  >
                    <ExternalLink size={16} color="#9B5CF6" />
                  </motion.div>
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
        )}
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
          {!showAllTx && txItems.length > 4 && (
            <span
              onClick={() => setShowAllTx(true)}
              style={{ color: '#4F6EF7', fontSize: 13, cursor: 'pointer' }}
            >
              Показать все
            </span>
          )}
        </div>

        {txItems.length === 0 ? (
          <div
            style={{
              borderRadius: 16,
              backgroundColor: '#12121F',
              border: '1px solid #FFFFFF10',
              height: 68,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: '#71717A', fontSize: 13 }}>Нет транзакций</span>
          </div>
        ) : (
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
                        background: item.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <item.Icon size={18} color={item.iconColor} />
                      )}
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
        )}
      </div>
    </main>

      {/* ── Code Activation Bottom Sheet ── */}
      {createPortal(<AnimatePresence>
        {activationItem && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              data-overlay=""
              onClick={() => setActivationItem(null)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 110,
                backgroundColor: 'rgba(13,13,20,0.7)',
                touchAction: 'none',
              }}
            />

            {/* Sheet */}
            <motion.div
              key="sheet"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden:  { y: '100%', transition: { duration: 0.26, ease: [0.4, 0, 1, 1] } },
                visible: { y: 0,      transition: { duration: 0.38, ease: [0.32, 0.72, 0, 1] } },
              }}
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 111,
                backgroundColor: '#12121F',
                borderRadius: '24px 24px 0 0',
                border: '1px solid rgba(255,255,255,0.08)',
                borderBottom: 'none',
                padding: '12px 20px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                willChange: 'transform',
                touchAction: 'none',
              }}
            >
              {/* Drag handle */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.15)' }} />
              </div>

              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 700 }}>Код активации</span>
                  <div style={{ color: '#52525B', fontSize: 12, marginTop: 2 }}>{activationItem.name}</div>
                </div>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActivationItem(null)}
                  style={{
                    width: 32, height: 32, borderRadius: 16,
                    backgroundColor: 'rgba(255,255,255,0.059)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} color="#A1A1AA" />
                </motion.div>
              </div>

              {/* Code row */}
              <div
                style={{
                  height: 56,
                  borderRadius: 14,
                  backgroundColor: '#1A1A2E',
                  border: '1px solid rgba(255,255,255,0.071)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 16px',
                }}
              >
                <span
                  style={{
                    color: '#E4E4E7',
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: 1.5,
                    fontFamily: 'monospace',
                  }}
                >
                  {activationItem.code}
                </span>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleCopy(activationItem.code)}
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    backgroundColor: copied ? 'rgba(168,255,62,0.18)' : 'rgba(168,255,62,0.102)',
                    border: '1px solid rgba(168,255,62,0.251)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', flexShrink: 0,
                    transition: 'background-color 0.2s',
                  }}
                >
                  {copied ? <Check size={16} color="#A8FF3E" /> : <Copy size={16} color="#A8FF3E" />}
                </motion.div>
              </div>

              {/* Hint */}
              <span style={{ color: '#52525B', fontSize: 12 }}>
                Скопируйте код и введите его при активации продукта
              </span>
            </motion.div>
          </>
        )}
      </AnimatePresence>, document.body)}
    </>
  )
}

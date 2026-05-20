import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Wallet, Lock } from 'lucide-react'
import { useStore } from '../lib/store'

export default function Cart() {
  const { user, cartItems, removeFromCart, clearCart, placeOrder } = useStore()
  const [checkingOut, setCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const balanceStr = user ? `$${parseFloat(user.balance).toFixed(2)}` : '$0.00'
  const total = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.product.price.replace('$', '')),
    0,
  )
  const hasEnoughBalance = user ? parseFloat(user.balance) >= total : false

  const handleCheckout = async () => {
    if (checkingOut || cartItems.length === 0) return
    setCheckingOut(true)
    setCheckoutError(null)
    const result = await placeOrder()
    setCheckingOut(false)
    if (!result.ok) {
      setCheckoutError(
        result.error === 'insufficient_balance' ? 'Недостаточно средств на балансе'
          : result.error === 'out_of_stock' ? 'Один из товаров закончился'
          : 'Ошибка при оплате. Попробуйте ещё раз',
      )
    }
  }

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
        <span style={{ color: '#FFFFFF', fontSize: 26, fontWeight: 700 }}>Корзина</span>
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
          <span style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600 }}>{balanceStr}</span>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 200,
          }}
        >
          <span style={{ color: '#71717A', fontSize: 14 }}>Корзина пуста</span>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Items */}
            {cartItems.map((item, idx) => (
              <div key={item.productId}>
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
                      background: item.product.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <item.product.Icon size={32} color={item.product.iconColor} />
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 700 }}>
                      {item.product.name}
                    </span>
                    <span style={{ color: '#71717A', fontSize: 12 }}>{item.product.cardMeta}</span>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ color: '#A8FF3E', fontSize: 15, fontWeight: 700 }}>
                        {item.product.price}
                      </span>

                      <motion.div
                        whileTap={{ scale: 0.88 }}
                        onClick={() => removeFromCart(item.productId)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 10,
                          backgroundColor: 'rgba(255,59,48,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={15} color="#FF3B30" />
                      </motion.div>
                    </div>
                  </div>
                </div>

                {idx < cartItems.length - 1 && (
                  <div
                    style={{
                      height: 1,
                      backgroundColor: 'rgba(255,255,255,0.071)',
                      margin: '0 20px',
                    }}
                  />
                )}
              </div>
            ))}

            {/* Divider after items */}
            <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.071)', marginTop: 4 }} />

            {/* Count badge + Clear row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 8,
                padding: '12px 20px',
              }}
            >
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
                <span style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600 }}>
                  {cartItems.length}
                </span>
              </div>

              <motion.div
                whileTap={{ scale: 0.93 }}
                onClick={clearCart}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  backgroundColor: 'rgba(255,59,48,0.125)',
                  borderRadius: 999,
                  padding: '8px 12px',
                  cursor: 'pointer',
                  touchAction: 'manipulation',
                }}
              >
                <Trash2 size={14} color="#FF3B30" />
                <span style={{ color: '#FF3B30', fontSize: 13, fontWeight: 600 }}>Очистить</span>
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
              <span style={{ color: '#A1A1AA', fontSize: 14 }}>Позиций</span>
              <span style={{ color: '#FFFFFF', fontSize: 14 }}>{cartItems.length}</span>
            </div>

            <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.094)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 700 }}>Итого</span>
              <span style={{ color: '#A8FF3E', fontSize: 18, fontWeight: 700 }}>
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Error message */}
          {checkoutError && (
            <div style={{ margin: '12px 20px 0', padding: '10px 14px', borderRadius: 12, backgroundColor: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.25)' }}>
              <span style={{ color: '#FF3B30', fontSize: 13 }}>{checkoutError}</span>
            </div>
          )}

          {/* Checkout Button */}
          <div style={{ padding: '16px 20px 0' }}>
            <motion.button
              whileTap={{ scale: checkingOut || !hasEnoughBalance ? 1 : 0.97 }}
              onClick={hasEnoughBalance && !checkingOut ? handleCheckout : undefined}
              style={{
                width: '100%',
                height: 54,
                backgroundColor: !hasEnoughBalance ? '#1A1A2E' : checkingOut ? '#6B9A2E' : '#A8FF3E',
                borderRadius: 999,
                border: !hasEnoughBalance ? '1px solid rgba(255,255,255,0.08)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                cursor: checkingOut || !hasEnoughBalance ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              {!hasEnoughBalance ? (
                <span style={{ color: '#71717A', fontSize: 16, fontWeight: 700 }}>
                  Пополните баланс
                </span>
              ) : (
                <>
                  <Lock size={18} color="#0D0D14" />
                  <span style={{ color: '#0D0D14', fontSize: 16, fontWeight: 700 }}>
                    {checkingOut ? 'Обработка...' : 'Оплатить безопасно'}
                  </span>
                </>
              )}
            </motion.button>
          </div>
        </>
      )}
    </main>
  )
}

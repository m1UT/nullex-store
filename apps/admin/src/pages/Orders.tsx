import { useEffect, useState } from 'react'
import { api, Order } from '../api'

const STATUSES = ['PENDING', 'PAID', 'DELIVERED', 'CANCELLED'] as const

const STATUS_COLOR: Record<string, string> = {
  PENDING:   '#FF9F0A',
  PAID:      '#4F6EF7',
  DELIVERED: '#A8FF3E',
  CANCELLED: '#FF3B30',
}

const STATUS_LABEL: Record<string, string> = {
  PENDING:   'Ожидает',
  PAID:      'Оплачен',
  DELIVERED: 'Доставлен',
  CANCELLED: 'Отменён',
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])

  const load = () => api.orders().then(setOrders)
  useEffect(() => { load() }, [])

  const changeStatus = async (id: number, status: string) => {
    await api.updateOrder(id, status)
    load()
  }

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Заказы</h2>

      <div style={{ backgroundColor: '#12121F', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['ID', 'Пользователь', 'Товары', 'Сумма', 'Статус', 'Дата'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#71717A', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px 16px', color: '#71717A', fontSize: 13 }}>#{o.id}</td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>
                  {o.user.username ? `@${o.user.username}` : o.user.telegramId}
                </td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#A1A1AA', maxWidth: 200 }}>
                  {o.items.map(i => i.product.name).join(', ')}
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#A8FF3E', fontWeight: 700 }}>${o.total}</td>
                <td style={{ padding: '12px 16px' }}>
                  <select
                    value={o.status}
                    onChange={e => changeStatus(o.id, e.target.value)}
                    style={{
                      height: 32, borderRadius: 8, border: '1px solid rgba(255,255,255,0.09)',
                      backgroundColor: '#1A1A2E', color: STATUS_COLOR[o.status],
                      padding: '0 10px', fontSize: 12, fontWeight: 600, outline: 'none',
                    }}
                  >
                    {STATUSES.map(s => (
                      <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#71717A' }}>
                  {new Date(o.createdAt).toLocaleDateString('ru')}
                </td>
              </tr>
            ))}
            {!orders.length && (
              <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#71717A', fontSize: 13 }}>Нет заказов</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

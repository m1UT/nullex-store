import { useEffect, useState } from 'react'
import { api, Order } from '../api'

const STATUS_COLOR: Record<string, string> = {
  PENDING:   '#FF9F0A',
  PAID:      '#4F6EF7',
  DELIVERED: '#A8FF3E',
  CANCELLED: '#FF3B30',
}

const STATUS_LABEL: Record<string, string> = {
  PENDING:   'Ожидает',
  PAID:      'Оплачен',
  DELIVERED: 'Выдан',
  CANCELLED: 'Отменён',
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => { api.orders().then(setOrders) }, [])

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Заказы</h2>

      <div style={{ backgroundColor: '#12121F', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['ID', 'Пользователь', 'Товар', 'Сумма', 'Статус', 'Дата'].map(h => (
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
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#A1A1AA' }}>
                  {o.items.map(i => i.product.name).join(', ')}
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#A8FF3E', fontWeight: 700 }}>${o.total}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    color: STATUS_COLOR[o.status] ?? '#A1A1AA',
                    backgroundColor: `${STATUS_COLOR[o.status] ?? '#A1A1AA'}18`,
                    border: `1px solid ${STATUS_COLOR[o.status] ?? '#A1A1AA'}40`,
                  }}>
                    {STATUS_LABEL[o.status] ?? o.status}
                  </span>
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
